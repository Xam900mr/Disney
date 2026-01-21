import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getMyWatchLater, deleteWatchLater } from '../utils/apicall';
import { AiFillDelete, AiFillPlayCircle } from 'react-icons/ai';
import Header from './Header.jsx';
import '../components/movies/CardMovie.css';

const VerTarde = () => {
  const [watchLaterItems, setWatchLaterItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const fetchWatchLater = async () => {
    try {
      setLoading(true);
      const data = await getMyWatchLater();
      setWatchLaterItems(data || []);
    } catch (err) {
      console.error('Error fetching watch later:', err);
      setError('Error al cargar la lista de "Ver más tarde"');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteWatchLater(id);
      setWatchLaterItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error removing from watch later:', err);
      alert('Error al eliminar de la lista');
    }
  };

  const handleViewDetails = (item) => {
    if (item.movie) {
      navigate(`/movies/details/${item.movie._id}`);
    } else if (item.series) {
      navigate(`/series/details/${item.series._id}`);
    }
  };

  
  if (loading) {
    return (
      <div style={styles.container}>
        <Row>
          <Col><Header/></Col>
        </Row>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Row>
        <Col><Header /></Col>
      </Row>
      <Container>
        <div style={styles.header}>
          <h1 style={styles.title}>Ver Más Tarde</h1>
          <p style={styles.subtitle}>
            {watchLaterItems.length > 0 
              ? `${watchLaterItems.length} ${watchLaterItems.length === 1 ? 'título guardado' : 'títulos guardados'}`
              : 'Tu lista está vacía'
            }
          </p>
        </div>
        
        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}
        
        {watchLaterItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📺</div>
            <p style={styles.emptyText}>No tienes nada en tu lista de "Ver más tarde"</p>
            <button 
              style={styles.exploreButton}
              onClick={() => navigate('/movies')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(193, 80, 192, 0.6), 0 6px 15px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(193, 80, 192, 0.5), 0 4px 10px rgba(0, 0, 0, 0.2)';
              }}
            >
              <AiFillPlayCircle style={{ fontSize: '1.5rem', marginRight: '10px' }} />
              Explorar películas
            </button>
          </div>
        ) : (
          <Row>
            {watchLaterItems.map((item) => {
              const content = item.movie || item.series;
              const isMovie = !!item.movie;
              const isHovered = hoveredCard === item._id;
              
              return (
                <Col lg="3" md="4" sm="6" xs="12" key={item._id} className="mb-4">
                  <div 
                    style={{
                      ...styles.card,
                      ...(isHovered ? styles.cardHovered : {})
                    }}
                    onMouseEnter={() => setHoveredCard(item._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleViewDetails(item)}
                  >
                    <div style={styles.imageContainer}>
                      <div style={styles.badge}>
                        {isMovie ? 'Película' : 'Serie'}
                      </div>
                      <img
        
                        src={content.portada_url || 'https://via.placeholder.com/300x450?text=No+Image'}
                        alt={content.title}
                        style={{
                          ...styles.image,
                          ...(isHovered ? styles.imageHovered : {})
                        }}
                      />
                      <div style={{
                        ...styles.overlay,
                        ...(isHovered ? styles.overlayVisible : {})
                      }}>
                        <AiFillPlayCircle style={styles.playIcon} />
                      </div>
                    </div>
                    
                    <div style={styles.cardContent}>
                      <h5 style={styles.cardTitle} title={content.title}>
                        {content.title}
                      </h5>
                      <p style={styles.cardType}>
                        Añadido el {new Date(item.added_at).toLocaleDateString('es-ES')}
                      </p>
                      
                      <button
                        style={{
                          ...styles.deleteButton,
                          ...(isHovered ? styles.deleteButtonHover : {})
                        }}
                        onClick={(e) => handleRemove(item._id, e)}
                      >
                        <AiFillDelete style={styles.deleteIcon} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};
const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      paddingTop: '0px',
      paddingBottom: '60px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
      letterSpacing: '1px',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1.1rem',
      fontWeight: '400',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60vh',
    },
    spinner: {
      width: '60px',
      height: '60px',
      border: '4px solid rgba(255, 255, 255, 0.1)',
      borderTop: '4px solid #C850C0',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    emptyState: {
      textAlign: 'center',
      marginTop: '100px',
      padding: '40px',
    },
    emptyIcon: {
      fontSize: '5rem',
      color: 'rgba(255, 255, 255, 0.3)',
      marginBottom: '20px',
    },
    emptyText: {
      fontSize: '1.4rem',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '30px',
      fontWeight: '500',
    },
    exploreButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '18px 36px',
      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
      border: 'none',
      borderRadius: '50px',
      color: '#ffffff',
      fontSize: '1.05rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 25px rgba(193, 80, 192, 0.5), 0 4px 10px rgba(0, 0, 0, 0.2)',
      letterSpacing: '0.5px',
    },
    card: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
    },
    cardHovered: {
      transform: 'translateY(-10px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(193, 80, 192, 0.4), 0 10px 20px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(193, 80, 192, 0.5)',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '350px',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s ease',
    },
    imageHovered: {
      transform: 'scale(1.1)',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayVisible: {
      opacity: 1,
    },
    playIcon: {
      fontSize: '4rem',
      color: '#fff',
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
    },
    badge: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(193, 80, 192, 0.6)',
      letterSpacing: '0.5px',
      zIndex: 2,
    },
    cardContent: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    cardTitle: {
      color: '#fff',
      marginBottom: '10px',
      fontSize: '1.3rem',
      fontWeight: '700',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      letterSpacing: '0.3px',
    },
    cardType: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.9rem',
      marginBottom: '15px',
      fontWeight: '500',
    },
    deleteButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, rgba(255, 75, 75, 0.2) 0%, rgba(255, 0, 0, 0.3) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 75, 75, 0.4)',
      borderRadius: '50px',
      color: '#fff',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: 'auto',
      width: '100%',
      letterSpacing: '0.3px',
    },
    deleteButtonHover: {
      background: 'linear-gradient(135deg, rgba(255, 75, 75, 0.4) 0%, rgba(255, 0, 0, 0.5) 100%)',
      border: '2px solid rgba(255, 75, 75, 0.7)',
      transform: 'scale(1.05)',
    },
    deleteIcon: {
      fontSize: '1.2rem',
      marginRight: '8px',
    },
    errorAlert: {
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(255, 75, 75, 0.2) 0%, rgba(255, 0, 0, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 75, 75, 0.4)',
      borderRadius: '20px',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '30px',
    },
  };


export default VerTarde;