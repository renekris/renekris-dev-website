import React from 'react';
import { FaHome, FaUser, FaBriefcase, FaEnvelope } from 'react-icons/fa';

const Navigation = () => {
  return (
    <nav style={{
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#00d4ff'
        }}>
          renekris.dev
        </div>
        
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: '2rem'
        }}>
          <li>
            <a href="/" style={{
              color: '#ffffff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)'
            }}>
              <FaHome />
              Home
            </a>
          </li>
          <li>
            <a href="/portfolio" style={{
              color: '#cccccc',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ffffff';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#cccccc';
              e.target.style.background = 'transparent';
            }}>
              <FaBriefcase />
              Portfolio
            </a>
          </li>
          <li>
            <a href="/about" style={{
              color: '#cccccc',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ffffff';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#cccccc';
              e.target.style.background = 'transparent';
            }}>
              <FaUser />
              About
            </a>
          </li>
          <li>
            <a href="/contact" style={{
              color: '#cccccc',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ffffff';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#cccccc';
              e.target.style.background = 'transparent';
            }}>
              <FaEnvelope />
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;