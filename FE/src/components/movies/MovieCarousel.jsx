import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { getAllMovies } from '../../utils/apicall.js';

function MovieCarousel(args) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((movies) => {
        const withBackdrop = (movies || []).filter(
          (m) => typeof m.backdrop_url === 'string' && m.backdrop_url.trim().length > 0
        );
        const shuffled = withBackdrop.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        const mapped = selected.map((m) => ({
          src: m.backdrop_url,
          altText: m.title,
          caption: m.title,
          id: m._id,
        }));
        setItems(mapped);
      })
      .catch((err) => {
        console.error('Carousel movies load error:', err);
        setItems([]);
      });
  }, []);

  if (!items || items.length === 0) return null;

  const sectionStyle = {
    width: '100%',
    background: 'linear-gradient(180deg, rgba(15, 20, 31, 0.95) 0%, rgba(26, 31, 46, 0.98) 50%, rgba(15, 20, 31, 0.95) 100%)',
    padding: '40px 0',
    marginBottom: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    borderRadius: '20px',
  };

  const carouselContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.3)',
  };

  const imageWrapperStyle = {
    position: 'relative',
    width: '100%',
    height: '500px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  };

  const gradientOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 40%, transparent 100%)',
    pointerEvents: 'none',
  };

  const captionStyle = {
    position: 'absolute',
    bottom: '40px',
    left: '40px',
    right: '40px',
    textAlign: 'left',
    padding: 0,
  };

  const captionTitleStyle = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)',
    margin: '0 0 10px 0',
    letterSpacing: '0.5px',
    lineHeight: '1',
  };


  return (
    <div style={sectionStyle}>
      
      <div style={carouselContainerStyle}>
        <Carousel fade interval={5000} pause="hover" {...args}>
          {items.map((item) => (
            <Carousel.Item key={item.id}>
              <Link to={`/movies/details/${item.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={imageWrapperStyle}>
                  <img
                    src={item.src}
                    alt={item.altText}
                    style={imageStyle}
                  />
                  <div style={gradientOverlayStyle} />
                </div>
                <Carousel.Caption style={captionStyle}>
                  <h3 style={captionTitleStyle}>{item.caption}</h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
        
        <style>{`
          .carousel-control-prev,
          .carousel-control-next {
            width: 60px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .carousel:hover .carousel-control-prev,
          .carousel:hover .carousel-control-next {
            opacity: 1;
          }
          
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            width: 40px;
            height: 40px;
            background-color: rgba(102, 126, 234, 0.8);
            border-radius: 50%;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
          }
          
          .carousel-control-prev-icon:hover,
          .carousel-control-next-icon:hover {
            background-color: rgba(102, 126, 234, 1);
            transform: scale(1.15);
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.6);
          }
          
          .carousel-indicators {
            bottom: 20px;
          }
          
          .carousel-indicators [data-bs-target] {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.6);
            margin: 0 8px;
            transition: all 0.3s ease;
          }
          
          .carousel-indicators .active {
            width: 40px;
            border-radius: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.6);
          }
          
          @media (max-width: 768px) {
            .carousel-item img {
              height: 350px !important;
            }
          }
          
          @media (max-width: 576px) {
            .carousel-item img {
              height: 280px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default MovieCarousel;