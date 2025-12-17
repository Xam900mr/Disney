import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllSeries } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardSeries from "./CardSeries.jsx";
import MovieCarousel from "./MovieCarouselCustom.jsx";

export default function SeriesList() {
  const [series, setSeries] = useState(null);

  const getSeries = () => {
    getAllSeries().then((series) => {
      setSeries(series);
    });
  };

  useEffect(() => {
    getSeries();
  }, []);

  return series === null ? (
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

        </CardTitle>
        <Row>
          {series.map((series, index) => {
            return (
              <Col key={series.id || series._id || series.title || index} xs="12" sm="6" md="4" lg="3">
                <CardSeries series={series} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}