import React from 'react';
import { AutocompleteItem } from '@nextui-org/react';

const AutocompleteList = ({ autocompleteItems, onClick = null }) => {
    if (!Array.isArray(autocompleteItems)) {
        return null;
    }

    return (
        <>
            {autocompleteItems.map(item => (
                <AutocompleteItem onClick={onClick} key={item}>
                    {item}
                </AutocompleteItem>
            ))}
        </>
    );
};

export default AutocompleteList;
