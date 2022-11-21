import { Image } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Page404() {
    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center">
                <Image src="/404.webp" style={{ width: "30%" }} />
                <h1>Page Not Found</h1>
                <Link to="/">
                    <h4>Return Home</h4>
                </Link>
            </div>

        </>
    );
}

export default Page404;
