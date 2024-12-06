
import React, { useState, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem, Card, CardBody, Chip } from "@nextui-org/react";
import { FaBookOpen, FaGear } from "react-icons/fa6";
import { MdPrivacyTip } from "react-icons/md";
import { FaEye, FaTags } from "react-icons/fa";
import { ImArrowDown } from "react-icons/im";
import { AnimatePresence, motion } from 'framer-motion';
import { getAnimationProps, updateURLParams } from "@/Utils/common-utils";
import {
    fetchSearchFilteredData, getLastFileCategory, handleDownloadPDFClick, handleFileCategoryClick, handleFileClick, handleOpenPDFClick,
    loadFilesByCategory, loadPageSetup, loadSearchBarPlaceholder
} from "@/Utils/admin-utils";
import PageHeader from '@/Components/Admin/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchBar from "@/Components/Admin/SearchBar";
import StarRating from "@/Components/StarRating";
import NoDataPrompt from "@/Components/Admin/NoDataPrompt";
import FolderSkeleton from "@/Components/Admin/FolderSkeleton";
import ManuscriptSkeleton from "@/Components/Admin/ManuscriptSkeleton";

// Separate functions to be used in institution archives as well.
export const renderTableControls = (routeName, params, fileCategoryCollections, fileCategories, setFileCategories,
    handleFileCategoryClick, lastFileCategory, searchTerm, setSearchTerm, searchBarPlaceholder, setIsDataLoading) => {

    return (
        <div className="w-full gap-10 content-start flex max-sm:flex-col max-sm:gap-3">
            {/* FILE CATEGORIES */}
            <div className="w-full flex-2">
                <Breadcrumbs size="lg" variant="solid">
                    {fileCategories.map((category) => (
                        <BreadcrumbItem
                            key={category}
                            onClick={() =>
                                handleFileCategoryClick(
                                    routeName,
                                    params,
                                    fileCategoryCollections,
                                    fileCategories,
                                    setFileCategories,
                                    category,
                                    setSearchTerm,
                                    setIsDataLoading
                                )
                            }
                        >
                            {category}
                        </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
            </div>

            {/* SEARCH BAR */}
            <div className="auto w-full flex max-md:flex-col flex-1 gap-3">
                <SearchBar
                    name="searchName"
                    value={searchTerm}
                    variant="bordered"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchBarPlaceholder}
                    isDisabled={fileCategoryCollections.some(file => Array.isArray(file.files) && file.files.length === 0 && file.category === lastFileCategory)}
                    className="flex-1 min-w-[300px]"
                />
            </div>
        </div>
    );
};

export const renderFolders = (routeName, params, filesToDisplay, setFilesToDisplay, handleFileClick, fileCategoryCollections,
    fileCategories, setFileCategories, setSearchTerm, hasFilteredData, getAnimationProps, isDataLoading, setIsDataLoading) => {

    return (
        <div className="p-4 border grid grid-cols-1 content-start sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 m-0 gap-x-5 gap-y-3 justify overflow-y-auto w-full min-h-[53vh] max-h-[100vh]">
            {!isDataLoading ? (
                filesToDisplay.length > 0 ? (
                    filesToDisplay.map((file, index) => (
                        <AnimatePresence mode="wait" key={index}>
                            <motion.div
                                key={index}
                                className="flex items-center gap-3 w-full shadow-md cursor-pointer rounded-md border p-3 text-wrap hover:bg-gray-100"
                                onClick={() => handleFileClick(
                                    routeName,
                                    params,
                                    fileCategoryCollections,
                                    setSearchTerm,
                                    fileCategories,
                                    setFileCategories,
                                    setFilesToDisplay,
                                    setIsDataLoading,
                                    file.category_on_select
                                )}

                                {...getAnimationProps({ animationType: "fadeUp", index })}
                            >
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                    <img
                                        src="/images/folder.png"
                                        alt="file image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex">
                                    <span className="text-customGray">
                                        {file.sub_name}{" "}
                                        <strong>
                                            {file.sub_name
                                                ? `(${file.category_on_select})`
                                                : file.category_on_select}
                                        </strong>
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ))
                ) : (
                    <div className="col-span-5">
                        <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                    </div>
                )
            ) : (
                <FolderSkeleton />
            )}
        </div>
    );
};

export const renderManuscripts = (adminType, openManuscriptRoute, downloadManuscriptRoute, handleOpenPDFClick, handleDownloadPDFClick,
    handleManuscriptVisibilityClick = null, filesToDisplay, hasFilteredData, getAnimationProps, isDataLoading) => {

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4 h-full w-full overflow-y-auto border-1">
            {!isDataLoading ? (
                filesToDisplay.length > 0 ? (
                    filesToDisplay.map((file, index) => (
                        <AnimatePresence mode="wait" key={index}>
                            <motion.div
                                key={index}
                                className="flex items-start h-full w-full group"
                                {...getAnimationProps({ animationType: 'fadeUp', index })}
                            >
                                <Card isHoverable className="w-full shadow-md border-1">
                                    <CardBody>
                                        <div className="flex h-full gap-4 items-center">
                                            <img
                                                alt="Manuscript Pic"
                                                src="/images/manuscript.png"
                                                className="h-[90px] sm:h-[100px] w-auto group-hover:scale-125 group-hover:mx-2 transition-all duration-200"
                                            />

                                            {/* MANUSCRIPT INFO */}
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-customBlue tracking-wide">
                                                    {file.man_doc_title}
                                                </h3>

                                                <div>
                                                    <StarRating interactive={false} initialRating={file.man_doc_rating} size={3} />
                                                </div>

                                                <div className="text-gray-500 text-sm mt-1">
                                                    <strong>By: </strong>
                                                    {Array.isArray(file.authors) ? file.authors.join(', ') : 'No authors available'}
                                                    <strong> ({file.capstone_group})</strong>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                                                    <div className="flex flex-col gap-2 m-0 p-0">
                                                        <div className="text-gray-400 flex flex-wrap items-center gap-2 text-xs">
                                                            <span className="flex items-center"><MdPrivacyTip />&nbsp;{file.man_doc_visibility}</span>
                                                            <span className="flex items-center"><FaEye />&nbsp;{file.man_doc_view_count}</span>

                                                            {/* ACTION BUTTONS */}
                                                            <button
                                                                className="flex items-center"
                                                                onClick={() => handleOpenPDFClick(openManuscriptRoute, file.id, file.man_doc_title)}
                                                            >
                                                                <FaBookOpen className="flex-shrink-0" />&nbsp;Open PDF
                                                            </button>
                                                            <button
                                                                className="flex items-center"
                                                                onClick={() => handleDownloadPDFClick(downloadManuscriptRoute, file.id, file.man_doc_title)}
                                                            >
                                                                <ImArrowDown className="flex-shrink-0" />&nbsp;Download PDF
                                                            </button>

                                                            {/* Only the institution admin can manage the manuscript visiblitiy */}
                                                            {adminType === 'institution_admin' && (
                                                                <button
                                                                    className="flex items-center"
                                                                    onClick={() => handleManuscriptVisibilityClick(file.manuscript_id, file.man_doc_title, file.man_doc_visibility)}
                                                                >
                                                                    <FaGear className="flex-shrink-0" />&nbsp;Manage Visibility
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* TAGS */}
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            {Array.isArray(file.tag_names) ? file.tag_names.map(tag => (
                                                                <Chip
                                                                    key={tag}
                                                                    startContent={<FaTags className="mr-1" />}
                                                                    className="px-2"
                                                                    size="sm"
                                                                    variant="flat"
                                                                    color="primary"
                                                                >
                                                                    {tag}
                                                                </Chip>
                                                            )) : 'No tags available'}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    ))
                ) :
                    (<div className="col-span-2">
                        <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                    </div>)
            ) :
                (<ManuscriptSkeleton />)
            }
        </div>
    )
};

export default function SuperAdminArchives({ auth, folders, manuscripts, search }) {
    // Extract the needed data from the grouped server-side data
    const { universityFolders, branchFolders, departmentFolders, courseFolders, sectionFolders } = folders;

    const [fileCategories, setFileCategories] = useState([]);
    const [filesToDisplay, setFilesToDisplay] = useState([]);
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [searchBarPlaceholder, setSearchBarPlaceholder] = useState('');
    const [lastFileCategory, setLastFileCategory] = useState('');
    const [isDataLoading, setIsDataLoading] = useState(false);

    // Restore the searchTerm value after a page reload by setting the default value from the search prop
    const [searchTerm, setSearchTerm] = useState(search || '');

    const fileCategoryCollections = [
        { files: universityFolders, param: 'university', category: 'Universities' },
        { files: branchFolders, param: 'branch', category: 'Branches' },
        { files: departmentFolders, param: 'department', category: 'Departments' },
        { files: courseFolders, param: 'course', category: 'Courses' },
        { files: sectionFolders, param: 'section', category: 'Sections' },
        { files: manuscripts, param: null, category: 'Manuscripts' },
    ];

    useEffect(() => {
        fileCategoryCollections.forEach((category, index) => {
            // Log the actual folder arrays (files like universityFolders, branchFolders, etc.)
            console.log(`${category.category} folder:`, category.files);
        });
    }, [fileCategoryCollections]);

    useEffect(() => {
        console.log('universityFolders', universityFolders);

    }, [universityFolders]);

    const params = route().params;

    console.log('params', params);

    useEffect(() => {
        console.log('fileCategories', fileCategories)
    }, [fileCategories]);

    useEffect(() => {
        loadPageSetup(params, fileCategoryCollections, setFileCategories, setFilesToDisplay);
    }, []);

    useEffect(() => {
        loadFilesByCategory(lastFileCategory, fileCategoryCollections, setFilesToDisplay);
    }, [universityFolders, branchFolders, departmentFolders, courseFolders, sectionFolders, manuscripts]);

    useEffect(() => {
        loadSearchBarPlaceholder(fileCategories, fileCategoryCollections, setSearchBarPlaceholder);
        getLastFileCategory(setLastFileCategory, fileCategories);
    }, [fileCategories]);

    // Search filter
    useEffect(() => {
        setIsDataLoading(true);

        const debounce = setTimeout(() => {
            fetchSearchFilteredData('archives.filter', null, params, searchTerm, setIsDataLoading,
                setFilesToDisplay, setHasFilteredData);
        }, 300);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);

    return (
        <AdminLayout
            user={auth.user}
        >
            <div className="p-4 flex flex-col gap-5">
                <div className="flex">
                    <PageHeader>ARCHIVES</PageHeader>
                </div>

                <div className="max-w-7xl w-full mx-auto sm:px-2 lg:px-4">
                    <div className="bg-white flex flex-col gap-3 h-[75dvh] shadow-md sm:rounded-lg p-4">
                        {/* TABLE CONTROLS */}
                        {renderTableControls('archives.filter', params, fileCategoryCollections, fileCategories, setFileCategories, handleFileCategoryClick,
                            lastFileCategory, searchTerm, setSearchTerm, searchBarPlaceholder, setIsDataLoading)}

                        {/* FOLDERS */}
                        {lastFileCategory !== 'Manuscripts' && (
                            renderFolders('archives.filter', params, filesToDisplay, setFilesToDisplay, handleFileClick, fileCategoryCollections, fileCategories,
                                setFileCategories, setSearchTerm, hasFilteredData, getAnimationProps, isDataLoading, setIsDataLoading)
                        )}

                        {/* MANUSRIPTS */}
                        {lastFileCategory === 'Manuscripts' && (
                            renderManuscripts('super-admin', 'archives.open-manuscript', 'archives.download-manuscript', handleOpenPDFClick, handleDownloadPDFClick,
                                null, filesToDisplay, hasFilteredData, getAnimationProps, isDataLoading)
                        )}
                    </div>
                </div >
            </div >
        </AdminLayout >
    );
}