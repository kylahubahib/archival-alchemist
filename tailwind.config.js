import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
const {nextui} = require("@nextui-org/react"); // David



/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                customlightBlue: '#e9f1ff',
                customBlue: '#294996' 
            },
            minHeight: {
                'custom': 'calc(100vh - 12rem)',
                '400': '400px'
            },
            height: {
                '445': '445px',
                '400': '400px',
                '480': '480px'
            }
        },
        
    },

    plugins: [forms, nextui()], // David
};
