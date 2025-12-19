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
  
    const getFavorites = () => {
      getMyfavorites(sessionStorage.getItem('email'))
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
                {favorites.map((favorite, idx) => {
                  return (
                    <React.Fragment key={favorite._id || (favorite.movie && favorite.movie._id) || (favorite.series && favorite.series._id) || idx}>
                      {favoriteRender(favorite)}
                    </React.Fragment>
                  )
                })}            
              </tbody>
            </Table>
        </Container>
      </div>
    );       
  }