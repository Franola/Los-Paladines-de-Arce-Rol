import './Layout.css'
import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useEffect,useState } from "react";
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query,
  } from "firebase/firestore";

function Layout() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const db = getFirestore();

    let refCollectionCategorias = collection(db, "Categoria");
    getDocs(refCollectionCategorias)
      .then((snapshot) => {
        setCategorias(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      })
    .finally(() => console.log(categorias));
  },[]);

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
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
    </>
  )
}

export default Layout