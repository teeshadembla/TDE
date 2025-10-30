import react from 'react';

const PublicationContent = () =>{
    return(
        <div className='bg-black py-[100px] px-[64px]'>
            {/* Wrapper class for all publications and components */}
            <div className="flex flex-col justify-center items-center  gap-x-[64px] gap-y-[64px] max-w-[894px] mx-auto px-0 relative">
                <div className='border-b-4 border-white p-4'>
                    <h1 className='text-5xl font-medium font-sans'>Publications</h1>
                </div>

                {/* Tab Content*/}
                <div>
                    {/* Publication Feature */}
                    <div class="flex flex-col justify-center items-center w-full gap-x-20 gap-y-20 pt-20 pb-20 text-base">
                        <div class="block text-center w-[45vw] text-white">
                            <h4 className='mt-[10px] mb-[10px] font-[600] text-[1.3em] leading-[120%] font-sans'>
                                Clear thinking for complex systems.<br/><br/>
                                Our publications translate systems complexity into actionable insight—through original research, strategic frameworks, and global roundtable takeaways.
                            </h4>
                        </div>
                        <div>
                            <div class="z-[1] text-[var(--text-icon--text-primary)] justify-center items-stretch w-auto mt-0 mb-0 font-semibold flex relative">
                                <h2 class="mt-[20px] mb-[10px] font-dm-sans text-[2.3em] font-bold leading-[120%]">
                                Featured
                                </h2>
                            </div>
                            <h4 className='font-normal text-[#9f9f9f] font-sans text-[1.3em] my-[10px]'>Highlighted insights from our latest research and thought leadership.</h4>
                        </div>

                        {/* Featured research papers */}
                        <div className='grid grid-cols-2 gap-x-8 gap-y-8 box-border'>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PublicationContent;