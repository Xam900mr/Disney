import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Row, Col, Button } from 'reactstrap';
import { AiOutlineArrowLeft, AiFillAppstore, AiFillVideoCamera, AiFillEdit, AiOutlineGlobal } from "react-icons/ai";

import Header from '../Header.jsx';
import { getSingleMovie } from "../../utils/apicall.js";

export default function ShowMovie(){

  const [movie, setMovie] = useState(null);

  const getMovie = (id) => {
    getSingleMovie(id)
      .then((movie) => {
        setMovie(movie);
      })
      .catch((err) => {
        console.error('Get single movie error', err);
      });
  }

  const { id } = useParams();

  useEffect(() =>{
    getMovie(id);
  },[id]);

  return movie === null ? 
    (<div>
      <Row>
        <Col>
          <Header/>
        </Col>
      </Row>
      <Row><h1 className="text-white">Loading...</h1></Row>
    </div>)
    : (
    <div>
    <Row><Col><Header /></Col></Row>
    <Row>
      <Col xs ="12" >
        <div className="card-body">
          <h4 className="text-black">{movie.title} </h4>
          <Link to={`/home`}><Button color="danger"><AiOutlineArrowLeft/> Back</Button></Link>
          <p className="text-black"><AiFillAppstore/> Category:
            {Array.isArray(movie.genre) && movie.genre.map((cat, idx) => {
              return (<span key={`${cat}-${idx}`} className="text-black"> {cat} </span>);
            })}
          </p>
          <div className="video-responsive">
            <iframe
              width="100%"
              height="650"
              src={movie.trailer_url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
          <p className="text-black">
            <AiFillEdit/> Plot: {movie.plot}<br/>
            <AiFillVideoCamera/> Director: {movie.director}<br/>
            <AiOutlineGlobal/>Country: {movie.country}
          </p> 
        </div>
      </Col>
    </Row>
  </div>
  );
}