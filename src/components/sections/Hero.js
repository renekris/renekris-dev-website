import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6">
      <div className="text-center max-w-lg">
        {/* Name - Mobile optimized typography */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Rene Kristofer Pohlak
        </h1>
        
        {/* Role */}
        <p className="text-lg md:text-xl text-gray-600 mb-1">
          Full-Stack Developer
        </p>
        
        {/* Location */}
        <p className="text-sm text-gray-500 mb-6">
          Tallinn, Estonia
        </p>
        
        {/* Tagline */}
        <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
          Building scalable web solutions and infrastructure
        </p>
        
        {/* CTA Button - Thumb-friendly size */}
        <button 
          onClick={() => {
            document.getElementById('projects').scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg text-lg transition-colors duration-200 min-h-[48px] shadow-sm hover:shadow-md"
        >
          View Work
        </button>
      </div>
    </section>
  );
};

export default Hero;