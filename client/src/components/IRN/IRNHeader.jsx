import react from "react";

const IRNHeader = () => {
    return(
        <section className="relative flex items-end justify-center w-full h-[700px] bg-black px-[144px] pb-[140px] mb-[-1px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
            <div className="relative z-30 flex flex-col justify-center items-start gap-y-[10px] w-[1160px] h-[306.94px] pl-[70px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                <h1 className="box-border block w-fit h-[38.54px] rounded-full border-[0.8px] border-[#888888] bg-transparent opacity-80 px-[15px] py-[10px] my-[10px] text-white montserrat-text font-light text-[15.4px] leading-[16.94px] text-center">Regenerative Digital Infrastructure</h1>

                <h1 className="block w-[1090px] h-[218.4px] text-white montserrat-text font-normal text-[56px] leading-[72.8px] my-[10px] text-left box-border">
                    An Enterprise Playbook<br/>for Climate Positive Digital Infrastructure
                </h1>

            </div>
            <div className="absolute inset-0 z-10 w-[1440px] h-[700px] overflow-hidden box-border block text-white font-sans text-[14px] leading-[20px]">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="https://cdn.prod.website-files.com/682f43574652bd066d73adbf%2F69953944a9ef2123bd7c78ec_RDI%20HEADER%203_poster.0000000.jpg"
                    className="absolute inset-0 z-0 w-full h-full object-cover"
                >
                    <source src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf%2F69953944a9ef2123bd7c78ec_RDI%20HEADER%203_mp4.mp4" type="video/mp4" />
                    <source src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf%2F69953944a9ef2123bd7c78ec_RDI%20HEADER%203_webm.webm" type="video/webm" />
                </video>
            </div>
            <div className="absolute inset-0 z-20 w-[1440px] h-[700px] bg-gradient-to-t from-black via-black/50 to-transparent box-border block text-[#333333] font-sans text-[14px] leading-[20px]"></div>
        </section>
    )
}

export default IRNHeader;