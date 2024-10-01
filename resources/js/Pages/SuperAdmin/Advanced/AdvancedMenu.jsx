import { FaFlag } from "react-icons/fa"; 
import { AiFillFileText } from "react-icons/ai"; 
import { MdForum } from "react-icons/md"; 
import { FaUniversity } from "react-icons/fa"; 
import { FaTags } from "react-icons/fa"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link} from '@inertiajs/react';
import { useState } from "react";

export default function AdvancedMenu({ auth }) {
    const [isActive, setIsActive] = useState();
    
    return (
        <>

            <Link href="/advanced/forum" className={`inline-flex items-center px-4 py-2 bg-customBlue rounded-md space-x-2 text-white racking-widest hover:bg-blue-900 active:bg-customBlue transition ease-in-out duration-150`}>
                <span><MdForum /></span>
                <span className="font-semibold">FORUM</span>
            </Link>

            <Link href="/advanced/universities"className={`inline-flex items-center px-4 py-2 bg-customBlue rounded-md space-x-2 text-white racking-widest hover:bg-blue-900 active:bg-customBlue transition ease-in-out duration-150`}>
                <span><FaUniversity /></span>
                <span className="font-semibold">UNIVERSITIES</span>
            </Link>

            <Link href="/advanced/custom-messages" className={`inline-flex items-center px-4 py-2 bg-customBlue rounded-md space-x-2 text-white racking-widest hover:bg-blue-900 active:bg-customBlue transition ease-in-out duration-150`}>
                <span><AiFillFileText /></span>
                <span className="font-semibold">MESSAGES</span>
            </Link>

            <Link href="#" className={`inline-flex items-center px-4 py-2 m-3 bg-customBlue rounded-md space-x-2 text-white racking-widest hover:bg-blue-900 active:bg-customBlue transition ease-in-out duration-150`}>
                <span><FaFlag /></span>
                <span className="font-semibold">REPORT REASON</span>
            </Link>

            <Link href="/advanced/tags" className={`inline-flex items-center px-4 py-2 m-3 bg-customBlue rounded-md space-x-2 text-white racking-widest hover:bg-blue-900 active:bg-customBlue transition ease-in-out duration-150`}>
                <span><FaTags /></span>
                <span className="font-semibold">TAGS</span>
            </Link>

        </>
    );
}
