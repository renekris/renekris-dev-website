import React from 'react';
import Navigation from './components/Navigation';
import Services from './components/Services';
import Footer from './components/Footer';

// ✅ GitHub Actions deployment working! - Fixed production build sync issue

function App() {
  return (
    <div>
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-2 text-primary glow-text">renekris.dev</h1>
          <p className="text-xl text-text-secondary mb-8">Full-Stack Developer & Infrastructure Engineer</p>
          <div className="text-sm text-gray-500 mb-4">v1.1.8 - Latest deployment sync test</div>
        </header>
        
        <Services />
        <Footer />
      </div>
    </div>
  );
}

export default App;