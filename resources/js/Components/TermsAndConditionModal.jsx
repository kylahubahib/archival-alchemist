import { HiBadgeCheck } from "react-icons/hi"; 
import { CgClose } from "react-icons/cg"; 
import Modal from "./Modal";
import PrimaryButton from "./PrimaryButton";
import LongTextInput from "./LongTextInput";
import { useForm } from "@inertiajs/inertia-react";
import InputError from "./InputError";
import StarRating from "./StarRating";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TermsAndConditionModal({ isOpen, onClose}) {
    
    useEffect(() => {
        if (isOpen) {
            
        } 
    }, [isOpen]);
    
  

   

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">

            <div className="shadow-sm p-3 justify-between flex flex-row">
                <div></div>
                <h2 className="text-xl text-gray-700 font-bold">Terms and Condition</h2>
                <button onClick={onClose} className="text-gray-600 text-xl hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            
        </Modal>
    );
}
