import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container, Input, Label } from 'reactstrap';
import { AiFillEdit, AiFillLock, AiFillCamera, AiFillSave, AiFillStar, AiFillWarning, AiOutlineClose } from 'react-icons/ai';
import Header from './Header.jsx';

const bgStyle = {
  minHeight: "100vh",
  backgroundColor: "#0f1419",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

// Avatares predefinidos
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

export default function Profile() {
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('name') || 'Usuario',
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    avatar: localStorage.getItem('userAvatar') || AVATARS[0],
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAvatarChange = async (avatarUrl) => {
    setProfileData({ ...profileData, avatar: avatarUrl });
    localStorage.setItem('userAvatar', avatarUrl);
    setShowAvatarPicker(false);

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: avatarUrl })
      });

      if (response.ok) {
        const updatedAvatar = await response.json();
        localStorage.setItem('avatar', updatedAvatar.avatar);
        setMessage({ type: 'success', text: '¡Avatar actualizado correctamente!' });
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el avatar' });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating avatar:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el avatar' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleNameChange = async () => {
    if (profileData.name.trim().length < 2) {
      setMessage({ type: 'error', text: 'El nombre debe tener al menos 2 caracteres' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileData.name })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('name', updatedUser.name);
        setEditingName(false);
        setMessage({ type: 'success', text: '¡Nombre actualizado correctamente!' });
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el nombre' });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating name:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el nombre' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUsernameChange = async () => {
    const currentUsername = localStorage.getItem('username');

    if (profileData.username.trim().length < 2) {
      setMessage({ type: 'error', text: 'El nombre de usuario debe tener al menos 2 caracteres' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (profileData.username === currentUsername) {
      setMessage({ type: 'error', text: 'Ese ya es tu nombre de usuario actual' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: profileData.username })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('username', updatedUser.username);
        setEditingUsername(false);
        setMessage({ type: 'success', text: '¡Nombre de usuario actualizado correctamente!' });
      } else if (response.status === 400) {
        setMessage({ type: 'error', text: 'El nombre de usuario ya existe' });
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el nombre de usuario' });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating username:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el nombre de usuario' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Aquí iría la llamada a la API para cambiar la contraseña
    setMessage({ type: 'success', text: '¡Contraseña actualizada correctamente!' });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAccountDeletion = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Debes ingresar tu contraseña' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!userId || !token) {
        setMessage({ type: 'error', text: 'Sesión inválida. Inicia sesión nuevamente.' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Primero verificar la contraseña haciendo login
      const loginResponse = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username,
          password: deletePassword 
        })
      });

      if (!loginResponse.ok) {
        setMessage({ type: 'error', text: 'Contraseña incorrecta' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Si la contraseña es correcta, proceder con la eliminación
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        localStorage.clear();
        sessionStorage.clear();
        setMessage({ type: 'success', text: '¡Cuenta eliminada correctamente!' });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else if (response.status === 401) {
        setMessage({ type: 'error', text: 'No autorizado. Vuelve a iniciar sesión.' });
      } else if (response.status === 404) {
        setMessage({ type: 'error', text: 'Usuario no encontrado.' });
      } else {
        setMessage({ type: 'error', text: 'Error al eliminar la cuenta.' });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setMessage({ type: 'error', text: 'Error de red al eliminar la cuenta.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={bgStyle}>
      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        input::-webkit-input-placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        input:-ms-input-placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
    </style>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>

      <Container style={{ maxWidth: '1200px', padding: '40px 20px' }}>
        {/* Header de perfil */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Mi Perfil</h1>
          <p style={styles.pageSubtitle}>Administra tu información personal</p>
        </div>

        {/* Mensaje de notificación */}
        {message && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
          }}>
            {message.text}
          </div>
        )}

        <Row>
          {/* Columna izquierda - Avatar y acciones rápidas */}
          <Col lg="4" md="12" className="mb-4">
            <div style={styles.card}>
              <div style={styles.avatarSection}>
                <div style={styles.avatarContainer}>
                  <img src={profileData.avatar} alt="Avatar" style={styles.avatar} />
                  <button 
                    style={styles.avatarEditButton}
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  >
                    <AiFillCamera style={{ fontSize: '1.2rem' }} />
                  </button>
                </div>
                
                <h3 style={styles.userName}>{profileData.name}</h3>
                <p style={styles.userEmail}>{profileData.email}</p>
              </div>

              {/* Selector de avatares */}
              {showAvatarPicker && (
                <div style={styles.avatarPicker}>
                  <h4 style={styles.pickerTitle}>Selecciona tu avatar</h4>
                  <div style={styles.avatarGrid}>
                    {AVATARS.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        style={{
                          ...styles.avatarOption,
                          ...(profileData.avatar === avatar ? styles.avatarOptionSelected : {})
                        }}
                        onClick={() => handleAvatarChange(avatar)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones rápidas */}
              <div style={styles.quickActions}>
                <button 
                  style={styles.quickActionButton}
                  onClick={() => navigate('/favorites')}
                >
                  <AiFillStar style={{ fontSize: '1.5rem', marginRight: '10px' }} />
                  Mis Favoritos
                </button>
              </div>
            </div>
          </Col>

          {/* Columna derecha - Formularios */}
          <Col lg="8" md="12">
            {/* Cambiar información */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <AiFillEdit style={{ fontSize: '1.5rem', marginRight: '10px', color: '#ffffff' }} />
                <h3 style={styles.cardTitle}>Información del Perfil</h3>
              </div>

              <div style={styles.formGroup}>
                <Label style={styles.label}>Nombre de usuario</Label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    disabled={!editingUsername}
                    style={editingUsername ? styles.input : styles.inputDisabled}
                  />
                  {editingUsername ? (
                    <button style={styles.saveButton} onClick={handleUsernameChange}>
                      <AiFillSave style={{ fontSize: '1.2rem' }} />
                    </button>
                  ) : (
                    <button style={styles.editButton} onClick={() => setEditingUsername(true)}>
                      <AiFillEdit style={{ fontSize: '1.2rem' }} />
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.formGroup}>
                <Label style={styles.label}>Nombre de perfil</Label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!editingName}
                    style={editingName ? styles.input : styles.inputDisabled}
                  />
                  {editingName ? (
                    <button style={styles.saveButton} onClick={handleNameChange}>
                      <AiFillSave style={{ fontSize: '1.2rem' }} />
                    </button>
                  ) : (
                    <button style={styles.editButton} onClick={() => setEditingName(true)}>
                      <AiFillEdit style={{ fontSize: '1.2rem' }} />
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.formGroup}>
                <Label style={styles.label}>Correo electrónico</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  style={styles.inputDisabled}
                />
                <small style={styles.helpText}>El correo no se puede cambiar</small>
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <AiFillLock style={{ fontSize: '1.5rem', marginRight: '10px', color: '#ffffff' }} />
                <h3 style={styles.cardTitle}>Cambiar Contraseña</h3>
              </div>

              <form onSubmit={handlePasswordChange}>
                <div style={styles.formGroup}>
                  <Label style={styles.label}>Contraseña actual</Label>
                  <Input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    style={styles.input}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div style={styles.formGroup}>
                  <Label style={styles.label}>Nueva contraseña</Label>
                  <Input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div style={styles.formGroup}>
                  <Label style={styles.label}>Confirmar nueva contraseña</Label>
                  <Input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    style={styles.input}
                    placeholder="Repite la nueva contraseña"
                  />
                </div>

                <button type="submit" style={styles.submitButton}>
                  Actualizar Contraseña
                </button>
              </form>
            </div>

            {/* Zona peligrosa - Eliminar cuenta */}
            <div style={styles.dangerCard}>
              <div style={styles.cardHeader}>
                <AiFillWarning style={{ fontSize: '1.5rem', marginRight: '10px', color: '#ff576c' }} />
                <h3 style={styles.dangerTitle}>Zona Peligrosa</h3>
              </div>
              <p style={styles.dangerText}>
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
              </p>
              <button 
                style={styles.dangerButton}
                onClick={() => setShowDeleteModal(true)}
              >
                Eliminar mi cuenta
              </button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword('');
              }}
            >
              <AiOutlineClose style={{ fontSize: '1.5rem' }} />
            </button>

            <div style={styles.modalHeader}>
              <AiFillWarning style={{ fontSize: '4rem', color: '#ff576c', marginBottom: '20px' }} />
              <h2 style={styles.modalTitle}>¿Eliminar tu cuenta?</h2>
              <p style={styles.modalText}>
                Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.
              </p>
            </div>

            <form onSubmit={handleAccountDeletion} style={{ width: '100%' }}>
              <div style={styles.formGroup}>
                <Label style={styles.label}>Confirma tu contraseña para continuar</Label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  style={styles.input}
                  placeholder="Ingresa tu contraseña"
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.confirmDeleteButton}>
                  Eliminar cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageHeader: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
  },
  pageTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '3rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    marginBottom: '10px',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
  },
  pageSubtitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  card: {
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  dangerCard: {
    background: 'linear-gradient(135deg, rgba(51, 20, 25, 0.95) 0%, rgba(35, 15, 20, 0.95) 100%)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 8px 24px rgba(255, 87, 108, 0.2)',
    border: '1px solid rgba(255, 87, 108, 0.3)',
  },
  avatarSection: {
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
  },
  avatarContainer: {
    position: 'relative',
    width: '150px',
    height: '150px',
    margin: '0 auto 20px',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '4px solid rgba(102, 126, 234, 0.5)',
    objectFit: 'cover',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '3px solid rgba(26, 31, 46, 0.95)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  userName: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  userEmail: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  avatarPicker: {
    marginTop: '20px',
    padding: '20px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
  },
  pickerTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    textAlign: 'center',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  avatarOption: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '3px solid transparent',
    transition: 'all 0.3s ease',
    objectFit: 'cover',
  },
  avatarOptionSelected: {
    border: '3px solid #667eea',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)',
    transform: 'scale(1.1)',
  },
  quickActions: {
    marginTop: '20px',
  },
  quickActionButton: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  dangerTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ff576c',
    margin: 0,
  },
  dangerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '8px',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '12px 16px',
    fontSize: '1rem',
  },
  inputDisabled: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    padding: '12px 16px',
    fontSize: '1rem',
    cursor: 'not-allowed',
  },
  helpText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.85rem',
    marginTop: '4px',
    display: 'block',
  },
  editButton: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    background: 'rgba(102, 126, 234, 0.2)',
    border: '1px solid rgba(102, 126, 234, 0.4)',
    color: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  saveButton: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  submitButton: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  dangerButton: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #ff576c 0%, #ff303f 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 87, 108, 0.4)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(15, 20, 25, 0.95) 100%)',
    borderRadius: '16px',
    padding: '40px',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
  },
  modalHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 12px 0',
  },
  modalText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 0',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: '12px 0',
    background: 'linear-gradient(135deg, #ff576c 0%, #ff303f 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 87, 108, 0.3)',
  },
  message: {
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '24px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  messageSuccess: {
    backgroundColor: 'rgba(102, 215, 132, 0.2)',
    color: '#66d784',
    border: '1px solid #66d784',
  },
  messageError: {
    backgroundColor: 'rgba(255, 87, 108, 0.2)',
    color: '#ff576c',
    border: '1px solid #ff576c',
  },
}; 