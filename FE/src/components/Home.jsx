import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Row,
  Col,
  Container,
  Card,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";

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

const cardStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  width: "min(360px, 90vw)",
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container fluid style={wrapperStyle}>
      <div style={cardStyle}>
        <Card className="shadow" style={{ padding: 12 }}>
          <CardText className="text-center" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Button 
              color="primary" 
              size="lg" 
              onClick={() => navigate('/login')}
              style={{ minWidth: "200px", fontSize: "1.1rem" }}>
              Iniciar Sesión
            </Button>
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
            }}>
            <CardTitle tag="h5">Bienvenidos a Baúl Mágico</CardTitle>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}