import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { X, ChevronRight } from "lucide-react";
import {
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
  Music2,
  Instagram,
  Circle,
} from "lucide-react";

const B = {
  textInverse: "#161616",
  grey600: "#888",
  blue: "#004aad",
  blue2nd: "#062c65",
  grey200: "#d9d9d9",
  grey400: "#adadad",
  grey50: "#f6f5f5",
  bgSecondary: "#474646",
  textPrimary: "#fff",
  buttonSecondary: "#6f6f6f",
  buttonHover: "#062c65",
  buttonPrimary: "#105abd",
  textOnColor: "#fff",
  textSecondary: "#9f9f9f",
};

// ── placeholder card data ──────────────────────────────────────────────────
const CARDS = [
  {
    tag: "Quantum Computing",
    type: "Publication",
    title: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    date: "May 1, 2026",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&q=80",
  },
  {
    tag: "Sustainability in Tech",
    type: "Roundtable",
    title: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    date: "Apr 18, 2026",
    img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=200&q=80",
  },
];

// ── nav items — swap in your real routes ──────────────────────────────────
const NAV_ITEMS = [
  { label: "Practice Area", route: "/practice-area" },
  { label: "Executive Fellowship", route: "/executive-fellowship" },
  { label: "Publications", route: "/publications" },
  { label: "Events", route: "/events" },
];

const FOOTER_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Institutional Research Network", href: "#" },
  { label: "Davos 2026", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "All Rights Reserved", href: "#" },
];

const SOCIAL_ICONS = [
  { Icon: Youtube, href: "#" },
  { Icon: Facebook, href: "#" },
  { Icon: Twitter, href: "#" },
  { Icon: Linkedin, href: "#" },
  { Icon: Bookmark, href: "#" },
  { Icon: Music2, href: "#" },       // TikTok placeholder
  { Icon: Instagram, href: "#" },
  { Icon: Circle, href: "#" },       // Threads placeholder
];

// ── Search bar ────────────────────────────────────────────────────────────
function SearchBar({ onClose }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderBottom: `1px dashed ${B.grey400}`,
        padding: "10px 20px",
        gap: 10,
        flexShrink: 0,
      }}
    >
      {/* search icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={B.grey600}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        placeholder="Search"
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          fontSize: 15,
          color: B.textInverse,
          fontFamily: "Montserrat, sans-serif",
        }}
        autoFocus
      />
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: B.textInverse,
          display: "flex",
          padding: 4,
        }}
      >
        <X size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}

// ── Left sidebar ──────────────────────────────────────────────────────────
function LeftSidebar({ navigate, onClose }) {
  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${B.grey200}`,
        overflowY: "auto",
      }}
    >
      {/* Just For You */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px",
          background: B.textInverse,
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: "default",
          userSelect: "none",
        }}
      >
        <span>Just For You</span>
        <ChevronRight size={18} strokeWidth={2} color="#fff" />
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column" }}>
        {NAV_ITEMS.map(({ label, route }) => (
          <button
            key={label}
            onClick={() => {
              navigate(route);
              onClose();
            }}
            style={{
              background: "none",
              border: "none",
              borderBottom: `1px solid ${B.grey200}`,
              textAlign: "left",
              padding: "18px 22px",
              fontSize: 15,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              color: B.textInverse,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = B.grey50)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "none")
            }
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Content card ──────────────────────────────────────────────────────────
function ContentCard({ card }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${B.grey200}`,
        padding: "18px 22px",
      }}
    >
      {/* tag pill */}
      <div style={{ marginBottom: 12 }}>
        <span
          style={{
            background: B.textInverse,
            color: "#fff",
            borderRadius: 999,
            padding: "4px 14px",
            fontSize: 12,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          {card.tag}
        </span>
      </div>

      {/* body row */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11.5,
              color: B.grey600,
              fontFamily: "Montserrat, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {card.type}
          </p>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: B.textInverse,
              lineHeight: 1.45,
            }}
          >
            {card.title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              color: B.grey600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {card.date}
          </p>
        </div>

        {/* image */}
        <img
          src={card.img}
          alt={card.tag}
          style={{
            width: 90,
            height: 72,
            objectFit: "cover",
            borderRadius: 6,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function MenuFooter() {
  return (
    <div
      style={{
        borderTop: `1px solid ${B.grey200}`,
        padding: "14px 22px 10px",
        flexShrink: 0,
      }}
    >
      {/* links row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 16px",
          marginBottom: 12,
        }}
      >
        {FOOTER_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontSize: 11.5,
              color: B.textInverse,
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            {label}
          </a>
        ))}
      </div>

      {/* social icons row + copyright */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {SOCIAL_ICONS.map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              style={{ color: B.textInverse, display: "flex" }}
            >
              <Icon size={17} strokeWidth={1.6} />
            </a>
          ))}
        </div>
        <span
          style={{
            fontSize: 11,
            color: B.grey600,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Copyright © 2026 The Digital Economist™.
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const HamburgerMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  // close on Escape
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── dark backdrop ── */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── sliding panel ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          height: "100vh",
          width: "min(580px, 96vw)",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isOpen ? "4px 0 32px rgba(0,0,0,0.18)" : "none",
          willChange: "transform",
        }}
        // prevent clicks inside from closing
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search bar at top */}
        <SearchBar onClose={onClose} />

        {/* Two-column body */}
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Left sidebar */}
          <LeftSidebar navigate={navigate} onClose={onClose} />

          {/* Right content cards */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: B.grey50,
            }}
          >
            {CARDS.map((card, i) => (
              <ContentCard key={i} card={card} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <MenuFooter />
      </div>
    </>
  );
};

export default HamburgerMenu;