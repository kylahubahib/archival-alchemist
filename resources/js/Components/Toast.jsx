import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastNotification() {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            // progressClassName={'!bg-customBlue'}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            // draggable={true}
            pauseOnHover={true}
            theme="light"
            transition={Slide}
        />
    );
}

// Sample for calling the showToast with arguments
// showToast('success',
//     '🦄 Wow so easy!', // can be a plain text or just and element with text content
//     {
//     position: "top-right",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "light",
//     transition: Bounce,
// });

// You can also export utility functions to trigger toasts
export const showToast = (type, message, customProps) => {
    switch (type) {
        case 'success':
            toast.success(message, customProps);
            break;
        case 'error':
            toast.error(message, customProps);
            break;
        case 'info':
            toast.info(message, customProps);
            break;
        case 'warning':
            toast.warn(message, customProps);
            break;
        default:
            toast(message, customProps);
    }
};