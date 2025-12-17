import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import { AiOutlineArrowLeft, AiFillAppstore, AiFillVideoCamera, AiFillEdit, AiOutlineGlobal } from "react-icons/ai";

import Header from '../Header.jsx';
import { getSingleCharacter_Serie, getSerieName } from "../../utils/apicall.js";

export default function ShowCharacter() {
  const [character, setCharacter] = useState(null);
  const [serieId, setSerieId] = useState(null);

  const { id } = useParams();

  // Obtener personaje
  const getCharacter = (id) => {
    getSingleCharacter_Serie(id).then((character) => {
      setCharacter(character);

      // Obtener ID de la serie usando el nombre
      if (character.serie_nombre) {
        getSerieName(character.serie_nombre)
          .then(data => setSerieId(data._id))
          .catch(err => console.error(err));
      }
    });
  };

  useEffect(() => {
    getCharacter(id);
  }, [id]);

  if (!character) {
    return (
      <div>
        <Row>
          <Col><Header /></Col>
        </Row>
        <Row>
          <Col className="text-center">
            <h1 className="text-white">Loading...</h1>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <Row>
        <Col><Header /></Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs="12" md="8" lg="6">
          <Card style={{ backgroundColor: '#1c1c1c', color: 'white' }} className="shadow">
            <CardBody className="text-center">
              <h3 className="mb-3">{character.personaje_nombre}</h3>

              <img
                src={character.personaje_foto_url}
                alt="Poster"
                style={{ height: '350px', borderRadius: '8px' }}
                className="img-fluid mb-3"
              />

              <p className="mb-2">
                <AiFillAppstore /> Serie:{" "}
                {serieId ? (
                  <Link
                    to={`/series/details/${serieId}`}
                    className="text-decoration-none text-info"
                  >
                    {character.serie_nombre}
                  </Link>
                ) : (
                  <span>{character.serie_nombre}</span>
                )}
              </p>

              <p className="mb-2"><AiFillEdit /> Descripción: {character.personaje_descripcion}</p>
              <p className="mb-2"><AiFillVideoCamera /> Edad: {character.personaje_edad}</p>
              <p className="mb-2"><AiOutlineGlobal /> Género: {character.personaje_genero}</p>
              <p className="mb-3"><AiFillEdit /> Actor: {character.actor_nombre}</p>

              <Link to={`/characters_series`}>
                <Button color="danger">
                  <AiOutlineArrowLeft /> Back
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
