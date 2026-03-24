import react from "react";

const ValueCard = ({value}) => {
    return(
            <div className="flex flex-col justify-center items-start w-[350px] h-[200px] 
                bg-gradient-to-br from-black to-[#171717] 
                border-[0.8px] border-[#6f6f6f] rounded-[15px] 
                pl-[60px] pr-[20px] py-[20px] box-border 
                relative transition-all duration-500 ease-in-out
                
                /* Hover Diff Styles */
                hover:from-[#004aad] hover:to-black 
                hover:border-[#6f6f6f] 
                hover:shadow-2xl hover:shadow-blue-900/20"
            >
                <img className="block w-[50px] h-[50px] aspect-square overflow-clip border-none align-middle object-contain" src={value?.img}></img>
                <p className="box-border block text-white font-['DM_Sans'] text-[18.2px] w-[211.14px] h-[25.48px] leading-[25.48px] my-[10px] text-left">
                    <span className="font-bold">{value?.boldText}</span>
                    -{value?.normalText}</p>
            </div>
    )
}

const StrategicValue = () => {

    const values = [
        {
            img:"https://cdn.prod.website-files.com/682f43574652bd066d73adbf/698c096b1713b564865e7e7b_Greenhouse%20Icon-p-500.png" ,
            boldText: `Lead`,
            normalText: "shape the sector"
        },
        {
            img: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/698c096b2cb2128a4d15fdce_Regenerative%20Icon-p-500.png",
            boldText: `Be Visible`,
            normalText: "Elevate Institutional Presence"
        },
        {
            img: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/698c096b3bb74348c1c3682f_Leadership%20Icon-p-500.png",
            boldText: `Contribute`,
            normalText: "Influence infrastructure outcomes"
        }
    ]
    return(
        <>
        <section className="flex flex-col w-full h-[588.8px] bg-black pt-[100px] pb-[120px] px-[140px] gap-y-[100px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
            <div className="flex flex-col items-center justify-center gap-y-[30px] w-[1160px] h-[368.8px] mx-auto box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                <div className="flex flex-col items-center justify-between gap-y-[20px] w-[311.58px] h-[98.8px] py-[10px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                    <h1 className="box-border block text-white montserrat-text font-light text-[42px] w-fit h-[58.8px] leading-[58.8px] my-[10px] text-left">Strategic Value</h1>
                </div>

                <div className="flex flex-col items-center justify-center gap-y-[30px] w-[1200px] h-[240px] py-[20px] mx-auto box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                    <div className="flex flex-row items-center justify-center gap-x-[70px] w-[1200px] h-[200px] mx-auto box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                        {
                            values?.map((value)=>(
                                <ValueCard value={value}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>

        <TextSection/>

        </>
    )
}

export default StrategicValue;

const TextSection = () => {
    return(
        <section className="flex flex-row items-stretch justify-around gap-x-[100px] w-full h-[450.1px] bg-black pt-[100px] pb-[140px] px-[140px] box-border text-[#333333] font-sans">
            <div className="flex flex-row items-start justify-between gap-x-[80px] w-[1160px] h-[210.1px] px-[20px] py-[10px] mx-auto box-border text-[#333333] font-sans">
                <h1 className="block w-[125.24px] h-[63px] text-white font-['Montserrat'] font-light text-[21px] leading-[31.5px] my-[10px] text-left transform-gpu">Intended Participants</h1>
                <p className="block w-[934.76px] h-[170.1px] text-white font-['DM_Sans'] font-light text-[37.8px] leading-[56.7px] my-[10px] text-left">Infrastructure operators, ESG leaders, investors, energy and engineering firms, A/E/C, ICT, carbon and MRV organizations.</p>
            </div>
        </section>
    )
}