import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'reactstrap';
import { AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar, AiOutlineLoading3Quarters } from "react-icons/ai";

import { addNewFavorites } from "../../utils/apicall.js";

export default function CardMovie({ movie }){

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const addFavorites = () => {
    //Save bookmark in database with the api call
    setLoading(true);
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    
        if (!email || !token) {
      alert('Por favor inicia sesión primero');
      setLoading(false);
      return;
    }

    if (!movie._id) {
      alert('Error: película no válida');
      setLoading(false);
      return;
    }

    console.log('Agregando película:', { email, movieId: movie._id });
    
    addNewFavorites(email, movie._id)
      .then((res) => {
        console.log('Película agregada exitosamente:', res);
        alert('¡Película agregada a favoritos!');
        navigate('/home/favorites');
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
        <h6 className="text-white">{movie.title}</h6>
        <p>
          <img src={movie.portada_url} alt="Poster" style={{ height: '350px' }} className="img-fluid" />
        </p>
        <p className="text-white">
          <AiTwotoneCalendar/> Cinema release: {movie.year}<br/>
          <AiFillSignal/> Popularity: {movie.imdb_rating}<br/>
          <AiFillAppstore/> Category:
          {Array.isArray(movie.genre) && movie.genre.map((cat, idx) => {
            return (<span key={`${cat}-${idx}`} className="text-white"> {cat} </span>);
          })}
        </p> 
        <table cellPadding="3">
          <tbody>
            <tr>
              <td><Link to={`/home/details/${movie._id}`}><Button color="danger"><AiFillEye/> Watch</Button></Link></td>
              <td><Button color="warning" onClick={addFavorites} disabled={loading}><AiOutlineStar/> {loading ? 'Adding...' : 'Add'}</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}