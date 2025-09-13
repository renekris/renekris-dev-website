import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaBriefcase } from 'react-icons/fa';
import SlidingTabIndicator from './SlidingTabIndicator';

const Navigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [tabPositions, setTabPositions] = useState({});
  
  // Refs for tab elements
  const portfolioRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const navContainerRef = useRef(null);

  // Measure tab positions
  const measureTabPositions = () => {
    if (navContainerRef.current && portfolioRef.current && homeRef.current && aboutRef.current) {
      
      const positions = {
        portfolio: {
          left: portfolioRef.current.offsetLeft,
          width: portfolioRef.current.offsetWidth
        },
        home: {
          left: homeRef.current.offsetLeft,
          width: homeRef.current.offsetWidth
        },
        about: {
          left: aboutRef.current.offsetLeft,
          width: aboutRef.current.offsetWidth
        }
      };
      
      setTabPositions(positions);
    }
  };

  // Measure positions on mount and resize
  useEffect(() => {
    measureTabPositions();
    
    const handleResize = () => {
      measureTabPositions();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/portfolio') {
      setActiveTab('portfolio');
    } else if (currentPath === '/about') {
      setActiveTab('about');
    } else {
      setActiveTab('home');
    }
    // Re-measure positions when route changes
    setTimeout(measureTabPositions, 100);
  }, [location.pathname]);

  const navSectionStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    textDecoration: 'none',
    color: '#ffffff',
    fontWeight: '500'
  };

  const activeSectionStyle = {
    ...navSectionStyle,
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(25px)',
    color: '#ffffff',
    marginBottom: '-1px',
    position: 'relative',
    zIndex: 1
  };

  const lastSectionStyle = {
    ...navSectionStyle,
    borderRight: 'none'
  };

  return (
    <nav style={{
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div 
        ref={navContainerRef}
        style={{
          display: 'flex',
          width: '100%',
          position: 'relative'
        }}>
        {/* Portfolio Section */}
        <Link 
          ref={portfolioRef}
          to="/portfolio" 
          style={activeTab === 'portfolio' ? activeSectionStyle : navSectionStyle}
          onClick={() => {
            setActiveTab('portfolio');
            setTimeout(measureTabPositions, 50);
          }}
          onMouseEnter={(e) => {
            if (activeTab === 'portfolio') {
              e.target.style.background = 'rgba(0, 0, 0, 0.3)';
            } else {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab === 'portfolio') {
              e.target.style.background = 'rgba(0, 0, 0, 0.2)';
            } else {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBriefcase />
            <span>Portfolio</span>
          </div>
        </Link>

        {/* Home Section */}
        <Link 
          ref={homeRef}
          to="/" 
          style={activeTab === 'home' ? activeSectionStyle : navSectionStyle}
          onClick={() => {
            setActiveTab('home');
            setTimeout(measureTabPositions, 50);
          }}
          onMouseEnter={(e) => {
            if (activeTab === 'home') {
              e.target.style.background = 'rgba(0, 0, 0, 0.3)';
            } else {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab === 'home') {
              e.target.style.background = 'rgba(0, 0, 0, 0.2)';
            } else {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHome />
            <span>Home</span>
          </div>
        </Link>

        {/* About Section */}
        <Link 
          ref={aboutRef}
          to="/about" 
          style={activeTab === 'about' ? {...activeSectionStyle, borderRight: 'none'} : lastSectionStyle}
          onClick={() => {
            setActiveTab('about');
            setTimeout(measureTabPositions, 50);
          }}
          onMouseEnter={(e) => {
            if (activeTab === 'about') {
              e.target.style.background = 'rgba(0, 0, 0, 0.3)';
            } else {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab === 'about') {
              e.target.style.background = 'rgba(0, 0, 0, 0.2)';
            } else {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUser />
            <span>About</span>
          </div>
        </Link>
        
        {/* Sliding Tab Indicator */}
        <SlidingTabIndicator 
          activeTab={activeTab} 
          tabPositions={tabPositions} 
        />
      </div>
    </nav>
  );
};

export default Navigation;