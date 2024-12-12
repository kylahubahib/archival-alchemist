import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import ShowMemersModal from '@/Components/Modal';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton
import CreateClassSection from '@/Pages/Users/Class/Teacher/CreateClassSection';


//axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
// axios.defaults.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;

export default function TeacherClass({ auth }) {
    const [isCreating, setIsCreating] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [className, setClassName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [classes, setClasses] = useState([]);
    const [manuscripts, setManuscripts] = useState([]);
    const [authorInputValue, setAuthorInputValue] = useState('');
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [users, setAuthors] = useState([]);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedClassName, setSelectedClassName] = useState('');
const [selectedClassCode, setSelectedClassCode] = useState('');
const [isShowMembersModalOpen, setIsShowMembersModalOpen] = useState(false);
const [hoveredClass, setHoveredClass] = useState(null);
const [members, setMembers] = useState([]);
const [error, setError] = useState('');
const [isMembersLoading, setIsMembersLoading] = useState(false);
const [semesters, setSemesters] = useState([]);
const [selectedSemester, setSelectedSemester] = useState('');
const [dropdownVisible, setDropdownVisible] = useState(true); // Controls dropdown visibility

useEffect(() => {
    const fetchSemesters = async () => {
      try {
        // Fetch semesters from the backend
        const response = await axios.get('/api/semesters'); // Adjust API route if necessary
        const fetchedSemesters = response.data;

        // Sort the semesters by `created_at` (assuming created_at is a valid timestamp)
        const sortedSemesters = [...fetchedSemesters].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setSemesters(sortedSemesters); // Update state with sorted semesters

        // Automatically select the latest semester
        if (sortedSemesters.length > 0) {
          setSelectedSemester(sortedSemesters[0].id); // Set the default semester
        }
      } catch (err) {
        setError('Failed to fetch semesters.');
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);


// Handle the selection change
const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedSemester(selectedId); // Set the selected semester ID to the state
    console.log("Mao ni ang selected semester:", selectedId); // Log the selected ID
  };

console.log("semesters:", semesters)


useEffect(() => {
    console.log("Updated selected semester ID:", selectedSemester);
  }, [selectedSemester]);


    // Fetch members whenever hoveredClass changes
    useEffect(() => {
        const fetchMembers = async () => {
            setIsMembersLoading(true); // Set loading state to true before fetching
            try {
                const response = await axios.get(`/groupmembers/${hoveredClass.id}`);
                setMembers(response.data);
                // setError(''); // Clear any previous error
            } catch (err) {
                // setError('Failed to load members.'); // Handle error
            } finally {
                setIsMembersLoading(false); // Set loading state to false after fetching
            }
        };

    if (hoveredClass) {
        fetchMembers();
    }
}, [hoveredClass]); // Only depend on hoveredClass

    useEffect(() => {
        // Fetch students from the database to display suggestions when typing
        if (authorInputValue.length > 2) {
            axios.get(`/students/search?name=${authorInputValue}`)
                .then((response) => {
                    setAuthorSuggestions(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching students:", error);
                });
        }
    }, [authorInputValue]);



    const fetchUpdatedManuscripts = async () => {
        try {
            const response = await axios.get('/manuscripts/class', {
                params: { ins_id: selectedClass.ins_id }
            });
            console.log(response.data); // Check that the new data is correct
            setClasses(response.data); // Update the classes state
        } catch (error) {
            console.error("Error fetching updated manuscripts:", error);
            setMessage("Failed to fetch updated manuscripts.");
        }
    };


    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/store-newGroupClass', {
                class_name: className, // Ensure this matches the controller's expected key
            });
            setMessage(`Group class created successfully: ${response.data.message}`);

            // Fetch the updated classes after creating a new one
            const classesResponse = await axios.get('/manuscripts/class', {
                params: {
                    ins_id: selectedClass.ins_id // Ensure this matches your class's property
                }
            });
            setClasses(classesResponse.data); // Update classes state with new data
            console.log('Classes:', classes); // Check the structure of classes to ensure ins_id exists

            // Close the modal and reset class name field after successful creation
            setIsGroupModalOpen(false);
            setClassName('');
        } catch (error) {
            // Improved error handling
            if (error.response) {
                setMessage(`Error creating new group class: ${error.response.data.message}`);
            } else {
                setMessage(`Error creating new group class: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/check-student-in-class')
        .then(response => {
            if (response.data.class) {
                setClassCode(response.data.class);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching student class info:', error);
            setLoading(false); // Ensure loading is stopped even on error
        });
    }, []);



    const handleModalClose = () => {
        setIsGroupModalOpen(false);
        setClassName('');
    };

    useEffect(() => {
        setIsLoading(true); // Set loading to true when the component mounts
        axios.get('/teacher/class')
            .then(response => {
                setCourses(response.data.courses);
                setClasses(response.data.classes); // Store the classes if you need them
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false after data is fetched
            });
    }, []);


    useEffect(() => {
        if (selectedClass) {
            console.log('Selected Class:', selectedClass); // Debugging line
            axios.get('/manuscripts/class', {
                params: {
                    ins_id: selectedClass.ins_id // Ensure this matches your class's property
                }
            })
                .then(response => {
                    console.log(response.data); // Log the response to check its structure
                    setClasses(response.data); // Store the manuscripts data
                })
                .catch(error => {
                    console.error("Error fetching manuscripts:", error);
                });
        } else {
            console.warn('selectedClass is undefined or null'); // Debugging line
        }
    }, [selectedClass]);



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-h-screen">
                    {selectedCourse && !selectedClass && (
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsGroupModalOpen(true)}>
                            Add Section
                        </button>
                    )}
                </div>
            }
        >

        {/* <div className="max-w-7xl mx-auto bg-white  flex justify-center h-screen items-center shadow-sm sm:rounded-lg sticky"> */}
        <div className="flex bg-white justify-start  items-start w-h-screen mt-8 mx-8 border-b border-gray-300 ">
            <Link
                to="/teacherclass"
                className="flex justify-start items-start my-3 mt-5 mx-5 w-full text-gray-700 text-2xl hover:underline hover:text-blue-500"
            >
            <div className="flex items-center space-x-10  border-gray-200">
                <div className="pr-3">
                    <Avatar
                        src="images/img1.png"
                        alt="Teacher"
                        size="8"
                    />
                </div>
                Alchemist Room
            </div></Link>
            <div className="m-4">
            {dropdownVisible && (
        <div>
          {/* Dropdown Component */}
          <select
            className="w-[300px] px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="" disabled>
              Select a Semester
            </option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name} {semester.school_year}
              </option>
            ))}
          </select>
        </div>
      )}
</div>



        </div>
            {isCreating ? (
                <CreateClassSection
                auth={auth}
                user={auth.user}
                setDropdownVisible={setDropdownVisible}
        visible={dropdownVisible} // Control visibility
                selectedSemester={selectedSemester}
                semesters={semesters} // Passing fetched semesters here as a prop
                    onCreate={handleCreate}
                    className="flex justify-between items-center w-h-full"
                />
            ) : (
                <div>
                    {/* Render classes or other main content here */}
                </div>
            )}


        </AuthenticatedLayout>
    );
}
