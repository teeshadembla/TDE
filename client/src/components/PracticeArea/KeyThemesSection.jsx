import React from "react";

const FeatureCard = ({keyTheme}) => {
  return(
    <div id="f-feature-card-outline" className="items-stretch bg-scroll bg-[#262626] hover:bg-black hover:bg-[linear-gradient(330deg,rgb(0,74,173),rgba(0,0,0,0)_39%)] border border-[#888888] rounded-[8px] box-border text-[#161616] gap-x-[24px] flex dmsans-text text-[15px] h-[187px] justify-start leading-[20px] max-w-none min-h-[25px] pb-[32px] pl-[32px] pr-[32px] pt-[32px] gap-y-[24px] [text-size-adjust:100%] transition-colors duration-[0.4s] ease [unicode-bidi:isolate] w-[540px]">
      <div className="bg-scroll box-border text-[#161616] block dmsans-text text-[15px] h-[121.4px] leading-[20px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[474.4px]">
        <div id="f-margin-bottom-08" className="bg-scroll box-border text-[#161616] block dmsans-text text-[15px] h-[23.4px] leading-[20px] mb-[8px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[474.4px]">
          <h4 className="items-center bg-scroll box-border text-[#ffffff] flex font-['DM Sans',sans-serif] text-[19.5px] font-semibold h-[23.4px] justify-start leading-[23.4px] m-0 relative [text-size-adjust:100%] [unicode-bidi:isolate] w-[474.4px] z-[1]"><strong>{keyTheme.title}</strong></h4>
        </div>
        <h5 className="bg-scroll box-border text-[#9f9f9f] block font-['DM Sans',sans-serif] text-[15px] font-normal h-[78px] leading-[19.5px] my-[10px] mb-[10px] me-0 ms-0 mt-[10px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[474.4px]">
          {keyTheme.description}
        </h5>
      </div>
    </div>
  )
}

const KeyThemesSection = ({ keythemes }) => {


  return (
    <section id="key-themes" className="box-border text-[#333333] flex justify-center dmsans-text text-[14px] h-[837.525px] leading-[20px] [text-size-adjust:100%] [unicode-bidi:isolate] w-screen bg-scroll">
      <div id="w-layout-blockcontainer" className="items-center bg-scroll bg-white box-border text-[#333333] gap-x-[20px] flex flex-col flex-nowrap dmsans-text text-[16px] h-[837.525px] justify-center leading-[20px] m-0 max-w-none pb-[144px] pl-[72px] pr-[72px] pt-[72px] static gap-y-[20px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[1440px]">
        
        <div id="boxes-featured" className="bg-scroll box-border text-[#161616] block dmsans-text text-[16px] h-[581.525px] leading-[20px] pb-0 pl-0 pr-0 pt-[10px] relative [text-size-adjust:100%] [unicode-bidi:isolate] w-[1200px]">
          <div id="f-container-regular" className="bg-scroll box-border text-[#161616] block dmsans-text text-[16px] h-[571.525px] leading-[20px] ml-0 mr-0 max-w-[1200px] relative [text-size-adjust:100%] [unicode-bidi:isolate] w-[1200px]">

            <div id="f-margin-bottom-64" className="bg-scroll box-border text-[#161616] block dmsans-text text-[16px] h-[93.525px] leading-[20px] mb-[64px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[1200px]">
              <div id="f-title-wrapper-center" className="items-center bg-scroll box-border text-[#161616] flex flex-col dmsans-text text-[16px] h-[93.525px] justify-center leading-[20px] ml-0 mr-0 max-w-full relative text-center [text-size-adjust:100%] [unicode-bidi:isolate] w-[1200px] z-[5]">
                <div id="f-margin-bottom-16" className="bg-scroll box-border text-[#161616] block dmsans-text text-[16px] h-[77.525px] leading-[20px] mb-[16px] text-center [text-size-adjust:100%] [unicode-bidi:isolate] w-[276.013px]">
                  <h1 id="heading-67" className="bg-scroll box-border text-[#161616] block montserrat-text text-[43.2px] font-bold h-[47.525px] leading-[47.52px] my-[10px] mt-[20px] mb-[10px] ml-0 mr-0 text-center [text-size-adjust:100%] [unicode-bidi:isolate] w-[276.013px]">
                    <strong >Key Themes</strong>
                  </h1>
                </div>
              </div>
            </div>
            <div id="f-feature-card-wrapper" className="bg-scroll box-border text-[#161616] gap-x-[40px] flex flex-row flex-wrap dmsans-text text-[15px] h-[414px] justify-center leading-[20px] gap-y-[40px] [text-size-adjust:100%] [unicode-bidi:isolate] w-[1200px]">
                {keythemes?.map((theme, index)=> (
                  <FeatureCard keyTheme={theme} />
                ))}
            </div>
          </div>
        </div>
      
      </div>
    </section>
  );
};

export default KeyThemesSection;