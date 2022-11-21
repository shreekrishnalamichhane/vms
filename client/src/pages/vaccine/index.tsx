import { Badge, Col, Container, Row, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { FaPenFancy, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from "react-router-dom";
import DataTableInstance from '../../components/dataTables/DataTableInstance';

import { useGetAllVaccineQuery, useDeleteVaccineMutation } from "../../api/vaccineQuery"
import { useEffect } from 'react';
import AnyCenter from '../../components/AnyCenter';
import { toast } from 'react-toastify';
import CustomLoader from '../../components/loader/CustomLoader';
import CustomError from '../../components/CustomError';
import CustomContainer from '../../components/CustomContainer';

function VaccineIndex() {
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetAllVaccineQuery(null)

    const [deleteVaccine, {
        data: vaccineDeleteData,
        isLoading: isVaccineDeleteLoading,
        isSuccess: isVaccineDeleteSuccess,
        isError: isVaccineDeleteError,
        error: vaccineDeleteError,
    }] = useDeleteVaccineMutation()

    useEffect(() => {
        if (isVaccineDeleteSuccess) {
            toast.success("Vaccine Deleted Successfully")
            refetch()
        } else if (isVaccineDeleteError) {
            console.log(error)
        }
    }, [isVaccineDeleteSuccess, isVaccineDeleteError])

    useEffect(() => {
        refetch()
    }, [])

    const deleteVaccineInstance = async (data: any) => {
        await deleteVaccine(data)
    }

    const columns = [
        {
            name: '# Id',
            selector: (row: any) => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            cell: (row: any) => (
                <>
                    {(row.name) ? row.name : "_"}
                </>
            ),
            sortable: true,
        },
        {
            name: 'Manufacturer',
            cell: (row: any) => (
                <>
                    {(row.manufacturer) ? row.manufacturer : "_"}
                </>
            ),
            sortable: true,
        },
        {
            name: 'Developed Year',
            cell: (row: any) => (
                <>
                    {(row.developedYear) ? row.developedYear : "_"}
                </>
            ),
            sortable: true,
        },
        {
            name: "Mandatory",
            selector: (row: any) => row.mandatory,
            cell: (row: any) => (
                <>
                    {(row.mandatory) ? <Badge bg={"danger"}>Yes</Badge> : <Badge bg={"success"}>No</Badge>}
                </>
            ),
        },
        {
            name: "Actions",
            cell: (row: any) => (
                <>
                    <Stack direction="horizontal" gap={2}>
                        <Link to={'/vaccine/show/' + row.id}>
                            <Button variant="outline-primary"><FaEye /></Button>
                        </Link>
                        <Link to={'/vaccine/' + row.id}>
                            <Button variant="outline-dark"><FaPenFancy /></Button>
                        </Link>
                        <Button variant="danger" onClick={async () => await deleteVaccineInstance(row)}><FaTrash /></Button>
                    </Stack>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: false
        }
    ];

    if (isLoading)
        return <CustomLoader />
    else if (isError)
        return <CustomError value="Error" />

    return (
        <CustomContainer lg={12} md={12} sm={12}>
            <div className='d-flex justify-content-end'>
                <Link to="/create" >
                    <Button variant="success" className="my-5"> <FaPlus className='me-1' />Add New Vaccine</Button>
                </Link>
            </div>
            <h1 className='pb-3'>Vaccines</h1>
            <DataTableInstance title="" columns={columns} data={data.data} pagination={true} theme={"default"} />
        </CustomContainer>
    );
}

export default VaccineIndex;
