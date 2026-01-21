import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { AiOutlineArrowLeft, AiFillStar, AiFillVideoCamera, AiOutlineUser, AiOutlineMan, AiOutlineWoman, AiFillCalendar } from "react-icons/ai";
import { FaMusic, FaTheaterMasks } from "react-icons/fa";
import Header from '../Header.jsx';
import { getSingleCharacter_Movie, getMovieName } from "../../utils/apicall.js";

export default function ShowCharacter() {
  const [character, setCharacter] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getCharacter = (id) => {
    getSingleCharacter_Movie(id)
      .then((character) => {
        setCharacter(character);
        console.log('Character loaded:', character);

        if (character.pelicula_titulo) {
          console.log('Searching for movie:', character.pelicula_titulo);
          getMovieName(character.pelicula_titulo)
            .then(data => {
              console.log('Movie found:', data);
              if (data && data._id) {
                setMovieId(data._id);
              }
            })
            .catch(err => {
              console.error('Error finding movie ID:', err);
            });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading character:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCharacter(id);
  }, [id]);

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}>✨</div>
          <h2 style={styles.loadingText}>Cargando personaje...</h2>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div style={styles.pageWrapper}>
        <Header />
        <Container>
          <div style={styles.errorContainer}>
            <h2 style={styles.errorText}>Personaje no encontrado</h2>
            <Link to="/characters_movies">
              <button style={styles.backButton}>
                <AiOutlineArrowLeft style={{ marginRight: '8px' }} />
                Volver a personajes
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const genderIcon = character.personaje_genero?.toLowerCase() === 'femenino' 
    ? <AiOutlineWoman /> 
    : <AiOutlineMan />;

  return (
    <div style={styles.pageWrapper}>
      <Header />

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <Container>
          <Link to="/characters_movies">
            <button style={styles.backButton}>
              <AiOutlineArrowLeft style={{ fontSize: '1.2rem' }} />
              <span style={{ marginLeft: '8px' }}>Volver</span>
            </button>
          </Link>
        </Container>
      </div>

      <Container style={styles.mainContainer}>
        <Row>
          {/* Columna Izquierda - Foto */}
          <Col xs="12" md="4">
            <div style={styles.photoSection}>
              <div style={styles.photoFrame}>
                <img 
                  src={character.personaje_foto_url} 
                  alt={character.personaje_nombre}
                  style={styles.photo}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=Sin+Foto';
                  }}
                />
                <div style={styles.photoOverlay}>
                  <div style={styles.characterBadge}>
                    <AiFillStar style={{ marginRight: '6px' }} />
                    {character.personaje_tipo ? character.personaje_tipo.split(/[\s\n]/)[0] : 'Personaje'}
                  </div>
                </div>
              </div>

              {/* Info rápida */}
              <div style={styles.quickInfo}>
                <div style={styles.quickInfoItem}>
                  <span style={styles.quickInfoLabel}>Interpretado por</span>
                  <span style={styles.quickInfoValue}>
                    <AiOutlineUser style={{ marginRight: '6px' }} />
                    {character.actor_nombre}
                  </span>
                </div>
              </div>
            </div>
          </Col>

          {/* Columna Derecha - Información */}
          <Col xs="12" md="8">
            <div style={styles.infoSection}>
              {/* Nombre del personaje */}
              <h1 style={styles.characterName}>{character.personaje_nombre}</h1>

              {/* Película */}
              <div style={styles.movieInfo}>
                <span style={styles.movieLabel}>Aparece en:</span>
                {character.pelicula_titulo && (
                  movieId ? (
                    <Link to={`/movies/details/${movieId}`} style={styles.movieLink}>
                      <AiFillVideoCamera style={{ marginRight: '8px' }} />
                      {character.pelicula_titulo}
                    </Link>
                  ) : (
                    <span style={styles.movieName}>
                      <AiFillVideoCamera style={{ marginRight: '8px' }} />
                      {character.pelicula_titulo}
                    </span>
                  )
                )}
              </div>

              {/* Canción Principal */}
              {character.cancion_principal && (
                <div style={styles.songCard}>
                  <div style={styles.songIcon}>
                    <FaMusic />
                  </div>
                  <div style={styles.songContent}>
                    <span style={styles.songLabel}>Canción Principal</span>
                    <span style={styles.songTitle}>{character.cancion_principal}</span>
                  </div>
                </div>
              )}

              {/* Datos del personaje */}
              <div style={styles.dataGrid}>
                {character.personaje_edad && (
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}>🎂</div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Edad</span>
                      <span style={styles.dataValue}>{character.personaje_edad}</span>
                    </div>
                  </div>
                )}

                {character.personaje_genero && (
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}>{genderIcon}</div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Género</span>
                      <span style={styles.dataValue}>{character.personaje_genero}</span>
                    </div>
                  </div>
                )}

                {character.pelicula_ano && (
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}><AiFillCalendar /></div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Año de la Película</span>
                      <span style={styles.dataValue}>{character.pelicula_ano}</span>
                    </div>
                  </div>
                )}

                {character.pelicula_tipo && (
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}><FaTheaterMasks /></div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Tipo</span>
                      <span style={styles.dataValue}>{character.pelicula_tipo}</span>
                    </div>
                  </div>
                )}

                {character.pelicula_genero && (
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}>🎭</div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Género de Película</span>
                      <span style={styles.dataValue}>{character.pelicula_genero}</span>
                    </div>
                  </div>
                )}

                {character.actor_nombre && (
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}>🎬</div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Actor/Actriz</span>
                      <span style={styles.dataValue}>{character.actor_nombre}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {character.personaje_descripcion && (
                <div style={styles.bioSection}>
                  <h2 style={styles.bioTitle}>
                    📖 Biografía del Personaje
                  </h2>
                  <p style={styles.bioText}>{character.personaje_descripcion}</p>
                </div>
              )}

              {/* Botón de acción */}
              {character.pelicula_titulo && movieId && (
                <Link to={`/movies/details/${movieId}`} style={{ textDecoration: 'none' }}>
                  <button style={styles.actionButton}>
                    <AiFillVideoCamera style={{ fontSize: '1.2rem' }} />
                    <span style={{ marginLeft: '10px' }}>Ver Película Completa</span>
                  </button>
                </Link>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    fontSize: '4rem',
    animation: 'spin 2s ease-in-out infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  errorText: {
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2rem',
    marginBottom: '30px',
  },

  // HERO
  heroSection: {
    padding: '30px 0 20px 0',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // MAIN
  mainContainer: {
    paddingTop: '20px',
    paddingBottom: '60px',
    animation: 'fadeIn 0.6s ease-out',
  },

  // PHOTO SECTION
  photoSection: {
    position: 'sticky',
    top: '100px',
  },
  photoFrame: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
    border: '3px solid rgba(102, 126, 234, 0.3)',
    marginBottom: '20px',
  },
  photo: {
    width: '100%',
    height: 'auto',
    display: 'block',
    aspectRatio: '2/3',
    objectFit: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%)',
  },
  characterBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    textTransform: 'uppercase',
  },
  quickInfo: {
    background: 'rgba(26, 31, 46, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  quickInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  quickInfoLabel: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  quickInfoValue: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    color: '#ffffff',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  },

  // INFO SECTION
  infoSection: {
    animation: 'slideIn 0.6s ease-out',
  },
  characterName: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '3.5rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 20px 0',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
    lineHeight: '1.1',
  },
  movieInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  movieLabel: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  movieLink: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  movieName: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
  },

  // SONG CARD
  songCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    marginBottom: '30px',
  },
  songIcon: {
    fontSize: '2.5rem',
    color: '#667eea',
    flexShrink: 0,
  },
  songContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  songLabel: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  songTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.3rem',
    color: '#ffffff',
    fontWeight: '700',
  },

  // DATA GRID
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  dataCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: 'rgba(26, 31, 46, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  dataIcon: {
    fontSize: '2.5rem',
    flexShrink: 0,
    color: '#667eea',
  },
  dataContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dataLabel: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  dataValue: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    color: '#ffffff',
    fontWeight: '600',
  },

  // BIO SECTION
  bioSection: {
    background: 'rgba(26, 31, 46, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '30px',
  },
  bioTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  bioText: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  },

  // ACTION BUTTON
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
  },
};