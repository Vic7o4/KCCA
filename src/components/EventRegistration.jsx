import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/EventRegistration.css';

const EventRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventDetails = location.state?.eventDetails;
  const [testStatus, setTestStatus] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('/api/test');
        setTestStatus('Connection successful!');
        console.log('Test response:', response.data);
      } catch (error) {
        setTestStatus('Connection failed');
        setApiError(error.message);
        console.error('Test error:', error);
      }
    };
    testConnection();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    affiliation: '',
    age: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    affiliation: '',
    age: '',
    email: '',
    phone: '',
    general: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: '',
    error: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      affiliation: '',
      age: '',
      email: '',
      phone: '',
      general: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Affiliation validation
    if (!formData.affiliation.trim()) {
      newErrors.affiliation = 'Affiliation is required';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (Number(formData.age) < 5 || Number(formData.age) > 120) {
      newErrors.age = 'Age must be between 5 and 120';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setStatus({
        loading: false,
        success: '',
        error: 'Please fix the errors in the form'
      });
      return;
    }

    setStatus({ loading: true, success: '', error: '' });

    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        ...formData,
        eventId: eventDetails?.id || 'default',
        eventName: eventDetails?.title || 'General Registration',
        eventDate: eventDetails?.date || '',
        eventLocation: eventDetails?.location || ''
      });

      setStatus({
        loading: false,
        success: 'Registration successful! Proceeding to payment...',
        error: ''
      });

      // Navigate to payment form with event and registration details
      setTimeout(() => {
        navigate('/payment', {
          state: {
            eventDetails,
            registrationDetails: formData,
            registrationId: response.data.registrationId
          }
        });
      }, 1500);

    } catch (error) {
      setStatus({
        loading: false,
        success: '',
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  if (!eventDetails) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <h2>Event Not Found</h2>
          <p>Please select an event from the events page to register.</p>
          <button onClick={() => navigate('/events')} className="submit-button">
            Go to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2>Event Registration</h2>
        
        <div className="event-details">
          <h3>{eventDetails.title}</h3>
          <p className="event-info">
            <span><i className="far fa-calendar-alt"></i> {eventDetails.date}</span>
            <span><i className="fas fa-map-marker-alt"></i> {eventDetails.location}</span>
          </p>
          <p className="event-description">{eventDetails.description}</p>
        </div>

        <div className="connection-status">
          <p style={{ color: testStatus === 'Connection successful!' ? 'green' : 'red' }}>
            {testStatus}
          </p>
          {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {status.loading && <p className="status-message loading">Processing your registration...</p>}
          {status.success && <p className="status-message success">{status.success}</p>}
          {status.error && <p className="status-message error">{status.error}</p>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="affiliation">Club/School</label>
            <input
              type="text"
              id="affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
              required
              placeholder="Enter your club or school name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="5"
              max="120"
              placeholder="Enter your age"
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
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          <button type="submit" className="submit-button" disabled={status.loading}>
            {status.loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration; 