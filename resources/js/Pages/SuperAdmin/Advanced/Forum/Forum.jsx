import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import { useEffect, useState, useCallback } from 'react';
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react';
import { TbDotsVertical } from 'react-icons/tb';
import ViewPost from './ViewPost';
import axios from 'axios'; // Ensure axios is imported
import SearchBar from '@/Components/Admin/SearchBar';

export default function Forum({ auth, forumPost }) {
    const [filteredData, setFilteredData] = useState(forumPost);
    const [viewPost, setViewPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (e) => {
        const selectedValue = e.target.value;  
        console.log(selectedValue);
        handleSortingForumPost(selectedValue);  
    };
    
    const handleSortingForumPost = (filter) => {
        axios.get(route('filter-post', { filter: filter }))
          .then((response) => {
            console.log(response.data.filteredPosts);
            setFilteredData(response.data.filteredPosts);
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
      };

    const handleViewPost = (data) => {
        setViewPost(true);
        setSelectedPost(data);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    
        const searchedData = forumPost.filter(
            post =>
                post.title.toLowerCase().includes(term) || 
                post.user.name.toLowerCase().includes(term)
        );
    
        setFilteredData(searchedData);
    };
    

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Forum</h2>}
        >
            <Head title="Advanced" />

            <div className="py-8">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="space-x-4 pb-4">
                        <AdvancedMenu />
                    </div>

                    {!viewPost ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[527px]  px-4">
                            <div className="flex flex-row justify-between m-3">
                                <SearchBar
                                    name="search"
                                    variant="bordered"
                                    placeholder="Search by post title, user name..."
                                    className="max-w-96 flex-1"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />

                                <Select
                                    labelPlacement="inside"
                                    label="Sort and Filters"
                                    className="max-w-52"
                                    size="sm"
                                    variant="bordered"
                                    onChange={handleFilterChange} 
                                >
                                    <SelectItem key="latest_post" value="latest_post">Latest Post</SelectItem>
                                    <SelectItem key="most_popular" value="most_popular">Most Popular</SelectItem>
                                    <SelectItem key="visible_post" value="visible_post">Visible Post</SelectItem>
                                    <SelectItem key="hidden_post" value="hidden_post">Hidden Post</SelectItem>
                                    <SelectItem key="deleted_post" value="deleted_post">Deleted Post</SelectItem>
                                </Select>
                            </div>

                            <div className="border-1 shadow-sm rounded-lg m-3">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
                                        <tr>
                                            <th className="px-6 py-3">Post Title</th>
                                            <th className="px-6 py-3">Posted By</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Views</th>
                                            <th className="px-6 py-3">Comments</th>
                                            <th className="px-6 py-3">Date Posted</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((post) => (
                                                <tr key={post.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        <div className="pl-3">
                                                            <div className="text-base font-semibold">{post.title}</div>
                                                        </div>
                                                    </th>
                                                    <td className="px-6 py-4">{post.user.name}</td>
                                                    <td className="px-6 py-4">
                                                        <Chip color={post.status === "Visible" ? "success" : post.status === "Hidden" ? "default" : "danger"} variant="flat">
                                                            {post.status}
                                                        </Chip>
                                                    </td>
                                                    <td className="px-6 py-4">{post.viewCount}</td>
                                                    <td className="px-6 py-4">{post.comments}</td>
                                                    <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString('en-US')}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="relative flex justify-center items-center gap-2">
                                                            <Dropdown>
                                                                <DropdownTrigger>
                                                                    <Button isIconOnly size="sm" variant="light">
                                                                        <TbDotsVertical />
                                                                    </Button>
                                                                </DropdownTrigger>
                                                                <DropdownMenu>
                                                                    <DropdownItem onClick={() => handleViewPost(post)}>View Post</DropdownItem>
                                                                    <DropdownItem>Hide</DropdownItem>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <ViewPost post={selectedPost} />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
