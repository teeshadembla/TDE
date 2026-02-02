import react from 'react';
import Footer from '../../components/Footer.jsx';
import PublicationContent from '../../components/Publications/PublicationContent.jsx';
import ResearchDisplay from '../../components/Publications/ResearchDisplay.jsx';

const Publications = () => {
    return (
        <>
        <div className='bg-black font-montserrat pl-[64px] text-base overflow-x-hidden'> 
            <div className='grid grid-cols-2  gap-y-[48px] flex-row max-w-none h-[40em] pl-[5%] pr-0 text-base overflow-x-hidden overflow-y-hidden relative bg-[radial-gradient(circle_farthest-side_at_100%_-30%,#062c65,#000)]'>
                <div className="flex flex-col font-montserrat justify-center items-start gap-x-[30px] gap-y-[30px] h-[640px] w-[436.1px] text-base overflow-y-hidden z-[99] static">
                    <h1 className='font-montserrat flex justify-center items-stretch w-[15ch] mt-0 mb-0 font-semibold text-white z-[1] relative text-[2.7em]'>
                        Explore Expert Insights, Strategic Research, and Global Thought Leadership
                    </h1>
                </div>
                <div
                className="aspect-square object-cover bg-[url('https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686598f73072243d853be886_book8.png')] bg-[position:0_0] bg-cover rounded-[5px] flex-none w-[640px] h-[640px] scale-150 relative ">
                    <div 
                    className="absolute top-0 right-0 bottom-0 left-0 block w-[640px] h-[640px] text-[rgb(0,74,173)] font-sans text-[16px] leading-[20px] z-[2] box-border [transform-style:preserve-3d] isolate [background-image:linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_60%,rgba(0,0,0,1)_100%)]"
                    ></div>

                </div>
            </div>
        </div>

        <PublicationContent/>
        <ResearchDisplay/>
        <Footer/>
        </>
    )
}

export default Publications;