import React from "react";
import { motion } from "framer-motion";

// Section Wrapper for modularity
const Section = ({ title, children }) => {
  return (
    <section className="py-20 px-6 md:px-20 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        {title && (
          <h2 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight">
            {title}
          </h2>
        )}
        {children}
      </motion.div>
    </section>
  );
};

// Team Member Card
const TeamMember = ({ name, role, image }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-2xl overflow-hidden shadow-lg bg-white text-black flex flex-col items-center p-6 transition-all"
    >
      <img
        src={image}
        alt={name}
        className="w-32 h-32 object-cover rounded-full mb-4"
      />
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-600 text-sm">{role}</p>
    </motion.div>
  );
};

// About Us Page
export default function Genesis() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-black text-white flex flex-col justify-center items-center py-32 px-6 md:px-20">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-center tracking-tight"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 max-w-2xl text-center text-lg text-gray-300"
        >
          We are a community of thinkers, innovators, and changemakers committed
          to building a sustainable digital economy.
        </motion.p>
      </section>

      {/* Mission Section */}
      <Section title="Our Mission">
        <p className="text-lg leading-relaxed text-gray-300">
          Our mission is to foster innovation, drive collaboration, and create
          meaningful impact in the world of technology and economics. We believe
          in building systems that empower communities and promote sustainable
          growth.
        </p>
      </Section>

      {/* Vision Section */}
      <Section title="Our Vision">
        <p className="text-lg leading-relaxed text-gray-300">
          We envision a future where technology bridges divides, enhances human
          potential, and creates opportunities for all. By leveraging the power
          of collective intelligence, we aim to reshape the global economy for
          the better.
        </p>
      </Section>

      {/* Team Section */}
      <Section title="Meet Our Team">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <TeamMember
            name="John Doe"
            role="Founder & CEO"
            image="https://via.placeholder.com/150"
          />
          <TeamMember
            name="Jane Smith"
            role="Head of Research"
            image="https://via.placeholder.com/150"
          />
          <TeamMember
            name="Alex Johnson"
            role="Community Lead"
            image="https://via.placeholder.com/150"
          />
        </div>
      </Section>
    </div>
  );
}
