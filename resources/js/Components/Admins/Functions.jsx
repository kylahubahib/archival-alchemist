import { AutocompleteItem, Chip } from "@nextui-org/react";

// Update the URL without reloading the page
export const updateUrl = (paramKey, paramValue) => {
    const urlParams = new URLSearchParams(window.location.search);

    if (paramValue === null) {
        urlParams.delete(paramKey);
    } else {
        urlParams.set(paramKey, paramValue);
    }

    window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`);
};

export const getAcronymAndOrigText = (str) => {
    if (typeof str === 'string') {
        let acronym;

        // Handle special case for acronyms with "of" in the string
        if (str === 'College of Technology') {
            acronym = 'COT';
        } else {
            acronym = (str.match(/\b[A-Z]/g) || []).join('');
        }

        return { origText: str, acronym };
    }

    return { origText: '', acronym: '' };
};


export const capitalize = (str) => {
    return str.replace(/^(.)/, (match) => match.toUpperCase());
}

export const titleCase = (str) => {
    return str
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(' '); // Join the words back into a single string
}

export const parseDate = (date) => {
    const padZero = (num) => String(num).padStart(2, '0');
    const formatDate = (d) => d ? `${d.year}-${padZero(d.month)}-${padZero(d.day)}` : null;

    const startDate = formatDate(date?.start);
    const endDate = formatDate(date?.end);

    return `${startDate} - ${endDate}`;
};

export const padZero = (num) => String(num).padStart(2, '0');

export const parseDateTime = (date) => {
    const formatDate = (d) => d ? `${d.year}-${padZero(d.month)}-${padZero(d.day)} ${padZero(d.hour)}:${padZero(d.minute)}:00` : null;

    const startDate = formatDate(date?.start);
    const endDate = formatDate(date?.end);

    return startDate && endDate ? `${startDate} - ${endDate}` : null;
};

export const encodeParam = (param) => {
    // Assign a default null value to remove the param in the url
    return param ? encodeURIComponent(param?.trim()) : null;
}

export const encodeAllParams = (params) => {
    Object.keys(params).forEach(key => {
        params[key] = encodeParam(params[key]);
    });
};

export const sanitizeParam = (param) => {
    const trimmedValue = param?.trim();
    return trimmedValue === "" ? null : trimmedValue;
};

export const setStatusChip = (status) => {
    switch (status) {
        case 'active':
            return <Chip size='sm' color='success' variant='flat'>Active</Chip>;
        case 'deactivated':
            return <Chip size='sm' color='danger' variant='flat'>Deactivated</Chip>;
        case 'paused':
            return <Chip size='sm' color='default' variant='flat'>Pending</Chip>;
        default:
            return <Chip size='sm' color='success' variant='flat'>Active</Chip>;
    }
};

export const renderAutocompleteItems = (category, autocompleteItems, onClick = null) => {
    return Array.isArray(autocompleteItems)
        ? autocompleteItems.map(item => {
            let itemKey = item;
            let itemLabel = item;

            // Add your own category here
            const categoriesWithAcronym = ['University', 'Branch', 'Department', 'Course'];
            const categoriesWithCapitalization = ['Plan Status'];

            // Then your own condition here
            if (categoriesWithAcronym.includes(category)) {
                const { origText, acronym } = getAcronymAndOrigText(item);
                itemKey = origText;
                itemLabel = acronym;
            }

            if (categoriesWithCapitalization.includes(category)) {
                itemLabel = capitalize(item);
            }

            return (
                <AutocompleteItem onClick={onClick} key={itemKey}>
                    {itemLabel}
                </AutocompleteItem>
            );
        })
        : null;
};

// For both autocomplete onSelectionChange and onInputChange 
export const onChangeHandler = ({ setter, category, value, forOnSelectionChange = false, forOnInputChange = false }) => {
    setter(prev => ({
        // Add additional keys here if needed for specific pages
        ...prev,
        plan: category === 'Current Plan' ? value : prev.plan,
        planStatus: category === 'Plan Status' ? value : prev.plan_status,
        dateCreated: category === 'Date Created' ? value : prev.date_created,
        branch: category === 'Branch' ? value : prev.branch,

        // For values with an acronym, assigns only the acronym value for onInputChange handler   
        university: (category === 'University' && forOnInputChange)
            ? { ...prev.university, acronym: value ?? prev.university.acronym }
            : (category === 'University' ? getAcronymAndOrigText(value) : prev.university),
        department: (category === 'Department' && forOnInputChange)
            ? { ...prev.department, acronym: value ?? prev.department.acronym }
            : (category === 'Department' ? getAcronymAndOrigText(value) : prev.department),
        course: (category === 'Course' && forOnInputChange)
            ? { ...prev.course, acronym: value ?? prev.course.acronym }
            : (category === 'Course' ? getAcronymAndOrigText(value) : prev.course),
    }));
};

//  CUSTOM NEXT UI COMPONENT STYLES //
export const inputClassNames = (propsClass = {}, styleProps = {}) => ({
    base: "tracking-wide pb-2",
    input: "border-none focus:ring-0 text-customGray",
    style: {  // Remove the default focus styles
        border: 'none',
        boxShadow: 'none',
        ...styleProps,
    },
    ...propsClass,
});

export const autocompleteInputProps = (propsClass = {}, styleProps = {}) => ({
    style: {
        border: 'none',
        boxShadow: 'none',
        marginBottom: '-10px',
        ...styleProps,
    },
    ...propsClass,
});

