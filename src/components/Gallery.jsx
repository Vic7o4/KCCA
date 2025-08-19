import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample gallery data for when API is not available
  const sampleImages = [
    {
      id: 1,
      image_url: '/images/chess-tournament-1.jpg',
      category: 'Tournaments',
      caption: 'Kiambu County Championship 2024',
      created_at: '2024-07-15T10:00:00Z'
    },
    {
      id: 2,
      image_url: '/images/youth-training.jpg',
      category: 'Training',
      caption: 'Youth Chess Workshop',
      created_at: '2024-06-20T14:30:00Z'
    },
    {
      id: 3,
      image_url: '/images/chess-club.jpg',
      category: 'Community',
      caption: 'Weekly Chess Club Meeting',
      created_at: '2024-06-15T16:45:00Z'
    },
    {
      id: 4,
      image_url: '/images/awards-ceremony.jpg',
      category: 'Awards',
      caption: 'Annual Awards Ceremony',
      created_at: '2024-05-30T18:00:00Z'
    },
    {
      id: 5,
      image_url: '/images/school-program.jpg',
      category: 'Education',
      caption: 'School Chess Program Launch',
      created_at: '2024-05-20T11:15:00Z'
    },
    {
      id: 6,
      image_url: '/images/chess-exhibition.jpg',
      category: 'Exhibitions',
      caption: 'Chess Master Exhibition Match',
      created_at: '2024-05-10T15:30:00Z'
    }
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get('/api/gallery');
        setImages(response.data.length > 0 ? response.data : sampleImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setImages(sampleImages);
        setLoading(false);
      }
    };

    fetchGallery();
  }, [sampleImages]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="gallery-page loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-page">
      <header className="gallery-hero">
        <h1>Photo Gallery</h1>
        <p>Capturing moments from our chess community</p>
      </header>

      <main className="gallery-content">
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-item" onClick={() => openModal(image)}>
              <img src={image.image_url} alt={image.caption || 'Gallery image'} />
              {image.category && <span className="image-category">{image.category}</span>}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="no-images">
            <p>No images available in the gallery.</p>
            <p>Please check back later!</p>
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={selectedImage.image_url} alt={selectedImage.caption || 'Gallery image'} />
            {selectedImage.caption && <p className="modal-caption">{selectedImage.caption}</p>}
            {selectedImage.category && <p className="modal-category">{selectedImage.category}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 