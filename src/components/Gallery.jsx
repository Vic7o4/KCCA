import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get('/api/gallery');
        setImages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setError('Failed to load gallery images');
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="gallery-page loading">Loading gallery...</div>;
  }

  if (error) {
    return <div className="gallery-page error">{error}</div>;
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