import { useState } from 'react';
import { FaFileDownload, FaEye, FaComment, FaBookmark } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, image }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-4 rounded-lg max-w-full max-h-full relative" onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <img src={image} alt="Expanded" className="max-w-full max-h-screen object-contain" />
            </div>
        </div>
    );
};

export default function Posts() {
    const [views, setViews] = useState(123);
    const [showComments, setShowComments] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const openImageModal = (image) => {
        setSelectedImage(image);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const images = [
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300"
    ];

    return (
        <section className="w-full mx-auto my-4">
            <div className="w-full bg-white shadow-lg flex flex-col">
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                className="rounded-full w-10 h-10"
                            />
                            <div className="ml-2">
                                <p className="font-bold">Username</p>
                                <p className="text-gray-600 text-sm">2 hours ago</p>
                            </div>
                        </div>
                        <a href="#" className="text-blue-500 hover:underline">View Book</a>
                    </div>
                    <p className="mb-4">
                        Hello everyone! I'm working on a project similar to the "Archival Alchemist Web-Based System" book and hope to connect with others with experience in this area. If you've worked on a similar project with the content of the book, I would love to hear from you! Specifically, I'm interested in learning more about the research methodologies used, any challenges faced during the project, and any insights gained from the process. Your expertise and insights would be precious to me.
                    </p>

                    <div className="flex gap-4 overflow-x-auto">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Attachment ${index + 1}`}
                                className="flex-shrink-0 w-32 h-32 object-cover cursor-pointer"
                                onClick={() => openImageModal(image)}
                            />
                        ))}
                    </div>

                    <hr />
                    <div className="mt-4">
                        <a href="#" onClick={toggleComments} className="text-blue-500 hover:underline">
                            {showComments ? 'See Less' : 'View All Comments'}
                        </a>
                        {showComments && (
                            <div className="mt-4 space-y-4">
                                <div className="border p-2 rounded">
                                    <p className="font-bold">Commenter 1</p>
                                    <p>This is a comment.</p>
                                </div>
                                <div className="border p-2 rounded">
                                    <p className="font-bold">Commenter 2</p>
                                    <p>This is another comment.</p>
                                </div>
                                <div className="border p-2 rounded">
                                    <p className="font-bold">Commenter 3</p>
                                    <p>This is yet another comment.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={!!selectedImage} onClose={closeImageModal} image={selectedImage} />
        </section>
    );
}
