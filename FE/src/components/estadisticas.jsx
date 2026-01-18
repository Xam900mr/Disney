import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AiFillStar, AiFillTrophy, AiFillFire, AiFillEye, AiFillClockCircle, AiFillHeart, AiFillVideoCamera } from "react-icons/ai";
import Header from './Header.jsx';
import { getMyStats, getMyWatchedMovies, getMyWatchedSeries } from '../utils/apicall';
import MyImgFondo from "../images/fondo.gif";

const bgStyle = {
  minHeight: "100vh",
  backgroundImage: `url(${MyImgFondo})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

export default function Estadisticas() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moviesModalOpen, setMoviesModalOpen] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [seriesModalOpen, setSeriesModalOpen] = useState(false);
  const [watchedSeries, setWatchedSeries] = useState([]);

  useEffect(() => {
    if (moviesModalOpen || seriesModalOpen) {
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.paddingRight = '';
    };
  }, [moviesModalOpen, seriesModalOpen]);

  useEffect(() => {
    getMyStats()
      .then(data => {
        console.log('Stats received:', data);
        setStats(data);
      })
      .catch(err => {
        console.error('Error loading stats:', err);
        if (err.message?.includes('401') || err.message?.includes('token')) {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div style={bgStyle}>
        <Row>
          <Col><Header /></Col>
        </Row>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}>✨</div>
          <h2 style={styles.loadingText}>Cargando estadísticas...</h2>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={bgStyle}>
        <Row>
          <Col><Header /></Col>
        </Row>
        <div style={styles.loadingContainer}>
          <p style={styles.errorText}>No se pudieron cargar las estadísticas</p>
        </div>
      </div>
    );
  }

  const hours = Math.floor(stats.totalSecondsWatched / 3600);
  const mins = Math.floor((stats.totalSecondsWatched % 3600) / 60);
  const userName = localStorage.getItem('name') || 'Usuario';

  return (
    <div style={bgStyle}>
      <Row>
        <Col><Header /></Col>
      </Row>

      <Container style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '1400px' }}>
        {/* Header del perfil */}
        <div style={styles.profileHeader}>
          <div style={styles.profileInfo}>
            <div style={styles.avatar}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={styles.userName}>{userName}</h1>
              <p style={styles.userSubtitle}>Mis Estadísticas</p>
            </div>
          </div>
        </div>

        {/* Cards de estadísticas principales */}
        <Row style={{ marginTop: '30px', marginBottom: '30px' }}>
          <Col xs="12" sm="6" lg="3" className="mb-3">
            <div style={{...styles.statCard, cursor: 'pointer'}} onClick={async () => {
              try {
                const data = await getMyWatchedMovies();
                setWatchedMovies(Array.isArray(data) ? data : []);
                setMoviesModalOpen(true);
              } catch (err) {
                console.error('Error loading watched movies:', err);
              }
            }}>
              <div style={styles.statIcon}>
                <AiFillVideoCamera style={{ fontSize: '2rem', color: '#667eea' }} />
              </div>
              <div style={styles.statNumber}>{stats.moviesSeen}</div>
              <div style={styles.statLabel}>Películas Vistas</div>
            </div>
          </Col>

          <Col xs="12" sm="6" lg="3" className="mb-3">
            <div style={{...styles.statCard, cursor: 'pointer'}} onClick={async () => {
              try {
                const data = await getMyWatchedSeries();
                setWatchedSeries(Array.isArray(data) ? data : []);
                setSeriesModalOpen(true);
              } catch (err) {
                console.error('Error loading watched series:', err);
              }
            }}>
              <div style={styles.statIcon}>
                <AiFillEye style={{ fontSize: '2rem', color: '#4ECDC4' }} />
              </div>
              <div style={styles.statNumber}>{stats.seriesSeen}</div>
              <div style={styles.statLabel}>Series Vistas</div>
            </div>
          </Col>

          <Col xs="12" sm="6" lg="3" className="mb-3">
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <AiFillClockCircle style={{ fontSize: '2rem', color: '#FFD700' }} />
              </div>
              <div style={styles.statNumber}>{hours}h {mins}m</div>
              <div style={styles.statLabel}>Tiempo Total</div>
            </div>
          </Col>

          <Col xs="12" sm="6" lg="3" className="mb-3">
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <AiFillFire style={{ fontSize: '2rem', color: '#FF8C42' }} />
              </div>
              <div style={styles.statNumber}>{stats.streakDays}</div>
              <div style={styles.statLabel}>Días de Racha</div>
            </div>
          </Col>
        </Row>

        {/* Badges/Logros */}
        {stats.badges && stats.badges.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <AiFillTrophy style={{ marginRight: '12px', color: '#FFD700' }} />
              Logros Desbloqueados
            </h2>
            <div style={styles.badgesContainer}>
              {stats.badges.map((badge, idx) => {
                const badgeConfig = {
                  'Cinéfilo': { icon: '🎬', color: '#FFD700' },
                  'Constante': { icon: '🔥', color: '#FF8C42' },
                  'Maratonero': { icon: '⏰', color: '#9B59B6' },
                  'Explorador': { icon: '🌍', color: '#4ECDC4' }
                };
                const config = badgeConfig[badge] || { icon: '🏆', color: '#667eea' };

                return (
                  <div key={idx} style={{ ...styles.badge, borderColor: config.color }}>
                    <div style={{ ...styles.badgeIcon, background: config.color }}>
                      {config.icon}
                    </div>
                    <div style={styles.badgeName}>{badge}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Géneros favoritos */}
        {stats.favoriteGenres && stats.favoriteGenres.length > 0 && (
          <Row style={{ marginTop: '40px' }}>
            <Col lg="12" className="mb-4">
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>
                  <AiFillFire style={{ marginRight: '10px', color: '#FF8C42' }} />
                  Géneros Favoritos
                </h3>
                <div style={styles.genresList}>
                  {stats.favoriteGenres.map((genre, idx) => {
                    const total = stats.favoriteGenres.reduce((sum, g) => sum + g.count, 0);
                    const percentage = (genre.count / total) * 100;
                    const colors = ['#667eea', '#FF6B6B', '#4ECDC4', '#FFD700', '#FF8C42', '#9B59B6', '#10b981', '#f59e0b'];
                    
                    return (
                      <div key={idx} style={styles.genreItem}>
                        <div style={styles.genreInfo}>
                          <span style={styles.genreRank}>#{idx + 1}</span>
                          <span style={styles.genreName}>{genre.genre}</span>
                          <span style={styles.genreCount}>{genre.count} visualizaciones</span>
                        </div>
                        <div style={styles.progressBar}>
                          <div style={{
                            ...styles.progressFill,
                            width: `${percentage}%`,
                            background: colors[idx % colors.length]
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Resumen adicional */}
        <Row style={{ marginTop: '30px' }}>
          <Col xs="12" md="4" className="mb-3">
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>{stats.moviesSeen + stats.seriesSeen}</div>
              <div style={styles.summaryLabel}>Contenido Total</div>
            </div>
          </Col>
          <Col xs="12" md="4" className="mb-3">
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>
                {stats.streakDays > 0 ? (stats.moviesSeen + stats.seriesSeen / stats.streakDays).toFixed(1) : 0}
              </div>
              <div style={styles.summaryLabel}>Promedio por Día</div>
            </div>
          </Col>
          <Col xs="12" md="4" className="mb-3">
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>
                {stats.favoriteGenres ? stats.favoriteGenres.length : 0}
              </div>
              <div style={styles.summaryLabel}>Géneros Diferentes</div>
            </div>
          </Col>
        </Row>
      </Container>

      
      <Modal isOpen={moviesModalOpen} toggle={() => setMoviesModalOpen(false)}>
        <ModalHeader toggle={() => setMoviesModalOpen(false)} style={{background:'linear-gradient(135deg, #3a3f55 0%, #1a1d29 100%)', color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
          Películas vistas
        </ModalHeader>

        <ModalBody style={{
          background: 'linear-gradient(135deg, #5b74d7 0%, #fdfdff 100%)',
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>
          {watchedMovies && watchedMovies.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px'}}>
              {watchedMovies.map((m) => (
                <div key={m._id} style={{ background: 'rgba(26,31,46,0.85)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease', cursor: 'pointer'  
                }} onClick={() => {
                  navigate(`/movies/details/${m._id}`);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img src={m.portada_url} alt={m.title} style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{m.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: 'rgba(249,249,249,0.6)',
              fontSize: '1.1rem'
            }}>
              No hay peliculas vistas aún
            </div>
          )}
        </ModalBody>
      </Modal>
    {/*series modal*/}
      <Modal isOpen={seriesModalOpen} toggle={() => setSeriesModalOpen(false)}>
        <ModalHeader toggle={() => setSeriesModalOpen(false)} style={{background:'linear-gradient(135deg, #3a3f55 0%, #1a1d29 100%)', color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
          Series vistas
        </ModalHeader>

        <ModalBody style={{
          background: 'linear-gradient(135deg, #5b74d7 0%, #fdfdff 100%)',
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>
          {watchedSeries && watchedSeries.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px'}}>
              {watchedSeries.map((m) => (
                <div key={m._id} style={{ background: 'rgba(26,31,46,0.85)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease', cursor: 'pointer'  
                }} onClick={() => {
                  navigate(`/series/details/${m._id}`);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img src={m.portada_url} alt={m.title} style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{m.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: 'rgba(249,249,249,0.6)',
              fontSize: '1.1rem'
            }}>
              No hay series vistas aún
            </div>
          )}
        </ModalBody>
      </Modal>


      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  loadingContainer: {
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
  errorText: {
    color: '#ffffff',
    fontSize: '1.2rem',
  },
  profileHeader: {
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: '700',
    color: '#ffffff',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  },
  userName: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  userSubtitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '16px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    height: '100%',
  },
  statIcon: {
    marginBottom: '15px',
  },
  statNumber: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '3rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '5px',
  },
  statLabel: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  section: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  badgesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
    
  },
  badge: {
    background: 'rgba(26, 31, 46, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    border: '2px solid',
    transition: 'all 0.3s ease',
  },
  badgeIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    fontSize: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  badgeName: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  chartCard: {
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  chartTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  genresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  genreItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  genreInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  genreRank: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#667eea',
    minWidth: '32px',
  },
  genreName: {
    flex: 1,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  genreCount: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.6s ease',
  },
  summaryCard: {
    background: 'rgba(26, 31, 46, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  summaryNumber: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
};