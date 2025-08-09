import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const homeStyle = {
    background: `url(${process.env.PUBLIC_URL}/Images/kingbg.webp)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: 'calc(100vh - 80px)',
  };

  return (
    <div className="home" style={homeStyle}>
      <header className="hero">
        <div className="hero-content">
          <h1>Kiambu County Chess Association</h1>
          <p>Promoting the royal game throughout Kiambu County</p>
        </div>
      </header>

      <main>
        <section className="about-section">
          <h2>Welcome to KCCA</h2>
          <p>
            The Kiambu County Chess Association (KCCA) is dedicated to promoting chess
            excellence and fostering a vibrant chess community in Kiambu County.
            We organize tournaments, training sessions, and social events for players
            of all skill levels.
          </p>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <h3>Tournaments</h3>
            <p>Regular competitive events for all skill levels</p>
          </div>
          <div className="feature-card">
            <h3>Training</h3>
            <p>Professional coaching and workshops</p>
          </div>
          <div className="feature-card">
            <h3>Community</h3>
            <p>Join our growing chess family</p>
          </div>
          <div className="feature-card">
            <h3>Youth Programs</h3>
            <p>Special programs for young talents</p>
          </div>
        </section>

        <section className="cta-section">
          <h2>Join Our Community</h2>
          <p>Whether you're a beginner or a grandmaster, there's a place for you here.</p>
          <button className="cta-button">Become a Member</button>
        </section>

        <section className="news-section">
          <h2>Latest News</h2>
          <p>Stay updated with the latest chess news and events from Kiambu County</p>
          <Link to="/news" className="view-news-button">View All News</Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
