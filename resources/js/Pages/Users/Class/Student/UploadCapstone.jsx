import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';


const UploadCapstone = ({class_code}) => {
    const [tags, setTags] = useState([]);
    const [users, setAuthors] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        man_doc_title: '',
        man_doc_content: null,
        man_doc_adviser: '',
        agreed: false,
    });
    const [errors, setErrors] = useState({ users: '', tags: '' });
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    // const [suggestions, setSuggestions] = useState([]);
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [authorInputValue, setAuthorInputValue] = useState('');
    const [tagInputValue, setTagInputValue] = useState('');

    const resetForm = () => {
        setFormValues({
            man_doc_title: '',
            man_doc_content: null,
            man_doc_adviser: '',
            agreed: false,
        });
        setTags([]);
        setAuthors([]);
        setErrors({});
        setMessage('');
        setSuccess(false);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault(); // Prevent form submission on Enter
            setTags([...tags, e.target.value.trim()]);  // Update tags only
            setTagInputValue('');  // Clear input after adding tag
            setTagSuggestions([]); // Clear suggestions
        }
    };



    const handleAuthorKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault(); // Prevent form submission on Enter
            setAuthors([...users, e.target.value.trim()]);  // Update authors only
            setAuthorInputValue('');  // Clear input after adding author
            setAuthorSuggestions([]); // Clear suggestions
        }
    };



    const handleTagRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleAuthorsRemove = (index) => {
        setAuthors(users.filter((_, i) => i !== index));
    };


    const handleFormFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    const handleTagInputChange = (e) => {
        const { value } = e.target;
        setTagInputValue(value);
        if (value.trim()) {
            fetchTagSuggestions(value);
        } else {
            setTagSuggestions([]);
        }
    };



    const handleAuthorInputChange = (e) => {
        const { value } = e.target;
        setAuthorInputValue(value);
        if (value.trim()) {
            fetchAuthorSuggestions(value);
        } else {
            setAuthorSuggestions([]);
        }
    };

    const fetchTagSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/tags/suggestions', {
                params: { query, tags },
            });
            setTagSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching tag suggestions:', error.response?.data || error.message);
            setTagSuggestions([]);
            setMessage('Unable to fetch tag suggestions. Please try again later.');
        }
    };


    const fetchAuthorSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/authors/suggestions', {
                params: { query, users },
            });
            setAuthorSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching Author suggestions:', error.response?.data || error.message);
            setAuthorSuggestions([]);
            setMessage('Unable to fetch Author suggestions. Please try again later.');
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        setTags([...tags, suggestion]);  // Update tags only
        setTagInputValue('');
        setTagSuggestions([]);
    };


    const handleAuthorSuggestionSelect = (suggestion) => {
        setAuthors([...users, suggestion]);
        setAuthorInputValue('');
        setAuthorSuggestions([]);
    };

    const handleFileChange = (e) => {
        const man_doc_content = e.target.files[0];
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (man_doc_content && allowedTypes.includes(man_doc_content.type)) {
            setFormValues({ ...formValues, man_doc_content });
        } else {
            setFormValues({ ...formValues, man_doc_content: null });
            alert('Only PDF and DOCX files are allowed.');
        }
    };

    const isFormValid = () => {
        return (
            formValues.man_doc_title &&
            formValues.man_doc_adviser &&
            users.length > 0 &&
            tags.length > 0 &&
            formValues.man_doc_content &&
            formValues.agreed
        );
    };

    const checkIfTitleExists = async (title) => {
        try {
            const response = await axios.post('/api/check-title', { title });
            return response.data.exists;
        } catch (error) {
            console.error('Error checking title existence:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formValues.man_doc_title) newErrors.man_doc_title = 'Title is required.';
        if (users.length === 0) newErrors.users = 'At least one user is required.';
        if (!formValues.man_doc_adviser) newErrors.man_doc_adviser = 'Adviser is required.';
        if (tags.length === 0) newErrors.tags = 'At least one tag is required.';
        if (!formValues.man_doc_content) newErrors.man_doc_content = 'A file is required.';
        if (!formValues.agreed) newErrors.agreed = 'You must agree to the terms and conditions.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const titleExists = await checkIfTitleExists(formValues.man_doc_title);

            if (titleExists) {
                setErrors({
                    man_doc_title: 'Oops, this project already exists. You may track your project and update it if necessary.'
                });
                return;
            }

            try {
                // Prepare form data
                const formData = new FormData();
                formData.append('man_doc_title', formValues.man_doc_title);
                formData.append('man_doc_adviser', formValues.man_doc_adviser);

                users.forEach(user => formData.append('name[]', user));
                tags.forEach(tag => formData.append('tags_name[]', tag));
                formData.append('man_doc_content', formValues.man_doc_content);
                formData.append('agreed', formValues.agreed);

                //Add the class_code
                formData.append('class_code', class_code);

                // Submit the form data
                const response = await axios.post('/api/capstone/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                setMessage(response.data.message);
                setSuccess(true);
            } catch (error) {
                console.error('Error Details:', error);
                if (error.response) {
                    console.error('Server Error:', error.response.data);
                    setMessage(error.response.data.message || 'Error uploading capstone project.');
                    setErrors(error.response.data.errors || {});
                } else if (error.request) {
                    console.error('No Response:', error.request);
                    setMessage('No response from the server. Please try again later.');
                } else {
                    console.error('Error:', error.message);
                    setMessage('An unexpected error occurred.');
                }
            }
        } else {
            window.scrollTo(0, 0);
        }


    };

    return (
        <div className="upload-capstone-container p-8 rounded shadow-lg bg-gray-100 h-screen">
            {success ? (
                <div>
                    <h2 className="text-green-600 mb-4"></h2>
                    <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={resetForm}
                    >
                        Submit another manuscript project
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="left-column">
                        <div className="mb-4">
                            <input
                                type="text"
                                name="man_doc_title"
                                placeholder="Title"
                                className="w-full p-2 border rounded mb-2"
                                value={formValues.man_doc_title}
                                onChange={handleFormFieldChange}
                            />
                            {errors.man_doc_title && <div className="text-red-600 text-sm mb-2">{errors.man_doc_title}</div>}


                            <input
                                type="text"
                                name="man_doc_adviser"
                                placeholder="Adviser"
                                className="w-full p-2 border rounded mb-2"
                                value={formValues.man_doc_adviser}
                                onChange={handleFormFieldChange}
                            />
                            {errors.man_doc_adviser && <div className="text-red-600 text-sm mb-2">{errors.man_doc_adviser}</div>}
                        </div>




                        {/* Authors input  */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter authors name and press Enter"
                                className="w-full p-2 border rounded mb-2"
                                value={authorInputValue}
                                onChange={handleAuthorInputChange}
                                onKeyDown={handleAuthorKeyDown}
                            />
                            {errors.users && <div className="text-red-600 text-sm mb-2">{errors.users}</div>}
                            {authorSuggestions.length > 0 && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 w-full">
                                    {authorSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleAuthorSuggestionSelect(suggestion.name)}
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}


                            <div className="tags-container flex flex-wrap mt-2">
                                {users.map((author, index) => (
                                    <div key={index} className="tag bg-gray-200 p-1 rounded mr-2 mb-2 flex items-center">
                                        {author}
                                        <button
                                            type="button"
                                            className="ml-1 text-red-600"
                                            onClick={() => handleAuthorsRemove(index)}
                                        >
                                            &#x2715;
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>




                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter tags and press Enter"
                                className="w-full p-2 border rounded mb-2"
                                value={tagInputValue}
                                onChange={handleTagInputChange}
                                onKeyDown={handleTagKeyDown}
                            />
                            {errors.tags && <div className="text-red-600 text-sm mb-2">{errors.tags}</div>}
                            {tagSuggestions.length > 0 && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 w-full">
                                    {tagSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSuggestionSelect(suggestion.tags_name)}
                                        >
                                            {suggestion.tags_name}
                                        </li>
                                    ))}
                                </ul>
                            )}


                            <div className="tags-container flex flex-wrap mt-2">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tag bg-gray-200 p-1 rounded mr-2 mb-2 flex items-center">
                                        {tag}
                                        <button
                                            type="button"
                                            className="ml-1 text-red-600"
                                            onClick={() => handleTagRemove(index)}
                                        >
                                            &#x2715;
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                    <div className="right-column">
                        <div className="mb-4 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md text-center">
                            <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg transition hover:bg-gray-100">
                                <p className="text-gray-600 mb-2">Drag or drop file here</p>
                                <input
                                    type="file"
                                    className="w-full mt-2 cursor-pointer file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx"
                                />
                            </div>
                            {errors.man_doc_content && (
                                <div className="text-red-600 text-sm mt-2">{errors.man_doc_content}</div>
                            )}
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="agreed"
                                checked={formValues.agreed}
                                onChange={handleFormFieldChange}
                                className="mr-2"
                            />
                            <label>I agree to the terms and conditions</label>
                            {errors.agreed && <div className="text-red-600 text-sm ml-2">{errors.agreed}</div>}
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white p-2 rounded w-full ${isFormValid() ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!isFormValid()}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}

            {message && (
                <div className={`mt-4 p-2 rounded ${success ? 'bg-green-200' : 'bg-red-200'}`}>
                    {message}
                </div>
            )}
            {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default UploadCapstone;
