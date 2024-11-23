import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleButton = () => {
  return (
    <a
      href={route('google.auth')}
      className="flex py-3 px-10 me-2 mb-2 text-xl font-medium text-gray-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
    >
      <span className="mr-3"><FcGoogle size={28} /></span>
      Continue with Google
    </a>
  );
};

export default GoogleButton;
