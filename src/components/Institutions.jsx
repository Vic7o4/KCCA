import React, { useState } from 'react';
import '../styles/Institutions.css';

const Institutions = () => {
  const [activeTab, setActiveTab] = useState('clubs');

  const clubs = [
    {
      id: 1,
      name: "Kiambu Chess Club",
      location: "Kiambu Town",
      meetingTime: "Saturdays, 2:00 PM - 6:00 PM",
      contact: "kiambucc@kiambuchess.org",
      members: 45,
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Thika Knights Chess Club",
      location: "Thika Town",
      meetingTime: "Sundays, 2:00 PM - 6:00 PM",
      contact: "thikakcc@kiambuchess.org",
      members: 35,
      image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Limuru Chess Masters",
      location: "Limuru",
      meetingTime: "Saturdays, 3:00 PM - 7:00 PM",
      contact: "limurucc@kiambuchess.org",
      members: 30,
      image: "https://images.unsplash.com/photo-1628005437056-473477b35446?auto=format&fit=crop&q=80"
    }
  ];

  const schools = [
    {
      id: 1,
      name: "Alliance High School",
      type: "Secondary",
      location: "Kikuyu",
      coach: "FM David Kamau",
      members: 50,
      achievements: "National Schools Champions 2023",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Kiambu High School",
      type: "Secondary",
      location: "Kiambu Town",
      coach: "CM Peter Mwangi",
      members: 40,
      achievements: "County Champions 2023",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "St. George's Primary",
      type: "Primary",
      location: "Ruiru",
      coach: "WFM Jane Njeri",
      members: 35,
      achievements: "Primary Schools Runner-up 2023",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      name: "Thika School",
      type: "Secondary",
      location: "Thika",
      coach: "IM John Mukabi",
      members: 45,
      achievements: "Regional Champions 2023",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="institutions-page">
      <header className="institutions-hero">
        <h1>Member Institutions</h1>
        <p>Chess clubs and schools affiliated with KCCA</p>
      </header>

      <main className="institutions-content">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'clubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            Chess Clubs
          </button>
          <button 
            className={`tab-button ${activeTab === 'schools' ? 'active' : ''}`}
            onClick={() => setActiveTab('schools')}
          >
            Schools
          </button>
        </div>

        {activeTab === 'clubs' ? (
          <section className="clubs-section">
            <h2>Chess Clubs</h2>
            <div className="institutions-grid">
              {clubs.map(club => (
                <div key={club.id} className="institution-card">
                  <div className="institution-image">
                    <img src={club.image} alt={club.name} />
                  </div>
                  <div className="institution-info">
                    <h3>{club.name}</h3>
                    <p><i className="fas fa-map-marker-alt"></i> {club.location}</p>
                    <p><i className="far fa-clock"></i> {club.meetingTime}</p>
                    <p><i className="fas fa-users"></i> {club.members} members</p>
                    <a href={`mailto:${club.contact}`} className="contact-button">
                      Contact Club
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="schools-section">
            <h2>Member Schools</h2>
            <div className="institutions-grid">
              {schools.map(school => (
                <div key={school.id} className="institution-card">
                  <div className="institution-image">
                    <img src={school.image} alt={school.name} />
                  </div>
                  <div className="institution-info">
                    <h3>{school.name}</h3>
                    <p><i className="fas fa-graduation-cap"></i> {school.type}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {school.location}</p>
                    <p><i className="fas fa-chalkboard-teacher"></i> Coach: {school.coach}</p>
                    <p><i className="fas fa-users"></i> {school.members} members</p>
                    <p><i className="fas fa-trophy"></i> {school.achievements}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Institutions; 