import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'reactstrap';
import { AiFillEye, AiFillSignal, AiFillAppstore, AiTwotoneCalendar, AiOutlineStar } from "react-icons/ai";

import { addNewBookmark } from "../../utils/apicall.js";

export default function CardMovie({ movie }){

  const navigate = useNavigate();

  const addBookmark = () => {
    //Save bookmark in database with the api call
    addNewBookmark(sessionStorage.getItem('email'), movie)
      .then((res) => navigate('/home/bookmarks'))
      .catch((err) => {
        console.error('Bookmark error', err);
      });
  }

  return(
    <div className="card" style={{ width: '18rem', backgroundColor: 'black' }}>
      <div className="card-body">
        <h6 className="text-white">{movie.title}</h6>
        <p>
          <img src={"https://m.media-amazon.com/images/I/713VJ-dHN9L._AC_UF350,350_QL80_.jpg"} alt="Poster" style={{ height: '350px' }} className="img-fluid" />
        </p>
        <p className="text-white">
          <AiTwotoneCalendar/> Cinema release: {movie.year}<br/>
          <AiFillSignal/> Popularity: {movie.imdbRating}<br/>
          <AiFillAppstore/> Category:
          {Array.isArray(movie.category) && movie.category.map((cat, idx) => {
            return (<span key={`${cat}-${idx}`} className="text-white"> {cat} </span>);
          })}
        </p> 
        <table cellPadding="3">
          <tbody>
            <tr>
              <td><Link to={`/home/details/${movie._id}`}><Button color="danger"><AiFillEye/> Watch</Button></Link></td>
              <td><Button color="warning" onClick={addBookmark}><AiOutlineStar/> Add</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}