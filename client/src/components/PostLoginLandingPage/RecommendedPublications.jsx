import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../config/apiConfig.js";
import DataContext from "../../context/DataProvider.jsx";

// ─── Fallback Data ─────────────────────────────────────────────────────────────
const FALLBACK_PUBLICATIONS = [
  {
    _id: "fallback-1",
    title: "AI in Physical Form: The Rise of Robots and Humanoids",
    publishingDate: "2025-12-19T00:00:00.000Z",
    documentType: "Position Paper",
    Authors: [{ name: "Sandy Carter" }, { name: "Dr. Priyanka Shrivastava" }, { name: "Sanjeev Sharma" }],
    tags: ["Human-Machine Systems", "Embodied Intelligence", "Adaptive Automation"],
    // AI / robotics
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  },
  {
    _id: "fallback-2",
    title: "Perspectives: Why Is Blockchain Not Successful (Yet)?",
    publishingDate: "2025-12-10T00:00:00.000Z",
    documentType: "Research Paper",
    Authors: [{ name: "Dr. Nikhil Varma" }],
    tags: ["Blockchain Taxonomy", "Digital Infrastructure", "Innovation Ecosystems"],
    // Circuit / digital tech
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    _id: "fallback-3",
    title: "AI Trust Revolution: Economic Incentives and Distributed Verification Solve Supply Chain Transparency",
    publishingDate: "2025-12-22T00:00:00.000Z",
    documentType: "Position Paper",
    Authors: [{ name: "Dr. Alejandro Molina" }],
    tags: ["Supply Chain", "Artificial Intelligence", "Transparency"],
    // Warehouse / logistics
    thumbnailUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  },
  {
    _id: "fallback-4",
    title: "Addressing Challenges and Delivering Value in Healthcare Using Generative AI",
    publishingDate: "2025-11-30T00:00:00.000Z",
    documentType: "Research Paper",
    Authors: [{ name: "Shree Varuna Ramesh" }, { name: "Shannon Kennedy" }],
    tags: ["Data Governance", "Healthcare Compliance", "SLM for Health Innovation"],
    // Medical lab
    thumbnailUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80",
  },
  {
    _id: "fallback-5",
    title: "A New Prescription for Healthcare: Why Systemic Collaboration Is the Cure",
    publishingDate: "2026-01-08T00:00:00.000Z",
    documentType: "Policy Paper",
    Authors: [{ name: "Dr. Priyanka Shrivastava" }],
    tags: ["AI in Healthcare", "Systemic Reform", "Policy"],
    // Data / policy analytics
    thumbnailUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
  },
];

// ─── Card slot configs ─────────────────────────────────────────────────────────
// Figma sizes reduced 20%:  Central 450×650→360×520  |  Secondary 400×578→320×462  |  Tertiary 350×506→280×404
// tx = horizontal pixel offset from stage center to card center
// Offsets chosen so secondary/tertiary are clearly visible (not tucked behind center card)
const CARD_SLOTS = [
  { offset: -2, w: 280, h: 404, tx: -550, zIndex: 1,  opacity: 0.42 },
  { offset: -1, w: 320, h: 462, tx: -305, zIndex: 2,  opacity: 0.70 },
  { offset:  0, w: 360, h: 520, tx:    0, zIndex: 10, opacity: 1    },
  { offset:  1, w: 320, h: 462, tx:  305, zIndex: 2,  opacity: 0.70 },
  { offset:  2, w: 280, h: 404, tx:  550, zIndex: 1,  opacity: 0.42 },
];

