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
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        {/* Mobile and small screens */}
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-montserrat font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight">
            Discover Bold Thinking, Transformative Research, and Global Voices Driving the Next Economy
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
            <b>The Digital Economist</b> bridges technology, sustainability, and policy to build an inclusive, thriving future.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingComponent;