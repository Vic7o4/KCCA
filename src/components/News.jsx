import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news');
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news articles');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="news-page loading">Loading news...</div>;
  }

  if (error) {
    return <div className="news-page error">{error}</div>;
  }

  return (
    <div className="news-page">
      <h1>Chess News</h1>

      <div className="news-grid">
        {news.map((article) => (
          <div key={article.id} className="news-card">
            {article.image_url && (
              <div className="news-image">
                <img src={article.image_url} alt={article.title} />
              </div>
            )}
            
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