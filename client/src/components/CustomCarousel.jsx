// components/CustomCarousel.jsx
import React from 'react';
import Slider from 'react-slick'; // for custom styling

const slides = [
  {
    title: 'Navroop Sahdev at New York Stock Exchange: New Human-centered Digital Economy',
    buttonText: 'Watch Interview',
    image: 'https://static.wixstatic.com/media/92dfa2_e439d12093334da39da9463438cca5f8~mv2.png/v1/fill/w_538,h_176,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1200px-NY_Stock_Exchange_logo_edited.png',
    link: 'https://fintech.tv/navroop-sahdev-founder-ceo-of-the-digital-economist/'
  },{
    title: 'Rebooting The Global Economy After Coronavirus: Physical Scarcity To Digital Abundance',
    buttonText: 'Read Article',
    image: 'https://static.wixstatic.com/media/92dfa2_d89968a8fe8b4818929af5cf5958b304~mv2.png/v1/crop/x_0,y_0,w_2373,h_896/fill/w_872,h_334,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/forbes-logo-black-and-white.png',
    link: 'https://www.forbes.com/sites/lawrencewintermeyer/2020/04/02/rebooting-the-global-economy-after-coronavirus-physical-scarcity-to-digital-abundance/#381c22244b09'
  }
];

const CustomCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="carousel-container bg-black text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl px-4">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="flex items-center justify-between flex-wrap md:flex-nowrap px-4 py-8">
              <div className="text-left p-2 max-w-xl">
                <h2 className="text-2xl md:text-3xl font-light mb-4 leading-snug">
                  {slide.title}
                </h2>
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border px-4 py-2 text-sm hover:bg-white hover:text-black transition"
                >
                  {slide.buttonText}
                </a>
              </div>
              <div className="mt-6 md:mt-0 pt-2 pl-4">
                <img src={slide.image} alt="slide" className="max-h-64 md:max-h-80 object-contain" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CustomCarousel;
