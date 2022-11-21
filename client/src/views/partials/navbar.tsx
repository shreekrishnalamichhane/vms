import { useEffect } from 'react';
import { Button, Image, Stack } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useSignOutMutation } from '../../api/authQuery';
import { resetUser } from '../../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

function NavBar() {

    const { isAuth, user } = useAppSelector((state) => state.authReducer);
    const navigate = useNavigate()

    const [signOut, { isLoading, isSuccess, isError, error, data }] = useSignOutMutation()
    const dispatch = useAppDispatch()

    const logout = async () => {
        toast.info("Signing Out")
        await signOut(null)
    }

    useEffect(() => {
        if (isSuccess && data) {
            toast.success('Signed Out Successfully')
            dispatch(resetUser())
            navigate('/signin')
        }
        else if (isError && error) {
            toast.error('Signed Out Failed')
        }
    }, [isSuccess, isError, data])

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Stack gap={3} direction="horizontal">
                    <Image src='/logo.png' height={50}></Image>
                    <Link to="/" className="text-decoration-none">
                        <Navbar.Brand >Vaccine Management</Navbar.Brand>
                    </Link>
                </Stack>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>

                    {isAuth ? (
                        <Nav>
                            <Stack direction="horizontal" gap={3} className="d-flex align-items-center">
                                <Link to="/me" className="text-decoration-none">
                                    <Nav.Item>
                                        <Button className='text-white'>User  : {user!.name}</Button>
                                    </Nav.Item>
                                </Link>
                                <Link to="/signin" className="text-decoration-none">
                                    <Nav.Item>
                                        <Button onClick={logout} variant="danger">Sign Out</Button>
                                    </Nav.Item>
                                </Link>
                            </Stack>
                        </Nav>
                    ) : (
                        <Nav>
                            <Stack direction="horizontal" gap={3}>
                                <Link to="/signin" className="text-decoration-none">
                                    <Nav.Item>
                                        <Button variant="primary">Sign In</Button>
                                    </Nav.Item>
                                </Link>
                                <Link to="/signup" className="text-decoration-none">
                                    <Nav.Item>
                                        <Button variant="danger">Sign Up</Button>
                                    </Nav.Item>
                                </Link>
                            </Stack>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default NavBar;