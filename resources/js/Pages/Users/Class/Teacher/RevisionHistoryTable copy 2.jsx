import React from 'react';

const RevisionHistoryTable = ({ classes }) => {
  // Filter and flatten the revision history once the classes prop is available
  const filteredClasses = classes?.filter(classItem => classItem.revision_history && classItem.revision_history.length > 0) || [];
  const flattenedRevisionHistories = filteredClasses.flatMap(classItem => classItem.revision_history);

  console.log('Filtered and flattened revision histories: ', flattenedRevisionHistories);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Comments</th>
          </tr>
        </thead>
        <tbody>
          {flattenedRevisionHistories.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-4 py-2 border text-center">No revision history available</td>
            </tr>
          ) : (
            flattenedRevisionHistories.map((revision) => (
              <tr key={revision.id}>
                <td className="px-4 py-2 border">{revision.man_doc_status}</td>
                <td className="px-4 py-2 border">{revision.updated_at}</td>
                <td className="px-4 py-2 border">{revision.ins_comment}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RevisionHistoryTable;
