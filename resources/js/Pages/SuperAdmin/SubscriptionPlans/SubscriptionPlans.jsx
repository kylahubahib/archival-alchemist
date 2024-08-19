import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AddButton from "@/Components/AddButton";
import { FaPlus } from "react-icons/fa";
import Create from './Create';
import Show from './Show';
import Edit from './Edit';
import Pagination from '@/Components/Pagination';

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
            
            if(filteredStatus === "All"){
                return (
                    (value.plan_name.toLowerCase().includes(wordEntered.toLowerCase()))
                );
            }else {
                return (
                    value.plan_status.toLowerCase() === filteredStatus.toLowerCase() &&
                    (value.plan_name.toLowerCase().includes(wordEntered.toLowerCase()))
                );
            }
        });
        setFilteredData(newFilter);
    }, [filteredStatus, wordEntered, subscriptionPlans.data]);

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };


    const filterStatus = (status) => {
        setCurrentPage(1)
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
                    alert('Successfully deleted!');
                },
            });
        }
    };

    const openCreateModal = () => {
        setSelectedPlan(null);
        setIsCreateModalOpen(true);
    };

    const openShowModal = (plan) => {
        setSelectedPlanFeature(getFeaturesByPlanId(plan.id));
        setSelectedPlan(plan);
        setIsShowModalOpen(true);
    };

    const openEditModal = (plan) => {
        setSelectedPlan(plan);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setFilteredData(subscriptionPlans.data)
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between m-3">
                            <div className="text-gray-800 text-3xl font-bold">Subscription Plans</div>

                            <div>
                                <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add Plan</span>
                                </AddButton>
                            </div>
                        </div>

                        <div className="overflow-x-auto shadow-md sm:rounded-lg px-5">
                        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
                                <label className="sr-only">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="search-users" 
                                        className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Search" 
                                        value={wordEntered}
                                        onChange={handleFilter}
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

                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Plans
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
                                    {filteredData.length > 0 ? (filteredData.map((sp) => (
                                        <tr key={sp.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibol max-w-44 truncate">{sp.plan_name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 max-w-60 truncate">{sp.plan_term}</td>
                                            <td className="px-6 py-4">{sp.plan_price}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-1/2">
                                                    <p className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded text-center ${sp.plan_status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                    {sp.plan_status}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex flex-col space-y-1">
                                                <a onClick={() => openShowModal(sp)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">View</a>
                                                <a onClick={() => openEditModal(sp)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Edit</a>
                                                <a onClick={() => deletePlan(sp.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</a>
                                            </td>
                                        </tr>

                                        ))) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>

                            <Pagination links={subscriptionPlans.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Create isOpen={isCreateModalOpen} onClose={closeModal} features={features} />
            { selectedPlan && <Show isOpen={isShowModalOpen} onClose={closeModal} subscriptionPlans={selectedPlan} planFeatures={selectedPlanFeature} />}
            { selectedPlan && <Edit isOpen={isEditModalOpen} onClose={closeModal} subscriptionPlans={selectedPlan} planFeatures={planFeatures} features={features} />}
        </AdminLayout>
    );
}
