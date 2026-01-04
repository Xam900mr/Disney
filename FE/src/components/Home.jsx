import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "reactstrap";
import "./Home.css";

import MyImgLogin from "../images/prueba.gif";
import BMlogo from "../images/BM.svg";

const dynamicStyles = {
  wrapper: {
    backgroundImage: `url(${MyImgLogin})`,
  },
};

const Logo = () => (
  <div className="home-logo-container">
    <img src={BMlogo} alt="Baúl Mágico" className="home-logo" />
  </div>
);

const ContentHeader = () => (
  <div className="home-content-header">
    <Logo />
    <h2 className="home-title">Ve películas y series</h2>
    <p className="home-description">
      Suscríbete a Baúl Mágico para ver películas y series populares,
      incluidos títulos exclusivos de nuestro catálogo.
    </p>
  </div>
);

const ActionButtons = ({ onLogin, onRegister }) => (
  <div className="home-button-group">
    <Button
      className="home-button home-button-primary"
      onClick={onLogin}>
      ¿Eres cliente? Identifícate
    </Button>

    <div className="home-divider">o</div>

    <Button
      className="home-button home-button-secondary"
      onClick={onRegister}>
      Regístrate ahora
    </Button>
  </div>
);


export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login', { state: { isRegister: true } });
  };

  return (
    <Container fluid className="home-wrapper" style={dynamicStyles.wrapper}>
      {/* Gradiente de transición */}
      <div className="home-gradient-overlay" aria-hidden="true" />

      {/* Recuadro negro con contenido */}
      <div className="home-card">
        <ContentHeader />
        <ActionButtons onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    </Container>
  );
}