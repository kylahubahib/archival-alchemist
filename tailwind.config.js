import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import plugin from "tailwindcss/plugin"; // Import the plugin function
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                cursive: ["Brush Script MT", "cursive"], // Logo font
            },
            colors: {
                customLightBlue: "#e9f1ff",
                customBlue: "#045a8d",
                customDarkBlue: "#084365",
                customGray: "#898282",
                customLightGray: "#e5e4e2",
                customOrange: "#fca570",
                customBlack: "#020202",
            },
            boxShadow: {
                topCustomOrange: "0 -3px 0 rgba(252, 165, 112,1)", // Custom shadow color
                textLogoShadow: "1px 1px 0 rgba(0, 0, 0, 0.3)",
            },
            flex: {
                2: "2",
            },
            flexGrow: {
                2: "2",
            },
            animation: {
                // flying: "fly 4s ease-in-out infinite",
            },
            keyframes: {
                // fly: {
                //     "0%": { transform: "translateX(0) translateY(0)" },
                //     "20%": { transform: "translateX(-5px)" }, // Shake left
                //     "40%": { transform: "translateX(7px)" }, // Shake right
                //     "60%": { transform: "translateX(-7px)" }, // Shake right
                //     "80%": { transform: "translateX(9px)" }, // Shake right
                //     "100%": { transform: "translateX(0) translateY(0)" }, // Back to original position
                // },
            },
        },
    },

    plugins: [
        require("tailwind-scrollbar"),
        forms,
        nextui(),
        plugin(function ({ addUtilities }) {
            addUtilities(
                {
                    ".text-shadow-sm": {
                        textShadow: "1px 1px 0 rgba(0, 0, 0, 0.3)",
                    },
                    ".text-shadow": {
                        textShadow: "1px 1px 0 rgba(0, 0, 0, 0.5)",
                    },
                    ".text-shadow-lg": {
                        textShadow: "2px 2px 0 rgba(0, 0, 0, 0.5)",
                    },
                    ".text-shadow-xl": {
                        textShadow: "3px 3px 0 rgba(0, 0, 0, 0.5)",
                    },
                },
                ["responsive", "hover"]
            );
        }),
    ],
};
