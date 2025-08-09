import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission to a backend
    setSubmitStatus('success');
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Clear success message after 3 seconds
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  return (
    <div className="contact-page">
      <header className="contact-hero">
        <h1>Contact Us</h1>
        <p>Get in touch with the Kiambu County Chess Association</p>
      </header>

      <main className="contact-content">
        <div className="contact-grid">
          {/* Contact Information */}
          <section className="contact-info">
            <h2>Get In Touch</h2>
            <p>Have questions about chess events, membership, or training programs? We're here to help!</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Location</h3>
                  <p>Kiambu Town Hall Complex</p>
                  <p>3rd Floor, Room 304</p>
                  <p>Kiambu, Kenya</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+254 123 456 789</p>
                  <p>+254 987 654 321</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@kiambuchess.org</p>
                  <p>support@kiambuchess.org</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Office Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="contact-form">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Message Subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your Message"
                  rows="6"
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Send Message
              </button>

              {submitStatus === 'success' && (
                <div className="success-message">
                  Message sent successfully!
                </div>
              )}
            </form>
          </section>
        </div>

        {/* Map Section */}
        <section className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            {/* Replace this div with an actual map implementation */}
            <div className="map-placeholder">
              <p>Map will be implemented here</p>
              <p>Location: Kiambu Town Hall Complex</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact; 