import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../config/apiConfig.js";
import DataContext from "../../context/DataProvider.jsx";

// ─── Fallback Data ──────────────────────────────────────────────────────────────
const FALLBACK_PUBLICATIONS = [
  {
    _id: "fallback-1",
    title: "AI in Physical Form: The Rise of Robots and Humanoids",
    publishingDate: "2025-12-19T00:00:00.000Z",
    documentType: "Position Paper",
    Authors: [{ name: "Sandy Carter" }, { name: "Dr. Priyanka Shrivastava" }, { name: "Sanjeev Sharma" }],
    tags: ["Human-Machine Systems", "Embodied Intelligence", "Adaptive Automation"],
    thumbnailUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  },
  {
    _id: "fallback-2",
    title: "Perspectives: Why Is Blockchain Not Successful (Yet)?",
    publishingDate: "2025-12-10T00:00:00.000Z",
    documentType: "Research Paper",
    Authors: [{ name: "Dr. Nikhil Varma" }],
    tags: ["Blockchain Taxonomy", "Digital Infrastructure", "Innovation Ecosystems"],
    thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  },
  {
    _id: "fallback-3",
    title: "AI Trust Revolution: Economic Incentives and Distributed Verification Solve Supply Chain Transparency",
    publishingDate: "2025-12-22T00:00:00.000Z",
    documentType: "Position Paper",
    Authors: [{ name: "Dr. Alejandro Molina" }],
    tags: ["Supply Chain", "Artificial Intelligence", "Transparency"],
    thumbnailUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  },
  {
    _id: "fallback-4",
    title: "Addressing Challenges and Delivering Value in Healthcare Using Generative AI",
    publishingDate: "2025-11-30T00:00:00.000Z",
    documentType: "Research Paper",
    Authors: [{ name: "Shree Varuna Ramesh" }, { name: "Shannon Kennedy" }],
    tags: ["Data Governance", "Healthcare Compliance", "SLM for Health Innovation"],
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  },
  {
    _id: "fallback-5",
    title: "A New Prescription for Healthcare: Why Systemic Collaboration Is the Cure",
    publishingDate: "2026-01-08T00:00:00.000Z",
    documentType: "Policy Paper",
    Authors: [{ name: "Dr. Priyanka Shrivastava" }],
    tags: ["AI in Healthcare", "Systemic Reform", "Policy"],
    thumbnailUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
  },
];

// ─── Helper ─────────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ─── Slot definitions ────────────────────────────────────────────────────────────
//
// HOW THE ANIMATION WORKS:
//   - Each card wrapper is keyed by paper._id. React therefore keeps the SAME
//     DOM node for a given paper across renders, even as activeIndex changes.
//   - Each render, the node receives the style of whichever slot its paper now
//     occupies (center, secondary, tertiary).
//   - All positioning is done via `transform: translate(...)` — GPU-composited,
//     always animates smoothly. Width/height/opacity are also transitioned.
//   - Result: pressing an arrow moves activeIndex by 1, every card's DOM node
//     gets new slot styles, and CSS transitions interpolate all of them at once
//     → smooth depth-layered slide effect.
//
const CARD_SLOTS = [
  { offset: -2, w: 280, h: 404, tx: -430, zIndex: 1,  opacity: 0.38 },
  { offset: -1, w: 320, h: 462, tx: -240, zIndex: 2,  opacity: 0.68 },
  { offset:  0, w: 360, h: 520, tx:    0, zIndex: 10, opacity: 1    },
  { offset:  1, w: 320, h: 462, tx:  240, zIndex: 2,  opacity: 0.68 },
  { offset:  2, w: 280, h: 404, tx:  430, zIndex: 1,  opacity: 0.38 },
];

const STAGE_H = 580;

