import React from 'react';
import CommentSection from '../components/CommentSection';

const DocumentPage = ({ documentId, userId }) => {
  return (
    <div>
      <h1>Document Page</h1>
      <CommentSection documentId={documentId} userId={userId} />
    </div>
  );
};

export default DocumentPage;
