import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Alert,
  Card,
  CardTitle,
  CardText,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import { jwtDecode } from "jwt-decode";

import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

import config from "../config.js";
import { googleSignIn, loginUser, registerUser } from "../utils/apicall.js";

import MyImgLogin from "../images/DISNEY.png";

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  position: "relative",
  backgroundImage: `url(${MyImgLogin})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const cardStyle = {
  width: "100%",
  maxWidth: "450px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
};

export default function Login() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isRegister);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/movies");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await loginUser(formData.username, formData.password);
      
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("name", response.user.name);
        localStorage.setItem("username", response.user.username);
        setMessage({
          type: "success",
          text: "¡Inicio de sesión exitoso!",
        });
        setTimeout(() => {
          navigate("/movies");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: "danger",
        text: error.response?.data || "Error al iniciar sesión",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "danger",
        text: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({
        type: "danger",
        text: "La contraseña debe tener al menos 6 caracteres",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
      });

      if (response) {
        setMessage({
          type: "success",
          text: "¡Cuenta creada exitosamente! Por favor, inicia sesión.",
        });
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: "",
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Error al crear la cuenta",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await googleSignIn(decoded.email, decoded.name);

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("name", response.user.name);
        localStorage.setItem("username", response.user.email);
        setMessage({
          type: "success",
          text: `¡Bienvenido ${response.user.name}!`,
        });
        setTimeout(() => {
          navigate("/movies");
        }, 1000);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage({
        type: "danger",
        text: "Error al iniciar sesión con Google",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    setMessage({
      type: "danger",
      text: "Error al iniciar sesión con Google",
    });
  };

  return (
    <GoogleOAuthProvider clientId={config.clientID}>
      <div style={wrapperStyle}>
        <Card style={cardStyle} className="p-4">
          <CardTitle tag="h3" className="text-center mb-4">
            🎬 Disney App
          </CardTitle>

          {message && (
            <Alert color={message.type} className="mb-3">
              {message.text}
            </Alert>
          )}

          {isLogin ? (
            // LOGIN FORM
            <Form onSubmit={handleLoginSubmit}>
              <FormGroup>
                <Label for="username">Usuario</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Ingresa tu usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="password">Contraseña</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <Button
                color="primary"
                block
                className="mb-3"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center my-3">
                <small className="text-muted">O</small>
              </div>

              <div className="mb-3 d-flex justify-content-center">
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    text="signin"
                    size="large"
                  />
                </div>
              </div>

              <CardText className="text-center">
                ¿No tienes cuenta?{" "}
                <Button
                  color="link"
                  onClick={() => {
                    setIsLogin(false);
                    setMessage(null);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      firstname: "",
                      lastname: "",
                    });
                  }}
                  style={{ padding: 0 }}
                >
                  Créate una
                </Button>
              </CardText>
            </Form>
          ) : (
            // REGISTER FORM
            <Form onSubmit={handleRegisterSubmit}>
              <FormGroup>
                <Label for="firstname">Nombre</Label>
                <Input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="Tu nombre"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="lastname">Apellido</Label>
                <Input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="Tu apellido"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="reg-username">Usuario</Label>
                <Input
                  type="text"
                  name="username"
                  id="reg-username"
                  placeholder="Elige un usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="reg-email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="reg-email"
                  placeholder="Tu correo electrónico"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="reg-password">Contraseña</Label>
                <Input
                  type="password"
                  name="password"
                  id="reg-password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </FormGroup>

              <Button
                color="success"
                block
                className="mb-3"
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <CardText className="text-center">
                ¿Ya tienes cuenta?{" "}
                <Button
                  color="link"
                  onClick={() => {
                    setIsLogin(true);
                    setMessage(null);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      firstname: "",
                      lastname: "",
                    });
                  }}
                  style={{ padding: 0 }}
                >
                  Inicia sesión aquí
                </Button>
              </CardText>
            </Form>
          )}

          <CardText className="text-center text-muted small mt-4">
            © 2024 Disney App. All rights reserved.
          </CardText>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
