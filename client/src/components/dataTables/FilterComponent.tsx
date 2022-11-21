import { Form, InputGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

interface Props {
    filterText: string,
    onFilter: any,
    onClear: any
}

const FilterComponent = ({ filterText, onFilter, onClear }: Props) => (
    <>
        <div className="d-flex">
            <InputGroup className="mb-3">
                <Form.Control
                    id="Search"
                    type=""
                    placeholder="Search"
                    aria-label="Search Input"
                    value={filterText}
                    onChange={onFilter}
                />
                <InputGroup.Text onClick={onClear}><FaTimes /></InputGroup.Text>
            </InputGroup>
        </div>
    </>
);

export default FilterComponent;