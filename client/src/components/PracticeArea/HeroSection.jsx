import React from "react";

const HeroSection = ({ name, subtitle,description, bgImg }) => {
  return (
    <div id={`hero-${name}`}   style={{ backgroundImage: `url(${bgImg})` }} className="items-center bg-center bg-no-repeat bg-cover box-border text-[#333333] flex flex-row flex-nowrap font-sans text-[14px] h-[486.4px] justify-start leading-[20px] object-cover pb-0 pl-[144px] pr-[72px] pt-0 [text-size-adjust:100%] [unicode-bidi:isolate] w-screen">
      <div id="container-workgroup" className="items-start box-border text-[#333333] gap-x-[20px] flex flex-row flex-nowrap font-sans text-[16px] h-[349.087px] justify-start leading-[20px] mb-[61.2px] ml-0 mr-0 mt-[61.2px] max-w-[1200px] pb-0 pl-0 pr-[61.2px] pt-0 static gap-y-[20px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[861.2px]">
        <div id="div-block-27" className="box-border text-[#333333] block font-sans text-[16px] h-[349.087px] leading-[20px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[800px]">
          <div id="div-block-22" className="items-center box-border text-[#333333] gap-x-[12px] flex font-sans text-[16px] h-[48.6375px] leading-[20px] gap-y-[12px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[800px]">
            <h4 id="text-box-48" className="box-border text-[#888888] block dmsans-text text-[20.8px] font-normal h-[24.9625px] leading-[24.96px] my-[10px] mb-[10px] me-0 ms-0 mt-[10px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[129.325px]">Practice Area</h4>
            <h4 id="text-box-49" className="border flex justify-center items-center border-[#888888] rounded-[99px] box-border text-[#d9d9d9] dmsans-text text-[19.2px] font-normal h-[28.6375px] leading-[23.04px] mb-[10px] mt-[10px] pb-[2px] pl-[14px] pr-[14px] pt-[2px] [text-size-adjust:100%] [unicode-bidi:isolate] w-fit">{name}</h4>
          </div>
          <div id="div-block-103" className="box-border text-[#333333] gap-x-[17px] flex flex-col flex-nowrap font-sans text-[16px] h-[300.45px] leading-[20px] gap-y-[17px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[800px]">
            <h1 id="heading-12" className="box-border text-[#ffffff] block montserrat-text text-[43.2px] font-bold h-[103.675px] leading-[51.84px] my-[10px] mt-[20px] mb-[10px] ml-0 mr-0 [text-size-adjust:100%] [unicode-bidi:isolate] w-[800px]">{subtitle}</h1>
            <h4 id='desc-workgroup-text' className="box-border text-[#ffffff] block dmsans-text text-[19.2px] font-normal h-[149.775px] leading-[24.96px] m-0 text-left [text-size-adjust:100%] [unicode-bidi:isolate] w-[700px]">{description}</h4>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HeroSection;