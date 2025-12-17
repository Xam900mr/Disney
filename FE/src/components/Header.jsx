import { googleLogout } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';

import { Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';

export default function Header(){

  const navigate = useNavigate();

  const onLogout = () => {
    googleLogout();
    sessionStorage.clear();
    navigate("/");
  }

  if (sessionStorage.getItem("email") !== null){

    return (
      <Navbar light color="danger" expand="md">
        <NavbarBrand><span className="text-white"><strong> Baul Magico</strong></span></NavbarBrand>
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link to="/movies" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0"> Peliculas </span></NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to="/series" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0"> Series </span></NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to="/characters" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0"> Personajes </span></NavLink></Link>
            </NavItem>
            <NavItem>
            <Link to="/favorites" style={{ textDecoration: 'none' }}><NavLink><span className="text-white"> Favoritos </span></NavLink></Link>
            </NavItem>
          </Nav>
          <NavbarText>
            <span className="text-white">{sessionStorage.getItem('name')} </span>
            <button className="btn btn-dark" onClick={onLogout}>Cerrar Sesion</button>

          </NavbarText>
        </Collapse>
      </Navbar>
    );
  }
}