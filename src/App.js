import React from 'react';
import StatusOverview from './components/StatusOverview';
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
      
      <StatusOverview />
      <Services />
      <Footer />
    </div>
  );
}

export default App;