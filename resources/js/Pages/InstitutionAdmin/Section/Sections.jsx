import { RiFolderUnknowFill } from "react-icons/ri";
import { FcFolder } from "react-icons/fc";
import AddButton from "@/Components/AddButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import Semester from "./SemesterModal";
import { getYearFromDate } from "@/utils";

export default function Sections({ auth, sections, departments, semester }) {
    const [filteredSections, setFilteredSections] = useState(sections); 
    const [filteredByDept, setFilteredByDept] = useState(sections); 
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [semesterModal, setSemesterModal] = useState(false);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {

        console.log('SemesterModal: ', semester );
        if (selectedDept) {
            const sectionsInDept = sections.filter(
                (section) => section.course.dept_id === selectedDept
            );
            setFilteredByDept(sectionsInDept);

            const uniqueCourses = [
                ...new Map(sectionsInDept.map((section) => [section.course.id, section.course])).values(),
            ];
            setAvailableCourses(uniqueCourses);
            setSelectedCourse(null);
        } else {
            setFilteredByDept(sections); 
            setAvailableCourses([]);
            
        }
    }, [selectedDept, sections]);

    useEffect(() => {
        let filtered = filteredByDept;

        if (selectedCourse) {
            filtered = filtered.filter((section) => section.course.id === selectedCourse);
        }

        setFilteredSections(filtered);
    }, [selectedCourse, filteredByDept]);

    const handleSemesterModal = () => {
        axios.get(route('manage-semester.index')).then(response => {
            if(response.data) {
                setSemesters(response.data);
                setSemesterModal(true);
            } else {
                setSemesters([]);
            }
        })
    }

    const closeModal = () => {
        setSemesterModal(false);
    }

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sections</h2>}
        >
            <Head title="Sections" />

            <div className="mt-5">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between mb-3 mt-5">
                        <h3 className="text-customGray text-lg font-bold">SECTIONS</h3>
                        <AddButton className="text-customBlue hover:text-white space-x-1" onClick={handleSemesterModal}>
                            <span>SEMESTERS</span>
                        </AddButton>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg p-5">
                        {/* Filters */}
                        <div className="flex space-x-3 mb-4">

                            {/* Semester Filter */}
                            <Select
                                aria-label="Course"
                                placeholder="Select Semester"
                                onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
                            >
                                {semester.map((sem) => (
                                    <SelectItem key={sem.id} value={sem.id} textValue={getYearFromDate(sem.start_date) - getYearFromDate(sem.end_date)}>
                                        {sem.name} S.Y {getYearFromDate(sem.start_date)} - {getYearFromDate(sem.end_date)}
                                    </SelectItem>
                                ))}
                            </Select>
                            {/* Department Filter */}
                            <Select
                                aria-label="Department"
                                placeholder="Select Department"
                                onChange={(e) => setSelectedDept(e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <SelectItem key="all" value={null}>
                                    All Departments
                                </SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id} textValue={dept.dept_name}>
                                        {dept.dept_name} ({dept.dept_acronym})
                                    </SelectItem>
                                ))}
                            </Select>

                            {/* Course Filter */}
                            <Select
                                aria-label="Course"
                                placeholder="Select Course"
                                onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
                                disabled={!selectedDept}
                            >
                                <SelectItem key="all" value={null}>
                                    All Courses
                                </SelectItem>
                                {availableCourses.map((course) => (
                                    <SelectItem key={course.id} value={course.id} textValue={course.course_name}>
                                        {course.course_name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Button>Reset</Button>
                        </div>

                        {/* Filtered Sections */}
                        <div className="grid lg:grid-cols-4 gap-5 md:grid-cols-2 grid-cols-1 pt-3">
                            {filteredSections.length > 0 ? (
                                filteredSections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="border rounded-lg p-6 cursor-pointer shadow hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex justify-center">
                                            <FcFolder size={70} />
                                        </div>
                                        <h4 className="text-center text-xl font-semibold mb-4">
                                            {section.section_name}
                                        </h4>
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <p>
                                                <strong>Assigned Teacher:</strong>{" "}
                                                {section.user?.name || "N/A"}
                                            </p>
                                            <p>
                                                <strong>Course:</strong>{" "}
                                                {section.course.course_acronym || "N/A"}
                                            </p>
                                            <p>
                                                <strong>Date Created:</strong>{" "}
                                                {new Date(section.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center text-gray-300">
                                    <RiFolderUnknowFill size={200} />
                                    <p className="mt-4 text-lg font-semibold">No sections found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <Semester isOpen={semesterModal} onClose={closeModal} semesters={semesters}/>
        </AdminLayout>
    );
}
