import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllCharacters } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardCharacter from "./CardCharacter.jsx";

export default function CharacterList() {
  const [characters, setCharacter] = useState(null);

  const getCharacter = () => {
    getAllCharacters().then((characters) => {
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
        <h1 class="text-white">Loading...</h1>
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
        <CardTitle tag="center">
          <Badge pill color="dark">
            Total characters found: {characters.length}
          </Badge>
        </CardTitle>
        <Row>
          {characters.map((character) => {
            return (
              <Col xs="12" sm="6" md="4" lg="3">
                <CardCharacter character={character} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}