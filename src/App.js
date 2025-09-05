import React from 'react';
import Services from './components/Services';
import Footer from './components/Footer';

// ✅ GitHub Actions deployment working!

function App() {
  return (
    <div className="container">
      <header>
        <h1>renekris.dev</h1>
        <p className="tagline">Full-Stack Developer & Infrastructure Engineer</p>
      </header>
      
      <Services />
      <Footer />
    </div>
  );
}

export default App;