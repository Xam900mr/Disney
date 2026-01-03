import { googleLogout } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap';

import { useEffect, useRef, useState } from 'react';
import { searchAll } from '../utils/apicall';


function highlight(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  );
}

export default function Header() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const onLogout = () => {
    googleLogout();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShow(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchAll(query.trim());
        setResults(data);
        setShow(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goTo = (item) => {
    setQuery('');
    setResults([]);
    setShow(false);

    if (item.type === 'movie') {
      navigate(`/movies/details/${item._id}`);
    } else {
      navigate(`/series/details/${item._id}`);
    }
  };

  const handleKey = (e) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    }

    if (e.key === 'ArrowUp') {
      setActiveIndex(i => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      goTo(results[activeIndex]);
    }
  };

  if (!localStorage.getItem('token')) return null;

  return (
    <Navbar color="danger" expand="md" className="px-3">
      <NavbarBrand className="text-white">
        <strong>Baúl Mágico</strong>
      </NavbarBrand>

      <Collapse navbar>
        <Nav className="me-auto">
          <NavItem>
            <Link to="/movies">
              <NavLink className="text-white">Películas</NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/series">
              <NavLink className="text-white">Series</NavLink>
            </Link>
          </NavItem>

          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret className="text-white">
              Personajes
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem onClick={() => navigate('/characters_movies')}>
                Películas
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/characters_series')}>
                Series
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <NavItem>
            <Link to="/favorites">
              <NavLink className="text-white">Favoritos</NavLink>
            </Link>
          </NavItem>
        </Nav>

        <div
          ref={wrapperRef}
          style={{ position: 'relative', width: 320, marginRight: 20 }}
        >
          <Input
            placeholder="Buscar películas o series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => query.length >= 2 && setShow(true)}
          />

          {show && (
            <div
              className="bg-white shadow rounded mt-1"
              style={{
                position: 'absolute',
                width: '100%',
                maxHeight: 320,
                overflowY: 'auto',
                zIndex: 1000
              }}
            >
              {loading && (
                <div className="px-3 py-2 text-muted">
                  Buscando...
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="px-3 py-2 text-muted">
                  No se encontraron resultados
                </div>
              )}

              {!loading && results.map((item, idx) => (
                <div
                  key={item._id}
                  onClick={() => goTo(item)}
                  className={`d-flex align-items-center px-2 py-2 ${
                    idx === activeIndex ? 'bg-light' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={item.portada_url || '/no-image.png'}
                    alt=""
                    style={{
                      width: 40,
                      height: 55,
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />

                  <div className="ms-2">
                    <div>
                      <strong>{highlight(item.title, query)}</strong>
                    </div>
                    <small className="text-muted">
                      {item.type === 'movie' ? '🎬 Película' : '📺 Serie'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <NavbarText>
          <span className="text-white me-2">
            {localStorage.getItem('name')}
          </span>
          <button className="btn btn-dark" onClick={onLogout}>
            Cerrar sesión
          </button>
        </NavbarText>
      </Collapse>
    </Navbar>
  );
}
