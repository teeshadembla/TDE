import react from "react";

const banners = {
    "698cdd95a0d9354807be9ba9" : "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/69237e75ca9e77668b936099_christian-lue-iAXgp5Qs9E8-unsplash-p-800.webp",
    "698cdd95a0d9354807be9bae": "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/69238385a42b0a184f2fbd51_justin-lane-lwwM_dotpcs-unsplash.webp",
    "698cdd95a0d9354807be9bb3":"https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686584804746a6aff66d06dc_Rectangle%20119-p-800.png",
    "698cdd95a0d9354807be9bb8":"https://cdn.prod.website-files.com/682f43574652bd066d73adbf/692381c87914156fb68055d1_kevin-ache-2JJ3wBHu4_0-unsplash-p-800.webp",
    "698cdd95a0d9354807be9bbd":"https://cdn.prod.website-files.com/682f43574652bd066d73adbf/687475884b9c8a386ed6991b_nb.png",
    "698cdd95a0d9354807be9bc2":"https://cdn.prod.website-files.com/682f43574652bd066d73adbf/698583dfce2931ae749408dc_Quantum%20Computing%20Body-p-800.jpg",
    "698cdd95a0d9354807be9bc7":"https://cdn.prod.website-files.com/682f43574652bd066d73adbf/69858a1eac5d2b77630a38c1_Cyber%20Studio%20Body-p-800.jpg",
}

const Banner = ({workGroupId}) => {
    return (
        <section id="banner" className="box-border block text-[#333333] font-sans text-[14px] leading-[20px] mt-0 pl-0 pr-0 w-full h-[273.6px]">
            <img className="inline-block box-border text-[#333333] font-sans text-[14px] leading-[20px] w-full h-[273.6px] max-w-full object-cover object-center align-middle p-0 border-0 rounded-none overflow-hidden" src={banners[workGroupId]}></img>
        </section>
    )
}

export default Banner;