import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar } from "react-icons/ai";
import { getSerieName } from "../../utils/apicall";

export default function CardCharacter({ character }) {
  const [serieId, setSerieId] = useState(null);

  useEffect(() => {
    if (character.serie_nombre) {
      getSerieName(character.serie_nombre)
        .then(data => setSerieId(data._id))
        .catch(err => console.error(err));
    }
  }, [character.serie_nombre]);

  return (
    <div className="card" style={{ width: '18rem', backgroundColor: 'black' }}>
      <div className="card-body">
        <h6 className="text-white">{character.personaje_nombre}</h6>

        <img
          src={character.personaje_foto_url}
          alt="Poster"
          style={{ height: '350px' }}
          className="img-fluid mb-2"
        />

        <p className="text-white">
          <AiTwotoneCalendar /> Edad: {character.personaje_edad}<br />
          <AiFillSignal /> Sexo: {character.personaje_genero}<br />
          <AiFillAppstore /> Serie:{" "}
          {serieId ? (
            <Link to={`/series/details/${serieId}`} className="text-decoration-none text-white">
              {character.serie_nombre}
            </Link>
          ) : (
            <span>{character.serie_nombre}</span>
          )}
        </p>

        <div className="mt-2">
          <Link to={`/characters_series/details/${character._id}`}>
            <Button color="danger">
              <AiFillEye /> Mas información...
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
