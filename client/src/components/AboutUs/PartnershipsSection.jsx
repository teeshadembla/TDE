import React from 'react';

const partnerships = [
  {
    name: "MIT",
    tag: "ARTIFICIAL INTELLIGENCE",
    description:
      "The Digital Economist is engaged with MIT Connection Science on the applications of Machine Learning for efficiency gains in governance and fraud detection.",
    logoImage: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ef3469ad154b5e42030bc_MIT_logo.svg",
  },
  {
    name: "The World Bank",
    tag: "GOVTECH",
    description:
      "The Digital Economist is a “Global Partner” of the World Bank, focused on mainstreaming gender in public goods delivery and accurately measuring govtech indicators.",
    logoImage: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ef3354f712d189f8bbb2b_world-bank-seeklogo.svg",
  },
  {
    name: "IBM",
    tag: "RENEWABLE ENERGY",
    description:
      "Cutting-edge work combining blockchain, AI, and renewable energy (particularly solar and wind), the organizations are building “programmable energy” using a prosumer model.",
    logoImage: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ef33f4f712d189f8bbe4e_01_8-bar-positive.svg",
  },
];


const IntegrationCard = ({partnership}) =>{
  return (
    <div id="integration-popular-card" className='flex items-start justify-start flex-col flex-nowrap box-border bg-white text-[#333333] font-[Arial] text-[16px] leading-[20px] h-[331.438px] w-[311.6px] gap-[16px] p-[24px] rounded-[12px]'>
      <div id="integraton-row" className='flex items-start justify-between box-border text-[#333333] font-[Arial] text-[16px] leading-[20px] h-[40px] w-[263.6px] gap-[12px]'>
        <img src={`${partnership.logoImage}`} className='block box-border text-[#333333] font-[Arial] text-[16px] leading-[20px] h-[32px] w-[62.0625px] max-w-full overflow-clip align-middle'></img>
        <div id="button-primary-5" className='flex items-center justify-center box-border bg-[rgb(37,39,44)] text-white font-[Arial] text-[12px] font-normal leading-[16px] tracking-[-0.08px] h-[40px] min-h-[40px] w-[189.538px] gap-[8px] px-[16px] py-[8px] border border-black rounded-[8px] shadow-[rgba(0,0,0,0.5)_0px_1px_2px_0px,_rgb(63,68,77)_0px_1px_1px_2px_inset] text-center whitespace-nowrap transition-colors duration-[0.3s] ease'>
          <strong className='block box-border text-white font-[Arial] text-[12px] font-bold leading-[16px] tracking-[-0.08px] h-[16px] w-[155.938px] text-center whitespace-nowrap'>{partnership.tag}</strong>
        </div>
      </div>
      <h3 className='block box-border text-[#333333] dmsans-text text-[27.2px] font-bold leading-[32.64px] h-[32.6375px] w-fit mt-[20px] mb-[10px] mx-0'><strong className='inline box-border text-[#333333] dmsans-text text-[27.2px] font-bold leading-[32.64px]'>{partnership.name}</strong></h3>
      <h5 className='block box-border text-[rgb(100,98,98)] dmsans-text text-[16px] font-normal leading-[20.8px] h-[104px] w-[263.6px] my-[10px]'>{partnership.description}</h5>
    </div>
  )
}

const PartnershipsSection = () => {
  return (
    <div className='flex justify-center'>
    <div id="about-us-partnership" className='flex justify-center box-border bg-white text-[#333333] font-[Arial] text-[14px] leading-[20px] h-[949.6px] w-[1440px] overflow-hidden py-[144px] px-[72px]'>
      <div id="partnership-wrapper" className='flex flex-col flex-nowrap box-border text-[#333333] font-[Arial] text-[14px] leading-[20px] h-[661.6px] max-w-[1092px] gap-[32px] mx-[102px]'>
        <div id="section-regular-5" className='block box-border relative bg-[rgb(247,248,248)] text-[#333333] font-[Arial] text-[14px] leading-[20px] h-[661.6px] w-[1092px] py-[96px] px-[54.6px]'>
          <div id="container-large-7" className='block box-border text-[#333333] font-[Arial] text-[16px] leading-[20px] h-[469.6px] w-[982.8px] max-w-[1280px] mx-0'>
            <div id="title-wrapper-2" className='flex items-center justify-start flex-col flex-nowrap box-border text-[#333333] font-[Arial] text-[16px] leading-[20px] h-[74.1625px] w-[628px] max-w-[628px] gap-[16px] mb-[64px] mx-[177.4px] text-center'>
              <h2 id='heading-2-black' className='block box-border text-[rgb(22,22,22)] dmsans-text text-[36.8px] font-bold leading-[44.16px] h-[44.1625px] w-[305.038px] mt-[20px] mb-[10px] mx-0 text-center'>Our Partnerships</h2>
            </div>
            <div id="grid-three-column-2" className='grid box-border text-[#333333] font-[Arial] text-[16px] leading-[20px] h-[331.438px] w-[982.8px] gap-[24px] grid-cols-[311.6px_311.6px_311.6px] grid-rows-[331.438px] auto-cols-fr'>
              {partnerships.map((partnership) => (
                <IntegrationCard partnership={partnership}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PartnershipsSection;