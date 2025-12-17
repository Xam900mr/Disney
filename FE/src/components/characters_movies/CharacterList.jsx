import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllCharacters_Series } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardCharacter from "./CardCharacter.jsx";

export default function CharacterList() {
  const [characters, setCharacter] = useState(null);

  const getCharacter = () => {
    getAllCharacters_Series().then((characters) => {
      setCharacter(characters);
    });
  };

  useEffect(() => {
    getCharacter();
  }, []);

  return characters === null ? (
    <div>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Row>
        <h1 className="text-black">Loading...</h1>
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
          {characters.map((character, index) => {
            return (
              <Col key={character.id || character._id || character.personaje_nombre || index} xs="12" sm="6" md="4" lg="3">
                <CardCharacter character={character} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}