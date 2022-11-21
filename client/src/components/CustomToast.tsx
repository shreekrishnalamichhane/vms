import { ToastContainer } from 'react-toastify';

function CustomToast() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            theme="colored"
        />
    );
}

export default CustomToast;