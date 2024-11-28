import React, { useState, useEffect} from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

const RevisionHistoryTable = (groupId, classes) => {
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility of the table



  console.log("This is the manuscript id history for this group:", groupId.groupId); // For debugging
  console.log("This is the revision id history for this group:", groupId); // For debugging


  // Log the classes prop to see its structure
  useEffect(() => {
    if (!classes) {
      console.error("No classes prop passed.");
    } else {
      console.log("Received classes prop:", classes);
      if (!Array.isArray(classes.classes)) { // Check if the 'classes' key is an array
        console.error("Expected 'classes.classes' to be an array, but got:", typeof classes.classes);
      }
    }
  }, [classes]);

  // Check if classes is an array or an object containing an array
  const filteredClasses = Array.isArray(classes?.classes) // Use optional chaining to check if classes exists and is an array
    ? classes.classes.filter(cls => cls.group_id === groupId.groupId)
    : []; // Default to an empty array if not found

  // Extract revision history for the filtered classes
  const revisionHistories = filteredClasses
    .map(cls => cls.revision_history) // Extract revision history arrays
    .flat(); // Flatten the arrays into a single array

  console.log("This is the revision history for this group:", revisionHistories); // For debugging

  const list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setPage((prev) => prev + 1);
      }

      const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", { signal });
      let json = await res.json();

      if (!cursor) {
        setIsLoading(false);
      }

      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  const hasMore = page < 9;

  const closeTable = () => {
    setIsVisible(false); // Hide the table when the close button is clicked
  };

  if (!isVisible) return null; // If table is not visible, return null (hide the table)

  const backgroundColor = "#f1f1f1"; // Set the background color you want for both header and table body

  return (
    <div
      style={{
        width: "100%", // Make the parent container full-width
        height: "100vh", // Make the parent container full-height
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black background for the parent container
        position: "fixed", // Fixed position to make it stay in place
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center", // Center the table horizontally
        alignItems: "center", // Center the table vertically
        zIndex: 9999, // Ensure the table is on top
        overflow: "hidden", // Hide overflow in the parent container
      }}
    >
      {/* Table Container */}
      <div
        style={{
          width: "80%", // Set the width of the table container (80% of the viewport)
          maxWidth: "1200px", // Maximum width of the table
          height: "auto", // Allow the height to adjust to the content
          backgroundColor: backgroundColor, // Set the background color for the table container
          borderRadius: "8px", // Apply rounded corners to the container
          overflow: "hidden", // Ensure the content doesn't overflow with rounded corners
        }}
      >
        {/* Header with Group Name and Close Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "white", // Same background color for header
            borderTopRightRadius: "8px", // Rounded top-right corner
            borderTopLeftRadius: "0px", // Square top-left corner
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Group Name {/* Replace this with dynamic group name if needed */}
          </div>
          <button
            className="text-red-600 hover:text-red-800"
            style={{
              fontSize: "18px",
              background: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={closeTable}
          >
            ❌ {/* Close Icon */}
          </button>
        </div>

        {/* Table with Scrollable Body */}
        <Table
          isHeaderSticky
          aria-label="Revision History Table"
          bottomContent={
            hasMore && !isLoading ? (
              <div className="flex w-full justify-center">
                <Button isDisabled={list.isLoading} variant="flat" onPress={list.loadMore}>
                  {list.isLoading && <Spinner color="white" size="sm" />}
                  Load More
                </Button>
              </div>
            ) : null
          }
          classNames={{
            base: "max-h-[520px] overflow-y-auto", // Make the table body scrollable.
            table: "min-h-[420px]",
          }}
          css={{ backgroundColor: backgroundColor }} // Set the background color for the table body
        >
          <TableHeader>
            {/* Make the header sticky */}
            <TableColumn key="name" style={{ position: "sticky", top: 0, backgroundColor: "white",  width: "100px"}}>
              Status
            </TableColumn>
            <TableColumn key="height" style={{ position: "sticky", top: 0, backgroundColor: "white",  width: "100px"}}>
              Date
            </TableColumn>
            <TableColumn key="mass" style={{ position: "sticky", top: 0, backgroundColor: "white",  width: "300px" }}>
              Comments
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={isLoading} items={list.items} loadingContent={<Spinner label="Loading..." />}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RevisionHistoryTable;


//           <TableBody isLoading={isLoading} items={list.items} loadingContent={<Spinner label="Loading..." />}>
        //     {(item) => (
        //       <TableRow key={item.name}>
        //         {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
        //       </TableRow>
        //     )}
        //   </TableBody>
