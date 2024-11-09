
import React, { useState, } from "react";
import { RiArchiveStackFill } from "react-icons/ri";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User } from "@nextui-org/react";
import { FaPlus, FaTableList, } from "react-icons/fa6";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import PageHeader from '@/Components/Admins/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchBar from "@/Components/Admins/SearchBar";
import MainNav from "@/Components/MainNav";
import { HiDocumentCheck, HiDocumentMinus } from "react-icons/hi2";
import AddButton from "@/Components/Admins/AddButton";

export default function CoAdmin({ auth }) {
    const [searchManuscript, setSearchManuscript] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const studentsNavigation = [
        { text: 'Premium Access', icon: <HiDocumentCheck />, route: 'institution-students' },
        { text: 'No Premium Access', icon: <HiDocumentMinus />, route: 'institution-students' },
    ];

    const tableHeader = ['Name', 'Date Created', 'Role', 'Status', 'Actions'];

    return (
        <AdminLayout
            user={auth.user}
        >
            <div>
                <PageHeader>CO-ADMINS</PageHeader>
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-4">

                    {/* Main Filter Navigation */}
                    <div className="MainNavContainer flex gap-3 py-4">
                        {/* {studentsNavigation.map(nav => (
                            <MainNav
                                icon={nav.icon}
                                active={route().current(nav.route)}>
                                {nav.text}
                            </MainNav>))

                        } */}
                        <AddButton onClick={() => setIsCreateModalOpen(true)} icon={<FaPlus />}>
                            Add Co-Admin
                        </AddButton>
                    </div>
                    <div className="bg-white flex flex-col gap-4 relative shadow-md sm:rounded-lg overflow-hidden p-4">
                        {/* Table Controls */}
                        <div className="TableControlsContainer flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
                            <SearchBar
                                name='searchName'
                                value={searchManuscript}
                                variant="bordered"
                                onChange={(e) => setSearchManuscript(e.target.value)}
                                placeholder={'Search by name...'}
                            />

                            <div className="DropdownContainer flex gap-3">
                                <Dropdown classNames={{ content: "max-w-2" }}>
                                    <DropdownTrigger>
                                        <Button
                                            className="border border-customLightGray bg-white"
                                            radius="sm"
                                            disableRipple
                                            startContent={<FaTableList size={18} className="text-customGray" />}
                                            endContent={<FaChevronDown size={14} className="text-customGray" />}
                                        >
                                            <p className='text-gray-500 tracking-wide'>Entries per page:&nbsp;
                                                <span className="font-bold text-customBlue">{entriesPerPage}</span>
                                            </p>
                                        </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu >
                                        {[1, 5, 10, 15, 20, 25, 30].map((entry) => (
                                            <DropdownItem
                                                key={entry}
                                                className="!text-customGray"
                                                onClick={() => {
                                                    setEntriesPerPage(entry);
                                                }}
                                            >
                                                {entry}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                                <div className="flex h-full gap-1">

                                    <Button
                                        className="border border-customLightGray bg-white"
                                        radius="sm"
                                        disableRipple
                                        startContent={<FaFilter size={16} className="text-gray-400" />}
                                    // onClick={() => setIsFilterModalOpen(true)}
                                    >
                                        <p className='text-gray-500 tracking-wide'>Filter:&nbsp;
                                            {/* <span className="font-bold text-customBlue">{totalFilters}</span> */}
                                        </p>
                                    </Button>
                                    {/* {totalFilters > 0 &&
                                        <FaXmark
                                            size={33}
                                            className="h-full hover:bg-gray-400 cursor-pointer rounded-md px-2 text-gray-500 transition duration-200"
                                            onClick={handleClearFilters}
                                        />
                                    } */}
                                </div>


                            </div>
                        </div>

                        <div className="TableContainer border overflow-y-auto max-h-[45vh] ">
                            <div className="TableContainer border overflow-y-auto max-h-[45vh] ">
                                <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                    <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
                                        <tr>
                                            {/* Loads the tableHeader for a specific user type */}
                                            {tableHeader.map((header, index) => (
                                                <th key={index} scope="col" className="p-2">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-customGray hover:bg-gray-100">

                                            <td className="flex items-center content-center py-2">
                                                <User
                                                    // name={name}
                                                    // description={email}
                                                    avatarProps={{
                                                        // src: user_pic ? `/storage/${user_pic}` : '/images/default-profile.png',
                                                        alt: "profile-pic",
                                                        isBordered: true
                                                    }}
                                                />
                                            </td>
                                        </tr>

                                    </tbody>
                                </table >
                            </div>

                        </div>

                    </div>
                </div>
            </div >
        </AdminLayout >
    );
}
