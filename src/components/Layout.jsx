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
                {categorias.map((cate) => (
                  <Nav.Link as={Link} to={`/${cate.descripcion}`} key={cate.id}>{cate.descripcion}s</Nav.Link>
                ))}
              </Nav>
              <Nav>
                <NavDropdown title={`${(usuario == undefined ? "" : usuario.usuario)}`} id="basic-nav-dropdown" className='usuario'>
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