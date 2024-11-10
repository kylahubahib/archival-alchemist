import { Link, Head } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import LongTextInput from '@/Components/LongTextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';

export default function InquiryForm({isOpen, onClose}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '', 
    });

    const submit = (e) => {
        e.preventDefault();

        console.log(formData);
        //axios.post('/send-to-email', formData);
    }


    return ( 
        <Modal show={isOpen} onClose={onClose}>
       
        <form onSubmit={submit} className='m-10 space-y-3'>
            <div>
            <h2 class="mb-4 text-3xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
            <p class="mb-8 lg:mb-10 font-light text-center text-gray-500 dark:text-gray-400 sm:text-md">Got a technical issue? Need details about our subscription plan? Let us know.</p>
      
            </div>

            <div>
                <InputLabel value={'Full Name'} />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    className="mt-1 block w-full"
                    placeholder='Full Name'
                    autoFocus={true}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
            </div>

            <div>
                <InputLabel value={'Email'} />
                <TextInput 
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    className="mt-1 block w-full"
                    placeholder='example@domain.com'
                    autoFocus={true}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
            </div>

            <div>
                <InputLabel value={'Subject'} />
                <TextInput
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    className="mt-1 block w-full"
                    placeholder='Enter your subject'
                    autoFocus={true}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                />
            </div>

            <div>
                <InputLabel value={'Message'} />
                <LongTextInput
                    id="message"
                    type="text"
                    name="message"
                    value={formData.message}
                    className="mt-1 block w-full"
                    placeholder='Type your message'
                    autoFocus={true}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                />
            </div>

            <PrimaryButton type="submit">Submit</PrimaryButton>

        </form>
        </Modal>
    );
}
