import { Spinner } from "react-bootstrap";
import AnyCenter from "../AnyCenter";

function CustomLoader() {
    return (
        <AnyCenter style={{ 'height': '100vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </AnyCenter>
    );
}

export default CustomLoader;