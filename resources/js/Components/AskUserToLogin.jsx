import React from "react";
import { FaStar } from "react-icons/fa";
import NavLink from '@/Components/NavLink';
const AskUserToLogin = () => {
  return (
    <div className="relative text-gray-300 w-full h-full m-0 top-0 bottom-0 right-0 left-0 overflow-hidden" id="pricing">
      {/* Background Blurs */}
      <div
        aria-hidden="true"
        className="absolute w-full h-full inset-0 m-0 opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br to-purple-400 from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-indigo-600"></div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full sm:flex-row gap-4">
        <div className="flex flex-col items-center aspect-auto sm:p-8 border bg-gray-800 border-gray-700 shadow-lg flex-1">
          {/* Icon Circle Above */}
          <div className="flex justify-center items-center w-16 h-16 bg-white-600 rounded-full mb-4">
          <h2 className="text-3xl font-serif text-white mb-4 text-shadow-lg tracking-widest uppercase">
            Archival
          </h2> {/* <FaStar className="text-white text-2xl" /> */}
            <img
    src='/images/sad-owl.png'
    alt="PDF Thumbnail"
  />  <h2 className="text-3xl font-serif text-white mb-4 text-shadow-lg tracking-widest uppercase">
  Alchemist
</h2>
<div className="w-full h-[1px] bg-gray-500 mb-6"></div>
          </div>

          <h2 className="text-lg sm:text-xl font-medium text-white mb-2">Oooops!</h2>
          <p className="text-lg sm:text-xl text-center mb-6 mt-4">
            <span className="text-1xl sm:text-2xl font-bold text-white">Authentication Required</span>
          </p>
          <p className="text-center mb-6">
          Action cannot be completed at this time. Please log in first to proceed.
          </p>

          {/* Underline (Thin Horizontal Line) */}
          <div className="w-full h-[1px] bg-gray-500 mb-6"></div>

          <a
            href="#contact"
            className="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-white before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
          >
            <span className="relative text-sm font-semibold text-black hover:bg:blue-500"><NavLink href={route('login')} active={route().current('login')} >Sign In Now!</NavLink></span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AskUserToLogin;
