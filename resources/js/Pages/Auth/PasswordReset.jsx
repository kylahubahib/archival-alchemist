import { showToast } from '@/Components/Toast';
import { useForm } from '@inertiajs/react';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';

export default function PasswordReset({ tokenData }) {
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        token: tokenData.token,
        email: tokenData.email,
        password: '',
        password_confirmation: '',
    })

    console.log("tokenData", tokenData);
    console.log("errors", errors);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const inputClassName = {
        base: "tracking-wide pb-2",
        input: "border-none focus:ring-0 text-customGray",
    };

    const handlePasswordResetSubmit = (e) => {
        e.preventDefault();

        post(route('users.submit-password-reset'), {
            onSuccess: () => {
                // reset();
                // clearErrors();
                alert('Success');

            },
            onError: (errors) => {

                showToast('error', 'Register failed')
                console.log('Error occurred while registering.', errors);
            },
        });
    };

    return (
        <div className="bg-customLightBlue">
            <section>
                <form onSubmit={handlePasswordResetSubmit} className="container w-full flex flex-col max-w-[19rem] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl items-center justify-center min-h-screen px-6 mx-auto space-y-6">
                    <header className="flex w-full max-xl:flex-col items-center justify-center">
                        <div className="flex p-0  h-full items-center justify-center w-full font-cursive">
                            <img className="h-40 animate-flying  object-cover max-sm:h-32 block" src="/images/archival-alchemist.png" alt="Archival Alchemist Logo" />
                            <div className="flex flex-col justify-center text-[#413839] text-shadow-lg leading-3 font-cursive">
                                <p className="text-5xl max-sm:text-4xl m-0 text-shadow-sm ">rchival</p>
                                <p className="text-5xl max-sm:text-4xl  m-0 text-shadow-sm">lchemist</p>
                            </div>
                        </div>
                        <div className="flex ml-auto items-center justify-center p-1 w-full xl:ml-16 h-full text-customGray text-sm border">
                            <p className="max-sm:text-xs">
                                <strong>Note:</strong>&nbsp;
                                Please create a new password for your account. Once you've done that, you can log in with your email and the new password. Thanks!
                            </p>
                        </div>
                    </header>

                    <main className="w-full flex flex-col items-center justify-center">
                        <div className="flex flex-col gap-1 w-full "> {/* Adjusted for longer inputs */}
                            <Input
                                variant="underlined"
                                radius="sm"
                                placeholder="New Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                startContent={<FaLock className="text-[#413839]" />}
                                type={!isPasswordVisible ? "password" : "text"}
                                isInvalid={errors.password}
                                errorMessage={errors.password}
                                endContent={
                                    data.password &&
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)} >
                                        {isPasswordVisible
                                            ? <FaEyeSlash className="text-[#413839]" />
                                            : <FaEye className="text-[#413839]" />
                                        }
                                    </button>
                                }
                                classNames={{
                                    base: inputClassName.base,
                                    input: inputClassName.input,
                                }}
                                className="max-sm:text-xs"
                            />
                            <Input
                                variant="underlined"
                                radius="sm"
                                placeholder="Confirm Password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                startContent={<FaLock className="text-[#413839]" />}
                                type={!isConfirmPasswordVisible ? "password" : "text"}
                                isInvalid={errors.password_confirmation}
                                errorMessage={errors.password_confirmation}
                                endContent={
                                    data.password_confirmation &&
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} >
                                        {isConfirmPasswordVisible
                                            ? <FaEyeSlash className="text-[#413839]" />
                                            : <FaEye className="text-[#413839]" />
                                        }
                                    </button>
                                }
                                classNames={{
                                    base: inputClassName.base,
                                    input: inputClassName.input,
                                }}
                                className="max-sm:text-xs"
                            />
                            <Button
                                size="md"
                                radius="sm"
                                type="submit"
                                isLoading={processing}
                                className="p-2 tracking-wider bg-customBlue text-white w-full mt-4 max-w-2xl max-sm:text-xs"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </main>

                    <footer>
                        {/* <div className="mt-4 text-center text-sm max-sm:text-xs">
                            <p className="inline">Want to visit the Archival Alchemist page?</p>&nbsp;
                            <a href="http://127.0.0.1:8000/" target="_blank" className="text-blue-500 hover:underline">
                                Click here.
                            </a>
                        </div> */}
                    </footer>
                </form>
            </section>
        </div>
    );
}
