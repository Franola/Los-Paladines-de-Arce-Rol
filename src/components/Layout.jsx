import './Layout.css'
import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to={"/"}>LPA</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to={"/Armas"}>Armas</Nav.Link>
                    <Nav.Link as={Link} to={"/Hechizos"}>Hechizos</Nav.Link>
                    <Nav.Link as={Link} to={"/Pasivas"}>Pasivas</Nav.Link>
                    <Nav.Link as={Link} to={"/Objetos"}>Objetos</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
    </>
  )
}

export default Layout