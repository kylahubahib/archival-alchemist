import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import { useEffect, useState } from 'react';
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react';
import { TbDotsVertical } from 'react-icons/tb';
import ViewPost from './ViewPost';

export default function Forum({ auth, forumPost }) {
    const [filteredData, setFilteredData] = useState(forumPost);
    const [filterTags, setFilterTags] = useState([]);

    useEffect(() => {
        console.log(forumPost);
    },[]); 

    const handleSortingForumPost = () => {

    }

    return (
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Advanced</h2>}
        > 
            <Head title="Advanced" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" space-x-4 pb-4">
                        <AdvancedMenu />
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[527px]">
                        <div className="flex flex-row justify-between m-3">
                            <Select
                                labelPlacement="inside"
                                label="Sort By"
                                className="max-w-52"
                                size="sm"
                                variant="bordered"
                                onChange={handleSortingForumPost}
                                > 
                                <SelectItem key={'latest_post'}>Latest Post</SelectItem>
                                <SelectItem key={'most_popular'}>Most Popular</SelectItem>
                                <SelectItem key={'most_comment'}>Most Comments</SelectItem>
                            </Select>

                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    id="table-search-users" 
                                    className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Search" 
                                />
                            </div>

                        </div>
                       
                        <div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Post Title
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Posted By
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Views
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Comments
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Date Posted
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                           Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (filteredData.map((post) => (
                                        <tr key={post.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibold min-w-72">{post.title}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 min-w-44">{post.user.name}</td>
                                            <td className="px-6 py-4">
                                                {post.status === "Visible" && <Chip color="success" variant="flat">{post.status}</Chip>}
                                                {post.status === "Hidden" && <Chip color="default" variant="flat">{post.status}</Chip>}
                                                {post.status === "Deleted" && <Chip color="danger" variant="flat">{post.status}</Chip>}
                                            </td>
                                            <td className="px-6 py-4">{post.viewCount}</td>
                                            <td className="px-6 py-4">{post.comments}</td>
                                            <td className="px-6 py-4">{post.created_at}</td>
                                            <td className="px-6 py-4">
                                            <div className="relative flex justify-center items-center gap-2">
                                                <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light">
                                                    <TbDotsVertical />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu > 
                                                    <DropdownItem onClick={() => {}}>View Post</DropdownItem>
                                                    <DropdownItem onClick={() => {}}>Hide</DropdownItem>
                                                </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                               
                        </div>
                        
                    </div>

                    <div className=' pt-11'></div>

                    <ViewPost/>
                </div>
            </div>
            
        </AdminLayout>
    );
}
