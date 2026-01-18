import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getMyWatchLater, deleteWatchLater } from '../utils/apicall';
import '../components/movies/CardMovie.css';

const VerTarde = () => {
  const [watchLaterItems, setWatchLaterItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleRemove = async (id) => {
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
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner color="danger" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 style={{ color: '#ff5c5c', marginBottom: '30px' }}>Ver Más Tarde</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {watchLaterItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No tienes nada en tu lista de "Ver más tarde"</p>
          <Button 
            color="danger" 
            onClick={() => navigate('/movies')}
            style={{ marginTop: '20px' }}
          >
            Explorar películas
          </Button>
        </div>
      ) : (
        <Row>
          {watchLaterItems.map((item) => {
            const content = item.movie || item.series;
            const isMovie = !!item.movie;
            
            return (
              <Col md="3" sm="6" xs="12" key={item._id} className="mb-4">
                <div 
                  className="card-movie"
                  style={{
                    backgroundColor: '#222',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={content.image_url || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={content.title}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewDetails(item)}
                  />
                  <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h5 
                      style={{ 
                        color: '#fff', 
                        marginBottom: '10px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => handleViewDetails(item)}
                      title={content.title}
                    >
                      {content.title}
                    </h5>
                    <p style={{ color: '#bbb', fontSize: '12px', marginBottom: '10px' }}>
                      {isMovie ? 'Película' : 'Serie'}
                    </p>
                    <div style={{ marginTop: 'auto' }}>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleRemove(item._id)}
                        style={{ width: '100%', marginTop: '10px' }}
                      >
                        Eliminar de la lista
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default VerTarde;
