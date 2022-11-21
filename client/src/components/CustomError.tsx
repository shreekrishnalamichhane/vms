import AnyCenter from './AnyCenter';

interface Props {
    value?: string
}
function CustomError(props: Props) {
    const { value } = props
    return (
        <AnyCenter style={{ 'height': '100vh' }}>
            <p>{value ? value : "Error"}</p>
        </AnyCenter>
    );
}

export default CustomError;