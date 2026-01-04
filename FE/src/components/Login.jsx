import React, { useEffect, useState } from "react";
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
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";

import config from "../config.js";
import { googleSignIn, loginUser, registerUser } from "../utils/apicall.js";
import MyImgLogin from "../images/fondoLogin.png";

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
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(50px)",
};

// ============================================
// COMPONENTE INTERNO CON ACCESO AL PROVIDER
// ============================================
function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(!location.state?.isRegister);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    /*confirmPassword: "",*/
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
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

    /*if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "danger",
        text: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }*/

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
            /*confirmPassword: "",*/
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

  // AHORA googleLogin ESTÁ DENTRO DEL PROVIDER
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // 1. Obtener info del usuario con el access_token
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;
        
        // 2. Enviar al backend
        const response = await googleSignIn(userInfo.email, userInfo.name);

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
    },
    onError: () => {
      setMessage({
        type: "danger",
        text: "Error al iniciar sesión con Google",
      });
    }
  });

  const resetForm = () => {
    setMessage(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      /*confirmPassword: "",*/
      firstname: "",
      lastname: "",
    });
  };

  return (
    <div style={wrapperStyle}>
      <Card style={cardStyle} className="p-4">
        <CardTitle tag="h3" className="text-center mb-4">
          🏰 Disney App
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
              <Label for="username">Nombre de usuario</Label>
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
              <div style={{ position: "relative" }}>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "25px",
                    color: "#666",
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? "🙉" : "🙈"}
                </button>
              </div>
            </FormGroup>

            <Button style={{
                  backgroundColor: "#6366f1",
                  color: "white",
                  border: "1px solid #0957f2ff",
                  borderRadius: "20px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  height: "40px",
                  marginTop: "30px"
                }} block className="mb-3" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center my-4" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
              <div style={{ flex: 1, height: "4px", backgroundColor: "#fff", borderRadius: "2px"}}></div>
              <small style={{ color: "#fff" }}>O</small>
              <div style={{ flex: 1, height: "4px", backgroundColor: "#fff", borderRadius: "2px" }}></div>
            </div>

            <div className="mb-3 d-flex justify-content-center">
              <Button
                block
                disabled={loading}
                onClick={() => googleLogin()}
                style={{
                  backgroundColor: "white",
                  color: "#5f6368",
                  border: "1px solid #dadce0",
                  borderRadius: "20px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  height: "40px"
                }}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: "18px", height: "18px" }}
                />
                Google
              </Button>
            </div>

            <CardText className="text-center" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              ¿No tienes cuenta?{" "}
              <Button
                color="link"
                onClick={() => {
                  setIsLogin(false);
                  resetForm();
                }}
                style={{ padding: 0, color: "#fff", fontWeight: "700", textDecoration: "none", marginLeft: "5px", fontSize: "18px", height: "auto", lineHeight: "1" }}
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
              <Label for="reg-username">Nombre de usuario</Label>
              <Input
                type="text"
                name="username"
                id="reg-username"
                placeholder="Elige un nombre de usuario"
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
                type={showPassword ? "text" : "password"}
                name="password"
                id="reg-password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </FormGroup>

            <Button 
            style={{
                  backgroundColor: "#6366f1",
                  color: "white",
                  border: "1px solid #0957f2ff",
                  borderRadius: "20px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  height: "40px",
                  marginTop: "30px"
                }}
            color="success" block className="mb-3" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <CardText className="text-center" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              ¿Ya tienes cuenta?
              <Button
                color="link"
                onClick={() => {
                  setIsLogin(true);
                  resetForm();
                }}
                style={{ padding: 0, color: "white", fontWeight: "700", textDecoration: "none", marginLeft: "5px", fontSize: "18px", height: "auto", lineHeight: "1" }}
              >
                Inicia sesión aquí
              </Button>
            </CardText>
          </Form>
        )}

        <CardText style={{ color: "#fff" }} className="text-center small mt-4">
          © 2026 Disney App. All rights reserved.
        </CardText>
      </Card>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL CON PROVIDER
// ============================================
export default function Login() {
  return (
    <GoogleOAuthProvider clientId={config.clientID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}