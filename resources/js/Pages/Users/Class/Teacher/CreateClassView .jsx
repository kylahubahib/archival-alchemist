import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateClassView = ({ onCreate }) => {
    const [classCourse, setCourse] = useState(''); // This will now store course_id
    const [classSubjectName, setSubjectName] = useState('');
    const [classSection, setSection] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Retrieve CSRF token from meta tag and set it as default header for axios
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

        // Fetch courses from the backend
        fetch('/fetch-courses')
            .then((response) => response.json())
            .then((data) => setCourses(data))
            .catch((error) => console.error("Error fetching courses:", error));
    }, []);

    const handleCreateClass = async () => {
        if (!classCourse || !classSubjectName || !classSection) {
            alert("Please fill out all fields.");
            return;
        }

        setIsCreating(true);
        try {
            const response = await axios.post('/store-sections', {
                course_id: classCourse,
                subject_name: classSubjectName,
                section_name: classSection,
            });

            console.log('Success:', response.data.message);
            alert(response.data.message);  // Success message

            // Call onCreate to close the modal
            onCreate();
        } catch (error) {
            console.error('Error creating section:', error);

            // Display error message from server response
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Show the specific error message
            } else {
                alert('Failed to create section.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create a New Class</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Subject Name"
                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                        value={classSubjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                    />

                    {/* Dropdown for Courses */}
                    <select
                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                        value={classCourse}
                        onChange={(e) => setCourse(e.target.value)}
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}> {/* Use course.id as value */}
                                {course.course_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Section"
                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                        value={classSection}
                        onChange={(e) => setSection(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleCreateClass}
                    className={`mt-6 w-full p-4 rounded-md text-white ${
                        isCreating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create Class'}
                </button>
            </div>
        </div>
    );
};

export default CreateClassView;
