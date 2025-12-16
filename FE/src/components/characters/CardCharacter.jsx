import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Media, Button } from 'reactstrap';
import { AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar } from "react-icons/ai";


export default function CardCharacter({ character }){

  const navigate = useNavigate();


  return(
    <div className="card" style={{ width: '18rem', backgroundColor: 'black' }}>
      <div className="card-body">
        <h6 className="text-white">{character.name}</h6>
        <p>
          <Media src={character.photo} alt="Photo" height="350px"/>
        </p>
        <p className="text-white">
          <AiTwotoneCalendar/> Año de Nacimiento: {character.birthday}<br/>
          <AiFillSignal/> Sexo: {character.sex}<br/>
          <AiFillAppstore/> Peliculas o serias: 
            {character.movies.map((cat) => {
              return (<span className="text-white"> {cat} </span>);
            })}
        </p> 
      </div>
    </div>
  );
}