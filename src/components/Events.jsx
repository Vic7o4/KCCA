import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Events.css';

const Events = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('/api/tournaments');
        setTournaments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setError('Failed to load tournaments');
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = (tournament) => {
    navigate('/register', { state: { eventDetails: tournament } });
  };

  if (loading) {
    return <div className="events-page loading">Loading tournaments...</div>;
  }

  if (error) {
    return <div className="events-page error">{error}</div>;
  }

  return (
    <div className="events-page">
      <header className="events-hero">
        <h1>Chess Events</h1>
        <p>Join us for exciting chess tournaments and activities</p>
      </header>

      <main className="events-content">
        <section className="upcoming-events">
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="event-card">
                {tournament.poster_url && (
                  <div className="event-image">
                    <img src={tournament.poster_url} alt={tournament.title} />
                  </div>
                )}
                
                <div className="event-details">
                  <h2>{tournament.title}</h2>
                  
                  <div className="event-info">
                    <p><i className="far fa-calendar-alt"></i> {new Date(tournament.date).toLocaleDateString()}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {tournament.location}</p>
                  </div>
                  
                  <p className="event-description">{tournament.description}</p>
                  
                  <div className="event-footer">
                    <p className="registration-deadline">
                      Registration Deadline: {new Date(tournament.registration_deadline).toLocaleDateString()}
                    </p>
                    <button 
                      onClick={() => handleRegister(tournament)}
                      className="register-button"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {tournaments.length === 0 && (
          <div className="no-events">
            <p>No upcoming tournaments at the moment.</p>
            <p>Please check back later!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events; 