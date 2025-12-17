import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'reactstrap';
import { AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar, AiOutlineLoading3Quarters } from "react-icons/ai";

import { addNewFavorites } from "../../utils/apicall.js";

export default function CardSeries({ serie }){

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const addFavorites = () => {
    setLoading(true);
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    
        if (!email || !token) {
      alert('Por favor inicia sesión primero');
      setLoading(false);
      return;
    }

    if (!serie._id) {
      alert('Error: serie no válida');
      setLoading(false);
      return;
    }

    console.log('Agregando serie:', { email, serieId: serie._id });
    
    addNewFavorites(email, null, serie._id)
      .then((res) => {
        console.log('Serie agregada exitosamente:', res);
        alert('¡Serie agregada a favoritos!');
        navigate('/favorites');
      })
      .catch((err) => {
        console.error('Error al agregar favorito:', err);
        const errorMsg = err.response?.data?.error || err.message || 'Error desconocido';
        alert('Error al agregar a favoritos: ' + errorMsg);
        setLoading(false);
      });
  }

  return(
    <div className="card" style={{ width: '18rem', backgroundColor: 'black' }}>
      <div className="card-body">
        <h6 className="text-white">{serie.title}</h6>
        <p>
          <img src={serie.portada_url} alt="Poster" style={{ height: '350px' }} className="img-fluid" />
        </p>
        <p className="text-white">
          <AiTwotoneCalendar/> Release: {serie.year}<br/>
          <AiFillSignal/> Popularity: {serie.imdb_rating}<br/>
          <AiFillAppstore/> Category:
          {Array.isArray(serie.genre) && serie.genre.map((cat, idx) => {
            return (<span key={`${cat}-${idx}`} className="text-white"> {cat} </span>);
          })}
        </p> 
        <table cellPadding="3">
          <tbody>
            <tr>
              <td><Link to={`/series/details/${serie._id}`}><Button color="danger"><AiFillEye/> Watch</Button></Link></td>
              <td><Button color="warning" onClick={addFavorites} disabled={loading}><AiOutlineStar/> {loading ? 'Adding...' : 'Add'}</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}