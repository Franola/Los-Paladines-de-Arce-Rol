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

function Layout() {
  const [categorias, setCategorias] = useState([]);
  const { usuario, setUsuario } = useContext(UsuarioContext);
  const [cantNotif, setCantNotif] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/Login');
    }
    else {
      const db = getFirestore();

      let refCollectionCategorias = collection(db, "Categoria");
      getDocs(refCollectionCategorias)
        .then((snapshot) => {
          setCategorias(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        })
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      const db = getFirestore();
      const refCollection = collection(db, "Notificaciones");
      const q = query(refCollection, where("vista", "==", false), where("usuario", "==", usuario.id));
      getDocs(q)
        .then((snapshot) => {
          setCantNotif(snapshot.docs.length);
        })
    }
  }, [usuario]);

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // Limpiar localStorage
    navigate('/Login'); // Redirigir a la página de login
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
              <Navbar.Brand as={Link} to={"/"}>LPA</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {usuario && !usuario.admin && (
                    categorias.map((cate) => (
                      <Nav.Link as={Link} to={`/cartas/${cate.descripcion}`} key={cate.id}>{cate.descripcion}s</Nav.Link>
                    ))
                  )}
                  {usuario && usuario.admin && (
                    <>
                      <NavDropdown title="Cartas" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={`/`}>Todas</NavDropdown.Item>
                        {categorias.map((cate) => (
                          <NavDropdown.Item as={Link} to={`/cartas/${cate.descripcion}`} key={cate.id}>{cate.descripcion}s</NavDropdown.Item>
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
                {usuario && !usuario.admin && (
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