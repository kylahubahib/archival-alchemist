import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AddButton from "@/Components/AddButton";
import { FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import Create from './Create';
import Show from './Show';
import Edit from './Edit';
import Pagination from '@/Components/Pagination';
import PageHeader from '@/Components/Admin/PageHeader';
import SearchBar from '@/Components/Admin/SearchBar';
import { Chip } from '@nextui-org/react';

export default function SubscriptionPlans({ auth, subscriptionPlans = [], features, planFeatures }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPlanFeature, setSelectedPlanFeature] = useState([]);
    const [filteredData, setFilteredData] = useState(subscriptionPlans.data);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [wordEntered, setWordEntered] = useState("");

    useEffect(() => {
        const newFilter = subscriptionPlans.data.filter((value) => {
            if (filteredStatus === "All") {
                return (value.plan_name.toLowerCase().includes(wordEntered.toLowerCase()) ||
                value.plan_type.toLowerCase().includes(wordEntered.toLowerCase()));
            } else {
                return (
                    value.plan_status.toLowerCase() === filteredStatus.toLowerCase() &&
                    (value.plan_name.toLowerCase().includes(wordEntered.toLowerCase()) ||
                    value.plan_type.toLowerCase().includes(wordEntered.toLowerCase()))
                );
            }
        });
        setFilteredData(newFilter);
    }, [filteredStatus, wordEntered, subscriptionPlans.data]);

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };

    const filterStatus = (status) => {
        setFilteredStatus(status);
    };

    const getFeaturesByPlanId = (planId) => {
        return planFeatures
            .filter(planFeature => planFeature.plan.id === planId)
            .map(planFeature => planFeature.feature.feature_name);
    };

    const deletePlan = (id) => {
        if (confirm("Are you sure you want to delete this plan?")) {
            router.delete(route('manage-subscription-plans.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Successfully deleted plan!');
                },
            });
        }
    };

    const openCreateModal = () => {
        setSelectedPlan(null);
        setIsCreateModalOpen(true);
    };

    const openShowModal = (plan) => {
        //console.log('hello')
        setSelectedPlanFeature(getFeaturesByPlanId(plan.id));
        setSelectedPlan(plan);
        setIsShowModalOpen(true);
        console.log(isShowModalOpen);
    };

    const openEditModal = (plan) => {
        //console.log('hello')
        setSelectedPlan(plan);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setFilteredData(subscriptionPlans.data);
        setFilteredStatus("All");
        setWordEntered("");
        setIsCreateModalOpen(false);
        setIsShowModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedPlan(null);
        setSelectedPlanFeature([]);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subscription Plans</h2>}
        >
            <Head title="Subscription Plans" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-row justify-between my-5">
                        <PageHeader>SUBSCRIPTION PLANS</PageHeader>
                        {/* <div className="text-gray-800 text-3xl font-bold">Subscription Plans</div> */}

                        <div>
                            <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                <FaPlus /><span>Add Plan</span>
                            </AddButton>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        <div className="overflow-x-auto shadow-md sm:rounded-lg px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
                                {/* Search Filter */}
                                <div className="w-1/2">
                                    <SearchBar 
                                        name='search'
                                        value={wordEntered}
                                        variant="bordered"
                                        onChange={handleFilter}
                                        placeholder="Search (Name, Type)..."
                                        className=" min-w-sm flex-1"
                                    />
                                </div>  

                                <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse">
                                    <button onClick={() => {filterStatus("All")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "All" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        View all
                                    </button>

                                    <button onClick={() => {filterStatus("Available")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "Available" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        Available
                                    </button>

                                    <button onClick={() => {filterStatus("Unavailable")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "Unavailable" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        Unavailable
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[480px]"> 
                            {/* className="overflow-y-auto h-480" */}
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-1">
                                    <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Plans
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Type
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Term
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((sp) => (
                                                <tr key={sp.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
                                                        <div className="pl-3">
                                                            <div className="text-base font-semibol max-w-44 truncate">{sp.plan_name}</div>
                                                        </div>
                                                    </th>
                                                    <td className="px-6 py-4 max-w-60 truncate">{sp.plan_type}</td>
                                                    <td className="px-6 py-4 max-w-60 truncate">{sp.plan_term}</td>
                                                    <td className="px-6 py-4">{sp.plan_price}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-1/2">
                                                            {sp.plan_status === "Available" ? (
                                                                <Chip color='success' variant='flat'>{sp.plan_status}</Chip>
                                                            ) : (
                                                                <Chip color='danger' variant='flat'>{sp.plan_status}</Chip>
                                                            )}
                                                           
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 flex flex-row space-x-2">
                                                        <a onClick={() => openShowModal(sp)} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="View">
                                                            <FaEye/>
                                                        </a>
                                                        <a onClick={() => openEditModal(sp)} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Edit">
                                                            <FaPen/>
                                                        </a>
                                                        {/* <a onClick={() => deletePlan(sp.id)} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Delete">
                                                            <FaTrash/>
                                                        </a> */}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    No subscription plans found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <Pagination class="mt-6" links={subscriptionPlans.links} />
                    </div>
                </div>

            {/* Modals for Create, Show, and Edit */}
            <Create isOpen={isCreateModalOpen} onClose={closeModal} features={features} />
            { selectedPlan && <Show isOpen={isShowModalOpen} onClose={closeModal} subscriptionPlans={selectedPlan} planFeatures={selectedPlanFeature} />}
            { selectedPlan && <Edit isOpen={isEditModalOpen} onClose={closeModal} subscriptionPlans={selectedPlan} planFeatures={planFeatures} features={features} />}
            </AdminLayout>
    );
}
