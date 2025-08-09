import React from 'react';
import '../styles/Executive.css';

const Executive = () => {
  const executiveMembers = [
    {
      id: 1,
      name: "John Kamau",
      position: "President",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
      bio: "FIDE Master with over 20 years of chess experience. Leading KCCA since 2020.",
      email: "president@kiambuchess.org"
    },
    {
      id: 2,
      name: "Sarah Wanjiku",
      position: "Vice President",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
      bio: "International Arbiter and former national champion. Focused on youth development.",
      email: "vicepresident@kiambuchess.org"
    },
    {
      id: 3,
      name: "David Omondi",
      position: "Secretary General",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      bio: "Chess organizer and tournament director with extensive administrative experience.",
      email: "secretary@kiambuchess.org"
    },
    {
      id: 4,
      name: "Mary Njeri",
      position: "Treasurer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
      bio: "Certified accountant and chess enthusiast. Managing KCCA's financial growth.",
      email: "treasurer@kiambuchess.org"
    },
    {
      id: 5,
      name: "Peter Kimani",
      position: "Technical Director",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80",
      bio: "International Master and professional chess coach. Overseeing training programs.",
      email: "technical@kiambuchess.org"
    },
    {
      id: 6,
      name: "Jane Muthoni",
      position: "Public Relations Officer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      bio: "Communications specialist promoting chess across Kiambu County.",
      email: "pro@kiambuchess.org"
    }
  ];

  return (
    <div className="executive-page">
      <header className="executive-hero">
        <h1>Executive Members</h1>
        <p>Meet the team leading Kiambu County Chess Association</p>
      </header>

      <main className="executive-content">
        <div className="executive-grid">
          {executiveMembers.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="member-info">
                <h2>{member.name}</h2>
                <h3>{member.position}</h3>
                <p className="member-bio">{member.bio}</p>
                <a href={`mailto:${member.email}`} className="member-email">
                  <i className="fas fa-envelope"></i> {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Executive; 