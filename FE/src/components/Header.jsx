import React, { useEffect, useRef, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

import { searchAll } from '../utils/apicall';
import BMlogo from "../images/BM.svg";
import './Home.css';

// ============================================
// CONSTANTS
// ============================================
const SEARCH_DEBOUNCE_MS = 350;
const MIN_SEARCH_LENGTH = 2;

const NAV_ITEMS = [
  { id: 'movies', label: 'Películas', path: '/movies' },
  { id: 'series', label: 'Series', path: '/series' },
  { id: 'mi top', label: 'Mi Top', path: '/trendingSection' }
];

const CHARACTER_DROPDOWN = [
  { label: 'Películas', path: '/characters_movies' },
  { label: 'Series', path: '/characters_series' }
];

// Avatares predefinidos - Sincronizados con miPerfil.jsx
const AVATARS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=6',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=8',
  'https://i.pravatar.cc/150?img=9',
  'https://i.pravatar.cc/150?img=10',
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=12',
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
const highlight = (text, query) => {
  if (!text || !query) return text || '';
  const regex = new RegExp(`(${query})`, 'gi');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  );
};

// ============================================
// COMPONENTS
// ============================================
const Logo = ({ onClick }) => (
  <NavbarBrand>
    <button className="header-logo-button" onClick={onClick}>
      <img src={BMlogo} alt="Baúl Mágico" className="header-logo" />
    </button>
  </NavbarBrand>
);

