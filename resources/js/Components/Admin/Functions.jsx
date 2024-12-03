import { AutocompleteItem, Skeleton } from "@nextui-org/react";
import { showToast } from "../Toast";

// Update the URL without reloading the page

// For both next ui autocomplete onSelectionChange and onInputChange 
export const onChangeHandler = (setter, category, value) => {
    setter(prev => ({
        ...prev,
        plan: category === 'Current Plan' ? value : prev.plan,
        planStatus: category === 'Plan Status' ? value : prev.planStatus,
        dateCreated: category === 'Date Created' ? value : prev.dateCreated,
        branch: category === 'Branch' ? value : prev.branch,
        university: category === 'University' ? value : prev.university,
        department: category === 'Department' ? value : prev.department,
        course: category === 'Course' ? value : prev.course,
    }));
};

//  CUSTOM NEXT UI COMPONENT STYLES //




export const renderAutocompleteItems = (autocompleteItems, onClick = null) => {
    return Array.isArray(autocompleteItems)
        ? autocompleteItems.map(item => {
            return (
                <AutocompleteItem onClick={onClick} key={item}>
                    {item}
                </AutocompleteItem>
            );
        })
        : null;
};
