import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-12">
      <div className="text-center max-w-2xl">
        {/* Name - Mobile optimized typography */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Rene Kristofer Pohlak
        </h1>
        
        {/* Role */}
        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-2">
          Full-Stack Developer
        </p>
        
        {/* Location */}
        <p className="text-base text-gray-500 mb-8">
          Tallinn, Estonia
        </p>
        
        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
          Building scalable web solutions and infrastructure
        </p>
        
        {/* CTA Button - Thumb-friendly size */}
        <button 
          onClick={() => {
            document.getElementById('projects').scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all duration-200 min-h-[52px] shadow-lg hover:shadow-xl hover:scale-105"
        >
          View Work
        </button>
      </div>
    </section>
  );
};

export default Hero;