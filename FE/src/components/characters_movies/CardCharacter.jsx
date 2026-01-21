import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillStar, AiFillVideoCamera, AiTwotoneCalendar, AiFillSignal } from "react-icons/ai";
import { getMovieName } from "../../utils/apicall";

export default function CardCharacter({ character }) {
  const [movieId, setMovieId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (character.pelicula_titulo) {
      getMovieName(character.pelicula_titulo)
        .then(data => setMovieId(data._id))
        .catch(err => console.error(err));
    }
  }, [character.pelicula_titulo]);

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
      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    },
    cardInner: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
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
      opacity: isHovered ? 1 : 0,
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
      transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
      transition: 'transform 0.3s ease',
    },
    typeBadge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      padding: '6px 14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      fontSize: '0.7rem',
      fontWeight: '700',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'uppercase',
    },
    content: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1,
      minHeight: '200px',
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
    spacer: {
      flex: 1,
    },
  };

  // Determinar el tipo de personaje para mostrar
  const getTipoDisplay = () => {
    if (character.personaje_tipo) {
      const tipo = character.personaje_tipo.split(/[\s\n]/)[0];
      return tipo.toUpperCase();
    }
    return 'PERSONAJE';
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardInner}>
        
        {/* Poster */}
        <Link to={`/characters_movies/details/${character._id}`} style={styles.posterLink}>
          <div style={styles.posterContainer}>
            {character.personaje_tipo && (
              <div style={styles.typeBadge}>
                <AiFillStar style={{ fontSize: '0.8rem' }} />
                {getTipoDisplay()}
              </div>
            )}
            <img
              src={character.personaje_foto_url}
              alt={character.personaje_nombre}
              style={styles.poster}
            />
            <div style={styles.hoverOverlay}>
              <div style={styles.playButton}>
                <AiFillEye style={{ fontSize: '2rem' }} />
                <span style={{ marginLeft: '8px', fontSize: '1.1rem', fontWeight: '600' }}>Ver más</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Contenido */}
        <div style={styles.content}>
          <h3 style={styles.title}>{character.personaje_nombre}</h3>
          
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <AiTwotoneCalendar style={styles.icon} />
              <span>Edad: {character.personaje_edad || 'N/A'}</span>
            </div>
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <AiFillSignal style={styles.icon} />
              <span>Sexo: {character.personaje_genero || 'N/A'}</span>
            </div>
          </div>

          {/* Spacer */}
          <div style={styles.spacer}></div>

          <Link to={`/characters_movies/details/${character._id}`} style={{ textDecoration: 'none', width: '100%' }}>
            <button 
              style={styles.watchButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              <AiFillEye style={{ fontSize: '1.2rem' }} />
              <span style={{ marginLeft: '8px', fontWeight: '600' }}>Más info</span>
            </button>
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}