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

export default function GiveFeedbackModal({ isOpen, onClose}) {
    const [success, setSuccess] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        feedback_rating: '',
        feedback_content: ''
    });
    
    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            axios.get('/check-feedback')
                .then(response => {
                    //console.log('Response:', response.data);
                    if (response.data.feedbackExists) {
                        setData({
                            feedback_rating: response.data.feedbackExists.feedback_rating,
                            feedback_content: response.data.feedbackExists.feedback_content
                        })
                        
                    }
                })
                .catch(error => console.error('Error Message:', error));
        } 
    }, [isOpen]);
    
    const ratingSelect = (rating) => {
        setData('feedback_rating', rating);
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(data); 
        axios.post(route('user-feedbacks.store'), {
           feedback_rating: data.feedback_rating,
           feedback_content: data.feedback_content
        })
        .then(response => {
            if (response.data.success) {
                setSuccess(true);
                reset();
                setTimeout(() => {
                    onClose();
                }, 2000);    
            } else {
                alert(response.data.message);  
            }
        })
        .catch(error => {
            if (error.response) {
                alert(error.response.data.message);  
                console.log('Error:', error.response.data);  
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">

        {!success ? ( 
            <>
            <div className="shadow-sm p-3 justify-between flex flex-row">
                <div></div>
                <h2 className="text-xl text-gray-700 font-bold">Give Us Your Feedback</h2>
                <button onClick={onClose} className="text-gray-600 text-xl hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            <form onSubmit={submit} className="max-w-sm mx-auto p-5 space-y-3 flex flex-col">
            <div className="flex flex-col space-y-4 items-center justify-center">

                <label className="text-base font-bold text-gray-600 text-center">
                How would you rate your experience?
                </label>
                <StarRating size={12} onRatingSelect={ratingSelect} initialRating={data.feedback_rating}/>

                <label className="text-base font-bold text-gray-600 text-center pt-3">
                What can we improve?
                </label>
                <LongTextInput
                    placeholder="Describe your experience..."
                    value={data.feedback_content}
                    onChange={(e) => setData('feedback_content', e.target.value)}
                    className={'max-h-44'}
                />
                <InputError message={errors.feedback_content} className="mt-2" />

                
                <div>
                    <PrimaryButton type="submit" disabled={processing}>
                        Submit Feedback
                    </PrimaryButton>
                </div>

            </div>
            </form> 
            
            </> ): (
                <div className="flex flex-col items-center justify-center p-5 rounded-lg shadow-md">
                    <HiBadgeCheck size={80} color="#294996" />
                    <h2 className="text-xl text-gray-700 font-bold ml-2">Thank You for Your Feedback!</h2>
                    <p className="text-gray-600 text-center mt-3">
                        Your input helps us improve and provide a better experience for everyone.
                    </p>
                </div>
                )}
            
        </Modal>
    );
}
