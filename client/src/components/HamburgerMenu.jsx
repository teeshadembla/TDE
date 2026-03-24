import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { X, ChevronRight, ChevronDown, Loader } from "lucide-react";
import {
  Youtube, Facebook, Linkedin, Bookmark,
  Instagram, Github,
} from "lucide-react";
import axiosInstance from "../config/apiConfig";

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

const NAV_ITEMS = [
  { label: "Executive Fellowship", route: "/execFellowship" },
  { label: "Publications", route: "/publications" },
  { label: "Events", route: "/events" },
];

const FOOTER_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Institutional Research Network", href: "https://docsend.com/view/8ken6c6i84m8bwcu" },
  { label: "Davos 2026", href: "/davos" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "All Rights Reserved", href: "#" },
];

const SOCIAL_ICONS = [
  { Icon: Youtube, href: "https://www.youtube.com/@thedigitaleconomist5863" },
  { Icon: Facebook, href: "https://www.facebook.com/people/The-Digital-Economist/100057411551026/#" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/thedigitaleconomist/posts/?feedView=all&viewAsMember=true" },
  { Icon: Bookmark, href: "https://substack.com/@thedigitaleconomist" },
  { Icon: Instagram, href: "https://www.instagram.com/thedigitaleconomist/" },
  { Icon: Github, href: "https://github.com/Thedigitaleconomist" },
];

// ── Search bar ─────────────────────────────────────────────────────────────
function SearchBar({ onClose }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      borderBottom: `1px dashed ${B.grey400}`,
      padding: "10px 20px", gap: 10, flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={B.grey600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        placeholder="Search"
        style={{
          flex: 1, background: "none", border: "none", outline: "none",
          fontSize: 15, color: B.textInverse, fontFamily: "Montserrat, sans-serif",
        }}
        autoFocus
      />
      <button onClick={onClose} style={{
        background: "none", border: "none", cursor: "pointer",
        color: B.textInverse, display: "flex", padding: 4,
      }}>
        <X size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}

// ── Practice Area with workgroup sub-items ─────────────────────────────────
function PracticeAreaItem({ navigate, onClose}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [workgroups, setWorkgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkgroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/api/fellowship/getWorkgroups");
      setWorkgroups(res.data?.data || []);
    } catch (err) {
      setError("Could not load workgroups.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount so data is ready before the user ever opens the dropdown
  useEffect(() => {
    fetchWorkgroups();
  }, []);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  const subItemStyle = {
    background: "none",
    border: "none",
    borderBottom: `1px solid ${B.grey200}`,
    textAlign: "left",
    padding: "13px 22px 13px 36px",
    fontSize: 13.5,
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    color: B.blue,
    cursor: "pointer",
    width: "100%",
    transition: "background 0.15s",
    display: "block",
  };

  return (
    <>
      {/* Practice Area trigger row */}
      <button
        onClick={handleToggle}
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
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = B.grey50)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <span>Practice Area</span>
        {isExpanded
          ? <ChevronDown size={16} strokeWidth={2} />
          : <ChevronRight size={16} strokeWidth={2} />
        }
      </button>

      {/* Collapsible sub-menu */}
      {isExpanded && (
        <div style={{
          background: "#fafafa",
          borderBottom: `1px solid ${B.grey200}`,
          overflow: "hidden",
        }}>
          {loading && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 22px 12px 36px",
              fontSize: 13, color: B.grey600,
              fontFamily: "Montserrat, sans-serif",
            }}>
              <Loader size={14} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
              Loading workgroups…
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div style={{
              padding: "12px 22px 12px 36px",
              fontSize: 13, color: "#c0392b",
              fontFamily: "Montserrat, sans-serif",
            }}>
              {error}
              <button
                onClick={fetchWorkgroups}
                style={{
                  marginLeft: 8, fontSize: 12, color: B.blue,
                  background: "none", border: "none", cursor: "pointer",
                  textDecoration: "underline", fontFamily: "Montserrat, sans-serif",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && workgroups.length === 0 && (
            <div style={{
              padding: "12px 22px 12px 36px",
              fontSize: 13, color: B.grey600,
              fontFamily: "Montserrat, sans-serif",
            }}>
              No workgroups found.
            </div>
          )}

          {!loading && !error && workgroups.map((wg) => (
            <button
              key={wg._id}
              onClick={() => { navigate(`/practice/${wg._id}`); onClose(); }}
              style={subItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = B.grey200)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {wg.title}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Left sidebar ───────────────────────────────────────────────────────────
function LeftSidebar({ navigate, onClose }) {
  return (
    <div style={{
      width: 260, flexShrink: 0, display: "flex",
      flexDirection: "column", borderRight: `1px solid ${B.grey200}`,
      overflowY: "auto",
    }}>
      {/* Just For You */}
      <div
      onClick={() => navigate("/just-for-you")}
       style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 22px",
        background: "linear-gradient(90deg, #001e47 0%, #004aad 100%)",
        color: "#fff",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        userSelect: "none",
      }}>
        <span>Just For You</span>
        <ChevronRight size={18} strokeWidth={2} color="#fff" />
      </div>

      <nav style={{ display: "flex", flexDirection: "column" }}>
        {/* Practice Area with dynamic workgroups */}
        <PracticeAreaItem navigate={navigate} onClose={onClose} />

        {/* Remaining nav items */}
        {NAV_ITEMS.map(({ label, route }) => (
          <button
            key={label}
            onClick={() => { navigate(route); onClose(); }}
            style={{
              background: "none", border: "none",
              borderBottom: `1px solid ${B.grey200}`,
              textAlign: "left", padding: "18px 22px",
              fontSize: 15, fontFamily: "Montserrat, sans-serif",
              fontWeight: 500, color: B.textInverse,
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = B.grey50)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Content card ───────────────────────────────────────────────────────────
function ContentCard({ card, number }) {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer" onClick={() => navigate(number<1 ? `/events/${card._id}` : `/research-paper/${card._id}`) } style={{ borderBottom: `1px solid ${B.grey200}`, padding: "18px 22px" }}>
      <div style={{ marginBottom: 12 }}>
        <span style={{
          background: B.textInverse, color: "#fff", borderRadius: 999,
          padding: "4px 14px", fontSize: 12, fontFamily: "Montserrat, sans-serif",
          fontWeight: 600, letterSpacing: 0.2,
        }}>
          {card?.workgroupTitles?.[0]}
        </span>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: "0 0 4px", fontSize: 11.5, color: B.grey600,
            fontFamily: "Montserrat, sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>{card?.type || card?.documentType}</p>
          <p style={{
            margin: "0 0 8px", fontSize: 14, fontFamily: "Montserrat, sans-serif",
            fontWeight: 600, color: B.textInverse, lineHeight: 1.45,
          }}>{card.title}</p>
          <p style={{
            margin: 0, fontSize: 11.5, color: B.grey600, fontFamily: "Montserrat, sans-serif",
          }}>{new Date(number<1 ? card?.eventDate?.start : card?.publishingDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}</p>
        </div>
        <img src={card?.image?.url || card?.thumbnailUrl} alt={card.tag} style={{
          width: 90, height: 72, objectFit: "cover", borderRadius: 6, flexShrink: 0,
        }} />
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function MenuFooter() {
  return (
    <div style={{ borderTop: `1px solid ${B.grey200}`, padding: "14px 22px 10px", flexShrink: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginBottom: 12 }}>
        {FOOTER_LINKS.map(({ label, href }) => (
          <a key={label} href={href} style={{
            fontSize: 11.5, color: B.textInverse, textDecoration: "none",
            fontFamily: "Montserrat, sans-serif", fontWeight: 500, whiteSpace: "nowrap",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >{label}</a>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {SOCIAL_ICONS.map(({ Icon, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noreferrer"
              style={{ color: B.textInverse, display: "flex" }}>
              <Icon size={17} strokeWidth={1.6} />
            </a>
          ))}
        </div>
        <span style={{ fontSize: 11, color: B.grey600, fontFamily: "Montserrat, sans-serif" }}>
          Copyright © 2026 The Digital Economist™.
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
const HamburgerMenu = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const cardData = data || CARDS;

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div className="z-[20]">
      {/* Dark backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sliding panel */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 50,
          height: "100vh", width: "min(580px, 96vw)",
          background: "#fff", display: "flex", flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isOpen ? "4px 0 32px rgba(0,0,0,0.18)" : "none",
          willChange: "transform",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <SearchBar onClose={onClose} />

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <LeftSidebar navigate={navigate} onClose={onClose} />
          <div style={{ flex: 1, overflowY: "auto", background: B.grey50 }}>
            {cardData.map((card, i) => <ContentCard key={i} card={card} number={i}/>)}
          </div>
        </div>

        <MenuFooter />
      </div>
    </div>
  );
};

export default HamburgerMenu;