import { router } from "@inertiajs/react";
import { encodeURLParam, sanitizeURLParam, updateURLParams } from "./common-utils";
import axios from "axios";
import { showToast } from "@/Components/Toast";

export const getTotalFilters = (URLParams, filterParamList) => {
    let count = 0;

    filterParamList.filter(param => param in URLParams) // Note: URLParams must be an object like from the route().params
        .forEach(() => count++);

    return count;
}

// For both next ui autocomplete onSelectionChange and onInputChange and for filter purposes 
export const autocompleteOnChangeHandler = (setter, category, value) => {
    setter(prev => ({
        ...prev,
        // You can add a custom filter keys here 
        plan: category === 'Current Plan' ? value : prev.plan,
        planStatus: category === 'Plan Status' ? value : prev.planStatus,
        dateCreated: category === 'Date Created' ? value : prev.dateCreated,
        branch: category === 'Branch' ? value : prev.branch,
        university: category === 'University' ? value : prev.university,
        department: category === 'Department' ? value : prev.department,
        course: category === 'Course' ? value : prev.course,
    }));
};

export const formatAdminRole = (role) => {
    switch (role) {
        case 'institution_admin':
            return 'Institution Admin';
        case 'co_institution_admin':
            return 'Co-Institution Admin';
        case 'super_admin':
            return 'Super Admin';
        case 'co_super_admin':
            return 'Co-Super Admin';
        default:
            return 'Unknown Role';
    }
};

/* =============  ARCHIVES PAGE UTILITIES  =========== */
export const fetchSearchFilteredData = async (routeName, requiredRouteParam, params, searchTerm, setIsDataLoading,
    setFilesToDisplay, setHasFilteredData) => {

    setIsDataLoading(true);

    try {
        const response = await axios.get(route(routeName, { ...requiredRouteParam }), {
            params: {
                ...params,
                search: sanitizeURLParam(searchTerm),
            },
        });

        updateURLParams('search', encodeURLParam(searchTerm.trim()));
        setFilesToDisplay(response.data);

        response.data.length > 0 ? setHasFilteredData(true) : setHasFilteredData(false);

    } catch (error) {
        console.error("Error fetching search results:", error);
    } finally {
        setIsDataLoading(false);
    }
};

export const loadPageSetup = (params, fileCategoryCollections, setFileCategories, setFilesToDisplay,
    firstParam = 'university', defaultFileCategory = 'Universities') => {

    // Get the params that are present only in the file category collections
    const existingParams = fileCategoryCollections
        .map(category => params[category.param])
        .filter(value => value != null);

    // Check using the first param that is connected to the first file category since it append the url params from the very first click
    if (firstParam in params && params[firstParam] !== undefined) {
        setFileCategories(existingParams);

        const lastParamValue = existingParams[existingParams.length - 1];

        console.log('existingParams', existingParams);
        console.log('lastParamValue', lastParamValue);

        // Get the index value of the last param that is present in the file category collection params
        const currentCategoryIndex = fileCategoryCollections.findIndex(({ files }) =>
            files.some(file => file.category_on_select === lastParamValue)
        );

        console.log('currentCategoryIndex', currentCategoryIndex);

        // Restore file categories along with files that needed to be displayed
        if (currentCategoryIndex !== -1) {
            const nextFileCategoryCollections = fileCategoryCollections[currentCategoryIndex + 1];
            const nextFiles = nextFileCategoryCollections?.files || [];
            const nextFileCategory = nextFileCategoryCollections?.category || [];

            setFileCategories(prevCategories => [...prevCategories, nextFileCategory]);
            setFilesToDisplay(nextFiles);
        } else { // Since the files in file category collections will be cleared if there's search param so we manually just append the 

        }
    } else {
        setFileCategories([defaultFileCategory]);
    }
};

export const loadSearchBarPlaceholder = (fileCategories, fileCategoryCollections, setSearchBarPlaceholder) => {
    // Check if the category that's not being renamed exists in both fileCategories and fileCategoryCollections
    const matchingCategory = fileCategories.find(category =>
        fileCategoryCollections.some(collection => collection.category === category)
    );

    // Determine the placeholder text based on the matching category
    let placeholderText;

    if (!matchingCategory) {
        return null;
    }

    if (matchingCategory === "Universities") {
        placeholderText = "Search by university name...";
    } else if (matchingCategory === "Manuscripts") {
        placeholderText = "Search by manuscript title or tags...";
    } else if (matchingCategory === "Branches") {
        placeholderText = "Search by branch name...";
    } else {
        const categoryName = matchingCategory.slice(0, -1).toLowerCase(); // Singular form of category
        placeholderText = `Search by ${categoryName} name...`;
    }

    setSearchBarPlaceholder(placeholderText);
};

