import { TbUserExclamation } from "react-icons/tb";
import SearchBar from "@/Components/Admins/SearchBar";
import Pagination from "@/Components/Pagination";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function StudentList({ sectionId }) {
    const [filteredData, setFilteredData] = useState([]);
    const [members, setMembers] = useState([]);
    const [group, setGroup] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch list of students and groups
    useEffect(() => {
        setLoading(true);
        axios
            .get(route("manage-sections.show", { id: sectionId }))
            .then((response) => {
                if (response.data.members) {
                    setMembers(response.data.members);
                    setFilteredData(response.data.members);
                    setGroup(response.data.group);
                }
            })
            .catch((error) => {
                console.error("Error fetching members:", error);
                toast.error("Failed to fetch members. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, [sectionId]);

    // Search Filter
    const handleFilter = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setWordEntered(searchTerm);
        filterData(searchTerm, selectedGroup);
    };

    // Group Filter
    const handleGroupChange = (groupValue) => {
        setSelectedGroup(groupValue);
        filterData(wordEntered, groupValue);
    };

    // Combined Filtering Logic
    const filterData = (searchTerm, groupValue) => {
        const filtered = members.filter((member) => {
            const idNum = member.members?.[0]?.uni_id_num?.toLowerCase() || "";
            const name = member.members?.[0]?.name?.toLowerCase() || "";
            const groupName = member.group?.[0]?.group_name?.toLowerCase() || "";
            const groupId = member.group?.[0]?.id?.toString() || "";

            const matchesSearchTerm =
                idNum.includes(searchTerm) ||
                name.includes(searchTerm) ||
                groupName.includes(searchTerm);

            const matchesGroup = groupValue ? groupId === groupValue : true;

            return matchesSearchTerm && matchesGroup;
        });
        setFilteredData(filtered);
    };

    return (
        <div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="space-y-3">
                    <div className="flex flex-row justify-between space-x-64">
                        <SearchBar
                            name="search"
                            value={wordEntered}
                            variant="bordered"
                            onChange={handleFilter}
                            placeholder="Search by name, id number, group..."
                            className="min-w-sm flex-1"
                        />

                        <Select
                            aria-label="Groups"
                            className="max-w-xs"
                            placeholder="Select a group"
                            onChange={(e) => handleGroupChange(e.target.value)}
                        >
                            {group.map((gr) => (
                                <SelectItem key={gr.id} value={gr.id.toString()}>
                                    {gr.group_name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="overflow-y-auto h-480 border-1 shadow-md sm:rounded-lg">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Id Number</th>
                                        <th scope="col" className="px-6 py-3">Student Name</th>
                                        <th scope="col" className="px-6 py-3">Group</th>
                                        <th scope="col" className="px-6 py-3">Joined At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((mem) => (
                                            <tr
                                                key={mem.id}
                                                className="bg-white border-b hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    {mem.members?.[0]?.uni_id_num || ""}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {mem.members?.[0]?.name || ""}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {mem.group?.[0]?.group_name || "No group yet."}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(mem.created_at).toLocaleDateString() || ""}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4">
                                                <div className="flex flex-col items-center mt-6 justify-center text-gray-400 h-32">
                                                    <TbUserExclamation size={150} className="mb-2" color="#e5e7eb" />
                                                    <span>No user found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* <Pagination links={termsConditions.links} /> */}
                </div>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={true}
                theme="light"
                transition={Slide}
            />
        </div>
    );
}
