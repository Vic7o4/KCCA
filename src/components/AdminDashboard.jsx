import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('news');
  const [formData, setFormData] = useState({
    // News form
    newsTitle: '',
    newsContent: '',
    newsCategory: 'general',
    newsImage: null,
    
    // Tournament form
    tournamentTitle: '',
    tournamentDate: '',
    tournamentLocation: '',
    tournamentDescription: '',
    registrationDeadline: '',
    tournamentPoster: null,
    
    // Gallery form
    galleryImage: null,
    imageCategory: 'tournament',
    imageCaption: '',

    // Image Management form
    managementImage: null,
    imageName: '',
    imageDescription: ''
  });

  const [registrations, setRegistrations] = useState({
    list: [],
    summary: [],
    loading: false,
    error: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.newsTitle);
    formDataToSend.append('content', formData.newsContent);
    formDataToSend.append('category', formData.newsCategory);
    if (formData.newsImage) {
      formDataToSend.append('image', formData.newsImage);
    }

    try {
      await axios.post('http://localhost:3001/api/admin/news', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('News article created successfully!');
      // Reset form
      setFormData(prev => ({
        ...prev,
        newsTitle: '',
        newsContent: '',
        newsCategory: 'general',
        newsImage: null
      }));
    } catch (error) {
      alert('Error creating news article: ' + error.message);
    }
  };

  const handleTournamentSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.tournamentTitle);
    formDataToSend.append('date', formData.tournamentDate);
    formDataToSend.append('location', formData.tournamentLocation);
    formDataToSend.append('description', formData.tournamentDescription);
    formDataToSend.append('registrationDeadline', formData.registrationDeadline);
    if (formData.tournamentPoster) {
      formDataToSend.append('poster', formData.tournamentPoster);
    }

    try {
      await axios.post('http://localhost:3001/api/admin/tournaments', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Tournament created successfully!');
      // Reset form
      setFormData(prev => ({
        ...prev,
        tournamentTitle: '',
        tournamentDate: '',
        tournamentLocation: '',
        tournamentDescription: '',
        registrationDeadline: '',
        tournamentPoster: null
      }));
    } catch (error) {
      alert('Error creating tournament: ' + error.message);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('image', formData.galleryImage);
    formDataToSend.append('category', formData.imageCategory);
    formDataToSend.append('caption', formData.imageCaption);

    try {
      await axios.post('http://localhost:3001/api/admin/gallery', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Image uploaded successfully!');
      // Reset form
      setFormData(prev => ({
        ...prev,
        galleryImage: null,
        imageCategory: 'tournament',
        imageCaption: ''
      }));
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    }
  };

  const handleImageManagementSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('image', formData.managementImage);
    formDataToSend.append('name', formData.imageName);
    formDataToSend.append('description', formData.imageDescription);

    try {
      await axios.post('http://localhost:3001/api/admin/images', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Image uploaded successfully!');
      // Reset form
      setFormData(prev => ({
        ...prev,
        managementImage: null,
        imageName: '',
        imageDescription: ''
      }));
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const fetchRegistrations = async () => {
    setRegistrations(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const [listRes, summaryRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/registrations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }),
        axios.get('http://localhost:3001/api/admin/registrations/summary', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
      ]);

      setRegistrations({
        list: listRes.data,
        summary: summaryRes.data,
        loading: false,
        error: ''
      });
    } catch (error) {
      setRegistrations(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch registrations'
      }));
    }
  };

  const handleResendConfirmation = async (registrationId) => {
    try {
      await axios.post(
        `http://localhost:3001/api/admin/resend-confirmation/${registrationId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }
      );
      alert('Confirmation email sent successfully!');
    } catch (error) {
      alert('Failed to send confirmation email: ' + error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>KCCA Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
          <button
            className={`tab-button ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            Tournaments
          </button>
          <button
            className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
          <button
            className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            Image Management
          </button>
          <button
            className={`tab-button ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('registrations');
              fetchRegistrations();
            }}
          >
            Registrations
          </button>
        </nav>

        <div className="dashboard-forms">
          {activeTab === 'news' && (
            <form onSubmit={handleNewsSubmit} className="content-form">
              <h2>Add News Article</h2>
              
              <div className="form-group">
                <label htmlFor="newsTitle">Title</label>
                <input
                  type="text"
                  id="newsTitle"
                  name="newsTitle"
                  value={formData.newsTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newsCategory">Category</label>
                <select
                  id="newsCategory"
                  name="newsCategory"
                  value={formData.newsCategory}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="tournament">Tournament</option>
                  <option value="training">Training</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="newsContent">Content</label>
                <textarea
                  id="newsContent"
                  name="newsContent"
                  value={formData.newsContent}
                  onChange={handleChange}
                  required
                  rows="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newsImage">Image</label>
                <input
                  type="file"
                  id="newsImage"
                  name="newsImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <button type="submit" className="submit-button">
                Publish News
              </button>
            </form>
          )}

          {activeTab === 'tournaments' && (
            <form onSubmit={handleTournamentSubmit} className="content-form">
              <h2>Add Tournament</h2>
              
              <div className="form-group">
                <label htmlFor="tournamentTitle">Tournament Title</label>
                <input
                  type="text"
                  id="tournamentTitle"
                  name="tournamentTitle"
                  value={formData.tournamentTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tournamentDate">Date</label>
                <input
                  type="date"
                  id="tournamentDate"
                  name="tournamentDate"
                  value={formData.tournamentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tournamentLocation">Location</label>
                <input
                  type="text"
                  id="tournamentLocation"
                  name="tournamentLocation"
                  value={formData.tournamentLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tournamentDescription">Description</label>
                <textarea
                  id="tournamentDescription"
                  name="tournamentDescription"
                  value={formData.tournamentDescription}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationDeadline">Registration Deadline</label>
                <input
                  type="date"
                  id="registrationDeadline"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tournamentPoster">Tournament Poster</label>
                <input
                  type="file"
                  id="tournamentPoster"
                  name="tournamentPoster"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.tournamentPoster && (
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(formData.tournamentPoster)} 
                      alt="Tournament poster preview" 
                      style={{ maxWidth: '200px', marginTop: '10px' }}
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="submit-button">
                Create Tournament
              </button>
            </form>
          )}

          {activeTab === 'gallery' && (
            <form onSubmit={handleGallerySubmit} className="content-form">
              <h2>Add Gallery Image</h2>
              
              <div className="form-group">
                <label htmlFor="galleryImage">Image</label>
                <input
                  type="file"
                  id="galleryImage"
                  name="galleryImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageCategory">Category</label>
                <select
                  id="imageCategory"
                  name="imageCategory"
                  value={formData.imageCategory}
                  onChange={handleChange}
                >
                  <option value="tournament">Tournament</option>
                  <option value="training">Training</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="imageCaption">Caption</label>
                <input
                  type="text"
                  id="imageCaption"
                  name="imageCaption"
                  value={formData.imageCaption}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Upload Image
              </button>
            </form>
          )}

          {activeTab === 'images' && (
            <form onSubmit={handleImageManagementSubmit} className="content-form">
              <h2>Image Management</h2>
              
              <div className="form-group">
                <label htmlFor="managementImage">Image</label>
                <input
                  type="file"
                  id="managementImage"
                  name="managementImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageName">Image Name</label>
                <input
                  type="text"
                  id="imageName"
                  name="imageName"
                  value={formData.imageName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageDescription">Description</label>
                <textarea
                  id="imageDescription"
                  name="imageDescription"
                  value={formData.imageDescription}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-button">
                Upload Image
              </button>
            </form>
          )}

          {activeTab === 'registrations' && (
            <div className="registrations-section">
              <h2>Event Registrations</h2>
              
              {registrations.loading && <p>Loading registrations...</p>}
              {registrations.error && <p className="error-message">{registrations.error}</p>}
              
              {!registrations.loading && !registrations.error && (
                <>
                  <div className="registration-summary">
                    <h3>Registration Summary</h3>
                    <div className="summary-grid">
                      {registrations.summary.map(event => (
                        <div key={event.event_name} className="summary-card">
                          <h4>{event.event_name}</h4>
                          <p>Total Registrations: {event.total_registrations}</p>
                          <p>Paid Registrations: {event.completed_payments}</p>
                          <p>Total Amount Collected: KES {event.collected_amount}</p>
                          <p>Pending Payments: {event.total_registrations - event.completed_payments}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="registration-list">
                    <h3>All Registrations</h3>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Event</th>
                            <th>Name</th>
                            <th>Club/School</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.list.map(reg => (
                            <tr key={reg.id} className={reg.payment_status === 'completed' ? 'paid' : 'unpaid'}>
                              <td>{reg.event_name}</td>
                              <td>{reg.name}</td>
                              <td>{reg.affiliation}</td>
                              <td>{reg.age}</td>
                              <td>{reg.email}</td>
                              <td>{reg.phone}</td>
                              <td>
                                <span className={`status-badge ${reg.payment_status}`}>
                                  {reg.payment_status === 'completed' ? 'Paid' : 'Pending'}
                                </span>
                              </td>
                              <td>
                                {reg.payment_status === 'completed' && (
                                  <button
                                    onClick={() => handleResendConfirmation(reg.id)}
                                    className="resend-button"
                                    title="Resend confirmation email"
                                  >
                                    <i className="fas fa-envelope"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 