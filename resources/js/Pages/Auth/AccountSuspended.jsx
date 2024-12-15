import { FaGoogle } from 'react-icons/fa';

export default function AccountSuspended() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-customlightBlue">
            <div className="flex flex-col items-center justify-center bg-white shadow-xl rounded-xl p-10 max-w-md mx-auto space-y-6">
                
                <div className="mb-5 text-center">
                    <p className="text-5xl font-extrabold text-customBlue mb-2">
                        ARCHIVAL <br /> ALCHEMIST
                    </p>
                    <p className="text-lg text-gray-700 font-semibold">Your account is temporarily suspended.</p>
                </div>

                <div>
                    <p className="text-xl text-red-800 mb-4 font-semibold">Account Suspended</p>
                    <p className="text-lg text-gray-600 mb-4">
                        We regret to inform you that your account has been suspended due to a violation of our community guidelines.
                    </p>
                    <p className="text-lg text-gray-600">
                        Please review our <a href="/terms-and-conditions" className="text-blue-500 hover:underline">terms and conditions</a> and <a href="/privacy-policy" className="text-blue-500 hover:underline">privacy policy</a> to ensure compliance in the future.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 mt-6">
                    <p className="text-sm text-gray-500 mt-3">
                        Go back to home? <a href="/home" className="text-blue-400 hover:underline">Click here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
