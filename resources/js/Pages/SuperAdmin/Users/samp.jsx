admin-utils.js:261 Uncaught (in promise) TypeError: setEntriesPerPage is not a function
    at handleSetEntriesPerPageClick (admin-utils.js:261:5)
    at onClick (Users.jsx:139:48)



export const handleSetEntriesPerPageClick = async (routeName, setEntriesPerPage, entries, setEntriesData) => {
    setEntriesPerPage(entries);

export const renderTableControls = (routeName, searchVal, searchValSetter, searchBarPlaceholder, totalFilters,
    clearFiltersOnClick, isFilterOpen, isFilterOpenSetter, entriesPerPageOnClick, entriesPerPage, setEntriesPerPage, setEntriesResponseData) => {

    return (
        <div className="flex flex-col gap-3 min-[480px]:flex-row md:gap-20 w-full">
            <SearchBar
                name="search"
                value={searchVal}
                variant="bordered"
                onChange={(e) => searchValSetter(e.target.value)}
                placeholder={searchBarPlaceholder}
                className="min-w-sm flex-1"
            />

            <div className="flex w-full flex-1 gap-2 ml-auto min-h-[35px]">

                {/* FILTER */}
                <div className="flex flex-1 gap-1 justify-end">

                    {/* CLEAR FILTERS */}
                    <AnimatePresence>
                        {totalFilters > 0 && (
                            <motion.div
                                key="close-button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Tooltip
                                    color="danger"
                                    size="sm"
                                    closeDelay={180}
                                    content="Clear filters"
                                >
                                    <Button
                                        preserveScroll
                                        preserveState
                                        isIconOnly
                                        radius="sm"
                                        variant="bordered"
                                        onClick={clearFiltersOnClick}
                                        className="border ml-auto flex border-red-500 bg-white"
                                    >
                                        <FaFilterCircleXmark size={19} className="text-red-500" />
                                    </Button>
                                </Tooltip>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* TOGGLE FILTER */}
                    <div>
                        <Button
                            className="text-customGray border min-w-[100px] border-customLightGray bg-white"
                            radius="sm"
                            disableRipple
                            startContent={<FaFilter size={16} />}
                            onClick={() => isFilterOpenSetter((prev) => !prev)}
                        >
                            <span className="tracking-wide">
                                {!isFilterOpen ? 'Filters' : 'Hide Filters'}
                                {totalFilters > 0 && <strong>: {totalFilters}</strong>}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* ENTRIES PER PAGE */}
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            radius="sm"
                            disableRipple
                            endContent={<FaChevronDown size={14} className="text-customGray" />}
                            className="border w-[190px] max-sm:w-full border-customLightGray bg-white"
                        >
                            <span className="text-gray-500 tracking-wide">
                                Entries per page
                                <strong>: {entriesPerPage}</strong>
                            </span>
                        </Button>
                    </DropdownTrigger>

                    <DropdownMenu disabledKeys={[entriesPerPage.toString()]}>
                        {[10, 15, 20, 25, 30, 50, 100].map((entry) => (
                            <DropdownItem
                                key={entry}
                                className="!text-customGray"
                                onClick={() => entriesPerPageOnClick(routeName, entriesPerPage, setEntriesPerPage, setEntriesResponseData)}
                            >
                                {entry}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div >
    )
};


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

    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [isDataLoading, setIsDataLoading] = useState(false);
    
     {renderTableControls('entries route', searchTerm, setSearchTerm, 'Search by name or id...', totalFilters, handleClearFiltersClick,
                            isFilterOpen, setIsFilterOpen, handleSetEntriesPerPageClick, entriesPerPage, setEntriesPerPage, setUsersToRender)}