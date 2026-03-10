import react from "react";
import PublicationItem from "./PulicationsSection/PublicationItem";

const PublicationsSection = ({publications}) => {
    return(
        <section className="flex items-center justify-center box-border bg-[#F0F1F1] text-[#333] font-sans text-[14px] leading-[20px] h-fit">
            <div id="w-layout-block-container" className="flex flex-col items-center justify-center gap-[20px] box-border text-[#333] font-['DM_Sans',sans-serif] text-[16px] leading-[20px] h-fit w-full max-w-none m-0 pt-0 pb-[144px]">
                <h2 id="publication-workgroup" className="block box-border text-black font-['DM_Sans',sans-serif] text-[36.8px] font-bold leading-[44.16px] h-[44.1625px] w-[369.462px] mt-[144px] mb-[72px] mx-0">Related Publications</h2>
                <div className="flex items-center justify-center box-border text-[#333] font-sans text-[16px] leading-[20px] h-fit w-full px-[72px]">
                    <div id="list" className="grid grid-cols-[640px_640px] grid-rows-[240px_240px_240px_240px_240px_240px] gap-x-[16px] gap-y-[16px] box-border text-[#333] font-sans text-[16px] leading-[20px] pb-[50px] fit w-[1296px]">
                        {
                            publications && publications?.map((publication, index) => (
                                <PublicationItem publication={publication}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PublicationsSection; 