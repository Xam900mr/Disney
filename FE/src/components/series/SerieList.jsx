import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllSeries } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardSeries from "./CardSeries.jsx";
import SerieCarousel from "./SeriesCarousel.jsx";

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
          <p></p>
        <Row>
          <Col>
            <SerieCarousel/>
          </Col>
        </Row>
        <p></p>
        
        <CardTitle className="text-center">

        </CardTitle>
        <Row>
          {series.map((serie, index) => {
            return (
              <Col key={serie.id || serie._id || serie.title || index} xs="12" sm="6" md="4" lg="3">
                <CardSeries serie={serie} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}