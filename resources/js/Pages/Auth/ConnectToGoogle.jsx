import { FaGoogle } from 'react-icons/fa';

export default function ConnectToGoogle() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4 text-center">
            <p className="mb-6 text-lg text-gray-700">
                To access this class, please connect your Google account. This connection enables the use of essential Google 
                services required for a seamless collaboration experience. Once your account is connected, you’ll be able to upload and 
                modify your capstone manuscripts.
            </p>
            <a 
                href={route('google.auth')} 
                className="flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
            >
                <FaGoogle />
                <span className="ml-3">Connect Your Google Account</span>
            </a>
        </div>
    );
}
