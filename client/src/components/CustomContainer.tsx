import { Col, Container, Row } from 'react-bootstrap';

type col = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
interface Props {
    children?: React.ReactNode,
    lg?: col,
    md?: col,
    sm?: col,
}
function CustomContainer({
    children, lg = 8, md = 10, sm = 12
}: Props) {

    const remLg = Math.floor((12 - (lg || 0)) / 2),
        remMd = Math.floor((12 - (md || 0)) / 2),
        remSm = Math.floor((12 - (sm || 0)) / 2)
    return (
        <Container >
            <Row className="mt-5">
                <Col lg={remLg} md={remMd} sm={remSm}></Col>
                <Col lg={lg} md={md} sm={sm}>{children}</Col>
                <Col lg={remLg} md={remMd} sm={remSm}></Col>
            </Row>

        </Container >
    );
}

export default CustomContainer;