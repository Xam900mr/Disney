import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllMovies } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardMovie from "./CardMovies.jsx";
import MovieCarousel from "./MovieCarouselCustom.jsx";

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
    <div>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Row>
        <h1 className="text-white">Loading...</h1>
      </Row>
    </div>
  ) : (
    <div>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Container>
        <Row>
          <Col>
            <MovieCarousel />
          </Col>
        </Row>
        
        <CardTitle className="text-center">
          <Badge pill color="dark">
            Total movies found: {movies.length}
          </Badge>
        </CardTitle>
        <Row>
          {movies.map((movie, index) => {
            return (
              <Col key={movie.id || movie._id || movie.title || index} xs="12" sm="6" md="4" lg="3">
                <CardMovie movie={movie} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}