export default function TagBadge({className = '', children, value, ...props }) {
    return (
        <>
        <span {...props} className={`inline-flex items-center px-2 py-1 me-2 text-md font-medium text-customBlue bg-blue-100 rounded-full` + className}>
            {children}
        </span>
        </>
    );
}
