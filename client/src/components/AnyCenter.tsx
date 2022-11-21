
interface Props {
    children: React.ReactNode,
    style?: any
}
function AnyCenter(props: Props) {
    const { children, style } = props;
    return (
        <div className="d-flex justify-content-center align-items-center" style={style}>
            {children}
        </div>
    );
}

export default AnyCenter;