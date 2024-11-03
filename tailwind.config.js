import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable dark mode
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                customlightBlue: '#e9f1ff',
                customBlue: '#294996',
                success: '#28a745',  // Custom success color
                error: '#dc3545',    // Custom error color
                warning: '#ffc107',  // Custom warning color
            },
            minHeight: {
                'custom': 'calc(100vh - 12rem)',
                '400': '400px'
            },
            height: {
                '445': '445px',
                '400': '400px',
                '480': '480px'
            },
            screens: {
                'xs': '480px', // Custom breakpoint for extra small screens
            }
        },
    },
    plugins: [forms, nextui()],
};
