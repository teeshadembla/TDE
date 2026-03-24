import react from "react";

const IRNSubheader = () => {
    return(
        <div className="flex items-center justify-center w-full h-[900px] px-[100px] bg-black box-border text-[#333333] font-sans text-[14px] leading-[20px]">
            <div className="flex flex-row items-center justify-center gap-x-[50px] w-[1200px] h-[631.94px] mx-auto box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                <div className="flex flex-col justify-center items-start w-[450px] h-[263.45px] pl-[100px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                    <p className="box-border block text-white dmsans-text font-light text-[42px] w-[350px] h-[176.4px] leading-[58.8px] my-[10px] text-left">Digital<br/> infrastructure <br/> is scaling fast</p>
                    <p className="box-border block text-[#cccbcb] dmsans-text font-light text-[16.8px] w-[324.11px] h-[47.05px] leading-[23.52px] my-[10px] text-left">Regenerative Digital Infrastructure ensures <br/> it scales climate-positive</p>
                </div>

                <div className="flex flex-col justify-center items-start w-[700px] h-[631.94px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                    <img src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf/698d44e32486363809722603_9f1e8a6dae0a1cb2036a2ddf9f496e43_RDI%20Desc%20Image.jpg"
                        className="box-border block object-cover w-[700px] h-[631.94px] overflow-clip border-none align-middle max-w-full text-[#333333] font-sans"
                    >
                    </img>
                </div>
            </div>
        </div>
    )
}

export default IRNSubheader;