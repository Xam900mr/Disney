import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, CardTitle } from "reactstrap";
import { getAllCharacters_Movies } from "../../utils/apicall.js";

import Header from "../Header.jsx";
import CardCharacter from "./CardCharacter.jsx";
import MyImgLogin from "../../images/micky.gif";
import MyImgFondo from "../../images/fondo.gif";

const bgStyle = {
  minHeight: "100vh",
  backgroundImage: `url(${MyImgFondo})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

export default function CharacterList() {
  const [characters, setCharacter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const getCharacter = () => {
    getAllCharacters_Movies().then((characters) => {
      setCharacter(characters);
    });
  };

  useEffect(() => {
    getCharacter();
  }, []);

  const totalPages = characters ? Math.ceil(characters.length / ITEMS_PER_PAGE) : 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCharacters = characters ? characters.slice(startIndex, endIndex) : [];

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return characters === null ? (
    <div style={bgStyle}>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Col xs="12" className="d-flex justify-content-center">
          <img
            src={MyImgLogin}
            alt="Cargando"
            style={{ width: 350, height: "auto" }}
          />
        </Col>
      </Row>  
    </div>
  ) : (
    <div style={bgStyle}>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Container>
        <Row>
          {currentCharacters.map((character, index) => {
            return (
              <Col key={character.id || character._id || character.personaje_nombre || index} xs="12" sm="6" md="4" lg="3" className="mb-4 d-flex">
                <CardCharacter character={character} />
              </Col>
            );
          })}
        </Row>

        {/* Paginación */}
        <Row>
          <Col className="d-flex justify-content-center align-items-center flex-wrap" style={{ gap: '12px', marginBottom: '40px' }}>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              style={{
                padding: '10px 16px',
                background: currentPage === 1 ? 'rgba(102, 126, 234, 0.3)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: currentPage === 1 ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              ← Anterior
            </button>

            {/* Números de página */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={page === '...'}
                  style={{
                    padding: '10px 14px',
                    minWidth: '40px',
                    background: currentPage === page 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: currentPage === page ? '2px solid #667eea' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: page === '...' ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentPage === page ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 16px',
                background: currentPage === totalPages ? 'rgba(102, 126, 234, 0.3)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: currentPage === totalPages ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              Siguiente →
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}