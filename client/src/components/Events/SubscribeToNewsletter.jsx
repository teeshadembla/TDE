const SubscribeToNewsletter = () => {
  return (
    <section className="w-full h-[425.763px] flex justify-center bg-[rgb(23,23,23)]">
      <div className="w-[1520.8px] px-[76px] py-[80px] rounded-[24px] text-center relative">

        {/* Headings */}
        <div className="max-w-[858px] mx-auto flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">

            <h2 id="heading-35" className="text-[37px] font-extrabold h-[44.16] leading-[44.16px] text-white">
              Subscribe to Our Newsletter
            </h2>
          </div>

          <p id="heading-35" className="text-[16px] text-[rgb(136,136,136)]">
            Get the latest updates from The Digital Economist
          </p>
        </div>

        {/* Form */}
        <div className="mt-[48px] flex justify-center">
          <div className="w-[520px]">
            <form type="submit" className="flex items-center box-border text-[rgb(51,51,51)] font-['Inter',sans-serif] text-[16px] leading-[20px] w-[520px] h-[48px] gap-[8px] text-center">
                <input name="email" type="email" placeholder="Enter your Email" className="block box-border appearance-auto bg-white border-[0.8px] border-[rgb(229,231,235)] font-semibold rounded-[4px] text-[rgb(3,7,17)] cursor-text font-['Inter',sans-serif] text-[16px] leading-[32px] w-[369.35px] h-[48px] px-[16px] py-[8px] text-left align-middle overflow-hidden"></input>
                <button type="submit" className="block box-border appearance-button bg-[rgb(16,90,189)] text-white cursor-pointer font-['Inter',sans-serif] text-[16px] font-normal leading-[20px] w-[142.65px] h-[38px] px-[15px] py-[9px] rounded-[4px] text-center select-none overflow-hidden
">Subscribe now</button>
            </form>
          </div>
        </div>

        
        <div
        id="newsletter-photo-gallery"
        className="absolute top-0 right-0 w-[441px] h-full bg-[linear-gradient(90deg,rgb(23,23,23)_37%,rgba(0,74,173,0))] z-10 pointer-events-none"
        >
        <img
            src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6852cfaa60fb76d3db266307_BG.png"
            alt="newsletter photo"
            className="w-full h-full object-cover"
        />
        </div>


      </div>
    </section>
  );
};

export default SubscribeToNewsletter;
