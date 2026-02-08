import { useEffect, useState } from 'react';

const HowWeDriveImpact = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById('section-9');
            if (!section) return;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const scrollY = window.scrollY;
            
            // Calculate relative scroll position within the section
            const relativeScroll = scrollY - sectionTop;
            
            // Each image is 608px tall, so we have 3 sections of 608px each
            const imageHeight = 608;
            
            // Determine which text should be active based on 75% scroll through each image
            if (relativeScroll < 0) {
                setActiveIndex(0);
            } else if (relativeScroll < imageHeight * 0.50) {
                setActiveIndex(0);
            } else if (relativeScroll < imageHeight + (imageHeight * 0.50)) {
                setActiveIndex(1);
            } else if (relativeScroll < (imageHeight * 2) + (imageHeight * 0.50)) {
                setActiveIndex(2);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <section id='section-9' className='flex justify-start box-border relative text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[1824px]'>
        <div id="div-block-62" className='block box-border text-[#333333] font-[Arial] text-[18px] leading-[20px] h-[1824px] w-1/2 sticky top-[180px]'>
          <div className='block box-border text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] bg-[url(https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686eb92b3a6056673ec16301_sticky%20photo%201.png)] bg-[position:0%_50%] bg-repeat bg-auto'></div>
          <div className='block box-border text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] bg-[url(https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ab706e37cb6196aba2b17_2025-26%20FELLOWSHIP%20BROCHURE.jpg)] bg-[position:0%_50%] bg-no-repeat bg-cover'></div>
          <div className='block box-border text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] bg-[url(https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685a4e0f09d00f767f938a13_image-9.png)] bg-[position:100%_50%] bg-cover'></div>
        </div>
        <div id="div-block-63" className='block box-border text-[#333333] font-[Arial] text-[18px] leading-[20px] w-1/2 h-[1824px]'>
          <div id="sticky-text-holder" className='block box-border text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] sticky top-[180px]'>
            <div 
              id="sticky-text-1" 
              className='absolute top-0 bottom-0 left-0 right-0 flex flex-col flex-nowrap items-start justify-center box-border bg-[rgb(23,23,23)] text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] pl-[72px] gap-x-[17px] gap-y-[17px] transition-opacity duration-500 ease-in-out'
              style={{ opacity: activeIndex === 0 ? 1 : 0 }}
            >
              <h4 className='block box-border text-[rgb(100,98,98)] dmsans-text text-[23.4px] font-semibold leading-[28.08px] w-[240.425px] h-[28.075px] mt-[10px] mb-[129.6px] mx-0'>How We Drive Impact</h4>
              <h1 className='block box-border text-white montserrat-text text-[48.6px] font-bold leading-[53.46px] w-[244.275px] h-[53.4625px] mt-[20px] mb-[10px] mx-0 text-center whitespace-pre-wrap break-spaces'>
                <strong className='inline box-border text-white montserrat-text text-[48.6px] font-semibold leading-[53.46px] text-center whitespace-pre-wrap break-spaces'>Initiatives</strong>
              </h1>
              <p className='block box-border text-[rgb(170,167,167)] dmsans-text text-[18px] font-normal leading-[23.4px] w-[550.8px] h-[70.2px] mt-0 mb-[10px] mx-0 text-left whitespace-pre-wrap break-spaces'> We launch high-leverage initiatives that rewire systems from the ground up—aligning emerging technologies with inclusive policy and human-first design to unlock real-world change.</p>
            </div>
            <div 
              id="sticky-text-2" 
              className='absolute top-0 bottom-0 left-0 right-0 flex flex-col flex-nowrap items-start justify-center box-border bg-[rgb(71,70,70)] text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] pl-[72px] gap-x-[17px] gap-y-[17px] transition-opacity duration-500 ease-in-out'
              style={{ opacity: activeIndex === 1 ? 1 : 0 }}
            >
              <h4 className='block box-border text-[rgb(111,111,111)] dmsans-text text-[23.4px] font-semibold leading-[28.08px] w-[240.425px] h-[28.075px] mt-[10px] mb-[129.6px] mx-0'>How We Drive Impact</h4>
              <h1 className='block box-border text-white montserrat-text text-[48.6px] font-bold leading-[53.46px] w-[311.875px] h-[53.4625px] mt-[20px] mb-[10px] mx-0 text-center whitespace-pre-wrap break-spaces'><strong>Publications</strong></h1>
              <p className='block box-border text-[rgb(170,167,167)] dmsans-text text-[18px] font-normal leading-[23.4px] w-[550.8px] h-[70.2px] mt-0 mb-[10px] mx-0 text-left whitespace-pre-wrap break-spaces'>Access insight that moves the needle. Our publications offer strategic analysis, future trends, and global perspectives to help you lead in a fast-shifting digital economy.</p>
            </div>
            <div 
              id="sticky-text-3" 
              className='absolute top-0 bottom-0 left-0 right-0 flex flex-col flex-nowrap items-start justify-center box-border bg-[rgb(217,217,217)] text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[608px] pl-[72px] pb-0 gap-x-[17px] gap-y-[17px] transition-opacity duration-500 ease-in-out'
              style={{ opacity: activeIndex === 2 ? 1 : 0 }}
            >
               <h4 className='block box-border text-[rgb(173,173,173)] dmsans-text text-[23.4px] font-normal leading-[28.08px] w-[231.988px] h-[28.075px] mt-[10px] mb-[129.6px] mx-0'>How We Drive Impact</h4>
              <h1 className='inline box-border montserrat-text text-[48.6px] font-semibold leading-[53.46px] text-center bg-gradient-to-b from-[rgb(0,74,173)] to-black bg-clip-text text-transparent whitespace-pre-wrap break-spaces'>Events</h1>
              <p className='block box-border text-[rgb(100,98,98)] dmsans-text text-[18px] font-normal leading-[23.4px] w-[550.8px] h-[70.2px] mt-0 mb-[10px] mx-0 text-left whitespace-pre-wrap break-spaces'>Join a global network of changemakers. Our fellowship programs connect visionary leaders across sectors to collaborate, innovate, and shape the future of technology and society.</p>
            </div>
          </div>
        </div>
      </section>
    )
}

export default HowWeDriveImpact;