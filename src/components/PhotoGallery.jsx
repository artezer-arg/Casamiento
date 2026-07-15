import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PhotoGallery({ photos }) {
  const [activeIdx, setActiveIdx] = useState(null); // Index of active photo in lightbox
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Filter gallery photos
  const galleryPhotos = photos?.filter(p => p.tipo === 'galeria' && p.visible) || [];

  if (galleryPhotos.length === 0) return null;

  const openLightbox = (index) => {
    setActiveIdx(index);
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeLightbox = () => {
    setActiveIdx(null);
    document.body.style.overflow = ''; // Unlock scroll
  };

  const showNext = () => {
    setActiveIdx((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  };

  const showPrev = () => {
    setActiveIdx((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  };

  // Handle mobile swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // threshold in pixels

    if (distance > minSwipeDistance) {
      showNext(); // Swiped left, show next
    } else if (distance < -minSwipeDistance) {
      showPrev(); // Swiped right, show prev
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section id="galeria">
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Camera size={32} strokeWidth={1.5} />
      </div>

      <h2 className="section-title">Nuestra Galería</h2>
      <p className="section-subtitle">Momentos Compartidos</p>

      <div className="gallery-grid animate-fade-in-up">
        {galleryPhotos.map((photo, index) => (
          <div 
            key={photo.id || index} 
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            <img 
              src={photo.url} 
              alt={photo.texto_alternativo || `Foto ${index + 1}`} 
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar galería">
            <X size={28} />
          </button>

          <button 
            className="lightbox-arrow lightbox-arrow-left" 
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            className="lightbox-content-wrapper" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={galleryPhotos[activeIdx].url} 
              alt={galleryPhotos[activeIdx].texto_alternativo || 'Visualización ampliada'} 
              className="lightbox-img"
            />
          </div>

          <button 
            className="lightbox-arrow lightbox-arrow-right" 
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>

          {galleryPhotos[activeIdx].texto_alternativo && (
            <p className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
              {galleryPhotos[activeIdx].texto_alternativo}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
