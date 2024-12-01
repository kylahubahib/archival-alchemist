import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { router, useForm } from '@inertiajs/react';
import { Button, Chip, DatePicker, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import {getLocalTimeZone, today, parseDate} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";
import axios from 'axios';
import { getYearFromDate } from '@/utils';
import { FaEdit } from 'react-icons/fa';


export default function Semester({isOpen, onClose, semesters}) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [editable, setEditable] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({ column: 'name', direction: 'ascending' });
    const [selectedSem, setSelectedSem] = useState(null);
    const { data, setData, post, put, reset, errors, clearErrors, processing,  } = useForm({
        name: '', 
        start_date: null,
        end_date: null,
        start_sy: '',
        end_sy: '',
    });
   
    
    let formatter = useDateFormatter({ dateStyle: "short"});

    useEffect(() => {

        console.log(data);

        if (endDate && startDate) {
            // Convert to native Date objects using toDate()
            const dateStart = startDate.toDate(getLocalTimeZone());
            const dateEnd = endDate.toDate(getLocalTimeZone());
    
            // Compare the dates
            if (dateStart > dateEnd) {
                console.log('Error: Start date is after end date');
                setErrorMessage('Start date must not be later than the end date.');
            } else {
                console.log('No error');
                setErrorMessage(null);
            }
        }

    }, [data])

    const formatDate = (date) => {
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    };
    
    const createSubmit = (e) => {
        e.preventDefault();
    
        post(route('manage-semester.store'), {
            // data: formattedData,
            onSuccess: () => {
                onClose();
                showToast('success', 'Successfully added semester!');
                setEndDate(null);
                setStartDate(null);
                reset();
                clearErrors();
            },
        });
    };

    const editSubmit = (e) => {
        e.preventDefault();
    
        put(route('manage-semester.update', selectedSem), {
            // data: formattedData,
            onSuccess: () => {
                onClose();
                showToast('success', 'Successfully updated semester!');
                setEndDate(null);
                setStartDate(null);
                reset();
                clearErrors();

            },
        });
    }
    

   const handleDateChange = (field, value) => {

        if(field === 'start_date')
        {
            setStartDate(value);
        } else {
            setEndDate(value);
        }

        const formattedValue = value ? formatDate(value) : null;

        setData(field, formattedValue); 
    };

    const handleClose = () => {
        onClose(); 
        setEndDate(null);
        setStartDate(null);
        setErrorMessage(null); 
        reset(); 
        clearErrors();
    };


    // Function to handle sorting
    const sortedSemesters = [...semesters].sort((a, b) => {
        const column = sortDescriptor.column;
        const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;

        if (a[column] < b[column]) return -1 * direction;
        if (a[column] > b[column]) return 1 * direction;
        return 0;
    });

    
    const handleEditSemester = (sem) => {
    console.log("Semester Object:", sem);
    console.log("School Year:", sem.school_year);

    if (!sem.school_year) {
        console.error("school_year is undefined!");
        return;
    }

    setSelectedSem(sem.id);

    // Split the school_year into start and end
    const years = sem.school_year.split('-').map((year) => year.trim());

    // Convert MM/DD/YYYY to YYYY-MM-DD
    const convertToISODate = (dateString) => {
        const [month, day, year] = dateString.split('/').map((part) => parseInt(part, 10));
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const isoStartDate = convertToISODate(sem.start_date);
    const isoEndDate = convertToISODate(sem.end_date);

    console.log("Converted Start Date:", isoStartDate);
    console.log("Converted End Date:", isoEndDate);

    // Use parseDate with the ISO string
    const parsedStartDate = parseDate(isoStartDate);
    const parsedEndDate = parseDate(isoEndDate);

    const formattedStartDate = parsedStartDate ? formatDate(parsedStartDate) : null;
    const formattedEndDate = parsedEndDate ? formatDate(parsedEndDate) : null;

    // Update form data
    setData({
        name: sem.name,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        start_sy: years[0],
        end_sy: years[1],
    });

    setStartDate(parsedStartDate);
    setEndDate(parsedEndDate);

    console.log("Updated Form Data:", {
        name: sem.name,
        start_date: parsedStartDate,
        end_date: parsedEndDate,
        start_sy: years[0],
        end_sy: years[1],
    });

    setEditable(true);
};

    
    
    

    return (
      
        <Modal show={isOpen} onClose={onClose} closeable={false} maxWidth='5xl'>
            <div className="shadow-sm p-3 justify-between flex flex-row">
                <h2 className="text-xl text-gray-600 font-bold">Manage University Semesters</h2>
                <button onClick={handleClose} className="text-gray-600 text-xl p-2 rounded-full hover:bg-gray-100">
                    <CgClose />
                </button> 
            </div>

            <div className="p-6 space-y-5">
            { editable ? (
                <>
                <form onSubmit={editSubmit}>
                    <div className="space-x-5 flex items-start">
                        {/* Semester Name Input */}
                        <div className="flex flex-col">
                            <InputLabel htmlFor="name" value="Semester Name" />
                            <Input
                                id="name"
                                variant="bordered"
                                classNames={{
                                    base: "max-w-full sm:max-w-[20rem] h-10",
                                    mainWrapper: "h-full",
                                    input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                    inputWrapper: "h-full font-normal text-default-500",
                                }}
                                size="sm"
                                placeholder='e.g 1st Semester'
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* School Year */}
                        <div className="flex flex-col">
                        <InputLabel htmlFor="school_year" value="School Year" />
                        <div className="flex flex-row space-x-2 ">
                            <div className="flex flex-col">
                            <Input
                                id="start_sy"
                                variant="bordered"
                                classNames={{
                                    base: "max-w-full sm:max-w-[18rem] h-10",
                                    mainWrapper: "h-full",
                                    input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                    inputWrapper: "h-full font-normal text-default-500",
                                }}
                                placeholder="XXXX"
                                size="sm"
                                value={data.start_sy} 
                                type='number'
                                min={2000}
                                max={9999}
                                onChange={(e) => setData('start_sy', e.target.value)} 
                            />
                            <InputError message={errors.start_sy} className="mt-2" />
                            </div>

                            <div className="mt-2"> - </div>

                            <div className="flex flex-col">
                            <Input
                                id="end_sy"
                                variant="bordered"
                                classNames={{
                                    base: "max-w-full sm:max-w-[18rem] h-10",
                                    mainWrapper: "h-full",
                                    input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                    inputWrapper: "h-full font-normal text-default-500",
                                }}
                                placeholder="XXXX"
                                size="sm"
                                value={data.end_sy} 
                                type='number'
                                min={2000}
                                max={9999}
                                onChange={(e) => setData('end_sy', e.target.value)} 
                            />
                            <InputError message={errors.end_sy} className="mt-2" />
                            </div>
                        </div>
                        </div>


                        {/* Start Date Picker */}
                        <div className="flex flex-col">
                            <InputLabel htmlFor="start_date" value="Date Started" />
                            <DatePicker
                                id="start_date"
                                label={false}
                                aria-label="Start Date"
                                variant="bordered"
                                value={startDate} 
                                onChange={(value) => handleDateChange('start_date', value)}
                                showMonthAndYearPickers
                            />
                            <InputError message={errors.start_date || errorMessage} className="mt-2" />
                        </div>

                        {/* End Date Picker */}
                        <div className="flex flex-col">
                            <InputLabel htmlFor="end_date" value="Date Ended" />
                            <DatePicker
                                id="end_date"
                                label={false}
                                aria-label="End Date"
                                variant="bordered"
                                value={endDate} 
                                onChange={(value) => handleDateChange('end_date', value)}
                                showMonthAndYearPickers
                            />
                            <InputError message={errors.end_date} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="bg-customBlue mt-5 text-white hover:bg-white hover:text-customBlue hover:border-customBlue border-1"
                            type="submit"
                            isDisabled={processing} // Prevent multiple submissions
                        >
                            Save
                        </Button>
                    </div>
                </form>
                </>
            ) : (
                <>
                <form onSubmit={createSubmit}>
                    <div className="space-x-5 flex items-start">
                        {/* Semester Name Input */}
                        <div className="flex flex-col">
                            <InputLabel htmlFor="name" value="Semester Name" />
                            <Input
                                id="name"
                                variant="bordered"
                                classNames={{
                                    base: "max-w-full sm:max-w-[20rem] h-10",
                                    mainWrapper: "h-full",
                                    input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                    inputWrapper: "h-full font-normal text-default-500",
                                }}
                                size="sm"
                                placeholder='e.g 1st Semester'
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* School Year */}
                        <div className="flex flex-col">
                        <InputLabel htmlFor="school_year" value="School Year" />
                        <div className="flex flex-row space-x-2 ">
                            <div className="flex flex-col">
                            <Input
                                id="start_sy"
                                variant="bordered"
                                classNames={{
                                    base: "max-w-full sm:max-w-[18rem] h-10",
                                    mainWrapper: "h-full",
                                    input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                    inputWrapper: "h-full font-normal text-default-500",
                                }}
                                placeholder="XXXX"
                                size="sm"
                                value={data.start_sy} 
                                type='number'
                                min={2000}
                                max={9999}
                                onChange={(e) => setData('start_sy', e.target.value)} 
                            />
                            <InputError message={errors.start_sy} className="mt-2" />
                            </div>

                            <div className="mt-2"> - </div>

                            <div className="flex flex-col">
                            <Input
                                id="end_sy"
                                variant="bordered"
                                classNames={{
                                    base: "max-w-full sm:max-w-[18rem] h-10",
                                    mainWrapper: "h-full",
                                    input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                    inputWrapper: "h-full font-normal text-default-500",
                                }}
                                placeholder="XXXX"
                                size="sm"
                                value={data.end_sy} 
                                type='number'
                                min={2000}
                                max={9999}
                                onChange={(e) => setData('end_sy', e.target.value)} 
                            />
                            <InputError message={errors.end_sy} className="mt-2" />
                            </div>
                        </div>
                        </div>


                        {/* Start Date Picker */}
                        <div className="flex flex-col">
                            <InputLabel htmlFor="start_date" value="Date Started" />
                            <DatePicker
                                id="start_date"
                                label={false}
                                aria-label="Start Date"
                                variant="bordered"
                                value={startDate} 
                                onChange={(value) => handleDateChange('start_date', value)}
                                showMonthAndYearPickers
                            />
                            <InputError message={errors.start_date || errorMessage} className="mt-2" />
                        </div>

                        {/* End Date Picker */}
                        <div className="flex flex-col">
                            <InputLabel htmlFor="end_date" value="Date Ended" />
                            <DatePicker
                                id="end_date"
                                label={false}
                                aria-label="End Date"
                                variant="bordered"
                                value={endDate} 
                                onChange={(value) => handleDateChange('end_date', value)}
                                showMonthAndYearPickers
                            />
                            <InputError message={errors.end_date} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="bg-customBlue mt-5 text-white hover:bg-white hover:text-customBlue hover:border-customBlue border-1"
                            type="submit"
                            isDisabled={processing} // Prevent multiple submissions
                        >
                            Submit
                        </Button>
                    </div>
                </form>
                </>
            )}


                <div>
                <Table
                    aria-label="List of Semesters"
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                >
                    <TableHeader>
                        <TableColumn key="name" allowsSorting>
                            Semester
                        </TableColumn>
                        <TableColumn key="start_date" >
                            Date Started
                        </TableColumn>
                        <TableColumn key="end_date" >
                            Date Ended
                        </TableColumn>
                        <TableColumn key="status" >
                            Status
                        </TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody items={sortedSemesters} emptyContent="No semesters found.">
                        {(sem) => (
                            <TableRow key={sem.id}>
                                <TableCell>{sem.name} SY {sem.school_year}</TableCell>
                                <TableCell>{sem.start_date}</TableCell>
                                <TableCell>{sem.end_date}</TableCell>
                                <TableCell>
                                    {sem.status === 'Active' && <Chip color="success">{sem.status}</Chip>}
                                    {sem.status === 'Upcoming' && <Chip color="warning">{sem.status}</Chip>}
                                    {sem.status === 'Completed' && <Chip color="default">{sem.status}</Chip>}
                                </TableCell>
                                <TableCell className="p-5 flex flex-row space-x-2">
                                    <a
                                        onClick={() => {handleEditSemester(sem)}}
                                        className="text-customBlue rounded p-1 hover:text-blue-900 cursor-pointer"
                                        title="Edit"
                                    >
                                        <FaEdit size={20} />
                                    </a>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                </div>
            </div>

        </Modal>

    );
}