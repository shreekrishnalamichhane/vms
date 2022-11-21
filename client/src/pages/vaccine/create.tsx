import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'react-image-crop/dist/ReactCrop.css'
import InputGroup from 'react-bootstrap/InputGroup';
import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"
import { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'


import { useStoreVaccineMutation } from "../../api/vaccineQuery"
import { useDebounceEffect } from '../../utils/useDebounceEffect'
import { canvasPreview } from '../../utils/canvasPreview'
import ImageCrop from '../../components/imageCropper/ImageCrop';
import ImageCropPreview from '../../components/imageCropper/ImageCropPreview';
import CustomContainer from '../../components/CustomContainer';


function VaccineCreate() {

    const navigate = useNavigate()
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState<Crop>()
    const [aspect, setAspect] = useState<number | undefined>(16 / 9)
    const imgRef = useRef<HTMLImageElement>(null)
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)

    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({
        name: '', description: '', image: '', numberOfDoses: undefined,
        manufacturer: '', developedYear: undefined, ageGroup: '', sideEffects: '', mandatory: false
    })
    const [storeVaccine, { isLoading, isSuccess, isError, error, data }] = useStoreVaccineMutation()

    useEffect(() => {
        if (isSuccess && data) {
            toast.success("Vaccine Created Successfully")
            navigate('/')
        }
        else if (isError && error) {
            toast.error("Please try again")
        }
    }, [isSuccess, isError, data])
    const Events = {
        onChangeHandle: (e: React.ChangeEvent<any>) => {
            let key = e.target.getAttribute('name')
            switch (e.target.getAttribute('type')) {
                case 'number':
                    setState(pv => ({
                        ...pv,
                        [key]: Number(e.target.value),
                    }));
                    break;
                case 'checkbox':
                    setState(pv => ({
                        ...pv,
                        [key]: Boolean(e.target.checked),
                    }));
                    break;

                default:
                    setState(pv => ({
                        ...pv,
                        [key]: e.target.value,
                    }));
                    break;
            }
        },
        handleSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            const form = event.currentTarget;
            event.preventDefault();
            if (form.checkValidity() === false) {
                event.stopPropagation();
            } else {
                toast.info("Adding Vaccine")
                await storeVaccine(state)
            }
            setValidated(true);
        },
        onSelectFile: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                setCrop(undefined) // Makes crop preview update between images.
                const reader = new FileReader()
                reader.addEventListener('load', () =>
                    setImgSrc(reader.result?.toString() || ''),
                )
                reader.readAsDataURL(e.target.files[0])
            }
        },
        centerAspectCrop: (mediaWidth: number, mediaHeight: number, aspect: number) => {
            return centerCrop(
                makeAspectCrop({ unit: '%', width: 90, }, aspect, mediaWidth, mediaHeight,), mediaWidth, mediaHeight,)
        },
        onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
            if (aspect) {
                const { width, height } = e.currentTarget
                setCrop(Events.centerAspectCrop(width, height, aspect))
            }
        },
        handleToggleAspectClick: () => {
            if (aspect) {
                setAspect(undefined)
            } else if (imgRef.current) {
                setAspect(16 / 9)
            }
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
                setState(pv => ({
                    ...pv,
                    image: data,
                }))
            }
        },
        100,
        [completedCrop],
    )

    return (
        <>
            <CustomContainer>
                <div>
                    <h1>Create New Vaccine</h1>
                    <small>Please fill all the fields to continue</small>
                </div>
                <Form className="my-5" noValidate validated={validated} onSubmit={Events.handleSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name <Form.Text className='text-danger'>*</Form.Text></Form.Label>
                        <Form.Control type="text" placeholder="Enter name of vaccine" name="name" onChange={Events.onChangeHandle} required />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the name of vaccine</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description <Form.Text className='text-danger'>*</Form.Text></Form.Label>
                        <Form.Control as="textarea" placeholder="Enter description of vaccine" name="description" onChange={Events.onChangeHandle} required rows={10} />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the description</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mandatory">
                        <Form.Label>Mandatory <Form.Text className="text-muted"><Form.Text className="text-muted">(Optional)</Form.Text></Form.Text></Form.Label>
                        <Form.Check type="switch" label="Is Mandatory ?" onChange={Events.onChangeHandle} name="mandatory" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the mandatory</Form.Control.Feedback>
                    </Form.Group>
                    {/* Crop */}
                    <Form.Group className="Crop-Controls pb-2">
                        <Form.Label>Image <Form.Text className='text-danger'>*</Form.Text></Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control type="file" accept="image/*" onChange={Events.onSelectFile} required />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please choose the image</Form.Control.Feedback>
                        </InputGroup>

                    </Form.Group>
                    <ImageCrop imgSrc={imgSrc} crop={crop as Crop}
                        setCrop={setCrop} setCompletedCrop={setCompletedCrop}
                        aspect={aspect as number}
                        setAspect={setAspect} imgRef={imgRef}
                        onImageLoad={Events.onImageLoad} />
                    <ImageCropPreview completedCrop={completedCrop} previewCanvasRef={previewCanvasRef} />

                    <Form.Group className="mb-3" controlId="numberOfDoses">
                        <Form.Label>Number of Doses <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="number" placeholder="Enter number of doses" onChange={Events.onChangeHandle} name="numberOfDoses" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide the number of doses required</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="manufacturer">
                        <Form.Label>Manufacturer <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="text" placeholder="Enter manufacturer name" onChange={Events.onChangeHandle} name="manufacturer" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please enter the manufacturer</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="developedYear">
                        <Form.Label>Developed Year <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="number" placeholder="Enter developed year" min={1000} max={2100} onChange={Events.onChangeHandle} name="developedYear" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a valid year</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="ageGroup">
                        <Form.Label>Age Group <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control type="text" placeholder="Enter age group" onChange={Events.onChangeHandle} name="ageGroup" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a valid age group</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sidEffects">
                        <Form.Label>Side Effects <Form.Text className="text-muted">(Optional)</Form.Text></Form.Label>
                        <Form.Control as="textarea" type="text" placeholder="Enter side effects" onChange={Events.onChangeHandle} name="sideEffects" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a side effects if any</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Create
                    </Button>
                </Form>
            </CustomContainer>
        </>
    );
}

export default VaccineCreate;
