import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"

import { useSignInMutation } from "../../api/authQuery"
import CustomContainer from '../../components/CustomContainer';
import { useAppDispatch } from '../../redux/hooks';
import { resetUser, setUser } from '../../redux/authSlice';

function SignIn() {

    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({
        email: '',
        password: ''
    })
    const [signIn, { isLoading, isSuccess, isError, error, data }] = useSignInMutation()

    const dispatch = useAppDispatch()
    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data.data.user))
            console.log(data)
            toast.success("Signed In Successfully")
            navigate('/')
        } else if (isError && error) {
            dispatch(resetUser())
            toast.error("Sign In Failed")
        }
    }, [isError, isSuccess, data])

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
                await signIn(state)
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
                            <h1>Sign In</h1>
                            <small>Please login to continue</small>
                        </div>
                        <Form className="m-5" noValidate validated={validated} onSubmit={Events.handleSubmit} >
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email address<Form.Text className='text-danger ps-2'>*</Form.Text></Form.Label>
                                <Form.Control type="email" onChange={Events.onChangeHandle} placeholder="Enter email" name="email" required />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide the valid email</Form.Control.Feedback>
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
                                Sign In
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </CustomContainer>
        </>
    );
}

export default SignIn;
