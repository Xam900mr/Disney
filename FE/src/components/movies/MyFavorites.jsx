import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Container, Badge, CardTitle, Table, Button } from 'reactstrap';
import { AiFillEye, AiOutlineDelete } from "react-icons/ai";

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

export default function MyMovieList(){

    const [favorites, setFavorites] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
  
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

    const totalPages = favorites ? Math.ceil(favorites.length / ITEMS_PER_PAGE) : 1;
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

    const goToPage = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    //Deleting selected bookmark
    const deleteSelFavorite = (favorite) => {
    deleteFavorites(favorite._id)
      .then((res) => getFavorites())
      .catch((err) => {
        console.error('Delete favorite error', err);
      });
    }

    const favoriteRender = (favorite) => {
        if (!favorite) return null;

        if (favorite.movie) {
            const m = favorite.movie;
            return (
                <Row className="justify-content-center">
                  <Col>
                    <div className="card" style={{ backgroundColor: '#8e9aaf' }}>
                      <div className="card-body">
                          <Row>
                            <Col xs="2"><img src={m.portada_url} alt="Poster" style={{ height: '150px' }} className="img-fluid"/></Col>
                            <Col xs="8" className="text-white">
                                      <h6 className="text-white">{m.title}</h6>
                                      <span style={{ color: '#a4c3b2' }}>Added to bookmarks: {getDateInStrFormat(new Date(favorite.added_at))}</span><br/>
                                      Year: {m.year}<br/>
                                      Director: {m.director}<br/>
                                      Popularity: {m.imdb_rating}<br/>
                                      Plot: {m.plot}
                            </Col>
                            <Col xs="2">
                                      <table cellPadding="3">
                                        <tbody>
                                          <tr>
                                            <td><Link to={`/movies/details/${m._id}`}><Button color="danger"><AiFillEye/> Watch</Button></Link></td>
                                            <td><Button color="secondary" onClick={() => deleteSelFavorite(favorite)}><AiOutlineDelete/> Remove</Button></td>
                                          </tr>
                                        </tbody>
                                      </table>
                            </Col>
                          </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
            );
        }

        if (favorite.series) {
            const s = favorite.series;
            return (
                <Row className="justify-content-center">
                  <Col>
                    <div className="card" style={{ backgroundColor: '#8e9aaf' }}>
                      <div className="card-body">
                          <Row>
                            <Col xs="2"><img src={s.portada_url} alt="Poster" style={{ height: '150px' }} className="img-fluid"/></Col>
                            <Col xs="8" className="text-white">
                                      <h6 className="text-white">{s.title}</h6>
                                      <span style={{ color: '#a4c3b2' }}>Added to bookmarks: {getDateInStrFormat(new Date(favorite.added_at))}</span><br/>
                                      Years: {s.year_start} - {(s.year_end && s.year_end !== 0) ? s.year_end : 'En emision'}<br/>
                                      Popularity: {s.imdb_rating}<br/>
                                      Plot: {s.plot}
                            </Col>
                            <Col xs="2">
                                      <table cellPadding="3">
                                        <tbody>
                                          <tr>
                                            <td><Link to={`/series/details/${s._id}`}><Button color="danger"><AiFillEye/> Watch</Button></Link></td>
                                            <td><Button color="secondary" onClick={() => deleteSelFavorite(favorite)}><AiOutlineDelete/> Remove</Button></td>
                                          </tr>
                                        </tbody>
                                      </table>
                            </Col>
                          </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
            );
        }

        return null;
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
        <br/>
        <Container>
            <Table>
              <tbody>
                {currentFavorites.map((favorite, idx) => {
                  return (
                    <React.Fragment key={favorite._id || (favorite.movie && favorite.movie._id) || (favorite.series && favorite.series._id) || idx}>
                      {favoriteRender(favorite)}
                    </React.Fragment>
                  )
                })}            
              </tbody>
            </Table>

            {/* Paginación */}
            <Row>
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