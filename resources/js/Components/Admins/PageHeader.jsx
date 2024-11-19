function PageHeader({ className, children, ...props }) {
    return (
        <p
            {...props}
            className={`text-customGray text-lg p-0 m-0 font-bold ${className}`}>
            {children}
        </p>
    );
}
export default PageHeader;
