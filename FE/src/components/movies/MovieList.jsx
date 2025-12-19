import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllMovies } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardMovie from "./CardMovies.jsx";
import MovieCarousel from "./MovieCarousel.jsx";
import MyImgLogin from "../../images/micky.gif";
import MyImgFondo from "../../images/fondo.gif";

const bgStyle = {
  minHeight: "100vh",
  backgroundImage: `url(${MyImgFondo})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

export default function MovieList() {
  const [movies, setMovies] = useState(null);

  const getMovies = () => {
    getAllMovies().then((movies) => {
      setMovies(movies);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  return movies === null ? (
    <div style={bgStyle}>
      <Row>
        <Col>
          <Header />
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
    </div>
  ) : (
    <div style={bgStyle}>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Container>
        <p></p>
        <Row>
          <Col>
            <MovieCarousel />
          </Col>
        </Row>
        <p></p>        
        <CardTitle className="text-center">

        </CardTitle>
        <Row>
          {movies.map((movie, index) => {
            return (
              <Col key={movie.id || movie._id || movie.title || index} xs="12" sm="6" md="4" lg="3" className="mb-4 d-flex">
                <CardMovie movie={movie} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}