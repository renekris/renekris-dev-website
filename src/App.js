import React, { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import SmoothScrollNavigation from './components/SmoothScrollNavigation';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';

function App() {
  useEffect(() => {
    // Add smooth scroll behavior to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Navigation and Progress Indicator */}
        <SmoothScrollNavigation />
        <ScrollProgressIndicator />
        
        {/* Mobile-First Linear Portfolio - Add padding top for fixed nav */}
        <div className="pt-20">
          <Hero />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;