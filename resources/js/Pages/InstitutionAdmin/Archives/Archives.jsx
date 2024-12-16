import React, { useState, useEffect } from "react";
import { decodeURLParam, getAnimationProps, updateURLParams } from "@/Utils/common-utils";
import {
    fetchSearchFilteredData, getLastFileCategory, handleDownloadPDFClick, handleFileCategoryClick, handleFileClick, handleOpenPDFClick,
    loadFilesByCategory, loadPageSetup, loadSearchBarPlaceholder
} from "@/Utils/admin-utils";
import PageHeader from '@/Components/Admin/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import { renderFolders, renderManuscripts, renderTableControls } from "@/Pages/SuperAdmin/Archives/Archives";
import ManuscriptVisibility from "./ManuscriptVisibility";

export default function InsAdminArchives({ auth, folders, manuscripts, search }) {
    // Extract the needed data from the grouped server-side data
    const { universityFolders, branchFolders, departmentFolders, courseFolders, sectionFolders } = folders;
    const [manuscriptId, setManuscriptId] = useState(null);
    const [manuscriptTitle, setManuscriptTitle] = useState('');
    const [manuscriptVisibility, setManuscriptVisibility] = useState('');
    const [isManuscriptVisibilityModalOpen, setIsManuscriptVisibilityModalOpen] = useState(false);

    const [fileCategories, setFileCategories] = useState([]);
    const [filesToDisplay, setFilesToDisplay] = useState([]);
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [searchBarPlaceholder, setSearchBarPlaceholder] = useState('');
    const [lastFileCategory, setLastFileCategory] = useState('');
    const [isDataLoading, setIsDataLoading] = useState(false);

    // Restore the searchTerm value after a page reload by setting the default value from the search prop
    const [searchTerm, setSearchTerm] = useState(decodeURLParam(search) || '');

    const fileCategoryCollections = [
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
        console.log('manuscripts', manuscripts);
    }, [manuscripts]);

    const params = route().params;

    console.log('params', params);

    useEffect(() => {
        console.log('fileCategories', fileCategories)
    }, [fileCategories]);

    useEffect(() => {
        loadPageSetup(params, fileCategoryCollections, setFileCategories, setFilesToDisplay, 'department', 'Departments');
    }, []);

    useEffect(() => {
        loadFilesByCategory(lastFileCategory, fileCategoryCollections, setFilesToDisplay);
    }, [universityFolders, branchFolders, departmentFolders, courseFolders, sectionFolders, manuscripts, fileCategoryCollections]);

    useEffect(() => {
        loadSearchBarPlaceholder(fileCategories, fileCategoryCollections, setSearchBarPlaceholder);
        getLastFileCategory(setLastFileCategory, fileCategories);
    }, [fileCategories, fileCategoryCollections]);

    // Filter data
    useEffect(() => {
        setIsDataLoading(true);


        const debounce = setTimeout(() => {
            fetchSearchFilteredData('institution-archives.filter', null, params, searchTerm, setIsDataLoading,
                setFilesToDisplay, setHasFilteredData);
        }, 300);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);

    const handleManuscriptVisibilityClick = (id, title, visibility) => {
        setIsManuscriptVisibilityModalOpen(true);
        setManuscriptId(id);
        setManuscriptTitle(title);
        setManuscriptVisibility(visibility);
    }

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
                        {renderTableControls('institution-archives.filter', params, fileCategoryCollections, fileCategories, setFileCategories, handleFileCategoryClick,
                            lastFileCategory, searchTerm, setSearchTerm, searchBarPlaceholder, setIsDataLoading)}

                        {/* FOLDERS */}
                        {lastFileCategory !== 'Manuscripts' && (
                            renderFolders('institution-archives.filter', params, filesToDisplay, setFilesToDisplay, handleFileClick, fileCategoryCollections, fileCategories,
                                setFileCategories, setSearchTerm, hasFilteredData, getAnimationProps, isDataLoading, setIsDataLoading)
                        )}

                        {/* MANUSRIPTS */}
                        {lastFileCategory === 'Manuscripts' && (
                            renderManuscripts('institution_admin', 'institution-archives.open-manuscript', 'institution-archives.download-manuscript',
                                handleOpenPDFClick, handleDownloadPDFClick, handleManuscriptVisibilityClick, filesToDisplay, hasFilteredData, getAnimationProps, isDataLoading)
                        )}
                    </div>
                </div >
            </div >

            {/* Modals */}
            <ManuscriptVisibility
                isOpen={isManuscriptVisibilityModalOpen}
                onClose={() => setIsManuscriptVisibilityModalOpen(false)}
                id={manuscriptId}
                title={manuscriptTitle}
                visibility={manuscriptVisibility}
            />
        </AdminLayout >
    );
}               