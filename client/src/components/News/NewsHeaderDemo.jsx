import react from 'react';

const NewsHeaderDemo = () => {
  return(
    <>
      <section id='hero-news' className="relative z-0 flex flex-col justify-center items-center h-[420px]  bg-black [background-image:radial-gradient(circle_closest-corner_at_50%_0,_#004aad,_#000)] "> 
        <div className='w-[645.67px] h-[146px] mx-[342.362px] block'>
          <div id='div-block-116' className='flex justify-center items-center h-[107.8px] gap-[13px]'>
            <img className="inline-block align-middle max-w-full border-0 box-border w-[80px] h-[80px]"  src='https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68b0a9a0dc48ca34a3a11550_Logo%20outline%20white-p-500.png'></img>
            <h1 className='text-white text-center mt-0 mb-0 text-[7em] font-semibold'>News</h1>
          </div>
          <h5 className='text-center my-5 font-normal text-sm w-[645.675px] h-[18.200px] text-[#fff]'>The Latest News from Us and Other Emerging Narratives: Bridging Insights, Transforming Economies.</h5>
        </div>
      </section>
    </>
  )
}

export default NewsHeaderDemo;