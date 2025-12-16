import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Row, Col, Button } from 'reactstrap';
import { AiOutlineArrowLeft, AiFillAppstore, AiFillVideoCamera, AiFillEdit, AiOutlineGlobal } from "react-icons/ai";

import Header from '../Header.jsx';
import { getSingleCharacter } from "../../utils/apicall.js";

export default function ShowCharacter(){

  const [character, setCharacter] = useState(null);

  const getCharacter = (id) => {
    getSingleCharacter(id).then((character) => {
      setCharacter(character);
    });
  }

  const { id } = useParams();

  useEffect(() =>{
    getCharacter(id);
  },[id]);

  return character === null ? 
    (<div>
      <Row>
        <Col>
          <Header/>
        </Col>
      </Row>
      <Row><h1 class="text-white">Loading...</h1></Row>
    </div>)
    : (
    <div>
    <Row><Col><Header /></Col></Row>
    <Row>
      <Col xs ="12" >
        <div className="card-body">
          <h4 className="text-white">{character.name} </h4>
          <Link to={`/home`}><Button color="danger"><AiOutlineArrowLeft/> Back</Button></Link>
          <p className="text-white"><AiFillAppstore/> Category: 
            {character.movies.map((cat) => {
              return (<span className="text-white"> {cat} </span>);
            })}
          </p>
          <div className="video-responsive">
            <iframe
              width="100%"
              height="650"
              src={`https://www.youtube.com/embed/${character.trailer}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
          <p className="text-white">
            <AiFillEdit/> Plot: {character.plot}<br/>
            <AiFillVideoCamera/> Director: {character.director}<br/>
            <AiOutlineGlobal/>Country: {character.country}
          </p> 
        </div>
      </Col>
    </Row>
  </div>
  );
}