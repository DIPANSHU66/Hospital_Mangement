import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 sm:py-24">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/3 transform opacity-30 text-indigo-200">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] fill-current">
          <path d="M47.7,-57.2C59.4,-44.6,64.8,-26.4,68.4,-7.6C72,11.2,73.8,30.5,65.2,46.1C56.6,61.7,37.5,73.6,18.5,76.5C-0.5,79.4,-19.4,73.3,-34.5,61.9C-49.6,50.5,-60.9,33.8,-66.1,15.4C-71.3,-3,-70.4,-23.1,-60.8,-38.7C-51.2,-54.3,-32.9,-65.4,-15.5,-67.5C1.9,-69.6,19.3,-62.7,33.2,-58.5L47.7,-57.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Banner Content */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Leading-Edge Healthcare
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-650 leading-relaxed">
            Dipanshu Medical Institute is a state-of-the-art healthcare facility equipped with the latest technology. Our highly skilled team of doctors, specialists, and nurses deliver innovative treatments with a focus on clinical excellence and empathetic patient support throughout your recovery journey.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="/Appointment"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition duration-300 hover:-translate-y-0.5 text-base"
            >
              Book Appointment
            </a>
            <a
              href="/about"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-6 py-3.5 rounded-2xl border border-gray-200 shadow-sm transition duration-300 hover:-translate-y-0.5 text-base"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Banner Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <img
              src={imageUrl}
              alt="Medical Staff"
              className="w-full h-full object-cover animated-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
