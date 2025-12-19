import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Row,
  Col,
  Container,
  Alert,
  Card,
  CardTitle,
  CardText,
  Button,
  Media,
} from "reactstrap";

import { jwtDecode } from "jwt-decode";

import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

import config from "../config.js";
import { googleSignIn } from "../utils/apicall.js";

import MyImgLogin from "../images/DISNEY.png";

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  padding: "24px",
  position: "relative",
  backgroundImage: `url(${MyImgLogin})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const googleCardStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  width: "min(360px, 90vw)",
};

export default function Login() {
  const [loginMessage, setLoginMessage] = useState(null);
  const googleBtnRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    if (email) {
      navigate("/movies");
    }
  }, null);


  const onSuccess = (res) => {
    const email = jwtDecode(res.credential).email;
    const name = jwtDecode(res.credential).name;
    
    // Llamar al backend para crear/obtener usuario y generar token
    googleSignIn(email, name)
      .then((response) => {
        // Guardar email, name y token en sessionStorage
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('token', response.token);
        
        setLoginMessage(null);
        navigate("/movies");
      })
      .catch((err) => {
        console.error('Google Sign-In error:', err);
        setLoginMessage(<Alert color="danger">Error en el login. Intenta de nuevo.</Alert>);
      });
  };

  const onError = () => {
    console.log("[Login Failed]");
    setLoginMessage(<Alert color="danger">Error en el login de Google.</Alert>);
  };

  return (
    <Container fluid style={wrapperStyle}>
      <div style={googleCardStyle}>
        <Card className="shadow" style={{ padding: 12 }}>
          <CardText className="text-center" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Button color="primary" onClick={() => googleBtnRef.current?.click()}>
              Iniciar sesión
            </Button>
            {/* <div style={{ display: "none" }}> */}
              <GoogleOAuthProvider clientId={config.clientID}>
                <GoogleLogin
                  text="continue_with"
                  shape="pill"
                  onSuccess={onSuccess}
                  onError={onError}
                  useOneTap
                  ref={googleBtnRef}
                />
              </GoogleOAuthProvider>
            {/* </div> */}
            {loginMessage}
          </CardText>
        </Card>
      </div>

      <Row className="w-100 justify-content-center align-items-center">
        <Col xs={11} sm={10} md={6} lg={4} xl={3}>
          <Card
            inverse
            body
            className="text-center shadow"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderColor: "transparent",
              backdropFilter: "blur(2px)",
            }}
          >
            <CardTitle tag="h5">Bienvenidos a Baúl Mágico</CardTitle>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}