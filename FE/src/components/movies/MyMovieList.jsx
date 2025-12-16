import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Container, Badge, CardTitle, Table, Button } from 'reactstrap';
import { AiFillEye, AiOutlineDelete } from "react-icons/ai";

import { getMyBookmarks, deleteBookmark } from "../../utils/apicall.js";
import { getDateInStrFormat } from "../../utils/utils.js";

import Header from '../Header.jsx';

export default function MyMovieList(){

    const [bookmarks, setBookmarks] = useState(null);
  
    const getBookmarks = () => {
      getMyBookmarks(sessionStorage.getItem('email')).then((bookmarks) => {
        setBookmarks(bookmarks);
      });
    }
  
    useEffect(() =>{
      getBookmarks();
    },[]);

    //Deleting selected bookmark
    const deleteSelBookmark = (bookmark) => {
    deleteBookmark(bookmark._id)
      .then((res) => getBookmarks())
      .catch((err) => {
        console.error('Delete bookmark error', err);
      });
    }

    const bookmarkRender = (bookmark) => {
        if(bookmark!=null && bookmark.movie!=null){
        return <Row className="justify-content-center">
          <Col>    
            <div className="card" style={{ backgroundColor: 'black' }}>
              <div className="card-body">
                  <Row>
                    <Col xs="2"><img src={"https://m.media-amazon.com/images/I/713VJ-dHN9L._AC_UF350,350_QL80_.jpg"} alt="Poster" style={{ height: '150px' }} className="img-fluid"/></Col>
                    <Col xs="8" className="text-white">
                              <h6 className="text-white">{bookmark.movie.title}</h6>
                              <span style={{ color: '#F1C61A' }}>Added to bookmarks: {getDateInStrFormat(new Date(bookmark.addeddate))}</span><br/>
                              Year: {bookmark.movie.year}<br/>
                              Director: {bookmark.movie.director}<br/>
                              Popularity: {bookmark.movie.imdbRating}<br/>
                              Plot: {bookmark.movie.plot}
                    </Col>
                    <Col xs="2">
                              <table cellPadding="3">
                                <tbody>
                                  <tr>
                                    <td><Link to={`/home/details/${bookmark.movie._id}`}><Button color="danger"><AiFillEye/> Watch</Button></Link></td>
                                    <td><Button color="secondary" onClick={() => deleteSelBookmark(bookmark)}><AiOutlineDelete/> Remove</Button></td>
                                  </tr>
                                </tbody>
                              </table>
                    </Col>
                  </Row>
              </div>
            </div>
          </Col>
        </Row>
        
     
        }
        return null
    }
   
    return bookmarks === null ? 
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
        <Row>
          <Col>
            <Header/>
          </Col>
        </Row> 
        <Container>
          <CardTitle className="text-center"><Badge pill color="dark">Total bookmarks found: {bookmarks.length}</Badge></CardTitle>
            <Table dark>
              <tbody>
                {bookmarks.map((bookmark, idx) => {
                  return (
                    <React.Fragment key={bookmark._id || (bookmark.movie && bookmark.movie._id) || idx}>
                      {bookmarkRender(bookmark)}
                    </React.Fragment>
                  )
                })}            
              </tbody>
            </Table>
        </Container>
      </div>
    );       
  }