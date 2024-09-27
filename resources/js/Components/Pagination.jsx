import { Inertia } from '@inertiajs/inertia';

export default function Pagination({ links }) {
    
    const paginatePage = (url) => {
        if (url) {
            Inertia.visit(url);
        }
    };

    // If there are only two links (the "previous" and "next" links), then there's only one page
    if (links.length <= 3) {
        return null; // Don't render the pagination
    }

    return (

        <div className="flex justify-end m-5">
            <ul className="flex items-center -space-x-px h-10 text-base">
                {links.map((link, index) => (
                    <li key={index} className={`${!link.url ? "hidden" : "bg-white hover:bg-gray-100 hover:text-gray-700"}`}>
                        <a
                            onClick={() => paginatePage(link.url)}
                            className={`flex items-center justify-center px-4 h-10 cursor-pointer leading-tight text-gray-500 bg-white border 
                            border-gray-300 ${link.active ? 'bg-customBlue' : 'hover:bg-gray-100 hover:text-gray-700'}`}
                            dangerouslySetInnerHTML={{ __html: link.label.replace('&raquo;', '»').replace('&laquo;', '«') }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}



// function Pagination({ links }) {
    
//     const paginatePage = (url) => {
//     if (url) {
//         Inertia.visit(url);
//     }
// };


//     return (
//         <div className="flex justify-center">
//             <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
//             <ul class="flex items-center -space-x-px h-10 text-base">

//                 {links.map(link => (
//                     <li>
//                         <a onClick={() =>paginatePage(link.url)}  class={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border 
//                         border-gray-300 hover:bg-gray-100 hover:text-gray-700`}>
//                         {link.label.replace('&raquo;','»').replace('&laquo;','«')}
//                         </a>
//                     </li>
//                 ))}
//             </ul>
//             </nav>
//         </div>

        
//     );



// }
