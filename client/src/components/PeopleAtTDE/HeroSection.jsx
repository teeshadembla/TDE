import React from 'react';

export default function HeroSection() {
  return (
    <section 
      className="w-full h-[30em] flex flex-col items-center justify-center px-5 sm:px-6 lg:px-8 bg-black"
      style={{
        backgroundImage: 'radial-gradient(circle closest-corner at 50% 0, #404aad, #000)'
      }}
    >
      <h1 className="text-white font-bold text-center leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl">
        Our Fellows All Around the World.
      </h1>
    </section>
  );
}