import React from 'react';
import { DownloadIcon, FilePdfIcon } from '../icons';

const ResumeDownloader = ({ variant = 'button', className = '' }) => {
  const downloadPDF = () => {
    // Create download link for the static PDF
    const link = document.createElement('a');
    link.href = '/CV_Rene_Kristofer_Pohlak.pdf';
    link.download = 'CV_Rene_Kristofer_Pohlak.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Button variant styles
  const buttonStyles = {
    primary: `
      bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
      text-white font-semibold py-3 px-6 rounded-lg
      transition-all duration-300 ease-in-out
      flex items-center gap-3
      shadow-lg hover:shadow-xl
      transform hover:scale-105
      border border-cyan-500/30
    `,
    secondary: `
      bg-rgba(255, 255, 255, 0.1) hover:bg-rgba(255, 255, 255, 0.2)
      text-white font-medium py-2 px-4 rounded-md
      transition-all duration-300 ease-in-out
      flex items-center gap-2
      border border-white/20 hover:border-white/40
      backdrop-blur-sm
    `,
    minimal: `
      text-cyan-400 hover:text-cyan-300
      font-medium py-1 px-2 rounded
      transition-colors duration-200
      flex items-center gap-2
      hover:bg-white/10
    `
  };

  const currentStyle = buttonStyles[variant] || buttonStyles.primary;


  return (
    <button
      onClick={downloadPDF}
      className={`${currentStyle} ${className}`}
      title="Download professional resume as PDF"
    >
      <FilePdfIcon className="w-5 h-5" />
      <span>Download Resume</span>
      <DownloadIcon className="ml-1 w-4 h-4" />
    </button>
  );
};

// Specialized components for different use cases
export const HeroResumeButton = () => (
  <ResumeDownloader 
    variant="primary" 
    className="mx-auto mt-6"
  />
);

export const NavResumeButton = () => (
  <ResumeDownloader 
    variant="secondary" 
    className="ml-4"
  />
);

export const InlineResumeButton = () => (
  <ResumeDownloader 
    variant="minimal" 
    className="inline-flex"
  />
);

export default ResumeDownloader;