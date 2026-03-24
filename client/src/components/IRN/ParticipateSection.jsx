import react from "react";

const ParticipateSection = () => {
    return(
        <section className="flex flex-col items-center justify-center w-full h-[650px] bg-black/20 bg-[url('https://cdn.prod.website-files.com/682f43574652bd066d73adbf/699539464e39da4ca6bdf6e8_05d428f078837d07530642b4e67dbe66_RDI%20FOOTER%203.jpg')] bg-cover bg-bottom px-[110px] box-border text-white">
            <div className="flex flex-row items-center justify-center w-[1200px] h-[650px] mx-auto box-border text-[#333333] font-sans">
                <div className="flex flex-col items-center justify-center gap-y-[10px] w-[1200px] h-[650px] mx-auto box-border text-[#333333] font-sans">
                    <p className="block w-[880.05px] h-[156.8px] text-white dmsans-text font-normal text-[56px] leading-[78.4px] my-[10px] text-center mx-auto">Participate in<br/>Regenerative Digital Infrastructure</p>
                    <p className="box-border block text-[#cccbcb] dmsans-text font-light text-[21px] w-[704.18px] h-[29.4px] leading-[29.4px] my-[10px] text-left">Build and govern digital infrastructure with measurable climate outcomes.</p>
                    <div className="flex flex-row items-center justify-center gap-x-[25px] w-[338.88px] h-[80px] mx-auto box-border text-[#333333] font-sans">
                        <a 
            href="https://cdn.prod.website-files.com/682f43574652bd066d73adbf/699ec339ace9b4c92a31c40f_Regenerative%20Digital%20Infrastructure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[196.44px] h-[48px] bg-[#004aad] text-white dmsans-text font-bold text-[16px] rounded-[4px] capitalize cursor-pointer transition-all duration-200 ease-in hover:bg-blue-700 active:scale-95 shadow-sm"
        >
            Access Full Brochure
        </a>

        {/* APPLY NOW: 117.44px width */}
        <a 
            href="https://thedigitaleconomist.typeform.com/regen-infra?typeform-source=thedigitaleconomist.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[117.44px] h-[48px] bg-[#004aad] text-white dmsans-text font-bold text-[16px] rounded-[4px] capitalize cursor-pointer transition-all duration-200 ease-in hover:opacity-90 active:scale-95"
        >
            Apply Now
        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ParticipateSection;