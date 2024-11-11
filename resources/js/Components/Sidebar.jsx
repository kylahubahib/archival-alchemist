import { HiMenu } from "react-icons/hi";
import { Link, usePage } from '@inertiajs/react';
import { createContext, useContext, useState } from "react";


const SidebarContext = createContext();

export default function Sidebar({children, color, borderRadius, margin }) {
    const [expanded, setExpanded] = useState(false)
    const bgColor= `bg-${color}`;
    // const radius = `rounded-${borderRadius}`;
    // const SidebarMargin = `m-${margin}`

    return (
        <>
            <aside className="fixed top-0 left-0 h-screen z-50">
            <nav className={`h-full flex flex-col ${bgColor} shadow-sm rounded-none`} style={{ marginLeft: 0 }}>


            <div className="p-4 pb-2 flex justify-between items-center bg-customBlue">

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
      <a href={to} target="_blank" rel="noopener noreferrer">
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
      <Link href={to}>
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
      <li className={`${itemClasses} relative`} onClick={handleClick}>
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



export function SidebarSeparator({ marginTop=56 }) {
  const { expanded } = useContext(SidebarContext);

  const marginTopClass = {
    56: 'mt-56',
    60: 'mt-60',
    72: 'mt-72',
    80: 'mt-80',
  }[marginTop] || '';

  return (
    <div
      className={`${marginTopClass} transition-all duration-300 ease-in-out ${
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
