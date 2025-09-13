import React from 'react';
import Services from './Services';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-light mb-2 text-primary glow-text">renekris.dev</h1>
        <p className="text-xl text-text-secondary mb-8">Full-Stack Developer & Infrastructure Engineer</p>
      </header>
      
      <Services />
      <Footer />
    </div>
  );
};

export default Home;