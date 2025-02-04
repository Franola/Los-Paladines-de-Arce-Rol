import './Layout.css'
import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap'

function Layout() {
  return (
    <>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="#home">LPA</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="armas">Armas</Nav.Link>
                <Nav.Link href="hechizos">Hechizos</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </>
  )
}

export default Layout