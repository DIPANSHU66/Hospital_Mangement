import React from "react";

const Biography = ({ imageurl }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Banner Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-gray-100">
          <img
            src={imageurl}
            alt="About Dipanshu Medical Institute"
            className="w-full h-[350px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
        </div>

        {/* Text Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-3 py-1.5 rounded-full">
              Biography
            </span>
            <h2 className="text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              Who We Are & Our Legacy
            </h2>
          </div>
          
          <div className="space-y-4 text-gray-650 leading-relaxed text-base">
            <p>
              At <strong className="text-indigo-600 font-semibold">Dipanshu Medical Institute</strong>, our commitment to health is unwavering. We provide a comprehensive range of medical services designed to meet the diverse needs of our patients.
            </p>
            <p>
              We are dedicated to advancing health through a combination of innovative practices, state-of-the-art medical technology, and highly personalized care.
            </p>
            <p>
              We extend our heartfelt gratitude for taking the time to visit Dipanshu Medical Institute. We hope that your experience here is insightful, reassuring, and comforting.
            </p>
            <p>
              Our staff of board-certified specialists, compassionate nurses, and administrative professionals are dedicated to providing exceptional support at every stage of your healthcare journey.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
            <div className="text-center bg-gray-50 p-4 rounded-2xl flex-1 border border-gray-100">
              <span className="block text-3xl font-extrabold text-indigo-600">15+</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Specialties</span>
            </div>
            <div className="text-center bg-gray-50 p-4 rounded-2xl flex-1 border border-gray-100">
              <span className="block text-3xl font-extrabold text-indigo-600">99%</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Satisfaction</span>
            </div>
            <div className="text-center bg-gray-50 p-4 rounded-2xl flex-1 border border-gray-100">
              <span className="block text-3xl font-extrabold text-indigo-600">24/7</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Emergency Care</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
