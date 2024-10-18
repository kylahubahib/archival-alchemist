import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Inbox({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: ''
    });

    useEffect(() => {
        if(auth.user){
            const userId = auth.user.id;

            if(userId){
                window.Echo.private(`user.${userId}`)
                .listen('.message.sent', (e) => {
                    console.log('Broadcasted Message:', e.message);
                    // You can add additional logic to handle the received message
                });
            }
           
        }
    })

    const submit = (e) => {
        e.preventDefault();

        axios.post('/send-message', { message: data.message })
        .then(response => {
            console.log(response.data); 
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Inbox</h2>}
        >
            <Head title="Inbox" />

            <div className="py-12 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 h-96">Inbox</div>

                        <form onSubmit={submit}>
                       
                        <div className="mt-4">
                            <TextInput
                                id="message"
                                type="text"
                                name="message"
                                value={data.message}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('message', e.target.value)}
                            />

                        </div>

                            <PrimaryButton className="ms-4">
                                Send
                            </PrimaryButton>
                    </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
