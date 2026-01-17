import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Container } from 'reactstrap';
import { AiOutlineArrowLeft, AiFillAppstore, AiFillVideoCamera, AiFillEdit, AiOutlineGlobal, AiFillPlayCircle, AiOutlineClose, AiFillStar, AiTwotoneCalendar } from "react-icons/ai";

import Header from '../Header.jsx';
import { getSingleMovie, trackView } from "../../utils/apicall.js";

export default function ShowMovie(){

  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const getMovie = (id) => {
    getSingleMovie(id)
      .then((movie) => {
        setMovie(movie);
      })
      .catch((err) => {
        console.error('Get single movie error', err);
      });
  }

  const { id } = useParams();

  useEffect(() =>{
    getMovie(id);
  },[id]);

  useEffect(() => {
  // Solo trackear cuando la película esté cargada
    if (movie && movie._id) {
      trackView('movie', movie._id, 120); // registra 2 minutos para sumar en estadísticas
    }
  }, [movie]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname.includes('youtu.be')) {
        const id = parsed.pathname.split('/').filter(Boolean).pop();
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (hostname.includes('youtube.com')) {
        if (parsed.pathname.includes('/embed/')) return url;
        const params = new URLSearchParams(parsed.search);
        const v = params.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
        const parts = parsed.pathname.split('/').filter(Boolean);
        const vIndex = parts.indexOf('v');
        if (vIndex !== -1 && parts[vIndex + 1]) return `https://www.youtube.com/embed/${parts[vIndex + 1]}`;
      }
      return null;
    } catch (e) {
      const maybeId = url.trim();
      if (/^[A-Za-z0-9_-]{11}$/.test(maybeId)) return `https://www.youtube.com/embed/${maybeId}`;
      return null;
    }
  };

  const embedUrl = movie ? getYouTubeEmbedUrl(movie.trailer_url) : null;

  return movie === null ? (
    <div style={styles.loadingContainer}>
      <Row>
        <Col>
          <Header/>
        </Col>
      </Row>
      <div style={styles.loadingSpinner}>
        <div style={styles.spinner}>✨</div>
        <h2 style={styles.loadingText}>Cargando...</h2>
      </div>
    </div>
  ) : (
    <div style={styles.pageContainer}>
      <Row><Col><Header /></Col></Row>

      {/* Hero Section con backdrop */}
      <div style={{
        ...styles.heroSection,
        backgroundImage: `url(${movie.backdrop_url || movie.portada_url})`
      }}>
        <div style={styles.heroOverlay} />
        
        <Container style={styles.heroContent}>
          <Row>
            <Col>
              {/* Botón de regreso */}
              <Link to="/movies">
                <button style={styles.backButton}>
                  <AiOutlineArrowLeft style={{ fontSize: '1.2rem' }} />
                  <span style={{ marginLeft: '8px' }}>Volver</span>
                </button>
              </Link>

              {/* Título de la película */}
              <h1 style={styles.movieTitle}>{movie.title}</h1>

              {/* Tagline */}
              {movie.tagline && (
                <p style={styles.tagline}>{movie.tagline}</p>
              )}

              {/* Info badges */}
              <div style={styles.badgesContainer}>
                <div style={styles.badge}>
                  <AiTwotoneCalendar style={{ marginRight: '6px' }} />
                  {movie.year}
                </div>
                <div style={styles.badge}>
                  <AiFillStar style={{ marginRight: '6px' }} />
                  {movie.imdb_rating}
                </div>
                {movie.genre && movie.genre.length > 0 && (
                  <div style={styles.badge}>
                    <AiFillAppstore style={{ marginRight: '6px' }} />
                    {movie.genre.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>

              {/* Botón de ver trailer */}
              {embedUrl && (
                <button 
                  style={styles.trailerButton}
                  onClick={() => setShowTrailer(true)}
                >
                  <AiFillPlayCircle style={{ fontSize: '1.5rem' }} />
                  <span style={{ marginLeft: '10px', fontSize: '1.1rem' }}>Ver tráiler</span>
                </button>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Detalles de la película */}
      <Container style={styles.detailsContainer}>
        <Row>
          <Col lg="8">
            <div style={styles.detailsCard}>
              <h2 style={styles.sectionTitle}>
                <AiFillEdit style={{ marginRight: '10px' }} />
                Sinopsis
              </h2>
              <p style={styles.plot}>{movie.plot}</p>

              <div style={styles.infoGrid}>
                {movie.director && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>
                      <AiFillVideoCamera style={{ marginRight: '8px' }} />
                      Director
                    </div>
                    <div style={styles.infoValue}>{movie.director}</div>
                  </div>
                )}

                {movie.country && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>
                      <AiOutlineGlobal style={{ marginRight: '8px' }} />
                      País
                    </div>
                    <div style={styles.infoValue}>{movie.country}</div>
                  </div>
                )}

                {movie.genre && movie.genre.length > 0 && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>
                      <AiFillAppstore style={{ marginRight: '8px' }} />
                      Géneros
                    </div>
                    <div style={styles.genresList}>
                      {movie.genre.map((genre, idx) => (
                        <span key={idx} style={styles.genreTag}>{genre}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col lg="4">
            <div style={styles.posterCard}>
              <img 
                src={movie.portada_url} 
                alt={movie.title}
                style={styles.posterImage}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal del trailer */}
      {showTrailer && (
        <div style={styles.modalOverlay} onClick={() => setShowTrailer(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowTrailer(false)}
            >
              <AiOutlineClose style={{ fontSize: '1.5rem' }} />
            </button>
            
            <div style={styles.videoContainer}>
              {embedUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Movie Trailer"
                  style={styles.iframe}
                />
              ) : (
                <div style={styles.noTrailer}>
                  <p>Tráiler no disponible</p>
                  {movie.trailer_url && (
                    <a 
                      href={movie.trailer_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.externalLink}
                    >
                      Abrir en YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%)',
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%)',
  },
  loadingSpinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    fontSize: '4rem',
    animation: 'spin 2s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
  },
  heroSection: {
    position: 'relative',
    minHeight: '70vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'flex-end',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(15, 20, 25, 1) 0%, rgba(15, 20, 25, 0.8) 40%, rgba(15, 20, 25, 0.3) 70%, transparent 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    paddingBottom: '60px',
    animation: 'slideUp 0.8s ease-out',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '30px',
  },
  movieTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '4rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 20px 0',
    textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)',
    lineHeight: '1.1',
  },
  tagline: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.4rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginBottom: '30px',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
  },
  badgesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '30px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 18px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  trailerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
  },
  detailsContainer: {
    paddingTop: '60px',
    paddingBottom: '60px',
  },
  detailsCard: {
    background: 'rgba(26, 31, 46, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  plot: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '40px',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    color: '#667eea',
    fontSize: '0.95rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  genresList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  genreTag: {
    padding: '6px 14px',
    background: 'rgba(102, 126, 234, 0.2)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '12px',
    color: '#a8b3ff',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  posterCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(102, 126, 234, 0.3)',
  },
  posterImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
    animation: 'fadeIn 0.3s ease-out',
  },
  modalContent: {
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    aspectRatio: '16/9',
    background: '#000',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
    animation: 'slideUp 0.4s ease-out',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    background: '#000',
  },
  iframe: {
    border: 'none',
  },
  noTrailer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#ffffff',
    fontSize: '1.2rem',
  },
  externalLink: {
    marginTop: '20px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
  },
};