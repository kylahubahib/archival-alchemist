import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from 'socket.io-client';

const CommentSection = ({ documentId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null); // Track which comment we are replying to
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch existing comments when component mounts
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost/api/comments/${documentId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    // Setup socket connection for real-time updates
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    // Listen for new comments
    socketInstance.on("new_comment", (comment) => {
      setComments((prevComments) => [comment, ...prevComments]);
    });

    // Cleanup the socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [documentId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post("http://localhost/api/comments", {
        content: newComment,
        man_doc_id: documentId,
        user_id: userId,
      });

      setNewComment(""); // Clear the input field
      toast.success("Comment added successfully!");

      // Emit a socket event for real-time updates
      socket.emit("new_comment", response.data);
    } catch (error) {
      toast.error("Error posting comment");
      console.error("Error posting comment:", error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await axios.post("http://localhost/api/comments", {
        content: replyContent,
        man_doc_id: documentId,
        user_id: userId,
        parent_id: parentId, // Linking the reply to the parent comment
      });

      setReplyContent(""); // Clear the reply input field
      setReplyTo(null); // Reset reply state
      toast.success("Reply added successfully!");

      // Emit a socket event for real-time updates
      socket.emit("new_comment", response.data);
    } catch (error) {
      toast.error("Error posting reply");
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div>
      <div className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        ></textarea>
        <button onClick={handleCommentSubmit}>Post Comment</button>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <strong>{comment.user.name}</strong>
            <p>{comment.content}</p>

            {/* Reply Button */}
            <button onClick={() => setReplyTo(comment.id)}>Reply</button>

            {/* Show reply form when replying to a comment */}
            {replyTo === comment.id && (
              <div className="reply-form">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                ></textarea>
                <button onClick={() => handleReplySubmit(comment.id)}>Post Reply</button>
              </div>
            )}

            {/* Render replies if they exist */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply">
                    <strong>{reply.user.name}</strong>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
