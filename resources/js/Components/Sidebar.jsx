import { HiMenu } from "react-icons/hi";
import { Link, usePage } from '@inertiajs/react';
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();


export default function Sidebar({ children, color, borderRadius, margin }) {
    const [expanded, setExpanded] = useState(true);

    const handleResize = () => {
        if (window.innerWidth < 768) { 
            setExpanded(false);
        } else {
            setExpanded(true);
        }
    };

    useEffect(() => {
        handleResize(); 

        window.addEventListener('resize', handleResize); 
        return () => window.removeEventListener('resize', handleResize); 
    }, []);

    const bgColor = `bg-${color}`;
    const radius = `rounded-${borderRadius}`;
    const SidebarMargin = `m-${margin}`;

    return (
        <>
            <aside className="sticky top-0 h-screen">
                <nav className={`h-full flex flex-col ${bgColor} border-r shadow-sm ${radius} ${SidebarMargin}`}>
                    <div className="p-4 pb-2 flex justify-between items-center bg-customBlue rounded-t-xl">
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg text-customlightBlue hover:text-gray-100">
                            <HiMenu size={30} />
                        </button>
                        <span className={`text-white font-bold text-lg ${expanded ? 'w-52 ml-3' : 'w-0 hidden'}`}>Archival Alchemist</span>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3 mt-3">{children}</ul>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    );
}


export function SidebarItem({ icon, text, color, marginTop, marginBottom, alert, to, onClick, isActiveModal, externalLink, ...props }) {
  const { expanded } = useContext(SidebarContext);
  const { url } = usePage();

  const isActive = url === to || isActiveModal;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const itemClasses = `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
    isActive
      ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-gray-600'
      : 'hover:bg-indigo-50 text-gray-600'
  }`;

  const textColor = `text-${color}`;

  if (externalLink) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
        <li className={`${itemClasses}`}>
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
      </a>
    );
  } else {
    return to ? (
      <Link href={to} {...props}>
        <li className={`${itemClasses}`}>
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
    ) : (
      <li className={`${itemClasses} relative`} onClick={handleClick} {...props}>
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
    );
  }
}



export function SidebarSeparator({ marginTop }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <div
      className={`${marginTop} transition-all duration-300 ease-in-out ${
        expanded ? 'w-full' : 'w-10 mx-auto'
      }`}
    />
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
