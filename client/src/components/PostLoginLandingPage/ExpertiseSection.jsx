import React from "react";

const ExpertiseSection = () => {
  return (
    <section className="relative w-full bg-black overflow-hidden">

  {/* MAIN CONTENT */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center">

    {/* GLOW SYSTEM — EXACT FIGMA MATCH */}
<div
  className="
    absolute 
    top-1/2 
    left-[55%]
    -translate-x-1/2 
    -translate-y-1/2
    w-[1417px] 
    h-[917px]
    pointer-events-none
    z-0
    opacity-80
  "
>

  {/* Rectangle 23 → Radial */}
  <div className="
    absolute inset-0
    bg-[radial-gradient(35%_35%_at_50%_50%,#004AAD_0%,rgba(0,74,173,0.5)_35%,#000000_80%)]
    opacity-60
  " />

  {/* Rectangle 24 → Linear Overlay */}
  <div className="
    absolute inset-0
    bg-[linear-gradient(90deg,rgba(0,0,0,0)_51.21%,#000000_79.58%)]
  " />

</div>

    {/* LEFT */}
    <div className="text-white max-w-xl z-10">
      <h1 className="text-[36px] sm:text-[44px] lg:text-[50px] leading-tight font-light">
        Tailor your <span className="font-medium">expertise</span>
      </h1>

      <p className="mt-6 text-[18px] sm:text-[20px] lg:text-[25px] font-extralight text-white/80">
        Get personalized insights curated for your specific practice areas.
      </p>

      <button className="mt-6 bg-[#004AAD] text-white text-[15px] font-medium px-5 py-2 rounded-md">
        Pick your areas
      </button>
    </div>

    {/* RIGHT */}
    <div className="relative flex justify-center items-center">

      {/* TABLET */}
      <div className="relative w-[90%] max-w-[700px] aspect-[4/3] rounded-[28px] border border-white/20 overflow-hidden shadow-2xl">

        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0"
          alt="preview"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/80"></div>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

        <div className="relative z-10 p-6 text-white">
          <p className="text-xs text-white/60 mb-2">
            Tech Policy and Governance
          </p>

          <h3 className="text-lg sm:text-xl font-medium">
            Designing Inclusive Policy for the Digital Economy
          </h3>
        </div>

      </div>
    </div>
  </div>
</section>
  );
};

export default ExpertiseSection;