// ─── Helper ────────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ─── Main Component ────────────────────────────────────────────────────────────
export function PublicationCarousel() {
  const { account } = useContext(DataContext.DataContext);
  const navigate = useNavigate();

  const [publications, setPublications] = useState(FALLBACK_PUBLICATIONS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const fetchPersonalized = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/highlight/personalized");
        const fetched = res.data.publications || [];
        setPublications(fetched.length > 0 ? fetched : FALLBACK_PUBLICATIONS);
        setActiveIndex(0);
      } catch {
        setPublications(FALLBACK_PUBLICATIONS);
        setActiveIndex(0);
      } finally {
        setLoading(false);
      }
    };
    if (account?._id) fetchPersonalized();
  }, [account?._id]);

  // Lock during animation → update index → unlock
  const slideTo = useCallback(
    (direction) => {
      if (animating || publications.length === 0) return;
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) =>
          direction === "left"
            ? (prev - 1 + publications.length) % publications.length
            : (prev + 1) % publications.length
        );
        setAnimating(false);
      }, 420);
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
      <div
        className="w-full flex items-center justify-center"
        style={{ height: "964px", background: "#000" }}
      >
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // ── Outermost: full 1440px width, 964px tall, radial blue glow ──
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "964px",
        background:
          "radial-gradient(67.61% 67.61% at 49.28% 54.55%, #004AAD 0%, #000000 67.95%)",
      }}
    >
      {/* Left + right black vignette — fades cards at screen edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          background:
            "linear-gradient(270deg, #000000 0%, rgba(0,0,0,0.3) 16%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 84%, #000000 100%)",
        }}
      />

      {/* ── Content column, centred, no horizontal padding needed ── */}
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
            marginBottom: "24px",
          }}
        >
          Recommended for you
        </h2>

        {/* Controls: ‹ [Access Here] › */}
        <div
          className="flex items-center"
          style={{ gap: "24px", marginBottom: "44px" }}
        >
          <button
            onClick={() => slideTo("left")}
            disabled={animating}
            className="flex items-center justify-center text-white transition-opacity duration-200"
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
            className="flex items-center justify-center text-white transition-opacity duration-200"
            style={{ opacity: animating ? 0.3 : 0.75, width: 35, height: 35 }}
            aria-label="Next publication"
          >
            <ChevronRight size={35} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Carousel stage ──
            Visible width = 60% of 1440 = 864px, centered.
            Cards are absolutely positioned relative to the stage center.
            Secondary/tertiary cards overflow beyond 864px and are clipped
            + faded by the vignette overlay above.                         ── */}
        <div
          className="relative"
          style={{ width: "864px", height: "560px" }}
        >
          {CARD_SLOTS.map(({ offset, w, h, tx, zIndex, opacity }) => {
            const paper = getAt(offset);
            if (!paper) return null;
            const isCenter = offset === 0;

            return (
              <div
                key={`slot${offset}-${paper._id}`}
                className="absolute transition-all duration-[420ms] ease-in-out"
                style={{
                  width: w,
                  height: h,
                  zIndex,
                  opacity,
                  // Card center aligns to (stage center + tx)
                  left: `calc(50% + ${tx}px - ${w / 2}px)`,
                  // All cards share the same vertical center
                  top: `calc(50% - ${h / 2}px)`,
                  borderRadius: "20px",
                  border: "1px solid #666666",
                  overflow: "hidden",
                  pointerEvents: isCenter ? "auto" : "none",
                  cursor: isCenter ? "pointer" : "default",
                }}
                onClick={
                  isCenter
                    ? () => navigate(`/research-paper/${paper._id}`)
                    : undefined
                }
              >
                <PublicationCard
                  paper={paper}
                  isCenter={isCenter}
                  cardHeight={h}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Publication Card ──────────────────────────────────────────────────────────
//
// Layer stack (bottom → top):
//   1. Black card background (shows as border inside the 20px image margin)
//   2. Image — absolute, 20px margin from all card edges, borderRadius 10px
//   3. Top gradient overlay — 20% card height, black→transparent over image top
//   4. Bottom gradient overlay — 30% card height, transparent→black over image bottom
//   5. Header text (z-20) — logo + date/doctype, 20px from card edges
//   6. Footer text (z-20) — authors + title + tags + copyright, 20px from card edges
//
function PublicationCard({ paper, isCenter, cardHeight }) {
  const authorLine = Array.isArray(paper.Authors)
    ? paper.Authors
        .map((a) => (typeof a === "object" ? a.name || a.email || "" : a))
        .filter(Boolean)
        .join(", ")
    : "";

  // Font scale: slightly smaller on secondary/tertiary cards
  const fs = isCenter
    ? { author: "9px", title: "14px", tag: "7.5px", meta: "8px", copy: "7px" }
    : { author: "8px", title: "11px", tag: "6.5px", meta: "7px", copy: "6px" };

  const topGradientH = cardHeight * 0.20;
  const bottomGradientH = cardHeight * 0.30;

  return (
    <div
      className="relative w-full h-full"
      style={{ background: "#000", borderRadius: "20px" }}
    >
      {/* ── 1. Full-bleed image — 20px margin all sides (card rules: image margin 20px horizontal, centered) ── */}
      <div
        className="absolute"
        style={{
          top: "20px",
          left: "20px",
          right: "20px",
          bottom: "20px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {paper.thumbnailUrl ? (
          <img
            src={paper.thumbnailUrl}
            alt={paper.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "linear-gradient(135deg, #001a4d 0%, #000 100%)" }}
          />
        )}
      </div>

      {/* ── 2. Top gradient — 20% height, black → transparent, overlays image top ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: 0,
          height: `${topGradientH}px`,
          zIndex: 10,
          borderRadius: "20px 20px 0 0",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ── 3. Bottom gradient — 30% height, transparent → black, overlays image bottom ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: 0,
          height: `${bottomGradientH}px`,
          zIndex: 10,
          borderRadius: "0 0 20px 20px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ── 4. Header — on top gradient, 20px from card edges (elements margin: 20px, left-aligned) ── */}
      <div
        className="absolute left-0 right-0 flex items-start justify-between"
        style={{ top: 0, zIndex: 20, padding: "14px 20px 0 20px" }}
      >
        {/* Logo + wordmark — left aligned */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className="rounded-full flex items-center justify-center shrink-0"
            style={{ width: 26, height: 26, background: "rgba(255,255,255,0.13)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
              <ellipse cx="12" cy="12" rx="4" ry="9" stroke="white" strokeWidth="1.5" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <span
            className="text-white/60 uppercase leading-tight"
            style={{
              fontSize: fs.meta,
              letterSpacing: "0.07em",
              fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            THE<br />DIGITAL<br />ECONOMIST
          </span>
        </div>

        {/* Date + document type — right aligned */}
        <div className="text-right">
          <p
            className="text-white/45"
            style={{
              fontSize: fs.meta,
              lineHeight: "1.6",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Date of Publication
          </p>
          <p
            className="text-white/65"
            style={{
              fontSize: fs.meta,
              lineHeight: "1.6",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {formatDate(paper.publishingDate)}
          </p>
          <p
            className="text-white/90 font-medium"
            style={{
              fontSize: fs.meta,
              marginTop: "2px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {paper.documentType}
          </p>
        </div>
      </div>

      {/* ── 5. Footer — on bottom gradient, 20px from card edges (elements margin: 20px, left-aligned) ── */}
      <div
        className="absolute left-0 right-0"
        style={{ bottom: 0, zIndex: 20, padding: "0 20px 18px 20px" }}
      >
        {/* Authors — 20px between elements vertically */}
        {authorLine && (
          <p
            className="text-white/55 truncate"
            style={{
              fontSize: fs.author,
              marginBottom: "6px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {authorLine}
          </p>
        )}

        {/* Title */}
        <h3
          className="text-white font-semibold leading-snug line-clamp-2"
          style={{
            fontSize: fs.title,
            marginBottom: "8px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {paper.title}
        </h3>

        {/* Tags separated by | */}
        {paper.tags?.length > 0 && (
          <div
            className="flex flex-wrap items-center"
            style={{ gap: "5px", marginBottom: "8px" }}
          >
            {paper.tags.slice(0, 3).map((tag, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span
                    className="text-white/25"
                    style={{ fontSize: fs.tag }}
                  >
                    |
                  </span>
                )}
                <span
                  className="text-white/50 uppercase"
                  style={{
                    fontSize: fs.tag,
                    letterSpacing: "0.07em",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {tag}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Copyright */}
        <p
          className="text-white/25"
          style={{
            fontSize: fs.copy,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          © 2025 The Digital Economist. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default PublicationCarousel;