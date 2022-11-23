import { ListGroup } from 'react-bootstrap';
import Utils from '../utils/utils';

interface Props {
    name: string;
    data: string | number | undefined;
}
function Description(props: Props) {
    const { name, data } = props;
    return (
        <>
            {data && <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                <div>
                    <div className="fw-bold text-underline"><u>{Utils.camelCaseToTitleCase(name)}</u></div>
                    <p className='p-0 m-0 pt-2' style={{ "textAlign": "justify" }}>
                        {data}
                    </p>
                </div>
            </ListGroup.Item>
            }
        </>
    );
}

export default Description;