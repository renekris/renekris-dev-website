import React from 'react';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Linear Portfolio */}
      <Hero />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
}

export default App;