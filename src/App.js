import React from 'react';
import StatusOverview from './components/StatusOverview';
import Services from './components/Services';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <header>
        <h1>renekris.dev</h1>
        <p className="tagline">🚀 LIVE DEPLOYMENT TESTING 🚀 GitHub Actions + Blue-Green Working!</p>
      </header>
      
      <StatusOverview />
      <Services />
      <Footer />
    </div>
  );
}

export default App;