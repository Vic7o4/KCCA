import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Events.css';

const Events = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolClub: '',
    fideId: '',
    chessRating: '',
    notes: ''
  });

  // Sample data for when the API is not available
  const sampleEvents = [
    {
      id: 1,
      title: 'Kiambu County Chess Championship 2024',
      date: '2024-09-15',
      location: 'Kiambu Town Hall',
      description: 'Annual championship event featuring players from across the county competing for the prestigious title. Open to all age groups and skill levels.',
      registration_deadline: '2024-09-10',
      registration_fee: 2000, // KES
      poster_url: 'https://via.placeholder.com/600x400/4a90e2/ffffff?text=Chess+Championship',
      image_alt: 'Chess Championship Event'
    },
    {
      id: 2,
      title: 'Youth Chess Workshop',
      date: '2024-08-25',
      location: 'Thika Community Center',
      description: 'Special training session for young players aged 8-16, featuring instruction from experienced coaches. Learn new strategies and improve your game!',
      registration_deadline: '2024-08-20',
      registration_fee: 500, // KES
      poster_url: 'https://via.placeholder.com/600x400/6a1b9a/ffffff?text=Youth+Workshop',
      image_alt: 'Youth Chess Workshop'
    }
  ];

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('/api/events');
        setTournaments(response.data.length > 0 ? response.data : sampleEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setTournaments(sampleEvents);
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [sampleEvents]);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would get the registration ID from the API response
      // For now, we'll generate a mock registration ID
      const mockRegistrationId = 'reg_' + Math.random().toString(36).substr(2, 9);
      
      // In a real app, you would send the registration data to your backend
      // await axios.post('/api/registrations', {
      //   eventId: selectedEvent.id,
      //   ...registrationData
      // });
      
      // Navigate to payment page with necessary data
      navigate('/payment', {
        state: {
          eventDetails: selectedEvent,
          registrationDetails: registrationData,
          registrationId: mockRegistrationId
        }
      });
      
      // Show success message
      toast.success('Please complete your payment to finalize registration', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.', {
        position: "top-center"
      });
    }
  };

  if (loading) {
    return <div className="events-page loading">Loading events...</div>;
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
                <div className="event-image">
                  <img 
                    src={tournament.poster_url} 
                    alt={tournament.image_alt || tournament.title}
                    className="event-card-image"
                  />
                </div>
                
                <div className="event-details">
                  <h2>{tournament.title}</h2>
                  
                  <div className="event-info">
                    <p><i className="far fa-calendar-alt"></i> {new Date(tournament.date).toLocaleDateString()}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {tournament.location}</p>
                  </div>
                  
                  <p className="event-description">{tournament.description}</p>
                  
                  <div className="event-footer">
                    <div className="fee-deadline-container">
                      <div className="registration-fee">
                        <i className="fas fa-tag"></i> 
                        <span>KES {tournament.registration_fee?.toLocaleString() || 'TBD'}</span>
                      </div>
                      <p className="registration-deadline">
                        <i className="far fa-clock"></i> Closes {new Date(tournament.registration_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRegisterClick(tournament)}
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
          <div className="events-grid">
            <div className="event-card">
              <div className="event-image">
                <div className="placeholder-image">
                  <i className="fas fa-chess-knight"></i>
                </div>
              </div>
              
              <div className="event-details">
                <h2>Upcoming Chess Tournament</h2>
                
                <div className="event-info">
                  <p><i className="far fa-calendar-alt"></i> Coming Soon</p>
                  <p><i className="fas fa-map-marker-alt"></i> Location TBD</p>
                </div>
                
                <p className="event-description">
                  We're preparing an exciting chess tournament with great prizes and competition. 
                  Check back soon for more details and registration information.
                </p>
                
                <div className="event-footer">
                  <p className="registration-deadline">
                    Registration will open soon
                  </p>
                  <button 
                    className="register-button disabled"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Registration Modal */}
      {showRegistrationForm && selectedEvent && (
        <div className="modal-overlay">
          <div className="registration-modal">
            <button 
              className="close-button"
              onClick={() => setShowRegistrationForm(false)}
            >
              &times;
            </button>
            
            <h2>Register for {selectedEvent.title}</h2>
            <p className="event-details">
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}<br />
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            
            <form onSubmit={handleSubmitRegistration} className="registration-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="schoolClub">School/Club *</label>
                <input
                  type="text"
                  id="schoolClub"
                  name="schoolClub"
                  value={registrationData.schoolClub}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Kiambu Chess Club, XYZ School"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fideId">FIDE ID (if any)</label>
                <input
                  type="text"
                  id="fideId"
                  name="fideId"
                  value={registrationData.fideId}
                  onChange={handleInputChange}
                  placeholder="e.g., 12345678"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="chessRating">Chess Rating (if any)</label>
                <input
                  type="text"
                  id="chessRating"
                  name="chessRating"
                  value={registrationData.chessRating}
                  onChange={handleInputChange}
                  placeholder="e.g., 1500, Beginner, etc."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={registrationData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special requirements or comments..."
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowRegistrationForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 