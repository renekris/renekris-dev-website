import React from 'react';
import { FaHome, FaUser, FaBriefcase } from 'react-icons/fa';

const Navigation = () => {
  const navSectionStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    textDecoration: 'none',
    color: '#000000',
    fontWeight: '500'
  };

  const activeSectionStyle = {
    ...navSectionStyle,
    background: 'radial-gradient(ellipse at center, #050505 0%, #0a0a0a 30%, #000000 70%, #000000 100%)',
    color: '#ffffff',
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
      <div style={{
        display: 'flex',
        width: '100%'
      }}>
        {/* Portfolio Section */}
        <a 
          href="/portfolio" 
          style={navSectionStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 1)';
            e.target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#000000';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBriefcase />
            <span>Portfolio</span>
          </div>
        </a>

        {/* Home Section (Active) */}
        <a 
          href="/" 
          style={activeSectionStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'radial-gradient(ellipse at center, #0a0a0a 0%, #0f0f0f 30%, #050505 70%, #000000 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'radial-gradient(ellipse at center, #050505 0%, #0a0a0a 30%, #000000 70%, #000000 100%)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHome />
            <span>Home</span>
          </div>
        </a>

        {/* About Section */}
        <a 
          href="/about" 
          style={lastSectionStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 1)';
            e.target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#000000';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUser />
            <span>About</span>
          </div>
        </a>
      </div>
    </nav>
  );
};

export default Navigation;