import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import axios from 'axios';

export default function ChooseARole({ user }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null); 

    
    const openModalWithRole = (role) => {
        setSelectedRole(role); 
        setModalOpen(true); 
    };

   
    const closeModal = () => {
        setModalOpen(false);
        setSelectedRole(null);
    };

    const handleRoleAssignment = () => {
        axios.post('/assign-user-role', {role: selectedRole}).then(response => {
            if(response.data) {
                console.log('role assigned');
                router.reload();
                closeModal();
            }
        });
    }

    return (
        <section className="space-y-3">
            <div className="flex justify-between">
                <div className="flex items-center space-x-5">
                    <img src="/images/owl.png" className="h-20 w-20" />
                    <div className="space-y-2">
                        <p className="mt-1 text-lg text-gray-600 font-semibold">
                            Choose your role, alchemist! Only then will the secrets of the archive be revealed✨
                        </p>
                        <div className="flex space-x-5">
                            <Button size="md" variant="bordered"  color="primary" onPress={() => openModalWithRole('student')}>
                                Student
                            </Button>
                            <Button size="md" variant="bordered"  color="primary" onPress={() => openModalWithRole('teacher')}>
                                Teacher
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            
            <Modal isOpen={isModalOpen}  onOpenChange={setModalOpen} isDismissable={false} isKeyboardDismissDisabled={true} className="bg-white">
                <ModalContent className="rounded-lg border-2 border-white text-white p-6 animate-fadeIn">
                    {() => (
                        <>
                            <ModalHeader 
                                className="flex flex-col gap-1 text-customBlue text-2xl font-bold text-center drop-shadow-lg"
                            >
                                {selectedRole ? `✨ Welcome, ${selectedRole}! ✨` : '🌟 Magical Modal 🌟'}
                            </ModalHeader>
                            <ModalBody className="text-gray-600 text-center text-md mt-4 space-y-4 font-serif">
                                {selectedRole === 'student' && (
                                    <p>
                                    As a <strong>student</strong>, you will play an active role in preserving and exploring knowledge. 
                                    You can join group classes, collaborate with fellow members, upload manuscripts, 
                                    and receive valuable feedback from your adviser or teacher to refine your work and deepen your understanding.
                                    </p>
                                )}
                                {selectedRole === 'faculty' && (
                                    <p>
                                    As a <strong>teacher</strong>, you will play a vital role in guiding and mentoring students. 
                                    You can create group classes, provide guidance to assigned students, and 
                                    review their manuscripts to help them grow and improve.
                                    </p>
                                )}
                                {!selectedRole && (
                                    <p>🪄 Select a role to unveil its magical purpose! 🪄</p>
                                )}
                            </ModalBody>
                            <ModalFooter className="flex justify-center gap-20 mt-6">
                                <Button 
                                    color="danger" 
                                    variant="light" 
                                    onPress={closeModal} 
                                    className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg transform hover:scale-105 transition-transform"
                                >
                                    Close
                                </Button>
                                <Button 
                                    color="primary" 
                                    onPress={handleRoleAssignment} 
                                    className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transform hover:scale-105 transition-transform"
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>


        </section>
    );
}
