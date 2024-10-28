import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastNotification() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            
            rtl={false}
            pauseOnFocusLoss
            draggable
            
            transition={Bounce}
            theme="light"
        />
    );
}

// You can also export utility functions to trigger toasts
export const showToast = (type, message) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'info':
            toast.info(message);
            break;
        case 'warning':
            toast.warn(message);
            break;
        default:
            toast(message);
    }
};
