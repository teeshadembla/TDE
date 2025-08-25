import React from 'react';

const MissionSection = () => {
  return (
    <section
      className=" bg-cover bg-no-repeat bg-right text-white flex flex-col items-center justify-center text-center px-4 py-12 font-montserrat h-[600px]"
      style={{
        backgroundImage: `url("https://static.wixstatic.com/media/92dfa2_6d44ad3e3929431fbb7e75bc390f0d57~mv2.png/v1/fill/w_1901,h_635,al_b,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/92dfa2_6d44ad3e3929431fbb7e75bc390f0d57~mv2.png")`,
      }}
    >
      <h2 className="text-2xl tracking-widest opacity-60">MISSION</h2>
      <p className="max-w-3xl text-lg leading-relaxed mt-4">
        THE DIGITAL ECONOMIST IS A GLOBAL IMPACT ECOSYSTEM FOCUSED ON BUILDING INSIGHTS,
        PRODUCTS, SERVICES AND PROGRAMS TOWARD HUMAN AND PLANETARY OUTCOMES.
      </p>
      <button className="mt-8 px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors">
        Learn More
      </button>
    </section>
  );
};

export default MissionSection;
