import React, { useState } from "react";

// ─── DATA — fill in your links here ──────────────────────────────────────────
// type: "photo" | "video"
// For photos: provide `src` and `alt`
// For videos: provide `youtubeId`, `title`, `channel`
// Mix and order them however you like — they all share the same 3-col grid.

export const highlightItems = [
  { id: 1,  type: "photo", src: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939d66cbdc22808a9f0e058_E-p-500.jpg", alt: "Highlight photo 1" },
  { id: 2,  type: "photo", src: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939d66cc1577001e61c14dd_F-p-500.jpg", alt: "Highlight photo 2" },
  { id: 3,  type: "photo", src: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939d66cb63f4feb2d5b4ed9_Untitled-1-p-500.jpg", alt: "Highlight photo 3" },
  { id: 4,  type: "photo", src: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939d66cfc95bbc6f7384202_A6-p-500.jpg", alt: "Highlight photo 4" },
  { id: 5,  type: "photo", src: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939d66c4a29d9634ad5a234_DSCF0379-p-500.jpg", alt: "Highlight photo 5" },
  { id: 6,  type: "photo", src: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6939d66c4036196ccb6302a8_15-p-500.jpg", alt: "Highlight photo 6" },
  { id: 7,  type: "video", youtubeId: "QuFUJUZatNE&t=2s", title: "The Digital Economist Davos 2025",                    channel: "The Digital Economist" },
  { id: 8,  type: "video", youtubeId: "hAPrEJpYFhs&t=99s", title: "Ambassador Bitange Ndemo at Davos 2025",              channel: "The Digital Economist" },
  { id: 9,  type: "video", youtubeId: "v=B-dGuZLO_rg", title: "Ann Dunkin at Davos 2025 | The Digital Economist",    channel: "The Digital Economist" },
  { id: 10, type: "video", youtubeId: "v=cU5RVz9D1h0", title: "Nicole Sulu at Davos 2025 | The Digital Economist",   channel: "The Digital Economist" },
  { id: 11, type: "video", youtubeId: "3DCfdCKia1I", title: "Lisa Loud at Davos 2025 | The Digital Economist",     channel: "The Digital Economist" },
  { id: 12, type: "video", youtubeId: "CHVA2p3HPjs&t=23s", title: "Navroop Sahdev at Davos 2025 | The Digital Economist",channel: "The Digital Economist" },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="#0a0a0a">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
  </svg>
);

// ─── PHOTO CELL ───────────────────────────────────────────────────────────────

const PhotoCell = ({ item }) => (
  <div className="overflow-hidden rounded-[4px] aspect-[4/3] w-full bg-gray-200">
    {item.src ? (
      <img
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[12px] text-center px-2">
        {item.alt}
      </div>
    )}
  </div>
);

// ─── VIDEO CELL ───────────────────────────────────────────────────────────────

const VideoCell = ({ item }) => {
  const [embedActive, setEmbedActive] = useState(false);

  const thumbnailUrl = item.youtubeId
    ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
    : null;

  const watchUrl  = item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : "#";
  const embedUrl  = item.youtubeId ? `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1` : null;

  if (embedActive && embedUrl) {
    return (
      <div className="w-full aspect-[4/3] rounded-[4px] overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={item.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-[4px] aspect-[4/3] w-full bg-black cursor-pointer"
      onClick={() => item.youtubeId && setEmbedActive(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && item.youtubeId && setEmbedActive(true)}
      aria-label={`Play ${item.title}`}
    >
      {/* Thumbnail */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-[#1a1a1a]" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/40" />

      {/* Header: globe + title */}
      <div className="absolute top-[8px] left-[8px] right-[8px] flex items-start gap-[6px]">
        <div className="flex-shrink-0 w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded-full bg-white flex items-center justify-center p-[3px]">
          <GlobeIcon />
        </div>
        <div className="min-w-0">
          <p className="text-white font-['DM_Sans',sans-serif] font-bold text-[10px] sm:text-[11px] lg:text-[12px] leading-tight line-clamp-2">
            {item.title}
          </p>
          <p className="text-white/70 font-['DM_Sans',sans-serif] text-[9px] sm:text-[10px] mt-[1px]">
            {item.channel}
          </p>
        </div>
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[40px] h-[28px] sm:w-[50px] sm:h-[34px] bg-[#FF0000] rounded-[6px] sm:rounded-[8px] flex items-center justify-center group-hover:bg-[#cc0000] transition-colors duration-200">
          <svg viewBox="0 0 24 24" className="w-[45%] h-[45%]" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[8px] py-[5px]">
        <div className="flex gap-[8px]">
          <div className="w-[13px] h-[13px]"><ShareIcon /></div>
          <div className="w-[13px] h-[13px]"><ClockIcon /></div>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-['DM_Sans',sans-serif] text-[9px] sm:text-[10px] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

// ─── GRID CELL ROUTER ─────────────────────────────────────────────────────────

const GridCell = ({ item }) => {
  if (item.type === "photo") return <PhotoCell item={item} />;
  if (item.type === "video") return <VideoCell item={item} />;
  return null;
};

// ─── HIGHLIGHTS SECTION ───────────────────────────────────────────────────────
// Props:
//   title   string           Section heading (pass "" or null to hide)
//   items   HighlightItem[]  Override the data array (mix photos + videos freely)

const Highlights = ({
  title = "2025 Highlights",
  items = highlightItems,
}) => (
  <section className="w-full bg-[#f6f5f5] py-[48px] sm:py-[64px] lg:py-[72px]">
    {/* ── Constrained container ~1200px ── */}
    <div className="w-full max-w-[1200px] mx-auto px-[16px] sm:px-[40px] lg:px-[120px] flex flex-col gap-y-[24px]">

      {title && (
        <h2 className="text-center text-[#333333] font-['DM_Sans',sans-serif] text-[18px] sm:text-[21px] font-bold leading-tight">
          {title}
        </h2>
      )}

      {/* Single unified 3-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[8px] w-full">
        {items.map((item) => (
          <GridCell key={item.id} item={item} />
        ))}
      </div>

    </div>
  </section>
);

export default Highlights;