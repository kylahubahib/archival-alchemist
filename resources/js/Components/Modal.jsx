import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

export default function Modal({ children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {}, maxHeight = '2xl' }) {

    // Define max width and height classes based on props
    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
    }[maxWidth];

    const maxHeightClass = {
       sm: 'max-h-[50vh]',
        md: 'max-h-[60vh]',
        lg: 'max-h-[70vh]',
        xl: 'max-h-[80vh]',
        '2xl': 'max-h-[95vh]',
    }[maxHeight];

    const handleClose = () => {
        if (closeable) {
            onClose();
        }
    };

    return (
        <Transition show={show} leave="duration-200" enter="duration-100">
            <Dialog
                as="div"
                className="fixed inset-0 flex items-center justify-center z-50 transform transition-all"
                onClose={handleClose}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                ><div className="fixed inset-0 bg-gray-800/50" />

                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`relative bg-white rounded-lg shadow-xl m-5 transform transition-all sm:w-full sm:mx-auto ${maxWidthClass} ${maxHeightClass} overflow-y-auto`}
                        // className={`relative bg-white rounded-lg shadow-xl m-5 transform transition-all sm:w-full sm:mx-auto ${maxWidthClass} ${maxHeightClass} overflow-y-auto`}
                        >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
