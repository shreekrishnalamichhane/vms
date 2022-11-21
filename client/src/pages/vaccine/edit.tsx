import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'react-image-crop/dist/ReactCrop.css'
import InputGroup from 'react-bootstrap/InputGroup';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom"
import { useUpdateVaccineMutation, useGetVaccineQuery } from "../../api/vaccineQuery"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    centerCrop, makeAspectCrop, Crop, PixelCrop,
} from 'react-image-crop'

import { useDebounceEffect } from '../../utils/useDebounceEffect'
import { canvasPreview } from '../../utils/canvasPreview'
import ImageCrop from '../../components/imageCropper/ImageCrop';
import ImageCropPreview from '../../components/imageCropper/ImageCropPreview';
import CustomLoader from '../../components/loader/CustomLoader';
import CustomError from '../../components/CustomError';
import CustomContainer from '../../components/CustomContainer';

function VaccineEdit() {
    const navigate = useNavigate()
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState<Crop>()
    const [aspect, setAspect] = useState<number | undefined>(16 / 9)
    const imgRef = useRef<HTMLImageElement>(null)
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)

    const [validated, setValidated] = useState(false);

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


    useEffect(() => {
        refetch()
    }, [])

    const [inputValues, setInputValues] = useState<any>({
        id: '', name: '', description: '', image: '', numberOfDoses: '',
        manufacturer: '', developedYear: '', ageGroup: '', sideEffects: '', mandatory: false
    })

    useEffect(() => {
        if (data) {
            let dataD = data.data
            setInputValues({
                id: dataD.id,
                name: dataD.name ? dataD.name : '',
                description: dataD.description ? dataD.description : '',
                image: '',
                numberOfDoses: dataD.numberOfDoses ? parseInt(dataD.numberOfDoses) : undefined,
                manufacturer: dataD.manufacturer ? dataD.manufacturer : undefined,
                developedYear: dataD.developedYear ? parseInt(dataD.developedYear) : undefined,
                ageGroup: dataD.ageGroup ? dataD.ageGroup : undefined,
                sideEffects: dataD.sideEffects ? dataD.sideEffects : undefined,
                mandatory: dataD.mandatory ? dataD.mandatory : undefined,
            })
        }
    }, [data])

    const [updateVaccine, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, data: dataUpdate, error: errorUpdate }] = useUpdateVaccineMutation()
    useEffect(() => {
        if (isSuccessUpdate && dataUpdate) {
            toast.success("Vaccine Updated Successfully")
            navigate('/')
        }
        else if (isErrorUpdate && errorUpdate) {
            toast.error("Not Found")
            navigate('/')
        }
    }, [isSuccessUpdate, isErrorUpdate, dataUpdate])
    const onChangeHandle = (e: any) => {
        let key = e.target.getAttribute('name')
        switch (e.target.getAttribute('type')) {
            case 'number':
                setInputValues((pv: any) => ({
                    ...pv,
                    [key]: Number(e.target.value),
                }));
                break;
            case 'checkbox':
                setInputValues((pv: any) => ({
                    ...pv,
                    [key]: Boolean(e.target.checked),
                }));
                break;

            default:
                setInputValues((pv: any) => ({
                    ...pv,
                    [key]: e.target.value,
                }));
                break;
        }
    }
    const handleSubmit = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        else {
            toast.info("Updating Vaccine")
            await updateVaccine(inputValues)
        }

        setValidated(true);
    }
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }
    const centerAspectCrop = (mediaWidth: number, mediaHeight: number, aspect: number) => {
        return centerCrop(
            makeAspectCrop({ unit: '%', width: 90, }, aspect, mediaWidth, mediaHeight,), mediaWidth, mediaHeight,)
    }
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                let data = (await canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop
                ))
                setInputValues((pv: any) => ({
                    ...pv,
                    image: data,
                }));
                await canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop
                )
            }
        },
        100,
        [completedCrop],
    )



    if (isLoading)
        return <CustomLoader />
    else if (isError)
        return <CustomError value="Error" />

    return (
        <>
            <CustomContainer>
                <div>
                    <h1>Edit Vaccine</h1>
                    <small>Please change the fields to continue</small>
                </div>
                <Form className="my-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name <Form.Text className='text-danger'>*</Form.Text></Form.Label>
                        <Form.Control type="text" placeholder="Enter name of vaccine" name="name" onChange={onChangeHandle} value={inputValues.name} required />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the name of vaccine</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description <Form.Text className='text-danger'>*</Form.Text></Form.Label>
                        <Form.Control as="textarea" placeholder="Enter description of vaccine" name="description" onChange={onChangeHandle} value={inputValues.description} required rows={10} />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the description</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mandatory">
                        <Form.Label>Mandatory <Form.Text className="text-muted"><Form.Text className="text-muted">(Optional)</Form.Text></Form.Text></Form.Label>
                        <Form.Check type="switch" label="Is Mandatory ?" onChange={onChangeHandle} name="mandatory" checked={inputValues.mandatory} />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the mandatory</Form.Control.Feedback>
                    </Form.Group>
                    {/* Crop */}
                    <Form.Group className="Crop-Controls pb-2">
                        <Form.Label>Image</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control type="file" accept="image/*" onChange={onSelectFile} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please choose the image</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <ImageCrop imgSrc={imgSrc} crop={crop as Crop}
                        setCrop={setCrop} setCompletedCrop={setCompletedCrop}
                        aspect={aspect as number}
                        setAspect={setAspect} imgRef={imgRef}
                        onImageLoad={onImageLoad} />
                    <ImageCropPreview completedCrop={completedCrop} previewCanvasRef={previewCanvasRef} />

                    <Form.Group className="mb-3" controlId="numberOfDoses">
                        <Form.Label>Number of Doses <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="number" placeholder="Enter number of doses" onChange={onChangeHandle} value={inputValues.numberOfDoses} name="numberOfDoses" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the number of doses required</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="manufacturer">
                        <Form.Label>Manufacturer <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="text" placeholder="Enter manufacturer name" onChange={onChangeHandle} value={inputValues.manufacturer} name="manufacturer" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please enter the manufacturer</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="developedYear">
                        <Form.Label>Developed Year <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="number" placeholder="Enter developed year" min={1000} max={2100} onChange={onChangeHandle} value={inputValues.developedYear} name="developedYear" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a valid year</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="ageGroup">
                        <Form.Label>Age Group <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="text" placeholder="Enter age group" onChange={onChangeHandle} value={inputValues.ageGroup} name="ageGroup" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a valid age group</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sidEffects">
                        <Form.Label>Side Effects <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control as="textarea" type="text" placeholder="Enter side effects" onChange={onChangeHandle} value={inputValues.sideEffects} name="sideEffects" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a side effects if any</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Update
                    </Button>
                </Form>
            </CustomContainer>
        </>

    );
}

export default VaccineEdit;
