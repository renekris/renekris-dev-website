import React, { useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import SmoothScrollNavigation from './components/SmoothScrollNavigation';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import Hero from './components/sections/Hero';
import SEOHead from './components/SEO/SEOHead';
import StructuredData from './components/SEO/StructuredData';

const Contact = lazy(() => import('./components/sections/Contact'));

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <ThemeProvider>
      <SEOHead />
      <StructuredData />
      <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <SmoothScrollNavigation />
        <ScrollProgressIndicator />

        <div className="pt-20">
          <Hero />
          <Suspense fallback={<div className="min-h-screen" />}>
            <Contact />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;