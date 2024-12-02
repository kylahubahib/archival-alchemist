const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the CORS package

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS for all origins (you can restrict this to your React app's domain later)
app.use(cors()); // This enables CORS for all incoming requests

// Serve a basic "Hello World" endpoint
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Get comments for a specific document
app.get('/api/comments/:documentId', (req, res) => {
    const { documentId } = req.params;
    // Simulate fetching comments based on document ID
    const docComments = comments.filter((comment) => comment.man_doc_id === documentId);
    res.json(docComments);
});

// Post a comment (or reply)
app.post('/api/comments', (req, res) => {
    const { content, man_doc_id, user_id, parent_id } = req.body;

    const newComment = {
        id: comments.length + 1,
        content,
        man_doc_id,
        user_id,
        parent_id: parent_id || null,
        replies: [],
        user: { name: 'User ' + user_id },
    };

    // If it's a reply, find the parent comment and add the reply
    if (parent_id) {
        const parentComment = comments.find((comment) => comment.id === parent_id);
        if (parentComment) {
            parentComment.replies.push(newComment);
        }
    } else {
        comments.push(newComment);
    }

    res.json(newComment);
    io.emit('new_comment', newComment); // Emit the new comment to all connected clients
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
