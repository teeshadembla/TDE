import React from "react";

const LandingComponent = () => {
  return (
    <div className="m-0 p-0 border border-black relative w-full lg:w-screen h-[585px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px] overflow-hidden">
      {/* Background video */}
      <video
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 z-[-1]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf%2F68b0ea2e6d20a7c7e4284509_Untitled%20Design%20Video-transcode.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Foreground content */}
      <div id="container" className="flex flex-row flex-nowrap items-center justify-start box-border text-[#333333] font-[Arial,'Helvetica_Neue',Helvetica,sans-serif] text-[16px] leading-[20px]  h-[287.6px] py-[50px] px-[100px] mt-0 mb-0 gap-x-[35px] gap-y-[35px]">
        {/* Mobile and small screens */}
        <div id="title-wrapper" className="flex flex-col flex-nowrap items-start justify-center box-border text-[#333333] font-[Arial,'Helvetica_Neue',Helvetica,sans-serif] text-[16px] leading-[20px] w-[1200px] h-[187.6px] gap-x-[34px] gap-y-[34px] overflow-x-visible overflow-y-visible">
          <h1 id="dark-hero" className="flex items-stretch justify-center box-border text-white montserrat-text text-[43.2px] font-semibold leading-[51.84px] w-[1200px] h-[103.675px] m-0 relative z-[1]">
            Discover Bold Thinking, Transformative Research, and Global Voices Driving the Next Economy
          </h1>
          <h5 id="text-normal" className="block box-border text-white dmsans-text text-[19.2px] font-normal leading-[24.96px] w-[525.3px] h-[49.925px] m-0 relative z-[1]">
            <b>The Digital Economist</b> bridges technology, sustainability, and policy to build an inclusive, thriving future.
          </h5>
        </div>
      </div>
    </div>
  );
}

export default LandingComponent;