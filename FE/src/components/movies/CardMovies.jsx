import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import {AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar, AiFillStar, AiOutlineLoading3Quarters} from "react-icons/ai";

import {addNewFavorites, deleteFavorites, checkFavorite} from "../../utils/apicall.js";

import "./CardMovie.css";

export default function CardMovie({ movie }) {

  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token || !movie?._id) return;

    checkFavorite(movie._id, null)
      .then(res => {
        setIsFav(res.exists);
        if (res.favoriteId) {
          setFavoriteId(res.favoriteId);
        }
      })
      .catch(err => console.error(err));
  }, [movie._id]);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (!isFav) {
        const res = await addNewFavorites(null, movie._id);
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

  return (
    <div className="card movie-card">
      <div className="card-body">

        <h6 className="text-white">{movie.title}</h6>

        <img
          src={movie.portada_url}
          alt="Poster"
          className="img-fluid movie-poster"
        />

        <p className="text-white mt-2">
          <AiTwotoneCalendar /> Lanzamiento: {movie.year}<br />
          <AiFillSignal /> Popularidad: {movie.imdb_rating}<br />
          <AiFillAppstore /> Géneros:
          {Array.isArray(movie.genre) &&
            movie.genre.slice(0, 2).map((cat, idx) => (
              <span key={idx}> {cat}</span>
            ))}
          {movie.genre?.length > 2 && <span> ...</span>}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <Link to={`/movies/details/${movie._id}`}>
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
