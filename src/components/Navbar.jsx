import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useAuth } from '../contexts/AuthContext';

const chessBg = '/Images/chessbg.avif';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
    console.log('Dropdown toggled:', !dropdownOpen); // Debug log
  };

  const navbarStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${chessBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <nav className="navbar" style={navbarStyle}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/updated_assets/logo.png" alt="KCCA Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">KCCA</span>
        </Link>

        <div className={`menu-icon ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/gallery" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Gallery
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/news" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              News
            </Link>
          </li>
          <li className="nav-item dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
              className={`dropdown-toggle ${dropdownOpen ? 'active' : ''}`}
              onClick={toggleDropdown}
              style={{ position: 'relative', zIndex: 1001 }}
            >
              Members
            </button>
            {dropdownOpen && (
              <div 
                className="dropdown-menu show"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  minWidth: '220px',
                  zIndex: 1000,
                  display: 'block'
                }}
              >
                <Link to="/executive" className="dropdown-item" onClick={() => {
                  setDropdownOpen(false);
                  setMobileMenuOpen(false);
                }}>
                  Executive Committee
                </Link>
                <Link to="/institutions" className="dropdown-item" onClick={() => {
                  setDropdownOpen(false);
                  setMobileMenuOpen(false);
                }}>
                  Member Institutions
                </Link>
              </div>
            )}
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;