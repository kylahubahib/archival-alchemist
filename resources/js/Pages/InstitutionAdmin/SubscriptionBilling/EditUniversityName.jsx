import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { router, useForm } from '@inertiajs/react';

export default function EditUniversityCourse({isOpen, onClose, uniBranch}) {

    const { data, setData, put, processing, errors, reset } = useForm({
        uni_name: uniBranch.university.uni_name,
        uni_branch_name: uniBranch.uni_branch_name
    });

    const editSubmit = (e) => {
        e.preventDefault();
    
        console.log(data); 
    
        axios.post(route('update-university', { uniBranchId: uniBranch.id }), data).then((response) => {
                console.log("Update successful:", response.data);
                if(response.data.success){
                    onClose();
                    router.reload();
                }
            })
            .catch((error) => {
                console.error("Error updating university branch:", error);
            });
    };
    


    return (

        <Modal show={isOpen} onClose={onClose}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Update University Information</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={editSubmit}>
                        <div className='space-y-5'>
                            <div className="flex flex-col">
                                <InputLabel htmlFor="uni_branch_name" value="Branch Name" />
                                <TextInput
                                    id="uni_branch_name"
                                    value={data.uni_branch_name}
                                    onChange={(e) => {setData('uni_branch_name', e.target.value)}}
                                    className="mt-1 block w-full"
                                    placeholder="Branch Name"
                                />
                                <InputError message={errors.uni_branch_name} className="mt-2" />
                            </div>

                            <div className="mt-6 flex">
                                <PrimaryButton type="submit" disabled={processing}>
                                    Save
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-customBlue p-2 flex justify-end" >
                    <button onClick={onClose} className="text-white text-right mr-5">Close</button>
                </div>
        </Modal>

    );
}