// ─── Main Component ──────────────────────────────────────────────────────────────
export function PublicationCarousel({publicationContent}) {
  const { account } = useContext(DataContext.DataContext);
  const navigate    = useNavigate();

  const publications = publicationContent;
  const [activeIndex, setActiveIndex]   = useState(0);
  const [loading, setLoading]           = useState(false);
  const [animating, setAnimating]       = useState(false);

 
  const slideTo = useCallback(
    (direction) => {
      if (animating || publications.length === 0) return;
      setAnimating(true);
      // Update index immediately — CSS transition handles the visual animation
      setActiveIndex((prev) =>
        direction === "left"
          ? (prev - 1 + publications.length) % publications.length
          : (prev + 1) % publications.length
      );
      setTimeout(() => setAnimating(false), 500);
    },
    [animating, publications.length]
  );

  const getAt = (offset) => {
    if (!publications.length) return null;
    return publications[
      (activeIndex + offset + publications.length) % publications.length
    ];
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: "964px", background: "#000" }}>
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "964px",
        background: "radial-gradient(67.61% 67.61% at 49.28% 54.55%, #004AAD 0%, #000000 67.95%)",
      }}
    >
      {/* Left + right vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          background:
            "linear-gradient(270deg, #000000 0%, rgba(0,0,0,0.25) 20%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 80%, #000000 100%)",
        }}
      />

      {/* Content column */}
      <div
        className="relative flex flex-col items-center w-full"
        style={{ paddingTop: "80px", zIndex: 10 }}
      >
        {/* Title */}
        <h2
          className="text-white font-normal text-center"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "35px",
            lineHeight: "100%",
            marginBottom: "20px",
          }}
        >
          Recommended for you
        </h2>

        {/* Controls */}
        <div className="flex items-center" style={{ gap: "20px", marginBottom: "40px" }}>
          <button
            onClick={() => slideTo("left")}
            disabled={animating}
            className="flex items-center cursor-pointer justify-center text-white transition-opacity duration-200"
            style={{ opacity: animating ? 0.3 : 0.75, width: 35, height: 35 }}
            aria-label="Previous publication"
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => {
              if (!publications.length) return;
              navigate(`/research-paper/${publications[activeIndex]._id}`);
            }}
            className="text-white transition-colors duration-200 hover:bg-[#0057cc]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              background: "#004AAD",
              borderRadius: "5px",
              width: "141px",
              height: "34px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Access Here
          </button>

          <button
            onClick={() => slideTo("right")}
            disabled={animating}
            className="flex items-center cursor-pointer justify-center text-white transition-opacity duration-200"
            style={{ opacity: animating ? 0.3 : 0.75, width: 35, height: 35 }}
            aria-label="Next publication"
          >
            <ChevronRight size={35} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Carousel stage ── */}
        <div
          className="relative w-full"
          style={{ height: `${STAGE_H}px`, overflow: "hidden" }}
        >
          {CARD_SLOTS.map(({ offset, w, h, tx, zIndex, opacity }) => {
            const paper    = getAt(offset);
            if (!paper) return null;
            const isCenter = offset === 0;

            // All positioning via transform so the browser can GPU-composite it.
            // translate(calc(-50% + tx), -50%) places card center at (stage_center + tx, stage_center).
            const transform = `translate(calc(-50% + ${tx}px), -50%)`;

            return (
              <div
                key={paper._id}
                onClick={isCenter ? () => navigate(`/research-paper/${paper._id}`) : undefined}
                style={{
                  position:  "absolute",
                  left:      "50%",
                  top:       "50%",
                  width:     w,
                  height:    h,
                  transform,
                  zIndex,
                  opacity,
                  border:        "1px solid #666666",
                  borderRadius:  "20px",
                  overflow:      "hidden",
                  pointerEvents: isCenter ? "auto"    : "none",
                  cursor:        isCenter ? "pointer" : "default",
                  transition:
                    "transform 500ms cubic-bezier(0.4, 0, 0.2, 1), " +
                    "width 500ms cubic-bezier(0.4, 0, 0.2, 1), " +
                    "height 500ms cubic-bezier(0.4, 0, 0.2, 1), " +
                    "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <PublicationCard
                  paper={paper}
                  isCenter={isCenter}
                  cardH={h}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Publication Card ────────────────────────────────────────────────────────────
function PublicationCard({ paper, isCenter, cardH }) {
  const authorLine = Array.isArray(paper.Authors)
    ? paper.Authors
        .map((a) => (typeof a === "object" ? a.name || a.email || "" : a))
        .filter(Boolean)
        .join(", ")
    : "";

  const fs = isCenter
    ? { meta: "9px", author: "9px", title: "15px", tag: "7.5px", copy: "7px" }
    : { meta: "7.5px", author: "7.5px", title: "11px", tag: "6px", copy: "6px" };

  return (
    <div className="relative w-full h-full" style={{ background: "#000000", borderRadius: "20px" }}>

      {/* 1. Image — full bleed, covers entire card */}
      <div className="absolute inset-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
        {paper.thumbnailUrl ? (
          <img src={paper.thumbnailUrl} alt={paper.title} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #001a4d 0%, #000 100%)" }} />
        )}
      </div>

    
     
    </div>
  );
}

export default PublicationCarousel;