import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import { useEffect, useState } from 'react';
import { Avatar, Button, Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { TbDotsVertical } from 'react-icons/tb';

export default function ViewPost({}) {
    const [comments, setComments] = useState([
        {id: 1, name: 'Percy Jackson', content: 'Wow! So amazing!'},
        {id: 2, name: 'Jack and Jill', content: 'Went up the hill to fetch a pail of watahh'},
        {id: 3, name: 'Manny Pacquiao', content: 'Mike Tyson! I shall avenge you! Bring it on Jake Paul 0\^/0'},
    ])
    const [commentVisibility, setCommentVisibility] = useState(false);

    const openComment = () => {
        setCommentVisibility(true);
    }

    return (
        
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[527px] p-8 px-10">
        <div className=" flex flex-row space-x-5 items-center">
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" size="lg" />
            <div className=" text-xl text-gray-500 font-semibold">Kyla A. Hubahib</div>
        </div>

        <div className="ml-20 space-y-3">

            <div className="text-2xl font-bold text-gray-600">
                What's up madlang pipol?
            </div>

            <div className=" flex flex-row space-x-4">
                <Chip>Php</Chip>
                <Chip>Laravel</Chip>
            </div>

            <Divider/>

            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>

            <div className=" flex flex-row">
            <span className="mr-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                0
            </span>

            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                0
            </span>

            </div>

            <Divider />

            { !commentVisibility ? (
                <div className=" flex justify-center">
                <Button color="primary" variant="light" onClick={openComment}>
                    View Comments
                </Button>  
                </div>
            ) : (
                <div>
                    {comments.length > 0 ? (
                        comments.map((com) => (
                            <div className="my-2">
                                <div className=" flex flex-row space-x-5 items-center">
                                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" size="md" />
                                    <div className=" text-lg text-gray-500 font-semibold">{com.name || 'User Name'}</div>
                                </div>
                                <div className=" ml-16 space-y-2">
                                    <div>{com.content}</div>

                                    <Divider className=" mt-4"/>
                                </div>
                            </div>
                        ))
                    ): (<div>No comments found</div>)}
                </div>
            )

            }

       
        </div>
    </div>
                
    );
}
