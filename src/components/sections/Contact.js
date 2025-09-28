import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Open to opportunities in Tallinn and remote work
          </p>
          <p className="text-sm text-gray-500">
            Let's build something great together
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-4 mb-8">
          {/* Email Button */}
          <a 
            href="mailto:renekrispohlak@gmail.com"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <span>📧</span>
            <span>renekrispohlak@gmail.com</span>
          </a>

          {/* LinkedIn Button */}
          <a 
            href="https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <span>💼</span>
            <span>LinkedIn Profile</span>
          </a>

          {/* GitHub Button */}
          <a 
            href="https://github.com/renekris"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <span>🔗</span>
            <span>GitHub Portfolio</span>
          </a>
        </div>

        {/* Location & Status */}
        <div className="text-center space-y-2">
          <p className="text-gray-600">
            📍 Based in <strong>Tallinn, Estonia</strong>
          </p>
          <p className="text-sm text-emerald-600 font-medium">
            ✅ Available for new opportunities
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Rene Kristofer Pohlak. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;