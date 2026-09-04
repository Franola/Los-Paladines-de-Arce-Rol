import './Layout.css'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from "react";
import { UsuarioContext } from './context/usuarioContext';
import { NotificacionContext } from './context/notificacionContext';
import { PersonajeContext } from './context/personajeContext';
import { logoutUsuario } from '../services/UsuarioService.js';
import ErrorPopUp from './Popups/Error.jsx';
import { TIPOS_CARTAS } from '../utils/constants.js';

function Layout() {
  const [tiposCartas] = useState(TIPOS_CARTAS);
  const { usuario, setUsuario, loading: loadingUsuario } = useContext(UsuarioContext);
  const { cantNotif } = useContext(NotificacionContext);
  const { personajes, personajeActivo, setPersonajeActivo } = useContext(PersonajeContext);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const esAdmin = usuario?.rol === "admin";

  useEffect(() => {
    if (!loadingUsuario && (!usuario || usuario === undefined)) {
      navigate('/Login');
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [loadingUsuario, usuario, navigate]);

  const handleLogout = async () => {
    try {
      await logoutUsuario();
      navigate('/Login');
      setUsuario(null);
    } catch(error) {
      console.error("Error al cerrar sesión: ", error);
      ErrorPopUp(error.response?.data?.error || "Error al cerrar sesión");
    }
  };

  const renderSelectorPersonaje = () => {
    if (esAdmin) {
      return (
        <NavDropdown
          title={
            <span className="d-inline-flex align-items-center">
              {personajeActivo ? (
                <span className="badge bg-primary me-1 d-flex align-items-center text-truncate" style={{ fontSize: '0.85rem', padding: '5px 10px', maxWidth: '200px' }}>
                  🛡️ <span className="ms-1 fw-bold text-truncate">{personajeActivo.nombre}</span>
                  <small className="ms-1 opacity-75">({personajeActivo.usuario?.usuario || 'Jugador'})</small>
                </span>
              ) : (
                <span className="badge bg-warning text-dark me-1 d-flex align-items-center fw-bold" style={{ fontSize: '0.85rem', padding: '5px 10px' }}>
                  👑 <span className="ms-1">Modo Master</span>
                </span>
              )}
            </span>
          }
          id="personaje-dropdown-admin"
          className="me-2 my-auto"
        >
          <NavDropdown.Item
            active={personajeActivo === null}
            onClick={() => setPersonajeActivo(null)}
            className="fw-bold text-warning d-flex align-items-center"
          >
            👑 Modo Master (Todas las cartas)
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Header className="text-white-50">Personajes de Jugadores</NavDropdown.Header>
          {personajes && personajes.length > 0 ? (
            personajes.map((p) => (
              <NavDropdown.Item
                key={p.id}
                active={personajeActivo?.id === p.id}
                onClick={() => setPersonajeActivo(p)}
                className="d-flex justify-content-between align-items-center py-2"
              >
                <div>
                  <div className="fw-bold">{p.nombre}</div>
                  <small className="text-white-50">
                    {p.usuario?.usuario ? `@${p.usuario.usuario}` : 'Sin usuario'} • {p.clase?.descripcion || 'Sin clase'}
                  </small>
                </div>
                <span className="badge bg-dark ms-3">Nvl {p.nivel}</span>
              </NavDropdown.Item>
            ))
          ) : (
            <NavDropdown.Item disabled>No hay personajes creados</NavDropdown.Item>
          )}
        </NavDropdown>
      );
    }

    // Para jugador normal:
    if (!personajes || personajes.length === 0) {
      return (
        <span className="navbar-text text-white-50 me-2 my-auto" style={{ fontSize: '0.85rem' }}>
          (Sin personajes)
        </span>
      );
    }

    return (
      <NavDropdown
        title={
          <span className="d-inline-flex align-items-center">
            <span className="badge bg-success me-1 d-flex align-items-center text-truncate" style={{ fontSize: '0.85rem', padding: '5px 10px', maxWidth: '200px' }}>
              🛡️ <span className="ms-1 fw-bold text-truncate">{personajeActivo?.nombre || 'Seleccionar'}</span>
            </span>
            {personajeActivo?.clase?.descripcion && (
              <small className="text-light opacity-75 d-none d-xl-inline ms-1">
                ({personajeActivo.clase.descripcion})
              </small>
            )}
          </span>
        }
        id="personaje-dropdown-user"
        className="me-2 my-auto"
      >
        <NavDropdown.Header className="text-white-50">Tus Personajes</NavDropdown.Header>
        {personajes.map((p) => (
          <NavDropdown.Item
            key={p.id}
            active={personajeActivo?.id === p.id}
            onClick={() => setPersonajeActivo(p)}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{p.nombre}</strong>
              {p.clase?.descripcion ? ` (${p.clase.descripcion})` : ''}
            </span>
            <span className="badge bg-dark ms-3">Nvl {p.nivel}</span>
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    );
  };

  const mostrarBotonNotificaciones = (!esAdmin || personajeActivo !== null);

  const renderBotonNotificaciones = (extraClasses = '') => (
    <Nav.Link as={Link} to="/notificaciones" className={`icon-notif-link position-relative ${extraClasses}`}>
      <div className="icon-notif-container">
        <img src='/src/assets/icon-notificacion.png' className='icon-notif' alt="Notificaciones"/>
        {cantNotif > 0 && (
          <span className="badge bg-danger rounded-pill count-notif">
            {cantNotif}
          </span>
        )}
      </div>
    </Nav.Link>
  );

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid="xxl" className="px-3">
              <Navbar.Brand as={Link} to={"/"}>LPA</Navbar.Brand>
              <div className='d-flex align-items-center'>
                {windowWidth < 992 && (
                  <>
                    {renderSelectorPersonaje()}
                    {mostrarBotonNotificaciones && renderBotonNotificaciones('me-2')}
                  </>
                )}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </div>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {!esAdmin && (
                    tiposCartas.map((tipoCarta) => (
                      <Nav.Link as={Link} to={`/cartas/${tipoCarta}`} key={tipoCarta}>{tipoCarta}s</Nav.Link>
                    ))
                  )}
                  {esAdmin && (
                    <>
                      <NavDropdown title="Cartas" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={`/`}>Todas</NavDropdown.Item>
                        {tiposCartas.map((tipoCarta) => (
                          <NavDropdown.Item as={Link} to={`/cartas/${tipoCarta}`} key={tipoCarta}>{tipoCarta}s</NavDropdown.Item>
                        ))}
                      </NavDropdown>
                      <Nav.Link as={Link} to="/admin/crearUsuario">Crear usuario</Nav.Link>
                      <Nav.Link as={Link} to="/admin/personajes">Personajes</Nav.Link>
                      <NavDropdown title="Funcionalidades" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={`/admin/ofrecerCartas`}>Ofrecer cartas</NavDropdown.Item>
                      </NavDropdown>
                      <Nav.Link as={Link} to="/admin/Notificaciones">Notificaciones</Nav.Link>
                    </>
                  )}
                </Nav>
              <Nav className="d-flex align-items-center flex-row">
                {windowWidth > 991 && renderSelectorPersonaje()}
                {mostrarBotonNotificaciones && windowWidth > 991 && renderBotonNotificaciones('me-2')}
                <NavDropdown title={`${(usuario === undefined || !usuario ? "" : usuario.usuario)}`} id="basic-nav-dropdown" className='usuario d-flex align-items-center'>
                  <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      <Outlet /> 
    </>
  );
}

export default Layout;