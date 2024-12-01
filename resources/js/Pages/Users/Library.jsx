import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import AllManuscript from '@/Components/Manuscripts/AllManuscript';
import RecManuscript from '@/Components/Manuscripts/RecommendedManuscript';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar';
import React from 'react';
import Manuscript from '@/Components/Manuscript';
import MyUniBooks from '@/Components/Manuscripts/MyUniBooks';

const currentYear = new Date().getFullYear(); // Get the current year
const yearOptions = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, i) => currentYear - i
  ); // Generates years from current year down to 2024

export default function Library({ auth }) {
    const isAuthenticated = !!auth.user; // Check if user is authenticated
    const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('AllBooks');
    const [manuscripts, setManuscripts] = useState([]); // State for manuscripts
    const [searchQuery, setSearchQuery] = useState('');



    const [startYear, setStartYear] = useState(yearOptions[0]); // Default to current year
    const [endYear, setEndYear] = useState(yearOptions[0]); // Default to current year




    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const handleLeaveClass = () => {
        openConfirmModal();
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSearchResults = (results) => {
        setManuscripts(results); // Update manuscripts state with search results
    };

    const buttonStyle = (tab) => `px-4 py-2 font-semibold rounded-t-lg border ${activeTab === tab ? 'bg-gray-200 border-b-2 border-b-blue-500 text-blue-500' : 'border-transparent text-gray-700 hover:text-blue-500'}`;

const renderActiveTabContent = () => {
    switch (activeTab) {
        case 'AllBooks': {
            const choice = 'A';
            return (
                <AllManuscript
                    auth={auth}
                    title="All Capstone Manuscripts"
                    description="A list of all available capstone manuscripts."
                    manuscripts={manuscripts} // Pass manuscripts to Manuscript
                    user={auth.user} // Pass the user to Manuscript
                    //choice={choice} // Pass choice to Manuscript
                />
            );
        }
        case 'Recommended': {
            const choice = 'R';
            return (
                <RecManuscript
                auth={auth}
                title="All Capstone Manuscripts"
                description="A list of all available capstone manuscripts."
                manuscripts={manuscripts} // Pass manuscripts to Manuscript
                user={auth.user} // Pass the user to Manuscript
                //choice={choice} // Pass choice to Manuscript
                />
            );
         }
        case 'ByUniversity': {
            const choice = 'U';
            return (
                <MyUniBooks
                auth={auth}
                title="My Uni-Books"
                description="A list of all available capstone manuscripts of their universrity."
                manuscripts={manuscripts} // Pass manuscripts to Manuscript
                user={auth.user} // Pass the user to Manuscript
                //choice={choice} // Pass choice to Manuscript
                />
            );
        }

        default: {
            const choice = 'Default';
            return (
                <Manuscript
                    title="Welcome"
                    description="Select a tab to view manuscripts."
                    user={auth.user} // Pass the user to Manuscript
                    //choice={choice} // Pass choice to Manuscript
                />
            );
        }
    }
};

const handleEndYearChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);

    // Check if the selected end year is less than or equal to the start year
    if (selectedYear <= startYear) {
      alert("End Year must be greater than Start Year");
    } else {
      setEndYear(selectedYear); // Update end year only if it's valid
    }
  };


    return (
        <MainLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Library</h2>}
        >
            <Head title="Library" />

            <div className="bg-white m-4 min-h-screen rounded-xl">
                <div className="mx-auto sm:px-6 lg:px-8 bg-gray-100 h-screen pt-6">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex">
                                <button
                                    onClick={() => handleTabClick('AllBooks')}
                                    className={buttonStyle('AllBooks')}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleTabClick('Recommended')}
                                    className={buttonStyle('Recommended')}
                                >
                                    Recommended
                                </button>
                                <button
                                    onClick={() => handleTabClick('ByUniversity')}
                                    className={buttonStyle('ByUniversity')}
                                >
                                    My Uni-Books
                                </button>
                            </div>

                            <div className="flex items-center space-x-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="text-sm">Start Year:</label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded text-sm" // Reduced padding and font size
            style={{ width: "80px" }} // Set a fixed width for the dropdown
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col ml-4">
          <label className="text-sm">End Year:</label>
          <select
            value={endYear}
            onChange={handleEndYearChange} // Use the new handler
            className="px-2 py-1 rounded text-sm" // Reduced padding and font size
            style={{ width: "80px" }} // Set a fixed width for the dropdown
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

      {/* <p className="text-default-500 text-sm">
        Selected range: {startYear} - {endYear}
      </p> */}
    </div>
                            </div>
                        </div>
                        <div className="border-b border-gray-300 w-full -mx-6"></div>

                        <div className="bg-gray-100 flex-grow -mx-6 px-6 rounded-b-lg">
                            <div className="mt-6">
                                {renderActiveTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

