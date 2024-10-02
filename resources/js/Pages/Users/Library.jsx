import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import Manuscript from '@/Components/Manuscript';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar';

export default function Library({ auth }) {
    const isAuthenticated = !!auth.user;  // Convert auth.user to true or false
    const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('AllBooks');
    const [manuscripts, setManuscripts] = useState([]); // Lifted state for manuscripts
    const [searchQuery, setSearchQuery] = useState('');

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
        setManuscripts(results); // Update the manuscripts state with search results
    };

    const buttonStyle = (tab) => `px-4 py-2 font-semibold rounded-t-lg border ${activeTab === tab ? 'bg-gray-200 border-b-2 border-b-blue-500 text-blue-500' : 'border-transparent text-gray-700 hover:text-blue-500'}`;

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'AllBooks':
                return (
                    <Manuscript
                        title="All Capstone Manuscripts"
                        description="A list of all available capstone manuscripts."
                        manuscripts={manuscripts} // Pass the manuscripts prop here
                    />
                );
            case 'Recommended':
                return <Manuscript title="Recommended Manuscripts" description="A selection of manuscripts recommended for you." />;
            case 'ByUniversity':
                return <Manuscript title="Manuscripts by University" description="Manuscripts categorized by university." />;
            default:
                return <Manuscript title="Welcome" description="Select a tab to view manuscripts." />;
        }
    };

    return (
        <MainLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Library</h2>}
            className="min-h-screen flex flex-col rounded-xl "
        >
            <Head title="Library" />

            <div className="bg-white m-4 h-screen rounded-xl ">
                <div className="mx-auto sm:px-6 lg:px-8 h-screen  bg-gray-100 pt-6">
                    <div className="flex flex-col h-screen ">
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
                                    University
                                </button>
                            </div>
                            <div className="flex">
                                {/* <div className="shrink-0 flex items-center">
                                    <SearchBar onSearchResults={handleSearchResults} />
                                </div> */}
                            </div>
                            <div className="flex items-center space-x-4">
                                Year
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Start"
                                    className="mx-4 px-4 py-2 border border-gray-300 rounded-md"
                                    style={{ width: '70px' }} // Custom width using inline style
                                />-
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="End"
                                    className="mx-4 px-4 py-2 border border-gray-300 rounded-md"
                                    style={{ width: '70px' }} // Custom width using inline style
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="border-b border-gray-300 w-full -mx-6"></div> {/* Gray Divider Below Buttons */}

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
