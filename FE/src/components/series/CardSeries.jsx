import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import {AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar, AiFillStar, AiOutlineLoading3Quarters} from "react-icons/ai";

import {addNewFavorites, deleteFavorites, checkFavorite} from "../../utils/apicall.js";

export default function CardSeries({ serie }) {

  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !serie?._id) return;

    checkFavorite(null, serie._id)
      .then(res => {
        setIsFav(res.exists);
        if (res.favoriteId) {
          setFavoriteId(res.favoriteId);
        }
      })
      .catch(err => console.error(err));
  }, [serie._id]);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('email');
      if (!isFav) {
        const res = await addNewFavorites(email, null, serie._id);
        setIsFav(true);
        setFavoriteId(res._id);
      } else {
        await deleteFavorites(favoriteId);
        setIsFav(false);
        setFavoriteId(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const finalizacion =
    serie?.year_end && serie.year_end !== 0
      ? serie.year_end
      : 'En emisión';

  return (
    <div style={styles.card}>
      <div style={styles.cardInner}>
        
        {/* Botón de favorito flotante */}
        <button
          style={{
            ...styles.favButton,
            ...(isFav ? styles.favActive : {})
          }}
          onClick={toggleFavorite}
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters style={styles.spinIcon} />
          ) : isFav ? (
            <AiFillStar />
          ) : (
            <AiOutlineStar />
          )}
        </button>

        {/* Poster */}
        <Link to={`/series/details/${serie._id}`} style={styles.posterLink}>
          <div style={styles.posterContainer}>
            <img
              src={serie.portada_url}
              alt={serie.title}
              style={styles.poster}
            />
            <div style={styles.hoverOverlay}>
              <div style={styles.playButton}>
                <AiFillEye style={{ fontSize: '2rem' }} />
                <span style={{ marginLeft: '8px', fontSize: '1.1rem', fontWeight: '600' }}>Ver ahora</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Contenido con altura fija */}
        <div style={styles.content}>
          <h3 style={styles.title}>{serie.title}</h3>
          
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <AiTwotoneCalendar style={styles.icon} />
              <span>{serie.year_start}</span>
            </div>
            <div style={styles.infoItem}>
              <AiFillSignal style={styles.icon} />
              <span>{serie.imdb_rating}</span>
            </div>
          </div>

          <div style={styles.genresContainer}>
            {Array.isArray(serie.genre) &&
              serie.genre.slice(0, 2).map((cat, idx) => (
                <span key={idx} style={styles.genreBadge}>
                  {cat}
                </span>
              ))}
            {serie.genre?.length > 2 && <span style={styles.genreBadge}>+{serie.genre.length - 2}</span>}
          </div>

          {/* Spacer para empujar el botón al fondo */}
          <div style={{ flex: 1 }}></div>

          <Link to={`/series/details/${serie._id}`} style={{ textDecoration: 'none', width: '100%' }}>
            <button style={styles.watchButton}>
              <AiFillEye style={{ fontSize: '1.2rem' }} />
              <span style={{ marginLeft: '8px', fontWeight: '600' }}>Ver serie</span>
            </button>
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  card: {
    width: '100%',
    height: '100%',
    maxWidth: '280px',
    margin: '0 auto',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  cardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  favButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.3s ease',
  },
  favActive: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#fff',
    border: '2px solid #FFD700',
    transform: 'scale(1.1)',
  },
  spinIcon: {
    animation: 'spin 1s linear infinite',
  },
  posterLink: {
    textDecoration: 'none',
    display: 'block',
    position: 'relative',
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    height: '380px',
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '50px',
    color: '#1a1f2e',
    fontWeight: '600',
    transform: 'translateY(20px)',
    transition: 'transform 0.3s ease',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    minHeight: '240px',
  },
  title: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: 0,
    lineHeight: '1.3',
    height: '2.6em',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontFamily: 'Poppins, sans-serif',
  },
  infoRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  icon: {
    color: '#667eea',
    fontSize: '1rem',
  },
  genresContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.85rem',
    minHeight: '32px',
  },
  genreBadge: {
    padding: '4px 10px',
    background: 'rgba(102, 126, 234, 0.2)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '12px',
    color: '#a8b3ff',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  watchButton: {
    width: '100%',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
};
