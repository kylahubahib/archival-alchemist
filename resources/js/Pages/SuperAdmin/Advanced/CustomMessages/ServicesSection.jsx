import LongTextInput from '@/Components/LongTextInput';
import { router, useForm } from '@inertiajs/react';
import { CgClose } from 'react-icons/cg';
import Modal from '@/Components/Modal';
import { showToast } from '@/Components/Toast';
import { Button, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { FaCheck, FaPen, FaTrash } from 'react-icons/fa';
import TextInput from '@/Components/TextInput';
import CreateService from "./CreateService";

export default function ServicesSection({ isOpen, onClose, services }) {
    const [index, setIndex] = useState(null);
    const [newService, setNewService] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [iconPic, setIconPic] = useState(null);
    const { data, setData,put, processing, errors, reset } = useForm({
        content_text: '',
        content_title: '',
        content_type: ''
    });

    useEffect(() => {
        console.log(data);
    });

    useEffect(() => {
        if (index !== null) {
            const service = services.find((s) => s.id === index);
            setData({
                content_text: service?.content_text || '',
                content_title: service?.content_title || '',
                content_type: service?.content_type || '',
            });
            setIconPic(service?.subject || '')
            setPreviewUrl(null);
        }
    }, [index]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconPic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadIcon = (id) => {
        const formData = new FormData();
        formData.append('subject', iconPic);
        formData.append('content_title', data.content_title);
        formData.append('id', id);

        axios.post(route('update-icon'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            console.log('After upload icon', data);
        }).catch((error) => {
            console.error('There was an error updating the services icon!', error);
        });
    }

    const handleEditItem = (data) => {
        setIndex(data.id);
        setIconPic(data.subject);
    };

    const handleCloseEdit = () => {
        setIndex(null);
    };

    const handleCreateItem = () => {
        setNewService(true);
        setIndex(null);
        reset();
        setPreviewUrl(null);
    };

    const handleCloseCreate = () => {
        setNewService(false);
        reset();
        setPreviewUrl(null);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (iconPic instanceof File) {
           uploadIcon(index);
        }

        if (index !== null) {
            console.log('update');
            console.log(data);
            put(route('manage-custom-messages.update', index), {
                data,
                preserveScroll: true,
                onSuccess: () => {
                    showToast('success', 'Service updated successfully!');
                    setIndex(null);
                    onClose();
                },
                onError: () => {
                    showToast('error', 'Failed to update service.');
                },
            });
        }
    };

    const deleteService = (id) => {
            router.delete(route('manage-custom-messages.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    showToast('success', 'Successfully deleted service!');
                },
            });
    };


    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="5xl">
            <div className="p-3 flex justify-end">

                <button onClick={onClose} className="text-gray-600 p-2 text-xl rounded-full hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            <div className="px-4 flex justify-between">
                <h2 className="text-xl text-gray-700 font-bold">Services Section</h2>
                <Button onClick={handleCreateItem} radius="large" variant='bordered' size='sm' className="border-customBlue text-customBlue shadow">
                    Add New Service
                </Button>
            </div>

            {!newService ? (
            <div className="px-5 py-5">
                <div >
                    <Table>
                        <TableHeader>
                            <TableColumn>Icon</TableColumn>
                            <TableColumn>Title</TableColumn>
                            <TableColumn>Subtitle</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {services.length > 0 ? (services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>
                                        {index === service.id ? (
                                            <div className="relative w-14 h-14">
                                                <img
                                                    src={previewUrl || `/${iconPic || service.subject}`}
                                                    alt="icon"
                                                    className="h-14 w-14 rounded-t-lg object-cover p-2"
                                                />

                                                <button
                                                    className="absolute bottom-0 bg-gray-200 text-gray-600 w-14 text-sm flex items-center justify-center"
                                                >
                                                    Upload
                                                </button>

                                                <input
                                                type="file"
                                                id="subject"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                                />


                                            </div>

                                        ) : (
                                            <img src={`/${service.subject}`} className="h-16 w-16 rounded-full p-1" alt="Service Icon" />
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {index === service.id ? (
                                            <TextInput
                                                id="content_title"
                                                value={data.content_title}
                                                onChange={(e) => setData('content_title', e.target.value)}
                                                className="mt-1 block max-w-60 max-h-10"
                                                placeholder="Enter title here..."
                                            />
                                        ) : (
                                            service.content_title
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {index === service.id ? (
                                            <LongTextInput
                                                id="content_text"
                                                value={data.content_text}
                                                onChange={(e) => setData('content_text', e.target.value)}
                                                className="mt-1 block w-full min-h-10 max-h-32"
                                                placeholder="Enter description here..."
                                            />
                                        ) : (
                                            service.content_text
                                        )}
                                    </TableCell>

                                    <TableCell className="flex flex-row space-x-2 pt-8">
                                        {index === service.id ? (
                                            <>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer"
                                                    title="Save"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCloseEdit}
                                                    className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer"
                                                    title="Cancel"
                                                >
                                                    <CgClose />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <a
                                                    onClick={() => handleEditItem(service)}
                                                    className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <FaPen />
                                                </a>
                                                <a
                                                    onClick={() => {deleteService(service.id)}}
                                                    className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </a>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>No data available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
            </div>
            ) :(
               <CreateService close={handleCloseCreate}/>
            )}
        </Modal>
    );
}
