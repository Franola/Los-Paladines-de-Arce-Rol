import './Layout.css'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from "react";
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query,
} from "firebase/firestore";
import { useContext } from 'react';
import { UsuarioContext } from './context/usuarioContext';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
import useAsync from '../hooks/useAsync';
import { getNotificacionByUser } from '../services/NotificacionService.js';
import { logoutUsuario } from '../services/UsuarioService.js';
import ErrorPopUp from './Popups/Error.jsx';
import { TIPOS_CARTAS } from '../utils/constants.js';

function Layout() {
  const [tiposCartas, setTiposCartas] = useState(TIPOS_CARTAS);
  const { usuario, setUsuario, loading: loadingUsuario } = useContext(UsuarioContext);
  const [cantNotif, setCantNotif] = useState(0);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    console.log("Usuario en Layout:", usuario);
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
  }, []);

  useEffect(() => {
    if (!loadingUsuario && (!usuario || usuario === undefined)) {
      navigate('/Login');
    }
    
    if (!loadingUsuario && usuario) {
      async function fetchNotificaciones() {
        try {
          const notif = await getNotificacionByUser(usuario.usuario);
          setCantNotif(notif.result.length);
        } catch (error) {
          console.error("Error al obtener notificaciones: ", error);
          ErrorPopUp(error.response.data.error || "Error al obtener notificaciones");
        }
      }

      // fetchNotificaciones();
    } else {
      setCantNotif(0);
    }
  }, [loadingUsuario, usuario]);

  const handleLogout = async () => {
    try{
      await logoutUsuario();
      navigate('/Login'); // Redirigir a la página de login
      setUsuario(null); // Limpiar el contexto del usuario
    }
    catch(error){
      console.error("Error al cerrar sesión: ", error);
      ErrorPopUp(error.response.data.error || "Error al cerrar sesión");
    }
    
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
              <Navbar.Brand as={Link} to={"/"}>LPA</Navbar.Brand>
              <div className='d-flex align-items-center'>
                {usuario && usuario.rol !== "admin" && windowWidth < 992 && (
                  <Nav.Link as={Link} to="/notificaciones" className='position-relative me-2'>
                    {cantNotif > 0 && (
                        <span className="badge bg-danger rounded-circle count-notif">
                          {cantNotif}
                        </span>
                      )}
                    <img src='/src/assets/icon-notificacion.png' className='icon-notif'/>
                  </Nav.Link>
                )}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </div>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {usuario && usuario.rol !== "admin" && (
                    tiposCartas.map((tipoCarta) => (
                      <Nav.Link as={Link} to={`/cartas/${tipoCarta}`} key={tipoCarta}>{tipoCarta}s</Nav.Link>
                    ))
                  )}
                  {usuario && usuario.rol === "admin" && (
                    <>
                      <NavDropdown title="Cartas" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={`/`}>Todas</NavDropdown.Item>
                        {tiposCartas.map((tipoCarta) => (
                          <NavDropdown.Item as={Link} to={`/cartas/${tipoCarta}`} key={tipoCarta}>{tipoCarta}s</NavDropdown.Item>
                        ))}
                      </NavDropdown>
                      <Nav.Link as={Link} to="/admin/crearUsuario">Crear usuario</Nav.Link>
                      <NavDropdown title="Funcionalidades" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={`/admin/ofrecerCartas`}>Ofrecer cartas</NavDropdown.Item>
                      </NavDropdown>
                      <Nav.Link as={Link} to="/admin/Notificaciones">Notificaciones</Nav.Link>
                    </>
                  )}
                </Nav>
              <Nav>
                {usuario && usuario.rol !== "admin" && windowWidth > 991 && (
                  <Nav.Link as={Link} to="/notificaciones" className='position-relative'>
                    {cantNotif > 0 && (
                        <span className="badge bg-danger rounded-circle count-notif">
                          {cantNotif}
                        </span>
                      )}
                    <img src='/src/assets/icon-notificacion.png' className='icon-notif'/>
                  </Nav.Link>
                )}
                <NavDropdown title={`${(usuario == undefined ? "" : usuario.usuario)}`} id="basic-nav-dropdown" className='usuario d-flex align-items-center'>
                  <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      <Outlet /> 
    </>
  )
}

export default Layout