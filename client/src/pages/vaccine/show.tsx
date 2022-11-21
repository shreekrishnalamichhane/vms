import { Badge, Col, Container, Image, ListGroup, Row } from 'react-bootstrap';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom"
import { useGetVaccineQuery } from "../../api/vaccineQuery"
import AnyCenter from '../../components/AnyCenter';
import Spinner from 'react-bootstrap/Spinner';

import { useEffect } from 'react'
import CustomListGroup from '../../components/listGroups/CustomListGroup';
import CustomLoader from '../../components/loader/CustomLoader';
import CustomContainer from '../../components/CustomContainer';


function VaccineShow() {
    const navigate = useNavigate()

    const params = useParams<{
        vaccine_id: string;
    }>();

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetVaccineQuery(params.vaccine_id)
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
                    <Col lg={8} md={8} sm={12}>
                        <Image className='w-100' src={data.data.image} />
                        <p className='pt-3'>Latest Update By: {data.data.User.name} </p>
                        <p className='pb-3'>Email: {data.data.User.email} </p>
                    </Col>
                    <Col lg={4} md={4} sm={12}>
                        <h3 className='pt-5'>{data.data.name}</h3>
                        {data.data.mandatory ? <Badge bg="danger">Mandatory</Badge> : <Badge bg="success">Not Mandatory</Badge>}
                        <br></br>
                        <p className='pt-3'>{data.data.description}</p>
                        <ListGroup as="ol" className='py-3'>
                            <CustomListGroup name="Number of Doses" data={data.data.numberOfDoses} />
                            <CustomListGroup name="Manufacturer" data={data.data.manufacturer} />
                            <CustomListGroup name="Developed Year" data={data.data.developedYear} />
                            <CustomListGroup name="Age Group" data={data.data.ageGroup} />
                            <CustomListGroup name="Side Effects" data={data.data.sideEffects} />
                        </ListGroup>
                    </Col>
                </Row>
            </CustomContainer>
        </>
    );
}

export default VaccineShow;
