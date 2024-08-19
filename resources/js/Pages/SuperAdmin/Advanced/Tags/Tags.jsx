import { useEffect, useState } from 'react';
import { AiFillEdit } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import AddButton from '@/Components/AddButton';
import { FaPlus } from 'react-icons/fa';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TagBadge from '@/Components/TagBadge';
import Pagination from '@/Components/Pagination';

export default function Tags({ auth, tags }) {
    // Use Inertia's useForm hook to handle form state
    const { data, setData, post, put, processing, errors, reset } = useForm({
        tag_name: ''
    });

    // State to manage selected tag for editing
    const [selectedTag, setSelectedTag] = useState(null);
    // State to manage the visibility of the create tag form
    const [createTag, setCreateTag] = useState(false);
    // State to manage filtered tags based on search input
    const [filteredData, setFilteredData] = useState(tags.data);
    // State to manage search input value
    const [wordEntered, setWordEntered] = useState("");

    // Effect to filter tags based on search input
    useEffect(() => {
        const newFilter = tags.data.filter((value) => {
            return (
                value.tag_name.toLowerCase().startsWith(wordEntered.toLowerCase())
            );
        });
        setFilteredData(newFilter);
    }, [wordEntered, tags.data]);

    // Handler for search input change
    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };


    // Handler for submitting the create tag form
    const submit = (e) => {
        e.preventDefault();
        post(route('manage-tags.store'), {
            onSuccess: () => {
                alert('Success!');
                reset();
                setCreateTag(false); 
            },
        });
    };

    // Handler for submitting the update tag form
    const submitUpdate = (e) => {
        e.preventDefault();
        if (selectedTag) {
            put(route('manage-tags.update', selectedTag.id), {
                onSuccess: () => {
                    alert('Tag updated successfully!');
                    reset();
                    setSelectedTag(null);
                },
            });
        }
    };

    // Handler for edit button click
    const editButtonClick = (tag) => {
        setSelectedTag(tag);
        setCreateTag(false);
        setData('tag_name', tag.tag_name);
    };

    // Handler for delete button click
    const deleteTag = (id) => {
        setCreateTag(false); 
        setSelectedTag(null); 
        setData('tag_name', '');
        router.delete(route('manage-tags.destroy', id), {
            preserveScroll: true
        });
    };


    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Advanced</h2>}
        > 
            <Head title="Advanced" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" space-x-4 pb-4">
                        <AdvancedMenu />
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg space-x-4 p-4">

                        <div className="flex flex-row justify-between m-3">
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
                                        onChange={handleFilter}
                                    />
                                </div>
                            <div>
                                <AddButton onClick={() => {setCreateTag(true); setSelectedTag(null); setData('tag_name', '');}} className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add Tag</span>
                                </AddButton>
                            </div>
                        </div>
                        
                        {/* ADD TAG FORM */}
                        {createTag && (
                            <div className="overflow-x-auto">
                                <form onSubmit={submit} className="flex flex-col">
                                    <div className="flex flex-row">
                                        <TextInput
                                            id="tag_name"
                                            value={data.tag_name}
                                            onChange={(e) => setData('tag_name', e.target.value)}
                                            type="text"
                                            className="mt-1 block"
                                            placeholder="New Tag"
                                        />
                                        <PrimaryButton type="submit" disabled={processing} className="mt-1 block">
                                            Save
                                        </PrimaryButton>
                                    </div>
                                    <InputError message={errors.tag_name} className="mt-2" />
                                </form>
                            </div>
                        )}

                        {/* EDIT TAG FORM */}
                        {selectedTag && (
                            <div className="overflow-x-auto">
                                <form onSubmit={submitUpdate} className="flex flex-col">
                                    <div className="flex flex-row">
                                        <TextInput
                                            id="tag_name"
                                            value={data.tag_name}
                                            onChange={(e) => setData('tag_name', e.target.value)}
                                            type="text"
                                            className="mt-1 block"
                                        />
                                        <PrimaryButton type="submit" disabled={processing} className="mt-1 block">
                                            Update
                                        </PrimaryButton>
                                    </div>
                                    <InputError message={errors.tag_name} className="mt-2" />
                                </form>
                            </div>
                        )}

                        <div className="mt-4">
                            <div className="flex flex-wrap -mx-2">
                                {
                                    filteredData.length > 0 ? (
                                        filteredData.map((t) => (
                                            <div key={t.id} className="px-2 py-1">
                                                <TagBadge>
                                                    <div className="mr-2">{t.tag_name}</div>
                                                    <button onClick={() => deleteTag(t.id)} className="hover:text-blue-950"><RxCross2 /></button>
                                                    <button onClick={() => editButtonClick(t)} className="hover:text-blue-950"><AiFillEdit /></button>
                                                </TagBadge>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center w-full m-5 overflow-hidden justify-center">
                                            <span className="px-6 py-4 text-gray-600">No results found</span>
                                        </div>
                                    )
                                }
                            </div>

                            {/* Pagination component */}
                            
                            <Pagination links={tags.links}/>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
