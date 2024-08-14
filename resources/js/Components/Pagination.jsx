// Pagination component to navigate through a list of items
// Props:
// - totalItems: Total number of items across all pages
// - itemsPerPage: Number of items displayed per page
// - currentPage: The current active page number
// - onPageChange: Function to call when changing pages

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    // Calculate the total number of pages needed, rounding up to the nearest whole number
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        //Condition to check if the new page number is within the valid range (1 to totalPages)
        if (pageNumber > 0 && pageNumber <= totalPages) {
            onPageChange(pageNumber); // Trigger the callback with the new page number
        }
    };

    return (
        <div className='pagination flex justify-between m-5'>
            {/* Button to go to the previous page */}
            <button 
                onClick={() => handlePageChange(currentPage - 1)} // Decrement page number by 1
                disabled={currentPage === 1} // Disable button if already on the first page
                className={`px-4 py-2 border rounded ${currentPage <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-customBlue hover:text-white"}`}>
                    Previous
            </button>

            {/* Display the current page and total number of pages */}
            <span>Page {currentPage} of {totalPages}</span>

            {/* Button to go to the next page */}
            <button 
                onClick={() => handlePageChange(currentPage + 1)} // Increment page number by 1
                disabled={currentPage === totalPages} // Disable button if already on the last page
                className={`px-4 py-2 border rounded ${currentPage >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-customBlue hover:text-white"}`}>
                    Next
            </button>
        </div>
    );
}
