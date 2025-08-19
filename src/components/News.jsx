import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample news data for when API is not available
  const sampleNews = [
    {
      id: 1,
      title: 'Kiambu Chess Prodigy Wins National Championship',
      content: '14-year-old Sarah Muthoni from Kiambu made history this weekend by becoming the youngest ever national chess champion. Her remarkable journey from local chess clubs to national recognition has inspired young players across the country. Sarah will be representing Kenya in the upcoming African Youth Chess Championship.',
      category: 'Achievements',
      image_url: 'https://images.unsplash.com/photo-1581094794329-c811e9fcb72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      created_at: '2024-07-20T09:15:00Z',
      alt_text: 'Young chess champion holding trophy'
    },
    {
      id: 2,
      title: 'KCCA Launches School Chess Program',
      content: 'The Kiambu County Chess Association has partnered with the Department of Education to launch an ambitious chess program in local schools. The initiative will provide chess equipment, training materials, and professional coaching to participating schools. The program aims to introduce chess to over 10,000 students in the county within the next year.',
      category: 'Community',
      image_url: 'https://images.unsplash.com/photo-1543092587-d8b8feaf9628?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      created_at: '2024-07-15T14:30:00Z',
      alt_text: 'Students learning chess in a classroom'
    },
    {
      id: 3,
      title: 'International Master to Host Training Camp',
      content: 'International Master David Kamau, Kiambu\'s highest-rated player, will conduct an intensive training camp this summer. The program will cover advanced positional play, endgame techniques, and psychological preparation for tournaments. Limited spots available - register now to secure your place!',
      category: 'Training',
      image_url: 'https://images.unsplash.com/photo-1543092587-d8b8feaf9628?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      created_at: '2024-07-10T11:45:00Z',
      alt_text: 'Chess master teaching students'
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news');
        setNews(response.data.length > 0 ? response.data : sampleNews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(sampleNews);
        setLoading(false);
      }
    };

    fetchNews();
  }, [sampleNews]);

  if (loading) {
    return <div className="news-page loading">Loading news...</div>;
  }

  return (
    <div className="news-page">
      <h1>Chess News</h1>

      <div className="news-grid">
        {news.map((article) => (
          <div key={article.id} className="news-card">
            <div className="news-image">
              <img 
                src={article.image_url} 
                alt={article.alt_text || article.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x450?text=Chess+News';
                }}
              />
            </div>
            
            <div className="news-content">
              <h2>{article.title}</h2>
              <span className="news-category">{article.category}</span>
              <p className="news-date">{new Date(article.created_at).toLocaleDateString()}</p>
              <p className="news-text">{article.content}</p>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="no-news">
          <p>No news articles available at the moment.</p>
          <p>Please check back later!</p>
        </div>
      )}
    </div>
  );
};

export default News; 