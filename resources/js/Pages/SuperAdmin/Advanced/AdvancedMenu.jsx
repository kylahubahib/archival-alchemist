import { FaFlag } from "react-icons/fa"; 
import { AiFillFileText } from "react-icons/ai"; 
import { MdForum } from "react-icons/md"; 
import { FaUniversity } from "react-icons/fa"; 
import { FaTags } from "react-icons/fa"; 
import { Link, usePage } from '@inertiajs/react';

export default function AdvancedMenu({auth}) {
    const { url } = usePage(); 

    const isActive = (route) => url.startsWith(route);

    return (
        <div className=" space-x-5">
            <Link href="/advanced/forum" 
                className={`inline-flex items-center px-4 py-2 rounded-md space-x-2 text-white racking-widest ${isActive('/advanced/forum') ? 'bg-blue-950 border-t-3 border-yellow-500' : 'bg-customBlue hover:bg-blue-900 transition ease-in-out duration-150'}`}>
                <span><MdForum /></span>
                <span className="font-semibold">FORUM</span>
            </Link>

            <Link href="/advanced/universities"
                className={`inline-flex items-center px-4 py-2 rounded-md space-x-2 text-white racking-widest ${isActive('/advanced/universities') ? 'bg-blue-950 border-t-3 border-yellow-500' : 'hover:bg-blue-900 bg-customBlue transition ease-in-out duration-150'}`}>
                <span><FaUniversity /></span>
                <span className="font-semibold">UNIVERSITIES</span>
            </Link>

            <Link href="/advanced/custom-messages"
                className={`inline-flex items-center px-4 py-2 rounded-md space-x-2 text-white racking-widest ${isActive('/advanced/custom-messages') ? 'bg-blue-950 border-t-3 border-yellow-500' : 'hover:bg-blue-900 bg-customBlue transition ease-in-out duration-150'}`}>
                <span><AiFillFileText /></span>
                <span className="font-semibold">MESSAGES</span>
            </Link>

            <Link href="#" 
                className={`inline-flex items-center px-4 py-2 m-3 rounded-md space-x-2 text-white racking-widest ${isActive('/advanced/report-reason') ? 'bg-blue-950 border-t-3 border-yellow-500' : 'hover:bg-blue-900 bg-customBlue transition ease-in-out duration-150'}`}>
                <span><FaFlag /></span>
                <span className="font-semibold">REPORT REASON</span>
            </Link>

            <Link href="/advanced/tags" 
                className={`inline-flex items-center px-4 py-2 m-3 rounded-md space-x-2 text-white racking-widest ${isActive('/advanced/tags') ? 'bg-blue-950 border-t-3 border-yellow-500' : 'hover:bg-blue-900 bg-customBlue transition ease-in-out duration-150'}`}>
                <span><FaTags /></span>
                <span className="font-semibold">TAGS</span>
            </Link>
        </div>
    );
}
