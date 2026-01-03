import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import {
  Container,
  Button,
} from "reactstrap";

import MyImgLogin from "../images/prueba.gif";
import BMlogo from "../images/BM.svg";

const wrapperStyle = {
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "flex-end",
  padding: "0",
  margin: "0",
  position: "relative",
  backgroundImage: `url(${MyImgLogin})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  overflow: "hidden",
};

// Recuadro negro que ocupa toda la altura y llega al borde derecho
const cardStyle = {
  position: "relative",
  width: "min(550px, 45vw)",
  height: "100vh",
  padding: "0 60px",
  margin: "0",
  background:"black",
  borderRadius: "0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "32px",
  boxSizing: "border-box",
  zIndex: 2,
  // Difuminado suave solo en el lado izquierdo
  boxShadow: `
    -150px 0 150px 80px rgba(0, 0, 0, 0.7),
    -80px 0 100px 50px rgba(0, 0, 0, 0.5)
  `,
};

// Gradiente adicional para mejor transición del lado izquierdo
const gradientOverlayStyle = {
  position: "absolute",
  top: 0,
  right: "min(550px, 45vw)",
  width: "250px",
  height: "100%",
  background: "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.8) 100%)",
  pointerEvents: "none",
  zIndex: 1,
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container fluid style={wrapperStyle}>
      {/* Gradiente de transición */}
      <div style={gradientOverlayStyle}></div>
      
      {/* Recuadro negro con contenido */}
      <div style={cardStyle} className="home-card-content">
        <div className="home-right-content">
          <div style={{
            display: "flex",
            justifyContent: "center",
            
          }}>
            <img 
              src={BMlogo} 
              alt="Baúl Mágico" 
              style={{
                width: "200px",
                height: "auto"
              }}
            />
          </div>
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            marginBottom: "24px",
            lineHeight: "1.1",
            color: "white",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)"
          }}>
            Ve películas y series
          </h2>
          <p style={{
            fontSize: "1.25rem",
            lineHeight: "1.6",
            color: "rgba(255, 255, 255, 0.95)",
            marginBottom: "0",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)"
          }}>
            Suscríbete a Baúl Mágico para ver películas y series populares, 
            incluidos títulos exclusivos de nuestro catálogo.
          </p>
        </div>

        <div className="home-button-group" style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <Button 
            className="home-button home-button-primary"
            style={{
              backgroundColor: "white",
              color: "#0F1111",
              fontWeight: "600",
              fontSize: "1.1rem",
              padding: "18px 30px",
              borderRadius: "8px",
              border: "none",
              transition: "all 0.3s ease"
            }}
            onClick={() => navigate('/login')}>
            ¿Eres cliente? Identifícate
          </Button>
          
          <div style={{
            textAlign: "center",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "500",
            margin: "4px 0"
          }}>
            o
          </div>
          
          <Button
            className="home-button home-button-secondary"
            style={{
              backgroundColor: "transparent",
              color: "white",
              fontWeight: "600",
              fontSize: "1.1rem",
              padding: "18px 30px",
              borderRadius: "8px",
              border: "2px solid white",
              transition: "all 0.3s ease"
            }}
            onClick={() => navigate('/login', { state: { isRegister: true } })}>
            Regístrate ahora
          </Button>
        </div>
      </div>
    </Container>
  );
}