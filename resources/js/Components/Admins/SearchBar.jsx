import React from 'react';
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Input } from '@nextui-org/react';

export default function SearchBar({ name, value, className, classNames = {}, isDisabled, size, variant, onChange, placeholder, ...props }) {
    // Define your base styles for the input
    const baseInputStyles = {
        base: "tracking-wide",
        input: "border-none focus:ring-0 bg-transparent",
        inputWrapper: "border-1",
    };

    // Combine the base styles with the incoming classNames
    const combinedClassNames = {
        ...baseInputStyles,
        ...(classNames ? classNames : {}),
    };

    return (
        <Input
            {...props}
            size={size}
            variant={variant}
            classNames={combinedClassNames} // Pass the combined classNames
            className={className}
            isDisabled={isDisabled}
            radius="sm"
            type="text"
            name={name}
            value={value}
            startContent={<FaSearch size={20} className="text-customGray" />}
            endContent={typeof value === 'string' && value.trim() !== '' && (
                <FaXmark
                    size={25}
                    className="hover:bg-gray-400 rounded-full cursor-pointer p-1 text-gray-500 transition duration-200"
                    onClick={() => onChange({ target: { value: '' } })}
                />
            )}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}
