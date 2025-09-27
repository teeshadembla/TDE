import React from "react";

const OurMission = () => {
  return (
    <div className="w-full min-h-screen bg-black grid grid-cols-1 md:grid-cols-2 gap-10 p-10 items-center">
      {/* Image Section */}
      <div className="flex justify-center">
        <img
          className="w-full max-w-md h-72 md:h-64 object-cover rounded-md"
          src="https://media.meer.com/attachments/d99fb168c4e00a4c40e14c3ac154b2592ec0b90c/store/fill/1230/692/e3c3f360d32e359c7ef2d8f3b7bbd67796ed5c051a6ad322a67bd88412fd/A-surreal-shot-of-Davos-in-the-night.jpg"
          alt="Our Mission"
        />
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center">
        <h4 className="font-montserrat text-md font-semibold text-neutral-500">
          Our Mission
        </h4>
        <p className="mt-4 text-white font-medium text-lg leading-relaxed">
          Launched at Davos in 2020, The Digital Economist is a global ecosystem
          reimagining how economies define and deliver value—grounded in human
          needs, ecological integrity, and planetary stewardship.
          <br />
          <br />
          We work with cross-sector leaders, policymakers, and technologists to
          drive systems-level change through applied research, strategic
          partnerships, and transformative programs.
        </p>
      </div>
    </div>
  );
};

export default OurMission;
