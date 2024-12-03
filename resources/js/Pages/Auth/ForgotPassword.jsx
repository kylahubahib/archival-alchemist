import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { showToast } from '@/Components/Toast';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleResetPasswordSubmit = (e) => {
        e.preventDefault();

        // The `processing` state will automatically be true during the request
        post(route('users.send-password-reset'), {
            onSuccess: () => {
                showToast('success', 'The password reset link has been sent successfully.');
            },
            onError: () => {
                show.log('Error occurred while adding the admin.');
            },
        });
    };
    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <main id="content" role="main" className="w-full flex justify-center item max-w-md mx-auto p-6">
                <div className="flex h-full justify-center items-center mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
                    <div className="p-4 sm:p-7 h-full">
                        <div className="text-center">
                            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                                Forgot password?
                            </h1>
                            <p className="text-gray-500 text-sm pt-2 text-left">
                                No problem. Just let us know your email address and we will email you a password
                                reset link that will allow you to choose a new one.
                            </p>
                        </div>
                        <div className="mt-5">
                            <form onSubmit={handleResetPasswordSubmit}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex items-center w-full">
                                        <PrimaryButton className="w-full flex justify-center" type="submit" disabled={processing}>
                                            Email Password Reset Link
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 text-center dark:text-gray-400">
                            Remember your password?
                            <a className="text-blue-600 decoration-2 hover:underline font-medium" href="/login">
                                &nbsp;Login here
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </GuestLayout>
    );
}
