import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';

const UploadCapstone = () => {
    const [tags, setTags] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        man_doc_title: '',
        man_doc_content: null,
        man_doc_adviser: '',
        man_doc_author: [],
        agreed: false,
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Function to handle tag addition
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            setTags([...tags, e.target.value.trim()]);
            setInputValue('');
            setSuggestions([]);
        }
    };

    // Function to remove a tag
    const handleTagRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    // Function to handle input changes for form fields
    const handleFormFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Function to handle input changes for tags
    const handleTagInputChange = (e) => {
        const { value } = e.target;
        setInputValue(value);
        if (value.trim()) {
            fetchTagSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    // Function to fetch tag suggestions
    const fetchTagSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/tags/suggestions', {
                params: { query },
            });
            console.log('Tag suggestions response:', response.data); // Debug line
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching tag suggestions:', error.response?.data || error.message);
            setSuggestions([]); // Clear suggestions on error
            setMessage('Unable to fetch tag suggestions. Please try again later.');
        }
    };


    // Function to select a suggestion
    const handleSuggestionSelect = (suggestion) => {
        setTags([...tags, suggestion]);
        setInputValue('');
        setSuggestions([]);
    };

    // Function to handle file changes
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

    // Function to validate the form
    const isFormValid = () => {
        return (
            formValues.man_doc_title &&
            formValues.man_doc_author.length > 0 &&
            formValues.man_doc_adviser &&
            tags.length > 0 &&
            formValues.man_doc_content &&
            formValues.agreed
        );
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const authorsArray = formValues.man_doc_author; // Make sure this is an array
        const newErrors = {};

        if (!formValues.man_doc_title) newErrors.man_doc_title = 'Title is required.';
        if (authorsArray.length === 0) newErrors.man_doc_author = 'Authors are required.';
        if (!formValues.man_doc_adviser) newErrors.man_doc_adviser = 'Adviser is required.';
        if (tags.length === 0) newErrors.tags = 'At least one tag is required.';
        if (!formValues.man_doc_content) newErrors.man_doc_content = 'A file is required.';
        if (!formValues.agreed) newErrors.agreed = 'You must agree to the terms and conditions.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // Save tags to the database
                await axios.post('/api/tags/store', { tags });

                // Proceed with capstone upload
                const formData = new FormData();
                formData.append('man_doc_title', formValues.man_doc_title);
                formData.append('man_doc_adviser', formValues.man_doc_adviser);
                authorsArray.forEach(author => formData.append('man_doc_author[]', author)); // Append each author
                formData.append('tags_name[]', ...tags); // Spread the tags array



                if (formValues.man_doc_content) {
                    formData.append('man_doc_content', formValues.man_doc_content);
                }
                formData.append('agreed', formValues.agreed);


                const response = await axios.post(route('api.capstone.upload'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setMessage(response.data.message);
            } catch (error) {
                console.error('There was an error uploading the capstone project!', error.response?.data);
                setMessage('Error uploading capstone project.');
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        } else {
            window.scrollTo(0, 0); // Scroll to top to show errors
        }
    };

    return (
        <div className="upload-capstone-container p-4 border rounded shadow-lg bg-white">
            <div className="flex items-center mb-4">
                <div className="text-red-600 mr-2">&#9888;</div>
                <div>Please ensure all information is accurate before submitting</div>
            </div>
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
                        <textarea
                            name="man_doc_author"
                            placeholder="Authors (Last Name, First Name)"
                            className="w-full p-2 border rounded mb-2"
                            value={formValues.man_doc_author.join('\n')} // Join array back into string for display
                            onChange={(e) => setFormValues({
                                ...formValues,
                                man_doc_author: e.target.value
                                    .split('\n')
                                    .map(author => author.trim())
                                    .filter(author => author) // filter out empty authors
                            })}

                            rows={3} // Adjust the number of rows if needed
                        />
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
                    <div>
                        <input
                            type="text"
                            placeholder="Enter tags and press Enter"
                            className="w-full p-2 border rounded mb-2"
                            value={inputValue}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                        />
                        {errors.tags && <div className="text-red-600 text-sm mb-2">{errors.tags}</div>}
                        {suggestions.length > 0 && (
                            <ul className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10">
                                {suggestions.map((suggestion, index) => (
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
                    <div className="mb-4 border-dashed border-2 p-4 text-center">
                        Drag or drop file here
                        <input
                            type="file"
                            className="w-full mt-2"
                            onChange={handleFileChange}
                        />
                        {errors.man_doc_content && <div className="text-red-600 text-sm mt-2">{errors.man_doc_content}</div>}
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
                        className={`bg-blue-500 text-white p-2 rounded ${isFormValid() ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isFormValid()}
                    >
                        Submit
                    </button>
                </div>
            </form>
            {message && <div className="mt-4 text-green-600">{message}</div>}
            {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default UploadCapstone;
