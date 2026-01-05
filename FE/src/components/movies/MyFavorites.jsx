import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Container, Button } from 'reactstrap';
import { AiFillEye, AiOutlineDelete, AiFillStar, AiTwotoneCalendar } from "react-icons/ai";

import { getMyfavorites, deleteFavorites } from "../../utils/apicall.js";
import { getDateInStrFormat } from "../../utils/utils.js";
import MyImgLogin from "../../images/micky.gif";

import Header from '../Header.jsx';
import MyImgFondo from "../../images/fondo.gif";

const bgStyle = {
  minHeight: "100vh",
  backgroundImage: `url(${MyImgFondo})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};
const ITEMS_PER_PAGE = 5;
export default function MyMovieList(){

    const [favorites, setFavorites] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const getFavorites = () => {
      const email = localStorage.getItem('email');
      if (!email) {
        console.error('No email found in localStorage');
        setFavorites([]);
        return;
      }
      
      getMyfavorites(email)
        .then((favorites) => {
          setFavorites(favorites);
        })
        .catch((err) => {
          console.error('Error loading favorites:', err);
          setFavorites([]);
        });
    }
  
    useEffect(() =>{
      getFavorites();
    },[]);

    // Calcular paginación solo si favorites no es null
    const totalPages = favorites ? Math.ceil(favorites.length / ITEMS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentFavorites = favorites ? favorites.slice(startIndex, endIndex) : [];

    const goToPrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const goToNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const goToPage = (pageNum) => {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Generar números de página a mostrar
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      
      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= maxPagesToShow; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    const deleteSelFavorite = (favorite) => {
      deleteFavorites(favorite._id)
        .then((res) => getFavorites())
        .catch((err) => {
          console.error('Delete favorite error', err);
        });
    }

    const favoriteRender = (favorite) => {
        if (!favorite) return null;

        const item = favorite.movie || favorite.series;
        if (!item) return null;

        const isMovie = !!favorite.movie;
        const detailsPath = isMovie ? `/movies/details/${item._id}` : `/series/details/${item._id}`;

        return (
          <div style={styles.card}>
            <div style={styles.favoriteTag}>
              <AiFillStar style={{ fontSize: '1.2rem', marginRight: '6px' }} />
              Favorito
            </div>

            <Row className="g-0 h-100">
              <Col xs="12" md="3" style={styles.posterCol}>
                <Link to={detailsPath}>
                  <div style={styles.posterContainer}>
                    <img src={item.portada_url} alt={item.title} style={styles.poster} />
                    <div style={styles.posterOverlay}>
                      <div style={styles.playIcon}>
                        <AiFillEye style={{ fontSize: '2rem' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>

              <Col xs="12" md="7" style={styles.contentCol}>
                <div style={styles.content}>
                  <h3 style={styles.title}>{item.title}</h3>
                  
                  <div style={styles.addedDate}>
                    <AiTwotoneCalendar style={{ marginRight: '6px' }} />
                    Añadido el {getDateInStrFormat(new Date(favorite.added_at))}
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Año:</span>
                      <span style={styles.infoValue}>
                        {isMovie ? item.year : `${item.year_start} - ${(item.year_end && item.year_end !== 0) ? item.year_end : 'En emisión'}`}
                      </span>
                    </div>
                    
                    {isMovie && item.director && (
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Director:</span>
                        <span style={styles.infoValue}>{item.director}</span>
                      </div>
                    )}
                    
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Rating:</span>
                      <span style={styles.ratingBadge}>⭐ {item.imdb_rating}</span>
                    </div>
                  </div>

                  <p style={styles.plot}>
                    {item.plot && item.plot.length > 200 
                      ? `${item.plot.substring(0, 200)}...` 
                      : item.plot}
                  </p>
                </div>
              </Col>

              <Col xs="12" md="2" style={styles.actionsCol}>
                <div style={styles.actions}>
                  <Link to={detailsPath} style={{ textDecoration: 'none', width: '100%' }}>
                    <button style={styles.watchButton}>
                      <AiFillEye style={{ fontSize: '1.2rem' }} />
                      <span style={{ marginLeft: '8px' }}>Ver</span>
                    </button>
                  </Link>
                  
                  <button 
                    style={styles.removeButton}
                    onClick={() => deleteSelFavorite(favorite)}
                  >
                    <AiOutlineDelete style={{ fontSize: '1.2rem' }} />
                    <span style={{ marginLeft: '8px' }}>Eliminar</span>
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        );
    }
   
    return favorites === null ? 
      (<div style={bgStyle}>
        <Row>
          <Col>
            <Header/>
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <Col xs="12" className="d-flex justify-content-center">
            <img
              src={MyImgLogin}
              alt="Cargando"
              style={{ width: 350, height: "auto" }}
            />
          </Col>
        </Row>
      </div>) 
      : (
      <div style={bgStyle}>
        <Row>
          <Col>
            <Header/>
          </Col>
        </Row> 
        
        <Container style={{ maxWidth: '1400px', padding: '40px 20px' }}>
          {/* Header de favoritos */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>
              <AiFillStar style={{ fontSize: '2.5rem', marginRight: '12px', color: '#FFD700' }} />
              Mis Favoritos
            </h1>
            <p style={styles.pageSubtitle}>
              {favorites.length === 0 
                ? 'No tienes favoritos guardados' 
                : `${favorites.length} ${favorites.length === 1 ? 'favorito guardado' : 'favoritos guardados'}`
              }
            </p>
          </div>

          {/* Lista de favoritos */}
          {favorites.length === 0 ? (
            <div style={styles.emptyState}>
              <AiFillStar style={{ fontSize: '5rem', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '20px' }} />
              <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>No hay favoritos aún</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Comienza a agregar tus películas y series favoritas</p>
            </div>
          ) : (
            <>
              <div style={styles.favoritesContainer}>
                {currentFavorites.map((favorite, idx) => {
                  return (
                    <React.Fragment key={favorite._id || (favorite.movie && favorite.movie._id) || (favorite.series && favorite.series._id) || idx}>
                      {favoriteRender(favorite)}
                    </React.Fragment>
                  )
                })}
              </div>
            </>
          )}
          {/* Paginación */}
            <Row style={{ marginTop: '40px' }}>
              <Col className="d-flex justify-content-center align-items-center flex-wrap" style={{ gap: '12px', marginBottom: '40px' }}>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  style={{
                    padding: '10px 16px',
                    background: currentPage === 1 ? 'rgba(102, 126, 234, 0.3)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentPage === 1 ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  ← Anterior
                </button>
    
                {/* Números de página */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && goToPage(page)}
                      disabled={page === '...'}
                      style={{
                        padding: '10px 14px',
                        minWidth: '40px',
                        background: currentPage === page 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: currentPage === page ? '2px solid #667eea' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: page === '...' ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: currentPage === page ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
    
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 16px',
                    background: currentPage === totalPages ? 'rgba(102, 126, 234, 0.3)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentPage === totalPages ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  Siguiente →
                </button>
              </Col>
            </Row>
        </Container>
      </div>
    );       
}

const styles = {
  pageHeader: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
  },
  pageTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '3rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
  },
  pageSubtitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  favoritesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  favoriteTag: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
  },
  posterCol: {
    padding: '20px',
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    height: '280px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  posterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  playIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1a1f2e',
  },
  contentCol: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  addedDate: {
    display: 'flex',
    alignItems: 'center',
    color: '#a8b3ff',
    fontSize: '0.9rem',
    marginBottom: '16px',
  },
  infoGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  ratingBadge: {
    padding: '4px 12px',
    background: 'rgba(255, 215, 0, 0.2)',
    border: '1px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '12px',
    color: '#FFD700',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  plot: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
  },
  actionsCol: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
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
  removeButton: {
    width: '100%',
    padding: '12px 20px',
    background: 'rgba(255, 87, 108, 0.2)',
    border: '2px solid rgba(255, 87, 108, 0.5)',
    borderRadius: '12px',
    color: '#ff576c',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'rgba(26, 31, 46, 0.8)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  pageButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  pageButtonDisabled: {
    background: 'rgba(102, 126, 234, 0.3)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  pageIndicator: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '10px 20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
};
// Agregar este <style> tag al final del return, antes del último </div>

<style>{`
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    border-color: rgba(102, 126, 234, 0.4);
  }

  .posterContainer:hover .poster {
    transform: scale(1.1);
  }

  .posterContainer:hover .posterOverlay {
    opacity: 1;
  }

  .watchButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .removeButton:hover {
    background: rgba(255, 87, 108, 0.3);
    border-color: rgba(255, 87, 108, 0.8);
    transform: translateY(-2px);
  }

  .pageButton:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  @media (max-width: 768px) {
    .pageTitle {
      font-size: 2rem !important;
    }
    
    .title {
      font-size: 1.4rem !important;
    }
    
    .posterContainer {
      height: 200px !important;
    }
  }
`}</style>