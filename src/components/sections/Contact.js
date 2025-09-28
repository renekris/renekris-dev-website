import React from 'react';
import { FiMail, FiLinkedin, FiGithub, FiMapPin, FiCheck } from 'react-icons/fi';

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 mb-3">
            Open to opportunities in Tallinn and remote work
          </p>
          <p className="text-lg text-gray-500">
            Let's build something great together
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-5 mb-12">
          {/* Email Button */}
          <a 
            href="mailto:renekrispohlak@gmail.com"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 min-h-[56px] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FiMail className="w-6 h-6" />
            <span className="text-lg">renekrispohlak@gmail.com</span>
          </a>

          {/* LinkedIn Button */}
          <a 
            href="https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 min-h-[56px] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FiLinkedin className="w-6 h-6" />
            <span className="text-lg">LinkedIn Profile</span>
          </a>

          {/* GitHub Button */}
          <a 
            href="https://github.com/renekris"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 min-h-[56px] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FiGithub className="w-6 h-6" />
            <span className="text-lg">GitHub Portfolio</span>
          </a>
        </div>

        {/* Location & Status */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <FiMapPin className="w-5 h-5" />
            <span className="text-lg">Based in <strong className="text-gray-900">Tallinn, Estonia</strong></span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-emerald-600 font-semibold">
            <FiCheck className="w-5 h-5" />
            <span className="text-lg">Available for new opportunities</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-200 text-center">
          <p className="text-base text-gray-500">
            © 2025 Rene Kristofer Pohlak. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;