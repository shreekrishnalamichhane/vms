import { Button, Col, Image, Row, Stack } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Footer() {
    return (
        <>
            <div className="m-5 p-2"></div> {/* Spacer */}
            <div className='sticky-footer bg-dark navbar-dark'>
                <Container fluid>
                    <p style={{ textAlign: "center" }} className="navbar-brand py-3 m-0">&copy; Vaccine Management System</p>
                </Container>
            </div>
        </>
    );
}

export default Footer;