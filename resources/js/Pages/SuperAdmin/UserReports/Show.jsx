import { CgArrowsExchangeAltV } from "react-icons/cg"; 
import Modal from '@/Components/Modal';
import { router } from "@inertiajs/react";

export default function Show({ isOpen, onClose}) {


    return (
        <Modal show={isOpen} onClose={onClose}>

            <div className="bg-customBlue p-2 flex justify-end">

                <form>
                    <div>
                        
                    </div>
                </form>

                <button onClick={onClose} className="text-white text-right mr-5">Close</button>
            </div>
        </Modal>
    );
}
