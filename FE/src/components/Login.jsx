import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Row,
  Col,
  Container,
  Alert,
  Card,
  CardTitle,
  CardText,
  Media,
} from "reactstrap";

import { jwtDecode } from "jwt-decode";

import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

import config from "../config.js";
import { googleSignIn } from "../utils/apicall.js";

import MyImgLogin from "../images/background_mernflixdark.png";

var imgStyle = {
  width: "100%",
  height: "100%",
};

export default function Login() {
  const [loginMessage, setLoginMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    if (email) {
      navigate("/home");
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
    <Container>
      <Row>
        <Col>
          <Card
            inverse
            body
            className="text-center"
            style={{ backgroundColor: "#000", borderColor: "#000" }}
          >
            <CardTitle tag="h5">Welcome to MERNFlix</CardTitle>
            <CardText>React-based web project"</CardText>
            <CardText>
            <GoogleOAuthProvider clientId={config.clientID}>
              <GoogleLogin
                  auto_select
                  onSuccess={onSuccess}
                  onError={onError}
                  useOneTap
              />
            </GoogleOAuthProvider>
              {loginMessage}
            </CardText>
            <Media style={imgStyle} object src={MyImgLogin} alt="Login" />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}