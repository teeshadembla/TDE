import React, { useRef } from "react";
import { useNavigate } from "react-router";

export const practiceHighlightsDummyData = {
  practiceArea: "Applied Artificial Intelligence",
  items: [
    {
      id: 1,
      type: "Roundtable",
      date: "May 17, 2026",
      title: "AI in Enterprise Decision Making and Strategic Automation",
      image: "https://images.unsplash.com/photo-1581090700227-1e8c9b7c4b7b",
      cta: "Register Here",
      link: "#",
    },
    {
      id: 2,
      type: "Publication",
      date: "May 12, 2026",
      title: "Scaling Machine Learning Systems in High-Growth Organizations",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
      cta: "Access Here",
      link: "#",
    },
    {
      id: 3,
      type: "Publication",
      date: "May 5, 2026",
      title: "Human-AI Collaboration: Designing Systems for Trust and Efficiency",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      cta: "Access Here",
      link: "#",
    },
    {
      id: 4,
      type: "Roundtable",
      date: "April 28, 2026",
      title: "Ethical AI Frameworks for Global Enterprises",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      cta: "Register Here",
      link: "#",
    },
    {
      id: 5,
      type: "Publication",
      date: "April 20, 2026",
      title: "Generative AI in Product Development: Opportunities and Risks",
      image: "https://images.unsplash.com/photo-1673187732026-4c0f1f0b6e9f",
      cta: "Access Here",
      link: "#",
    },
    {
      id: 6,
      type: "Roundtable",
      date: "April 10, 2026",
      title: "AI Talent and Workforce Transformation in 2030",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
      cta: "Register Here",
      link: "#",
    },
  ],
};

const PracticeHighlightsSection = ({ workgroup, data }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -width * 0.8 : width * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full mx-auto py-16 bg-black flex flex-col justify-center items-center text-white font-[Plus Jakarta Sans] no-scrollbar no-scrollbar::-webkit-scrollbar">

      {/* HEADER */}
      <div className="flex w-full max-w-[1244px] justify-between items-center mb-6">
        <h2 className="text-[35px] font-light leading-[100%]">
          Practice Area Highlights
        </h2>

        
       {/*  <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-[25px] h-[25px] border border-white rounded-full flex items-center justify-center text-sm">
            +
          </div>
          <span className="text-[25px] font-extralight">
            Add Practice Area
          </span>
        </div> */}
        
      </div>

      {/* CONTAINER */}
      <div
        className="
          w-full
          max-w-[1244px] 
          rounded-[25px]
          p-10
          relative
        "
        style={{
          background:
            "#D9D9D9",
          borderImage:
            "linear-gradient(101.3deg, #666666 4.75%, #808080 90.53%) 1",
        }}
      >
        {/* TITLE + ARROWS */}
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-[25px] font-medium text-black">
            {workgroup?.title}
          </h3>

          <div className="flex gap-4 text-black">
            <button onClick={() => scroll("left")}>‹</button>
            <button onClick={() => scroll("right")}>›</button>
          </div>
        </div>

        {/* CARDS */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {data?.items?.map((item, i) => (
            <PracticeCard key={item.id} item={item} cta={item?.type === "event" ? `/events/${item?.data?._id}`:`/research-paper/${item?.data?._id}`} type={ item?.type === "publication" ? item?.data?.documentType: item?.data?.type} image={item?.type === "event" ? item?.data?.image?.url : item?.data?.thumbnailUrl} date={item?.type === "event" ? item?.data?.eventDate?.start: item?.data?.publishingDate} title={item?.data?.title}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeHighlightsSection;

const PracticeCard = ({ item, type, image, date, title, cta }) => {
  return (
    <div
      className="
        min-w-full 
        sm:min-w-[48%] 
        lg:min-w-[367px]
        h-[609px]
        bg-black
        rounded-[20px]
        border-[0.5px] border-[#D9D9D9]
        p-6
        flex flex-col justify-between
        text-white
      "
    >
      {/* TOP CONTENT */}
      <div>
        {/* EYEBROW */}
        <div className="flex justify-between items-center mb-6">
          
          {/* TAG */}
          <div className="px-4 py-1 capitalize border-[0.5px] border-[#D9D9D9] rounded-full text-[15px] font-light">
            {type}
          </div>

          {/* DATE */}
          <div className="text-[12px] font-extralight opacity-80">
            {new Date(date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </div>
        </div>

        {/* TITLE */}
        <h4 className="text-[20px] font-normal leading-[100%] mb-6 w-[299px]">
          {title}
        </h4>

        {/* BUTTON */}
        <Button redirectLink={cta}>Access Here</Button>
      </div>

      {/* IMAGE */}
      <div className="mt-6 w-full h-[317px] rounded-[20px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};


const Button = ({ children, redirectLink }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={()=> navigate(redirectLink)}
      className="
        w-[139px]
        h-[34px]
        bg-white
        text-black
        text-sm
        rounded-[5px]
        font-light
        hover:bg-gray-200
        transition
        cursor-pointer
      "
    >
      {children}
    </button>
  );
};


