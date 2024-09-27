import { HiMenu } from "react-icons/hi"; 
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from "react"


const SidebarContext = createContext();

export default function Sidebar({children, color, borderRadius, margin }) {
    const [expanded, setExpanded] = useState(true)
    const bgColor= `bg-${color}`;
    const radius = `rounded-${borderRadius}`; 
    const SidebarMargin = `m-${margin}`
    
    return (
        <>
            <aside className="sticky top-0 h-screen">
                <nav className={`h-full flex flex-col ${bgColor} border-r shadow-sm ${radius} ${SidebarMargin}`}>
                    <div className="p-4 pb-2 flex justify-between items-center bg-customBlue rounded-t-xl">
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg text-customlightBlue hover:text-gray-100">
                            {expanded ? <HiMenu size={30} /> : <HiMenu size={30} />}
                        </button>
                        <span className={`text-white font-bold text-lg ${expanded ? 'w-52 ml-3' : 'w-0 hidden'}`}>Archival Alchemist</span>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>

                        <ul className="flex-1 px-3 mt-3">{children}</ul>
                    </SidebarContext.Provider>

                </nav>
            </aside>
        </>
    )
}

  export function SidebarItem({ icon, text, color, marginTop, marginBottom, alert, to }) {
    const { expanded } = useContext(SidebarContext);
    const [active, setActive] = useState(false); // State to manage the active state
  
    // Function to toggle the active state when clicked
    const activeClick = () => {
      setActive(!active);
    };
  
    const itemClasses = `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
      active
        ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
        : 'hover:bg-indigo-50 text-gray-600'
    }`;
    const textColor = `text-${color}`;
  
    return (
      <Link href={to} onClick={activeClick}>
            <li className={`${itemClasses} relative`}>
                {icon}
                <span className={`${textColor} overflow-hidden whitespace-nowrap transition-all group-hover:text-gray-600 ${expanded ? 'w-52 ml-3' : 'w-0'} mt-${marginTop} mb-${marginBottom}`}>
                    {text}
                </span>
                {alert && (
                    <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`}></div>
                )}
                {!expanded && (
                    <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 overflow-hidden whitespace-nowrap`}>
                        {text}
                    </div>
                )}
            </li>
        </Link>
    );
  }

  export function SidebarSeparator({}) {
    const { expanded } = useContext(SidebarContext);
  
    return (
      <span className="border-t-2 border-gray-600 mt-4 mb-4"></span> 
    );
  }

  export function SidebarTitle({title}) {
    const { expanded } = useContext(SidebarContext);
  
    return (
      <span className={`text-white font-bold text-sm transition-width duration-300 ease-in-out m-3 ${expanded ? 'w-52 ml-3 inline-block' : 'w-0 hidden' } overflow-hidden`}>
        {title}
      </span>
    );
  }

{/*To use the sidebar here's the code: 
    <div className="flex">
        <Sidebar>
          <SidebarItem icon={<Home size={20} />} text="Home" alert />
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" href="#" />
          <SidebarItem icon={<StickyNote size={20} />} text="Projects" alert />
          <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
          <SidebarItem icon={<Layers size={20} />} text="Tasks" />
          <SidebarItem icon={<Flag size={20} />} text="Reporting" />
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
        </Sidebar>
      </div>



*/}