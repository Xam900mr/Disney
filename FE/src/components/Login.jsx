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
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";

import config from "../config.js";
import { googleSignIn, loginUser, registerUser } from "../utils/apicall.js";
import MyImgLogin from "../images/fondoLogin.png";
import "./Home.css";

// ============================================
const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_DELAY = 1000;
const REGISTER_SUCCESS_DELAY = 1500;

const INITIAL_FORM_STATE = {
  username: "",
  email: "",
  password: "",
  firstname: "",
  lastname: "",
};

const MESSAGES = {
  loginSuccess: "¡Inicio de sesión exitoso!",
  registerSuccess: "¡Cuenta creada exitosamente! Por favor, inicia sesión.",
  passwordTooShort: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
  loginError: "Error al iniciar sesión",
  registerError: "Error al crear la cuenta",
  googleError: "Error al iniciar sesión con Google",
};

// ============================================
const dynamicStyles = {
  wrapper: {
    backgroundImage: `url(${MyImgLogin})`,
  },
};

// ============================================
const PasswordToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="login-password-toggle"
    tabIndex="-1"
    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    {show ? "🙉" : "🙈"}
  </button>
);

const Divider = ({ text = "O" }) => (
  <div className="login-divider">
    <div className="login-divider-line" />
    <small className="login-divider-text">{text}</small>
    <div className="login-divider-line" />
  </div>
);

const GoogleButton = ({ onClick, loading }) => (
  <Button
    block
    disabled={loading}
    onClick={onClick}
    className="login-google-button"
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      className="login-google-icon"
    />
    Google
  </Button>
);

// ============================================
function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(!location.state?.isRegister);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/movies");
    }
  }, [navigate]);

  // ============================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setMessage(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const saveUserSession = (response) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("name", response.user.name);
    const email = response.user.email || localStorage.getItem('email');
    if (email) {
      localStorage.setItem("email", email);
      console.log('Email guardado:', email);
    } else {
      console.error('Email no disponible en la respuesta:', response.user);
    }
    localStorage.setItem("username", response.user.username || response.user.email);
  };

  const showSuccessAndRedirect = (text, delay = REDIRECT_DELAY) => {
    setMessage({ type: "success", text });
    setTimeout(() => navigate("/movies"), delay);
  };

  // ============================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await loginUser(formData.username, formData.password);
      
      if (response?.token) {
        saveUserSession(response);
        showSuccessAndRedirect(MESSAGES.loginSuccess);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: "danger",
        text: error.response?.data || MESSAGES.loginError,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setMessage({ type: "danger", text: MESSAGES.passwordTooShort });
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
        setMessage({ type: "success", text: MESSAGES.registerSuccess });
        setTimeout(() => {
          setIsLogin(true);
          setFormData(INITIAL_FORM_STATE);
        }, REGISTER_SUCCESS_DELAY);
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage({
        type: "danger",
        text: error.response?.data?.message || MESSAGES.registerError,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const userInfo = userInfoResponse.data;
        const response = await googleSignIn(userInfo.email, userInfo.name);

        if (response?.token) {
          saveUserSession(response);
          showSuccessAndRedirect(`¡Bienvenido ${response.user.name}!`);
        }
      } catch (error) {
        console.error("Google login error:", error);
        setMessage({ type: "danger", text: MESSAGES.googleError });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setMessage({ type: "danger", text: MESSAGES.googleError });
    },
  });

  // ============================================
  return (
    <div className="login-wrapper" style={dynamicStyles.wrapper}>
      <Card className="login-card">
        <CardTitle tag="h3" className="login-title">
          🏰 Disney App
        </CardTitle>
        
        {message && (
          <Alert color={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}

        {isLogin ? (
          // ============================================
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
              <div className="login-password-container">
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
                <PasswordToggle 
                  show={showPassword} 
                  onToggle={() => setShowPassword(!showPassword)} 
                />
              </div>
            </FormGroup>

            <Button 
              className="login-submit-button" 
              block 
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <Divider />

            <GoogleButton onClick={() => googleLogin()} loading={loading} />

            <CardText className="login-toggle-text">
              ¿No tienes cuenta?{" "}
              <Button
                color="link"
                onClick={toggleForm}
                className="login-toggle-link"
              >
                Créate una
              </Button>
            </CardText>
          </Form>
        ) : (
          // ============================================
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
              className="login-submit-button" 
              block 
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <CardText className="login-toggle-text">
              ¿Ya tienes cuenta?
              <Button
                color="link"
                onClick={toggleForm}
                className="login-toggle-link"
              >
                Inicia sesión aquí
              </Button>
            </CardText>
          </Form>
        )}

        <CardText className="login-footer">
          © 2026 Disney App. All rights reserved.
        </CardText>
      </Card>
    </div>
  );
}

// ============================================
export default function Login() {
  return (
    <GoogleOAuthProvider clientId={config.clientID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}