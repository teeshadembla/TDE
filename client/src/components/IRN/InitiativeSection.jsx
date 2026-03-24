import react from "react";

const InitiativeCard = ({initiative}) => {
    return(
        <div className="flex flex-row items-center justify-start gap-x-[40px] w-[900px] h-[80px] bg-gradient-to-r from-black via-black/23 to-white/15 border-[0.8px] border-[#6f6f6f] rounded-[15px] pl-[50px] pr-[40px] box-border text-[#333333] dmsans-text font-light text-[14px]">
            <p className="box-border block text-white dmsans-text font-medium text-[21px] w-[6.9px] h-[27.3px] leading-[27.3px] m-0">{initiative._id}</p>
            <p className="box-border block text-white/80 dmsans-text font-light text-[21px] w-fit h-[29.4px] leading-[29.4px] m-0 text-left">{initiative.title}</p>
        </div>
    )
}



const InitiativeSection = () => {

    const initiatives = [
  {
    _id: "1",
    title: "Reduce infrastructure emissions"
  },
  {
    _id: "2",
    title: "Advance circular systems"
  },
  {
    _id: "3",
    title: "Strengthen executive accountability"
  },
  {
    _id: "4",
    title: "Contribute to research, publications, and global convenings"
  },
  {
    _id: "5",
    title: "Collaborate through The Digital Economist’s Center of Excellence"
  }
];
    return(
        <section className="flex items-center bg-black justify-center w-full h-[900px] px-[100px] box-border text-[#333333] font-sans text-[14px] leading-[20px]">
            <div>
                <div className="flex flex-col items-center justify-center gap-y-[30px] w-[1200px] h-[242.9px] py-[40px] mx-auto box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                    <p className="box-border block text-white dmsans-text font-light text-[42px] w-[242.48px] h-[58.8px] leading-[58.8px] my-[10px] text-left">The Initiative</p>
                    <div className="flex flex-row items-center justify-center gap-x-[30px] w-[888.94px] h-[54.1px] mx-auto box-border text-[#333333] font-sans text-[14px] leading-[20px]">
                        <p className="box-border block w-fit h-[54.1px] rounded-full border-[0.8px] border-[#9f9f9f] px-[30px] leading-[52.5px] text-[#cccbcb] dmsans-text font-light text-[21px] text-center">Enterprise Led</p>
                        <p className="box-border block w-fit h-[54.1px] rounded-full border-[0.8px] border-[#9f9f9f] px-[30px] leading-[52.5px] text-[#cccbcb] dmsans-text font-light text-[21px] text-center">One-year institutional engagement</p>
                        <p className="box-border block w-fit h-[54.1px] rounded-full border-[0.8px] border-[#9f9f9f] px-[30px] leading-[52.5px] text-[#cccbcb] dmsans-text font-light text-[21px] text-center">IPCC 1.5°C aligned</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-[1200px] h-[560px] py-[40px] gap-y-[20px] box-border mx-auto">
                    {initiatives?.map((initiative)=>(
                        <InitiativeCard initiative={initiative}/>
                    ))
                        
                    }
                </div>
            </div>
        </section>
    )
}

export default InitiativeSection;