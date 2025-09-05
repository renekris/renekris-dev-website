import React from 'react';
import Navigation from './components/Navigation';
import Services from './components/Services';
import Footer from './components/Footer';

// ✅ GitHub Actions deployment working!

function App() {
  return (
    <div>
      <Navigation />
      
      <div className="container">
        <header>
          <h1>renekris.dev</h1>
          <p className="tagline">Full-Stack Developer & Infrastructure Engineer</p>
        </header>
        
        <Services />
        <Footer />
      </div>
    </div>
  );
}

export default App;