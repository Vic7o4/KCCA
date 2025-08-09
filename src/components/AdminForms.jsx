import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminForms.css';
import { useAuth } from '../contexts/AuthContext';

const AdminForms = () => {
  const { token } = useAuth();
  
  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    image: null,
    category: 'general',
    caption: ''
  });

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    registrationDeadline: '',
    image: null
  });

  // News Form State
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: 'general',
    image: null
  });

  // Member Form State
  const [memberForm, setMemberForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    image: null
  });

  // Handle Gallery Form Submission
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', galleryForm.image);
    formData.append('category', galleryForm.category);
    formData.append('caption', galleryForm.caption);

    try {
      await axios.post('/api/admin/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Image added successfully!');
      setGalleryForm({ image: null, category: 'general', caption: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add image');
    }
  };

  // Handle Event Form Submission
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', eventForm.image);
    formData.append('title', eventForm.title);
    formData.append('date', eventForm.date);
    formData.append('location', eventForm.location);
    formData.append('description', eventForm.description);
    formData.append('registrationDeadline', eventForm.registrationDeadline);

    try {
      await axios.post('/api/admin/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Event added successfully!');
      setEventForm({
        title: '',
        date: '',
        location: '',
        description: '',
        registrationDeadline: '',
        image: null
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add event');
    }
  };

  // Handle News Form Submission
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', newsForm.image);
    formData.append('title', newsForm.title);
    formData.append('content', newsForm.content);
    formData.append('category', newsForm.category);

    try {
      await axios.post('/api/admin/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('News added successfully!');
      setNewsForm({
        title: '',
        content: '',
        category: 'general',
        image: null
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add news');
    }
  };

  // Handle Member Form Submission
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', memberForm.image);
    formData.append('name', memberForm.name);
    formData.append('position', memberForm.position);
    formData.append('email', memberForm.email);
    formData.append('phone', memberForm.phone);
    formData.append('bio', memberForm.bio);

    try {
      await axios.post('/api/admin/members', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Member added successfully!');
      setMemberForm({
        name: '',
        position: '',
        email: '',
        phone: '',
        bio: '',
        image: null
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add member');
    }
  };

  // Handle File Upload
  const handleFileUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      if (formType === 'gallery') {
        setGalleryForm(prev => ({ ...prev, image: file }));
      } else if (formType === 'event') {
        setEventForm(prev => ({ ...prev, image: file }));
      } else if (formType === 'news') {
        setNewsForm(prev => ({ ...prev, image: file }));
      } else if (formType === 'member') {
        setMemberForm(prev => ({ ...prev, image: file }));
      }
    }
  };

  return (
    <div className="admin-forms-container">
      <h2>Content Management</h2>

      {/* Gallery Form */}
      <div className="admin-form-section">
        <h3>Add to Gallery</h3>
        <form onSubmit={handleGallerySubmit} className="admin-form">
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'gallery')}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={galleryForm.category}
              onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="general">General</option>
              <option value="tournaments">Tournaments</option>
              <option value="training">Training</option>
            </select>
          </div>
          <div className="form-group">
            <label>Caption</label>
            <input
              type="text"
              value={galleryForm.caption}
              onChange={(e) => setGalleryForm(prev => ({ ...prev, caption: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="submit-button">Add to Gallery</button>
        </form>
      </div>

      {/* Event Form */}
      <div className="admin-form-section">
        <h3>Add Event</h3>
        <form onSubmit={handleEventSubmit} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={eventForm.date}
              onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={eventForm.location}
              onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration Deadline</label>
            <input
              type="date"
              value={eventForm.registrationDeadline}
              onChange={(e) => setEventForm(prev => ({ ...prev, registrationDeadline: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'event')}
            />
          </div>
          <button type="submit" className="submit-button">Add Event</button>
        </form>
      </div>

      {/* News Form */}
      <div className="admin-form-section">
        <h3>Add News</h3>
        <form onSubmit={handleNewsSubmit} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newsForm.title}
              onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={newsForm.content}
              onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={newsForm.category}
              onChange={(e) => setNewsForm(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="general">General</option>
              <option value="tournaments">Tournaments</option>
              <option value="training">Training</option>
              <option value="results">Results</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'news')}
            />
          </div>
          <button type="submit" className="submit-button">Add News</button>
        </form>
      </div>

      {/* Member Form */}
      <div className="admin-form-section">
        <h3>Add Member</h3>
        <form onSubmit={handleMemberSubmit} className="admin-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={memberForm.name}
              onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={memberForm.position}
              onChange={(e) => setMemberForm(prev => ({ ...prev, position: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={memberForm.email}
              onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={memberForm.phone}
              onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={memberForm.bio}
              onChange={(e) => setMemberForm(prev => ({ ...prev, bio: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'member')}
            />
          </div>
          <button type="submit" className="submit-button">Add Member</button>
        </form>
      </div>
    </div>
  );
};

export default AdminForms;
