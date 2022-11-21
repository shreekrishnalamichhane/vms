interface Props {
    completedCrop: any,
    previewCanvasRef: any,
}
function ImageCropPreview({ completedCrop, previewCanvasRef }: Props) {
    return (
        <>
            {!!completedCrop && (
                <canvas
                    ref={previewCanvasRef}
                    style={{
                        border: '1px solid black',
                        objectFit: 'contain',
                        width: completedCrop.width,
                        height: completedCrop.height,
                    }}
                />
            )}
        </>
    );
}

export default ImageCropPreview;
