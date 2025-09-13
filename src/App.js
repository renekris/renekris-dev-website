import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import About from './components/About';

// ✅ GitHub Actions deployment working! - Fixed production build sync issue

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={
              <div className="max-w-6xl mx-auto px-4 py-8">
                <Portfolio />
              </div>
            } />
            <Route path="/about" element={
              <div className="max-w-6xl mx-auto px-4 py-8">
                <About />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;