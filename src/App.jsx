import React, { useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import SmoothScrollNavigation from './components/SmoothScrollNavigation.jsx';
import ScrollProgressIndicator from './components/ScrollProgressIndicator.jsx';
import Hero from './components/sections/Hero.jsx';
import SEOHead from './components/SEO/SEOHead.jsx';
import StructuredData from './components/SEO/StructuredData.jsx';

const Contact = lazy(() => import('./components/sections/Contact.jsx'));

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
      <div
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
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
