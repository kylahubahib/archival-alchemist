import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Comment = ({ comment, onReply, onDelete, onReport }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText, comment.id);
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <div className="ml-4 mt-4 border-l pl-4">
      <p className="font-medium">{comment.comment}</p>
      <div className="flex space-x-2 text-sm text-gray-500">
        <button onClick={() => setShowReply(!showReply)}>Reply</button>
        <button onClick={() => onReport(comment.id)}>Report</button>
        <button onClick={() => onDelete(comment.id)}>Delete</button>
      </div>
      {showReply && (
        <div className="mt-2">
          <textarea
            className="w-full border rounded p-2"
            rows="2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleReply}>
            Submit Reply
          </button>
        </div>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          onDelete={onDelete}
          onReport={onReport}
        />
      ))}
    </div>
  );
};

const CommentSection = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/forum-comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      try {
        const response = await axios.post('/forum-comments', {
          forum_post_id: postId,
          user_id: userId,
          comment: commentText,
        });
        setComments((prev) => [...prev, response.data]);
        setCommentText('');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  const handleReply = async (text, parentId) => {
    try {
      const response = await axios.post('/forum-comments', {
        forum_post_id: postId,
        user_id: userId,
        comment: text,
        parent_comment_id: parentId,
      });
      fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/forum-comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReport = async (id) => {
    try {
      await axios.post(`/forum-comments/${id}/report`);
      alert('Comment reported successfully');
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Comments</h3>
      <textarea
        className="w-full border rounded p-2"
        rows="3"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCommentSubmit}>
        Submit Comment
      </button>
      <div className="mt-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
