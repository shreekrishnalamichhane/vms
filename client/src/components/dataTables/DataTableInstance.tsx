import DataTable from 'react-data-table-component';
import Card from 'react-bootstrap/Card';
import React from "react"
import FilterComponent from './FilterComponent';

interface Props {
    title: string;
    columns: any;
    data: any;
    pagination: boolean;
    theme: string;
}

function DataTableInstance({ title, columns, data, pagination, theme }: Props) {
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = data.filter((item: any) => {
        return (Object.values(item).some((s: any) => {
            switch (typeof s) {
                case 'boolean':
                    return s.toString().includes(filterText.toLowerCase())
                case 'string':
                    return s.toLowerCase().includes(filterText.toLowerCase())
                case 'number':
                    return s.toString().includes(filterText.toLowerCase())
                default:
                    return false
            }
        }))
    })

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        return (
            < FilterComponent onFilter={(e: any) => setFilterText(e.target.value)
            } onClear={handleClear} filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    <DataTable title={title} columns={columns} data={filteredItems} pagination={pagination} theme={theme}
                        subHeader subHeaderComponent={subHeaderComponentMemo}
                        highlightOnHover pointerOnHover selectableRows persistTableHead />
                </Card.Text>
            </Card.Body>
        </Card>
    )
};

export default DataTableInstance