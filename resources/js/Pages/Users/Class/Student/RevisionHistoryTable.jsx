import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";

const RevisionHistoryTable = ({ groupId, classes }) => {
  console.log("This is the group ID:", groupId);
  console.log("These are the classes :", classes);

  const [isVisible, setIsVisible] = useState(true); // State to manage visibility of the table

  const closeTable = () => {
    setIsVisible(false); // Hide the table when the close button is clicked
  };

  if (!isVisible) return null; // If table is not visible, return null (hide the table)

  // Filter classes that have revision history related to the given groupId and have comments
  const filteredClasses = classes?.filter((classItem) =>
    classItem.revision_history?.some(
      (revision) => revision.group_id === groupId && revision.ins_comment
    )
  ) || [];

  console.log("Filtered Classes:", filteredClasses);

  const revisionHistory = filteredClasses.length > 0 ? filteredClasses[0].revision_history : [];

  console.log("Revision History:", revisionHistory);

  const groupName = filteredClasses.length > 0 && filteredClasses[0]?.group?.group_name;

  const getStatusDisplay = (status) => {
    const statusMap = {
      A: "Approved",
      T: "To-Review",
      M: "Missing",
      P: "Pending",
      D: "Declined",
    };

    return statusMap[status] || "Unknown"; // Default to 'Unknown' if status is not in the map
  };

  // If no revision history exists, show the message outside the table
  if (revisionHistory.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "slategray" }}>
              {groupName || "No Group Name"}
            </div>
            <button
              className="text-red-600 hover:text-red-800"
              style={{ fontSize: "18px", border: "none", cursor: "pointer" }}
              onClick={closeTable}
            >
              ❌ {/* Close Icon */}
            </button>
          </div>
          <div className="px-4 py-2 text-center text-gray-500">
            No revision history available
          </div>
        </div>
      </div>
    );
  }

  // If revision history exists, display the table
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "slategray" }}>
            {groupName || "No Group Name"}
          </div>
          <button
            className="text-red-600 hover:text-red-800"
            style={{ fontSize: "18px", border: "none", cursor: "pointer" }}
            onClick={closeTable}
          >
            ❌ {/* Close Icon */}
          </button>
        </div>

        <Table aria-label="Revision History Table" css={{ height: "400px", overflow: "auto" }}>
          <TableHeader>
            <TableColumn className="text-center">Status</TableColumn>
            <TableColumn className="text-center">Date</TableColumn>
            <TableColumn className="text-center">Comments</TableColumn>
          </TableHeader>

          <TableBody>
            {revisionHistory.map((revision) => (
              <TableRow key={revision.id}>
                <TableCell className="text-center w-75">
                  {getStatusDisplay(revision.man_doc_status || "Unknown")}
                </TableCell>
                <TableCell className="text-center w-75">
                  {new Date(revision.updated_at).toLocaleDateString() || "N/A"}
                </TableCell>
                <TableCell className="text-center w-200">
                  {revision.ins_comment || "⦿⦿⦿"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RevisionHistoryTable;