export const loadFilesByCategory = (lastFileCategory, fileCategoryCollections, setFilesToDisplay) => {
    fileCategoryCollections.forEach(({ files, category }) => {
        if (category === lastFileCategory) {
            setFilesToDisplay(files);
        }
    });
};

export const getLastFileCategory = (setLastFileCategory, fileCategories) => {
    setLastFileCategory(fileCategories[fileCategories.length - 1]);
}

export const handleFileCategoryClick = (routeName, params, fileCategoryCollections, fileCategories,
    setFileCategories, selectedCategory, setSearchTerm, setIsDataLoading) => {
    setSearchTerm('');

    console.log('Initial fileCategories:', fileCategories);

    // Get the index of the selected file category
    const selectedIndex = fileCategories.indexOf(selectedCategory);
    if (selectedIndex === -1) {
        console.error('Selected category not found in fileCategories.');
        return;
    }

    // Iterate through fileCategoryCollections to find the selected file category
    fileCategoryCollections.forEach(({ files, category }) => {
        if (files.some(file => file.category_on_select === selectedCategory)) {
            // Update fileCategories to replace the previously selected category and remove its subsequent categories
            setFileCategories(prevCategories => {
                const updatedCategories = [...prevCategories];
                updatedCategories[selectedIndex] = category; // Replace the selected file category with the new category
                return updatedCategories.slice(0, selectedIndex + 1); // Keep only categories up to and including the selected category
            });

            // Store the categories from the selected category onward
            const removedCategories = fileCategories.slice(selectedIndex);

            console.log('Removed categories:', removedCategories);

            // Initialize updatedParams with the current values from params to preserve the current state in the URL
            const updatedParams = { ...params };

            // Remove the parameters for the selected category and those after it
            removedCategories.forEach(removedCategory => {
                const paramKey = Object.keys(params).find(key => params[key] === removedCategory);
                if (paramKey) updatedParams[paramKey] = null;
            });

            console.log('Updated params:', updatedParams);

            router.get(route(routeName, updatedParams), {}, {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setIsDataLoading(true),
                onFinish: () => setIsDataLoading(false),
            });
        }
    });
};

export const handleFileClick = (routeName, params, fileCategoryCollections, setSearchTerm, fileCategories,
    setFileCategories, setFilesToDisplay, setIsDataLoading, selectedFileName) => {
    setSearchTerm('');

    // Iterate through fileCategoryCollections to find the selected file name
    fileCategoryCollections.forEach(({ files, param, category }, index) => {
        if (files.some(file => file.category_on_select === selectedFileName)) {
            // Get the index of the file category that was renamed after a file was selected within that file category
            const selectedCategoryIndex = fileCategories.indexOf(category);

            // Get the index of the next file category and its files after a file is selected in the previous file category
            const nextFileCategoryCollection = fileCategoryCollections[index + 1];
            const nextFiles = nextFileCategoryCollection ? nextFileCategoryCollection.files : [];
            const nextFileCategory = nextFileCategoryCollection ? nextFileCategoryCollection.category : null;

            // Append the next file category and rename the previous category based on its selected file name
            setFileCategories(prevCategories => {
                const updatedCategories = [...prevCategories, nextFileCategory];
                updatedCategories[selectedCategoryIndex] = selectedFileName;
                return updatedCategories;
            });

            // Update the files to display for the appended file category
            setFilesToDisplay(nextFiles);

            // Append the intended param for the selected file name
            router.get(route(routeName, { ...params, [param]: selectedFileName }), {}, {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setIsDataLoading(true),
                onFinish: () => setIsDataLoading(false)
            });
        }
    });
};

export const handleDownloadPDFClick = async (routeName, id, title) => {
    const downloadUrl = route(routeName, { id, title });

    try {
        const response = await axios.get(downloadUrl, {
            responseType: 'blob',
        });

        const fileBlob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileBlob);
        link.download = title;
        link.click();
    } catch (error) {
        showToast('error', 'PDF not found');
    }
};

export const handleOpenPDFClick = (routeName, id, title) => {
    try {
        const openUrl = route(routeName, { id, title });
        window.open(openUrl, '_blank');
    } catch (error) {
        showToast('error', 'PDF not found');
    }
};

export const handleSetEntriesPerPageClick = async (routeName, selectedEntries, setEntriesPerPage, setEntriesData) => {
    console.log('setEntriesPerPage:', setEntriesPerPage);
    setEntriesPerPage(selectedEntries);

    try {
        const response = await axios.get(route(routeName, { params }), {
            params: {
                entries: entries,
                search: params.search,
            }
        });
        setEntriesData(response.data);
        updateURLParams('entries', entries);
        updateURLParams('page', null);

    } catch (error) {
        showToast('error', 'Failed to set entries');
    }
};

export const handleManDocVisibilityFilterClick = (routeName, params) => {
    router.get(route(routeName, { ...params }), {}, {
        preserveState: true, preserveScroll: true
    })
}