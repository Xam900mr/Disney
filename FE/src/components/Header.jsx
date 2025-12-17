import { googleLogout } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarText, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function Header() {
  const navigate = useNavigate();

  const onLogout = () => {
    googleLogout();
    sessionStorage.clear();
    navigate("/");
  }

  if (sessionStorage.getItem("email") !== null) {
    return (
      <Navbar light color="danger" expand="md">
        <NavbarBrand>
          <span className="text-white"><strong>Baul Magico</strong></span>
        </NavbarBrand>
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link to="/movies" style={{ textDecoration: 'none' }}>
                <NavLink><span className="text-white">Películas</span></NavLink>
              </Link>
            </NavItem>

            <NavItem>
              <Link to="/series" style={{ textDecoration: 'none' }}>
                <NavLink><span className="text-white">Series</span></NavLink>
              </Link>
            </NavItem>

            {/* Desplegable "Personajes" */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="text-white">
                Personajes
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link to="/characters_movies" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Personajes Películas
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/characters_series" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Personajes Series
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <NavItem>
              <Link to="/favorites" style={{ textDecoration: 'none' }}>
                <NavLink><span className="text-white">Favoritos</span></NavLink>
              </Link>
            </NavItem>
          </Nav>

          <NavbarText>
            <span className="text-white me-2">{sessionStorage.getItem('name')}</span>
            <button className="btn btn-dark" onClick={onLogout}>Cerrar Sesión</button>
          </NavbarText>
        </Collapse>
      </Navbar>
    );
  }

  return null;
}
