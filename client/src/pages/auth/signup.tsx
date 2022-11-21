import { Col, Container, Row, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSignUpMutation } from "../../api/authQuery"
import { useNavigate } from "react-router-dom"
import CustomContainer from '../../components/CustomContainer';

function SignUp() {

    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [signUp, { isLoading, isSuccess, isError, error, data }] = useSignUpMutation()

    const [state, setState] = useState({
        email: '', password: '', name: '', phone: ''
    })
    const Events = {
        onChangeHandle: (e: any) => {
            let key = e.target.getAttribute('name')
            setState(pv => ({
                ...pv,
                [key]: e.target.value,
            }));
        },
        handleSubmit: async (event: any) => {
            const form = event.currentTarget;
            event.preventDefault();
            if (form.checkValidity() === false) {
                event.stopPropagation();
            } else {
                toast.info("Registering New Account")
                let success = await signUp(state)

                if (success.hasOwnProperty('data')) {
                    toast.success("Registration Successful")
                    toast.info("Please Log In")
                    navigate('/signin')
                }
                else if (success.hasOwnProperty('error')) {
                    toast.error((success as any).error.data.statusMessage)
                }
            }
            setValidated(true);
        }
    }
    return (
        <>
            <CustomContainer lg={6} md={8} sm={12}>
                <Card>
                    <Card.Body>
                        <div className="text-center">
                            <h1>Sign Up</h1>
                            <small>Please register your account to continue</small>
                        </div>
                        <Form className="m-5" noValidate validated={validated} onSubmit={Events.handleSubmit}>

                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name<Form.Text className='text-danger ps-2'>*</Form.Text></Form.Label>
                                <Form.Control type="text" onChange={Events.onChangeHandle} placeholder="Enter full name" name="name" required />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide a name</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email address<Form.Text className='text-danger ps-2'>*</Form.Text></Form.Label>
                                <Form.Control type="email" onChange={Events.onChangeHandle} placeholder="Enter email" name="email" required />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide the valid email</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Phone<Form.Text className='text-danger ps-2'>*</Form.Text></Form.Label>
                                <Form.Control type="number" onChange={Events.onChangeHandle} placeholder="Enter phone" name="phone" required />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide valid phone</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password<Form.Text className='text-danger ps-2'>*</Form.Text></Form.Label>
                                <Form.Control type="password" onChange={Events.onChangeHandle} placeholder="Password" name="password" required />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide the password</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <Form.Text className="text-muted">
                                    Fields marked with <Form.Text className='text-danger'>*</Form.Text> are mandatory
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>

                        </Form>
                    </Card.Body>
                </Card>
            </CustomContainer>
        </>

    );
}

export default SignUp;
