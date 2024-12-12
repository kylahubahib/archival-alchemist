import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import { useEffect, useState } from 'react';
import { Avatar, Button, Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { TbDotsVertical } from 'react-icons/tb';

export default function ViewPost({post}) {
    const [comments, setComments] = useState([])
    const [commentVisibility, setCommentVisibility] = useState(false);

    const openComment = () => {
        setCommentVisibility(true);
    }

    useEffect(() => {
        console.log('Selected Post: ', post);
    });

    const handleViewComment = () => {
        axios.get(route('manage-forum-posts.show', post.id)).then(response=> {
            if(response.data.comments) {
                setComments(response.data.comments);
                setCommentVisibility(true);
                console.log('Comments: ', response.data.comments);
            }
        })
    }

    const renderReplies = (replies) => {
        return replies.map((reply) => (
            <div key={reply.id} className="ml-8 my-2">
                <div className="flex justify-between items-center">
                    <div className="flex flex-row space-x-5 items-center">
                        <Avatar src={`http://127.0.0.1:8000/${reply.user?.user_pic}`} size="sm" />
                        <div className="text-md text-gray-500 font-semibold">{reply.user.name || 'User Name'}</div>
                    </div>
                    <div className="text-small text-gray-600">
                        {new Date(reply.created_at).toLocaleDateString('en-US')}
                    </div>
                </div>
    
                <div className="ml-12 text-gray-700">{reply.comment}</div>
                <Divider className="mt-2" />
            </div>
        ));
    };
    

    return ( 
        
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[527px] p-8 px-10">
        <div className=" flex flex-row space-x-5 items-center">
            <Avatar src={`http://127.0.0.1:8000/${post.user?.user_pic}`}  size="lg" />
            <div className=" text-xl text-gray-500 font-semibold">{post.user.name}</div>
        </div>

        <div className="ml-20 space-y-3">

            <div className="text-2xl font-bold text-gray-600">
                {post.title || ''}
            </div>

            <div className="flex flex-row space-x-4">
            {post.tags.length > 0 ? (
                post.tags.map((tag, index) => (
                <Chip key={index}>
                    {tag.name}
                </Chip>
                ))
            ) : (
                <Chip>Unavailable Tags</Chip>
            )}
            </div>

            <Divider/>

            <div className="text-gray-600">{post.body || ''}</div>

            <div className=" flex flex-row">
            <span className="mr-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                {post.viewCount || 0}
            </span>

            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                {post.comments || 0}
            </span>

            </div>

            <Divider />

            { !commentVisibility ? (
                <div className=" flex justify-center">
                <Button color="primary" variant="light" onClick={handleViewComment}>
                    View Comments
                </Button>  
                </div>
            ) : (
                <div>
                {comments.length > 0 ? (
                    comments.map((com) => (
                        <div key={com.id} className="my-2">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-row space-x-5 items-center">
                                    <Avatar src={`http://127.0.0.1:8000/${com.user?.user_pic}`} size="md" />
                                    <div className="text-lg text-gray-500 font-semibold">{com.user.name || 'User Name'}</div>
                                </div>
                                <div className="text-small text-gray-600">
                                    {new Date(com.created_at).toLocaleDateString('en-US')}
                                </div>
                            </div>

                            <div className="ml-16 space-y-2">
                                <div>{com.comment}</div>
                                {com.replies && com.replies.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm text-gray-500 font-semibold">Replies:</h4>
                                        {renderReplies(com.replies)}
                                    </div>
                                )}
                                <Divider className="mt-4" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-5 text-gray-600">No comments found</div>
                )}

                </div>
            )

            }

       
        </div>
    </div>
                
    );
}
