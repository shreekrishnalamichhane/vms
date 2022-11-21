import ReactCrop, { Crop } from 'react-image-crop'
import { TbAspectRatioOff, TbAspectRatio } from "react-icons/tb";
import AnyCenter from '../../components/AnyCenter';


interface Props {
    imgSrc: string,
    crop: Crop,
    setCrop: Function,
    setCompletedCrop: Function,
    aspect: number,
    setAspect: Function,
    imgRef: any,
    onImageLoad: any,
}

function ImageCrop({ imgSrc, crop, setCrop, setCompletedCrop, aspect, setAspect, imgRef, onImageLoad }: Props) {
    function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            setAspect(16 / 9)
        }
    }
    return (
        <>
            {!!imgSrc && (
                <>
                    <div className='pb-3'>
                        Toggle Aspect Ratio : &nbsp;
                        <span className='btn btn-success' onClick={handleToggleAspectClick}>
                            <AnyCenter>
                                {aspect ? < TbAspectRatio /> : < TbAspectRatioOff />}
                            </AnyCenter>
                        </span>
                    </div>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </>
            )}
        </>
    );
}

export default ImageCrop;
