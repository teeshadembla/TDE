import react from "react";

const Banner = ({image, title,subtitle, locationType, type}) => {
    return (
  <div
    id="image-banner-top"
    className="flex flex-col box-content justify-center bg-black bg-center bg-no-repeat bg-cover text-[#333] dmsans-text  text-[14px] leading-[20px] w-[1440px] h-[700px] px-[40.5px] pt-[10px] pb-0 overflow-hidden relative text-justify"
    style={{
      backgroundImage: `url(${image})`,
      backgroundPosition: "center"
    }}
  >
    <div className="absolute inset-0 bg-black/40 z-[1]" />

    {/* Tags pinned to the top */}
    <div
      id="locationType-event-type"
      className="absolute top-[140px] left-0 right-0 z-[2] flex items-center justify-center gap-[13px]"
    >
      <h6 className="bg-[rgba(71,70,70,0.45)] text-white font-dmsans text-[19.2px] font-normal leading-[24.96px] capitalize text-center rounded-[20px] border border-[#ADADAD] px-[10px] py-[5px]">{type}</h6>
      <h6 className="bg-[rgba(71,70,70,0.45)] text-white font-dmsans text-[19.2px] font-normal leading-[24.96px] capitalize text-center rounded-[20px] border border-[#ADADAD] px-[10px] py-[5px]">{locationType}</h6>
    </div>

    {/* Title perfectly centered */}
    <h1
      id="event-title"
      className="relative z-[2] text-white font-montserrat text-[70px] font-bold leading-[77px] uppercase text-center w-full m-0"
    >
      {title}
    </h1>

    <h4
      id="event-subtitle"
      className="hidden relative z-[2] text-white font-dmsans text-[28px] font-normal leading-[33.6px] text-center"
    >
        {subtitle}
    </h4>
  </div>
);
}

export default Banner;