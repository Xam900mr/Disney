import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import {AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar, AiFillStar, AiOutlineLoading3Quarters} from "react-icons/ai";

import {addNewFavorites, deleteFavorites, checkFavorite} from "../../utils/apicall.js";

import "../movies/CardMovie.css"; 

export default function CardSeries({ serie }) {

  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !serie?._id) return;

    checkFavorite(null, serie._id)
      .then(res => {
        setIsFav(res.exists);
        if (res.favoriteId) {
          setFavoriteId(res.favoriteId);
        }
      })
      .catch(err => console.error(err));
  }, [serie._id]);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('email');
      if (!isFav) {
        const res = await addNewFavorites(email, null, serie._id);
        setIsFav(true);
        setFavoriteId(res._id);
      } else {
        await deleteFavorites(favoriteId);
        setIsFav(false);
        setFavoriteId(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const finalizacion =
    serie?.year_end && serie.year_end !== 0
      ? serie.year_end
      : 'En emisión';

  return (
    <div className="card movie-card">
      <div className="card-body">

        <h6 className="text-white">{serie.title}</h6>

        <img
          src={serie.portada_url}
          alt="Poster"
          className="img-fluid movie-poster"
        />

        <p className="text-white mt-2">
          <AiTwotoneCalendar /> Lanzamiento: {serie.year_start}<br />
          <AiTwotoneCalendar /> Finalización: {finalizacion}<br />
          <AiFillSignal /> Popularidad: {serie.imdb_rating}<br />
          <AiFillAppstore /> Géneros:
          {Array.isArray(serie.genre) &&
            serie.genre.slice(0, 2).map((cat, idx) => (
              <span key={idx}> {cat}</span>
            ))}
          {serie.genre?.length > 2 && <span> ...</span>}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <Link to={`/series/details/${serie._id}`}>
            <Button color="danger">
              <AiFillEye /> Watch
            </Button>
          </Link>

          <Button
            className={`fav-btn ${isFav ? 'fav-active' : ''}`}
            onClick={toggleFavorite}
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="spin" />
            ) : isFav ? (
              <AiFillStar />
            ) : (
              <AiOutlineStar />
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
