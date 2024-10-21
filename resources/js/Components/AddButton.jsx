export default function AddButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 border-1 border-customBlue rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-blue-900 active:bg-customBlue transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
 