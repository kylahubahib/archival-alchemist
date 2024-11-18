
import React, { useState, } from "react";
import { RiArchiveStackFill } from "react-icons/ri";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Breadcrumbs, BreadcrumbItem, Accordion, AccordionItem, Avatar, Image, Card, CardHeader, Divider, CardBody, CardFooter } from "@nextui-org/react";
import { FaTableList, FaFolder } from "react-icons/fa6";
import { MdLibraryBooks } from "react-icons/md";
import { FaChevronDown, FaChevronLeft, FaFilter, FaTags, FaUniversity, FaUsers } from "react-icons/fa";
import PageHeader from '@/Components/Admins/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchBar from "@/Components/Admins/SearchBar";
import MainNav from "@/Components/MainNav";
import { Head, Link } from "@inertiajs/react";



export default function Archives({ auth }) {
    const [searchManuscript, setSearchManuscript] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const archivesNavigation = [
        { text: 'Folders', icon: <RiArchiveStackFill />, route: 'archives' },
        { text: 'Manuscripts', icon: <MdLibraryBooks />, route: 'archives' },
    ];


    return (
        <AdminLayout
            user={auth.user}
        >
            <div>
                <PageHeader>ARCHIVES</PageHeader>
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-4">

                    {/* Main Filter Navigation */}
                    <div className="MainNavContainer flex gap-3 py-4">

                        {
                            archivesNavigation.map((nav, index) =>
                                <MainNav
                                    key={index}
                                    icon={nav.icon}
                                    active={route().current('archives')}
                                // onClick={() => setIsUserTypeNavClicked(true)}
                                >
                                    {nav.text}
                                </MainNav>
                            )
                        }


                    </div>
                    <div className="bg-white flex flex-col gap-3 relative shadow-md sm:rounded-lg overflow-hidden p-4">

                        {/* Table Controls */}
                        <div className="w-full gap-10 content-start flex max-sm:flex-col max-sm:gap-3">
                            <div className="w-full flex-2">
                                <Breadcrumbs size="lg" variant="solid">
                                    <BreadcrumbItem>Universities</BreadcrumbItem>
                                    <BreadcrumbItem>Branches</BreadcrumbItem>
                                    <BreadcrumbItem>Deparments</BreadcrumbItem>
                                    <BreadcrumbItem>Courses</BreadcrumbItem>
                                    <BreadcrumbItem>Manuscripts</BreadcrumbItem>
                                </Breadcrumbs>

                            </div>

                            <div className="auto w-full mr-auto flex max-md:flex-col flex-1 gap-3">
                                <SearchBar
                                    name='searchName'
                                    value={searchManuscript}
                                    variant="bordered"
                                    onChange={(e) => setSearchManuscript(e.target.value)}
                                    placeholder={'Search by name...'}
                                    className="flex-1 min-w-[300px]"
                                />
                                <Button
                                    className="border flex-1 min-w-[100px] min-h-[35px] border-customLightGray bg-white"
                                    radius="sm"
                                    disableRipple
                                    startContent={<FaFilter size={16} className="text-gray-400" />}
                                // onClick={() => setIsFilterModalOpen(true)}
                                >
                                    <p className='text-gray-500 tracking-wide'>Filter:&nbsp;
                                        {/* <span className="font-bold text-customBlue">{totalFilters}</span> */}
                                    </p>
                                </Button>
                            </div>
                        </div>

                        {/* <div className="border grid grid-cols-1 content-start sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 m-0 gap-x-5 gap-y-3 justify p-3  overflow-y-auto w-full min-h-[53vh] max-h-[100vh]">
                            <button className="flex w-full gap-3 rounded-md items-center border p-3 h-10 hover:bg-gray-100">
                                <FaFolder className="text-orange-400 w-5 h-5" />
                                <span className="font-bold text-customGray">
                                    Cebu Technological University
                                </span>
                            </button>
                            <button className="flex w-full gap-3 rounded-md items-center border p-3 h-10 hover:bg-gray-100">
                                <FaFolder className="text-orange-400 w-5 h-5" />
                                <span className="font-bold text-customGray">
                                    Cebu Technological University
                                </span>
                            </button>
                            <button className="flex w-full gap-3 rounded-md items-center border p-3 h-10 hover:bg-gray-100">
                                <FaFolder className="text-orange-400 w-5 h-5" />
                                <span className="font-bold text-customGray">
                                    Cebu Technological University
                                </span>
                            </button>
                            <button className="flex w-full gap-3 rounded-md items-center border p-3 h-10 hover:bg-gray-100">
                                <FaFolder className="text-orange-400 w-5 h-5" />
                                <span className="font-bold text-customGray">
                                    Cebu Technological University
                                </span>
                            </button>

                        </div> */}
                        {/* <Accordion variant="splitted" className="grid grid-cols-1 shadow content-start sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 m-0 gap-x-5 gap-y-3 justify p-3 overflow-y-auto w-full min-h-[53vh] max-h-[100vh]">
                            <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
                                <div>see</div>
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                                <div>seess</div>
                            </AccordionItem>
                            <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                                <div>see</div>
                            </AccordionItem>
                            <AccordionItem key="4" aria-label="Accordion 4" title="Accordion 4">
                                <div>see</div>
                            </AccordionItem>
                        </Accordion> */}
                        <div className="border flex py-4 px-2 gap-5 w-full flex-row max:lg:gap-2 max-sm:flex-col">
                            <Accordion variant="splitted">
                                <AccordionItem
                                    key="1"
                                    aria-label="Chung Miller"
                                    startContent={
                                        <Image
                                            radius="none"
                                            isZoomed
                                            width={50}
                                            alt="NextUI Fruit Image with Zoom"
                                            src="/images/manuscript.png"
                                            className=""
                                            removeWrapper
                                        />
                                    }
                                    title={<span className="font-bold mt- text-customBlue tracking-wide">Archival Alchemist</span>}
                                    subtitle={
                                        <div className="text-gray-400 flex flex-col gap-[1px] m-0 text-xs">
                                            <span><FaUsers className="inline mr-2" /><strong>Authors: </strong>Kyla, David, Jeylsie, Carmel</span>
                                            <span><FaTags className="inline mr-2" /><strong>Tags: </strong>Laravel, PHP, react js</span>
                                        </div>
                                    }
                                    indicator={<FaChevronLeft />}
                                    className="min-w-300px"
                                >
                                    <div>
                                        <span className="font-bold tracking-wide text-customGray">Abstract</span>
                                        <hr />
                                        <p className="text-sm text-gray-500 text-justify indent-10 mt-2 ">                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque venenatis pellentesque efficitur. Morbi sit amet sapien in nisl scelerisque tristique porttitor ac sem. Sed sit amet massa feugiat, suscipit nisi id, dapibus nibh. Vestibulum vitae nisl fermentum, aliquet felis a, hendrerit odio. Pellentesque tempus, felis a tincidunt finibus, tellus turpis pellentesque velit, eget malesuada nisi velit eget odio. Suspendisse condimentum nibh metus, eget cursus sapien fermentum vitae. Maecenas ut odio nisl. Cras ultrices congue lorem, eu mollis nunc consequat nec. Pellentesque vehicula euismod nunc maximus finibus. Sed malesuada lacus volutpat ligula eleifend sollicitudin. Aliquam ut convallis risus, sed eleifend ligula. Sed scelerisque libero et egestas fermentum.
                                        </p>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                            <Accordion variant="splitted">
                                <AccordionItem
                                    key="1"
                                    aria-label="Chung Miller"
                                    startContent={
                                        <Image
                                            radius="none"
                                            isZoomed
                                            width={50}
                                            alt="NextUI Fruit Image with Zoom"
                                            src="/images/manuscript.png"
                                            className="rounded-none"
                                            removeWrapper
                                        />
                                    }
                                    className="min-w-300px"
                                    subtitle="4 unread messages"
                                    title="Chung Miller"
                                >
                                    <div>
                                        <p>Abstract</p>
                                        <hr />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque venenatis pellentesque efficitur. Morbi sit amet sapien in nisl scelerisque tristique porttitor ac sem. Sed sit amet massa feugiat, suscipit nisi id, dapibus nibh. Vestibulum vitae nisl fermentum, aliquet felis a, hendrerit odio. Pellentesque tempus, felis a tincidunt finibus, tellus turpis pellentesque velit, eget malesuada nisi velit eget odio. Suspendisse condimentum nibh metus, eget cursus sapien fermentum vitae. Maecenas ut odio nisl. Cras ultrices congue lorem, eu mollis nunc consequat nec. Pellentesque vehicula euismod nunc maximus finibus. Sed malesuada lacus volutpat ligula eleifend sollicitudin. Aliquam ut convallis risus, sed eleifend ligula. Sed scelerisque libero et egestas fermentum.
                                    </div>
                                </AccordionItem>
                            </Accordion>


                        </div>




                    </div>
                </div >
            </div >
        </AdminLayout >
    );
}
