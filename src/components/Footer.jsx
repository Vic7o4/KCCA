import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and Description Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/updated_assets/logo.png" alt="Kiambu County Chess Association Logo" className="footer-logo-img" />
            <div className="logo-text">
              <span>KIAMBU</span>
              <span>COUNTY</span>
              <span>CHESS</span>
              <span>ASSOCIATION</span>
            </div>
          </div>
          <p className="footer-description">
            Creating a prolific website for chess enthusiasts in Kiambu County.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/membership">Membership</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:kiambucountychessassociation@gmail.com" className="social-icon">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="footer-contact">
        <div className="contact-item">
          <i className="fas fa-phone"></i>
          <span>+1 23 456 789</span>
        </div>
        <div className="contact-item">
          <i className="fas fa-envelope"></i>
          <span>kiambucountychessassociation@gmail.com</span>
        </div>
        <div className="contact-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>Kiambu, Kenya</span>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© 2025 KIAMBU COUNTY CHESS ASSOCIATION. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 