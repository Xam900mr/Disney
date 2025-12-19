import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllCharacters_Movies } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardCharacter from "./CardCharacter.jsx";
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

export default function CharacterList() {
  const [characters, setCharacter] = useState(null);

  const getCharacter = () => {
    getAllCharacters_Movies().then((characters) => {
      setCharacter(characters);
    });
  };

  useEffect(() => {
    getCharacter();
  }, []);

  return characters === null ? (
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
        <Row>
          {characters.map((character, index) => {
            return (
              <Col key={character.id || character._id || character.personaje_nombre || index} xs="12" sm="6" md="4" lg="3" className="mb-4 d-flex">
                <CardCharacter character={character} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}