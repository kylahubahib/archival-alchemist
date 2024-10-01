import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import AdvancedMenu from '../AdvancedMenu';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { showToast } from '@/Components/Toast';
import { Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';

export default function Universities({ auth, uniBranches, universities }) {
    const [filteredData, setFilteredData] = useState(uniBranches.data);
    const [value, setValue] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [wordEntered, setWordEntered] = useState("");
    const { data, setData, put, processing, errors, reset } = useForm({ 
        uni_branch_name: '',
    });

    useEffect (() => {

        if(wordEntered != ""){
        const newFilter = uniBranches.data.filter((val) => {
            return (
                (val.university.uni_name.toLowerCase().startsWith(wordEntered.toLowerCase()) ||
                val.uni_branch_name.toLowerCase().startsWith(wordEntered.toLowerCase())) && (val.uni_id === parseInt(value)));
            
        });
        setFilteredData(newFilter);
        }
        else{
            changeUniversity();
            //console.log('Branches:', filteredData);
        }

        
    }, [value, wordEntered, uniBranches.data]);

    const openModal = (item) => {
        setSelectedData(item);
        setData('uni_branch_name', item.uni_branch_name);
        setIsEditModalOpen(true);

    }

    const closeModal = () => {
        setIsEditModalOpen(false);
    }

    const submit = (e) => {
        e.preventDefault();
        if(selectedData){
            put(route('manage-universities.update', selectedData.id), {
                onSuccess: () => {
                    closeModal();
                    showToast('success', 'Updated Successfully!');
                },
            });
        }
    };

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };

    
    const changeUniversity = async () => {
        const uniId = parseInt(value);
        try {
            const response = await axios.get('/get-branches', {
                params: {
                    id: uniId
                },
            });
            //console.log('Response', response.data);
            setFilteredData(response.data); 
        } catch (error) {
            showToast('error', 'Failed to fetch branches!');
        }
    };

    return (
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Advanced</h2>}
        > 
            <Head title="Advanced" /> 

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                    <div className=" space-x-4 pb-4">
                        <AdvancedMenu />
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between m-3 space-x-2">
                            <Select 
                                 aria-label="University"
                                className="max-w-xs"
                                placeholder='Select a university'
                                onChange={(e) => setValue(e.target.value)}
                            >
                                {universities.data.map((uni) => (
                                <SelectItem key={uni.id} value={uni.id}>
                                    {uni.uni_name}
                                </SelectItem>
                                ))} 
                            </Select>

                            <div className="relative">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="table-search-users" 
                                        className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Search" 
                                        value={wordEntered}
                                        onChange={handleFilter}
                                       
                                    />
                            </div>
                        </div>

                        <div className="overflow-y-auto h-480">

                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            School Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Branch Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Date Created
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3">
                                            Date Modified
                                        </th>*/}
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (filteredData.map((uni) => (
                                        <tr key={uni.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibol">{uni.university.uni_name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 max-w-60 truncate">{uni.uni_branch_name}</td>
                                            <td className="px-6 py-4">{uni.created_at}</td>
                                            {/*<td className="px-6 py-4">yo</td>*/}
                                            <td className="px-6 py-4 flex flex-row space-x-2">
                                                <a onClick={() => {openModal(uni)}} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Edit">
                                                    <FaPen /> 
                                                </a>
                                                {/* <a onClick={() => {}} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Delete">
                                                    <FaTrash />
                                                </a> */}
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* <Pagination links={uniBranches.links} /> */}
                        
                </div>
             </div>

            { selectedData &&
            <Modal show={isEditModalOpen} onClose={closeModal}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Update University</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={submit}>
                        <div className='space-y-5'>
                            <div className="flex flex-col">
                                <InputLabel htmlFor="uni_branch_name" value="Department" />
                                <TextInput
                                    id="uni_branch_name"
                                    value={data.uni_branch_name}
                                    onChange={(e) => {setData('uni_branch_name', e.target.value)}}
                                    className="mt-1 block w-full"
                                    placeholder="Department"
                                />
                                <InputError message={errors.uni_branch_name} className="mt-2" />
                            </div>
                                <input type="hidden" value={data.uni_branch_id} />

                            <div className="mt-6 flex">
                                <PrimaryButton type="submit" disabled={processing}>
                                    Save
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-customBlue p-2 flex justify-end" >
                    <button onClick={closeModal} className="text-white text-right mr-5">Close</button>
                </div>
            </Modal>
            }

        </AdminLayout>
    );
}
