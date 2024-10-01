const defaultTheme = require('tailwindcss/defaultTheme');
const forms = require('@tailwindcss/forms');
const flowbite = require('flowbite/plugin'); // Fixed plugin import
const { nextui } = require('@nextui-org/react'); // Use nextui from @nextui-org/react

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', // NextUI theme content path
        './node_modules/flowbite/**/*.js', // Ensure Flowbite's path is correct
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                customlightBlue: '#e9f1ff',
                customBlue: '#294996',
            },
        },
    },

    darkMode: 'class', // NextUI uses class-based dark mode

    plugins: [
        forms,  // Tailwind Forms plugin
        flowbite,  // Flowbite plugin
        nextui(),  // NextUI plugin
    ],
};
