// ─────────────────────────────────────────────────────────────
//  CONTROLLED VOCABULARY
// ─────────────────────────────────────────────────────────────
export const EXPERTISE_OPTIONS = [
  // Tech & Innovation
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Cybersecurity",
  "Blockchain & Web3",
  "Cloud Computing",
  "Data Engineering",
  "Data Science",
  "Software Architecture",
  "DevOps & MLOps",
  "Quantum Computing",
  "Robotics & Automation",
  "IoT & Embedded Systems",
  "AR / VR",
  "Product Management",
  "UX Research",

  // Law & Policy
  "Technology Law",
  "Intellectual Property",
  "Data Privacy & GDPR",
  "AI Governance",
  "Antitrust & Competition Law",
  "International Trade Law",
  "Regulatory Affairs",
  "Corporate Law",
  "Environmental Law",
  "Human Rights Law",
  "Cybercrime & Digital Law",
  "Policy Analysis",
  "Public Administration",
  "Legislative Drafting",

  // Finance & Economics
  "Venture Capital",
  "Private Equity",
  "Investment Banking",
  "Fintech",
  "DeFi & Crypto Finance",
  "Macroeconomics",
  "Behavioral Economics",
  "Development Economics",
  "Financial Regulation",
  "ESG Investing",
  "Risk Management",
  "Quantitative Finance",
  "Accounting & Audit",

  // Academia & Research
  "Academic Research",
  "Science & Technology Studies",
  "Computational Social Science",
  "Ethics & Philosophy of Tech",
  "Higher Education Policy",
  "Research Methodology",
  "Open Science",
  "Science Communication",
  "Digital Humanities",
  "Cognitive Science",
  "Neuroscience",
  "Climate Science",
  "Public Health",
  "Sociology",
  "Political Science",
];

export const INTEREST_OPTIONS = [
  // Tech & Innovation
  "AI Safety & Alignment",
  "Generative AI",
  "Large Language Models",
  "Open Source Software",
  "Tech Startups",
  "Digital Transformation",
  "Future of Work",
  "Smart Cities",
  "Autonomous Vehicles",
  "Space Technology",
  "Biotech & HealthTech",
  "EdTech",
  "Surveillance Technology",
  "Algorithmic Bias & Fairness",

  // Law & Policy
  "Tech Policy",
  "AI Regulation",
  "Internet Governance",
  "Digital Rights",
  "Platform Regulation",
  "Democracy & Technology",
  "Social Media Law",
  "Copyright & Creative AI",
  "Open Government",
  "Electoral Technology",

  // Finance & Economics
  "Impact Investing",
  "Crypto & Digital Assets",
  "Global Trade",
  "Gig Economy",
  "Economic Inequality",
  "Future of Finance",
  "Central Bank Digital Currencies",
  "Startup Funding",
  "Sustainable Finance",

  // Academia & Research
  "Interdisciplinary Research",
  "Tech Ethics",
  "Misinformation & Media",
  "Science Policy",
  "Academic Publishing",
  "Gender & Technology",
  "Global Development",
  "Mental Health & Technology",
  "Education Reform",
  "Climate & Tech Nexus",
  "Digital Literacy",
];

// ─────────────────────────────────────────────────────────────
//  TAG COMBOBOX COMPONENT
//  - Searchable dropdown with custom entry support
//  - Max 3 selections, shown as removable pills
//  - Dark-themed to match the existing signup form
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";

/**
 * TagCombobox
 *
 * Props:
 *   options       – string[]          full controlled vocabulary
 *   value         – string[]          currently selected tags
 *   onChange      – (tags: string[]) => void
 *   max           – number            max selections (default 3)
 *   placeholder   – string
 *   id            – string
 *   name          – string
 */
export default function TagCombobox({
  options = [],
  value = [],
  onChange,
  max = 3,
  placeholder = "Search or type...",
  id,
  name,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = query.trim() === ""
    ? options
    : options.filter((o) =>
        o.toLowerCase().includes(query.toLowerCase())
      );

  // Show "add custom" entry if typed value isn't in the list and not already selected
  const trimmed = query.trim();
  const canAddCustom =
    trimmed.length > 0 &&
    !options.some((o) => o.toLowerCase() === trimmed.toLowerCase()) &&
    !value.some((v) => v.toLowerCase() === trimmed.toLowerCase());

  const atMax = value.length >= max;

  const addTag = (tag) => {
    if (!atMax && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setQuery("");
    inputRef.current?.focus();
  };

  const removeTag = (tag) => {
    onChange(value.filter((v) => v !== tag));
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" id={id} data-name={name}>
      {/* Pills + Input */}
      <div
        className="min-h-[42px] flex flex-wrap gap-2 items-center px-3 py-2 bg-transparent border border-gray-500 rounded cursor-text focus-within:ring-2 focus-within:ring-blue-500"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-blue-600/30 border border-blue-500/50 text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="text-blue-300 hover:text-white leading-none ml-0.5"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        {!atMax && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={value.length === 0 ? placeholder : ""}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed) {
                e.preventDefault();
                const exactMatch = options.find(
                  (o) => o.toLowerCase() === trimmed.toLowerCase()
                );
                addTag(exactMatch || trimmed);
                setOpen(false);
              }
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Backspace" && query === "" && value.length > 0) {
                removeTag(value[value.length - 1]);
              }
            }}
            className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
          />
        )}

        {atMax && (
          <span className="text-xs text-gray-500 ml-1">Max {max} selected</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded border border-gray-600 bg-gray-900 shadow-xl">
          {/* Custom entry */}
          {canAddCustom && !atMax && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(trimmed); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:bg-gray-800 border-b border-gray-700 flex items-center gap-2"
            >
              <span className="text-blue-400 font-bold">+</span>
              Add &ldquo;{trimmed}&rdquo;
            </button>
          )}

          {filtered.length === 0 && !canAddCustom && (
            <p className="px-4 py-2 text-sm text-gray-500">No matches found.</p>
          )}

          {filtered.map((option) => {
            const isSelected = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                disabled={isSelected || atMax}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!isSelected && !atMax) { addTag(option); setOpen(false); }
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                  ${isSelected
                    ? "text-gray-500 cursor-default"
                    : atMax
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-white hover:bg-gray-800 cursor-pointer"
                  }`}
              >
                {option}
                {isSelected && <span className="text-blue-400 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}