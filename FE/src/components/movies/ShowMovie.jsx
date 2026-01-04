import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Container } from 'reactstrap';
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
  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname.includes('youtu.be')) {
        const id = parsed.pathname.split('/').filter(Boolean).pop();
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (hostname.includes('youtube.com')) {
        if (parsed.pathname.includes('/embed/')) return url;
        const params = new URLSearchParams(parsed.search);
        const v = params.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
        const parts = parsed.pathname.split('/').filter(Boolean);
        const vIndex = parts.indexOf('v');
        if (vIndex !== -1 && parts[vIndex + 1]) return `https://www.youtube.com/embed/${parts[vIndex + 1]}`;
      }
      return null;
    } catch (e) {
      const maybeId = url.trim();
      if (/^[A-Za-z0-9_-]{11}$/.test(maybeId)) return `https://www.youtube.com/embed/${maybeId}`;
      return null;
    }
  };

  const embedUrl = movie ? getYouTubeEmbedUrl(movie.trailer_url) : null;

  return movie === null ? (
    <div>
      <Row>
        <Col>
          <Header/>
        </Col>
      </Row>
      <Row><h1 className="text-white">Loading...</h1></Row>
    </div>
  ) : (
    <div>
      <Row><Col><Header /></Col></Row>
      <Container>
      <Row>
        <Col xs ="12" >
          <div className="card-body">
            <h4 className="text-black">{movie.title} </h4>
            <Link to={`/movies`}><Button color="danger"><AiOutlineArrowLeft/> Back</Button></Link>
            <p > {movie.tagline}    </p>
            <div className="video-responsive">
              {embedUrl ? (
                <iframe
                  width="100%"
                  height="650"
                  src={embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              ) : (
                <div className="text-black">Trailer no disponible. <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">Abrir en YouTube</a></div>
              )}
            </div>
            <p className="text-black">
              <AiFillEdit/> Trama: {movie.plot}<br/>
              <AiFillVideoCamera/> Director: {movie.director}<br/>
              <AiOutlineGlobal/>Pais de origen: {movie.country}
            </p>
          </div>
        </Col>
      </Row>
      </Container>
    </div>
  );
}