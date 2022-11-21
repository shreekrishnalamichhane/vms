import { ListGroup } from 'react-bootstrap';
import Utils from '../../utils/utils';

interface Props {
    name: string;
    data: string | number | undefined;
}
function CustomListGroup(props: Props) {
    const { name, data } = props;
    return (
        <>
            {data && <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{Utils.camelCaseToTitleCase(name)}</div>
                    {data}
                </div>
            </ListGroup.Item>}</>
    );
}

export default CustomListGroup;