const NavMenuItem = ({ item, isActive, onMouseEnter, onMouseLeave, navigate }) => (
  <NavItem>
    <NavLink 
      className={`header-nav-link ${isActive ? 'active' : ''}`}
      onClick={() => navigate(item.path)}
      style={{ cursor: 'pointer' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.label}
    </NavLink>
  </NavItem>
);

const CharactersDropdown = ({ isActive, onMouseEnter, onMouseLeave, navigate }) => (
  <UncontrolledDropdown 
    nav 
    inNavbar 
    className={`header-dropdown ${isActive ? 'active' : ''}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <DropdownToggle nav caret className="header-dropdown-toggle">
      Personajes
    </DropdownToggle>
    <DropdownMenu end className="header-dropdown-menu">
      {CHARACTER_DROPDOWN.map((item, idx) => (
        <DropdownItem 
          key={idx}
          onClick={() => navigate(item.path)}
          className="header-dropdown-item"
        >
          {item.label}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

const SearchButton = ({ onClick }) => (
  <button className="header-search-button" onClick={onClick} aria-label="Buscar">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  </button>
);

const SearchOverlay = ({ show, onClose, query, setQuery, results, loading, activeIndex, onSelect, onKeyDown, wrapperRef }) => {
  if (!show) return null;

  return (
    <div className="header-search-overlay">
      <div className="header-search-overlay-content">
        <div className="header-search-overlay-header">
          <svg className="header-search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <Input
            placeholder="Buscar películas o series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="header-search-overlay-input"
            autoFocus
          />
          <button className="header-search-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div ref={wrapperRef} className="header-search-results">
          {loading && (
            <div className="header-search-message">
              🔍 Buscando...
            </div>
          )}

          {!loading && query.length >= MIN_SEARCH_LENGTH && results.length === 0 && (
            <div className="header-search-message">
              No se encontraron resultados
            </div>
          )}

          {!loading && results.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => onSelect(item)}
              className={`header-search-item ${idx === activeIndex ? 'active' : ''}`}
            >
              <img
                src={item.portada_url || '/no-image.png'}
                alt={item.title || 'Sin título'}
                className="header-search-item-image"
              />
              <div className="header-search-item-info">
                <div className="header-search-item-title">
                  {highlight(item.title || 'Sin título', query)}
                </div>
                <small className="header-search-item-type">
                  {item.type === 'movie' ? '🎬 Película' : '📺 Serie'}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ name, avatar, onClick }) => (
  <button className="header-user-profile" onClick={onClick}>
    <span className="header-user-name">{name}</span>
    <img src={avatar} alt={name} className="header-user-avatar" />
    <span className="header-user-caret">▾</span>
  </button>
);

/*const LogoutButton = ({ onClick }) => (
  <button className="header-logout-button" onClick={onClick} aria-label="Cerrar sesión">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M7.5 1v7h1V1h-1z"/>
      <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
    </svg>
  </button>
);*/

// ============================================
// MAIN COMPONENT
// ============================================
export default function Header() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [avatar, setAvatar] = useState(localStorage.getItem('userAvatar') || localStorage.getItem('avatar'));
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState(null);

  // ============================================
  // HANDLERS
  // ============================================
  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim().length < MIN_SEARCH_LENGTH) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchAll(searchQuery.trim());
      setResults(data || []);
      setActiveIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (item) => {
    setQuery('');
    setResults([]);
    setShowSearch(false);

    const path = item.type === 'movie' 
      ? `/movies/details/${item._id}`
      : `/series/details/${item._id}`;
    
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelectResult(results[activeIndex]);
    }

    if (e.key === 'Escape') {
      setShowSearch(false);
      setQuery('');
      setResults([]);
    }
  };

  const handleUserProfileClick = () => {
    // Aquí puedes navegar a la página de perfil si existe
    console.log('User profile clicked');
  };

  const handleAvatarSelect = async (selectedAvatar) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      // Actualizar en el backend
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: selectedAvatar })
      });

      if (response.ok) {
        localStorage.setItem('avatar', selectedAvatar);
        localStorage.setItem('userAvatar', selectedAvatar);
        setAvatar(selectedAvatar);
        setShowAvatarModal(false);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    const handleStorageChange = () => {
      const newAvatar = localStorage.getItem('userAvatar') || localStorage.getItem('avatar');
      setAvatar(newAvatar);
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    // Interval para verificar cambios locales (mismo tab)
    const interval = setInterval(() => {
      const newAvatar = localStorage.getItem('userAvatar') || localStorage.getItem('avatar');
      if (newAvatar !== avatar) {
        setAvatar(newAvatar);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [avatar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  // ============================================
  // RENDER
  // ============================================
  if (!localStorage.getItem('token')) return null;

  const userName = localStorage.getItem('username') || 'Usuario';

  return (
    <>
      <Navbar dark expand="md" className="header-navbar">
        <Logo onClick={() => navigate('/')} />
        
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mx-auto" navbar > 
            {NAV_ITEMS.map((item) => (
              <NavMenuItem
                key={item.id}
                item={item}
                isActive={activeNav === item.id}
                onMouseEnter={() => setActiveNav(item.id)}
                onMouseLeave={() => setActiveNav(null)}
                navigate={navigate}
              />
            ))}

            <CharactersDropdown
              isActive={activeNav === 'characters'}
              onMouseEnter={() => setActiveNav('characters')}
              onMouseLeave={() => setActiveNav(null)}
              navigate={navigate}
            />
          </Nav>

          <div className="header-actions">
            <SearchButton onClick={() => setShowSearch(true)} />

            <UncontrolledDropdown nav inNavbar className="header-user-dropdown">
              <DropdownToggle nav caret={false} className="header-dropdown-toggle">
                <UserProfile 
                  name={userName} 
                  avatar={avatar}
                  onClick={handleUserProfileClick}
                />
              </DropdownToggle>
              <DropdownMenu end className="header-dropdown-menu">
                <DropdownItem onClick={() => navigate('/miPerfil')} className="header-dropdown-item">
                  Mi perfil
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/favorites')} className="header-dropdown-item">
                  Favoritos
                </DropdownItem>

                <DropdownItem onClick={() => navigate('/stats')} className="header-dropdown-item">
                  Mis Estadisticas
                </DropdownItem>

                <DropdownItem onClick={() => navigate('/watch-later')} className="header-dropdown-item">
                  Ver mas tarde
                </DropdownItem>
                
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout} className="header-dropdown-item">
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </Collapse>
      </Navbar>

      <SearchOverlay
        show={showSearch}
        onClose={() => {
          setShowSearch(false);
          setQuery('');
          setResults([]);
        }}
        query={query}
        setQuery={setQuery}
        results={results}
        loading={loading}
        activeIndex={activeIndex}
        onSelect={handleSelectResult}
        onKeyDown={handleKeyDown}
        wrapperRef={wrapperRef}
      />

      <Modal isOpen={showAvatarModal} toggle={() => setShowAvatarModal(false)} centered className="avatar-modal">
        <ModalHeader toggle={() => setShowAvatarModal(false)} className="avatar-modal-header">
          Selecciona tu avatar
        </ModalHeader>
        <ModalBody className="avatar-modal-body">
          <div className="avatar-grid">
            {AVATARS.map((url, index) => (
              <div
                key={index}
                className={`avatar-option ${avatar === url ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect(url)}
              >
                <img src={url} alt={`Avatar ${index + 1}`} className="avatar-option-image" />
              </div>
            ))}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}