import { Badge, Col, Image, ListGroup, Row } from 'react-bootstrap';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom"
import { useMeQuery } from "../../api/authQuery"
import AnyCenter from '../../components/AnyCenter';

import { useEffect } from 'react'
import CustomListGroup from '../../components/listGroups/CustomListGroup';
import CustomLoader from '../../components/loader/CustomLoader';
import CustomContainer from '../../components/CustomContainer';


function Profile() {
    const navigate = useNavigate()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useMeQuery(null)
    let contents = []

    useEffect(() => {
        if (isError) {
            toast.error("Not Found")
            navigate('/')
        }
    }, [error, isError])

    useEffect(() => {
        refetch()
    }, [])


    if (isLoading)
        return <CustomLoader />
    else if (isError)
        return <AnyCenter style={{ 'height': '100vh' }}>
            <p>Error</p>
        </AnyCenter>

    return (
        <>
            <CustomContainer>
                <Row>
                    <ListGroup as="ol" className='py-3'>
                        <CustomListGroup name="User Id" data={data.data.id} />
                        <CustomListGroup name="Name" data={data.data.name} />
                        <CustomListGroup name="Email" data={data.data.email} />
                        <CustomListGroup name="Phone" data={data.data.phone} />
                    </ListGroup>
                </Row>
            </CustomContainer>
        </>
    );
}

export default Profile;
