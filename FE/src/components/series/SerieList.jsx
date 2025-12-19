import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllSeries } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardSeries from "./CardSeries.jsx";
import SerieCarousel from "./SeriesCarousel.jsx";
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
            <SerieCarousel/>
          </Col>
        </Row>
        <p></p>
        
        <CardTitle className="text-center">

        </CardTitle>
        <Row>
          {series.map((serie, index) => {
            return (
              <Col key={serie.id || serie._id || serie.title || index} xs="12" sm="6" md="4" lg="3" className="mb-4 d-flex">
                <CardSeries serie={serie} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}