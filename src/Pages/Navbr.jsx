import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Navbr() {
  const location = useLocation();
  // If on /adminlogin -> do not show navbar
  if(location.pathname === '/adminlogin'){
    return null;
  }
  return (
    <>
      <Navbar data-bs-theme="dark" expand="lg">
        <Container>
          <Nav className="me-auto">
            <Link to="/" className="btn btn-light custom-btn-left">User</Link>
          </Nav>
          <Nav className="ms-auto">
            <Link to="/adminlogin" className="btn btn-warning custom-btn-right">AdminLogin</Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
