import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Container } from 'reactstrap';
import { AiOutlineArrowLeft, AiFillAppstore, AiFillVideoCamera, AiFillEdit, AiOutlineGlobal } from "react-icons/ai";

import Header from '../Header.jsx';
import { getSingleSerie } from "../../utils/apicall.js";

export default function ShowSerie(){

  const [serie, setSerie] = useState(null);

  const getSerie = (id) => {
    getSingleSerie(id)
      .then((serie) => {
        setSerie(serie);
      })
      .catch((err) => {
        console.error('Get single serie error', err);
      });
  }

  const { id } = useParams();

  useEffect(() =>{
    getSerie(id);
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

  const embedUrl = serie ? getYouTubeEmbedUrl(serie.trailer_url) : null;

  return serie === null ? (
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
            <h4 className="text-black">{serie.title} </h4>
            <Link to={`/series`}><Button color="danger"><AiOutlineArrowLeft/> Back</Button></Link>
            <p className="text-black"><AiFillAppstore/> Category:
              {Array.isArray(serie.genre) && serie.genre.map((cat, idx) => {
                return (<span key={`${cat}-${idx}`} className="text-black"> {cat} </span>);
              })}
            </p>
            <div className="video-responsive">
              {embedUrl ? (
                <iframe
                  width="100%"
                  height="650"
                  src={embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              ) : (
                <div className="text-black">Trailer no disponible. <a href={serie.trailer_url} target="_blank" rel="noopener noreferrer">Abrir en YouTube</a></div>
              )}
            </div>
            <p className="text-black">
              <AiFillEdit/> Plot: {serie.plot}<br/>
              <AiFillVideoCamera/> Director: {serie.director}<br/>
              <AiOutlineGlobal/>Country: {serie.country}
            </p>
          </div>
        </Col>
      </Row>
      </Container>
    </div>
  );
}