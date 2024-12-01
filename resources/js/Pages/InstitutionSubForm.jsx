import { Link, Head, useForm } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import LongTextInput from '@/Components/LongTextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Button, Divider } from '@nextui-org/react';
import { formatPrice } from '@/utils';

export default function InstitutionSubscriptionForm({ plan }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        university: '',
        campus: '',
        name: '',
        pnum: '',
        email: '',
        ins_admin_proof: '',
        uni_branch_id: '',
        plan: plan,
        number_of_users: '',
        total_amount: '',
    });
    const [universities, setUniversities] = useState([]);
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedFile, setSelectedFile] = useState(data.ins_admin_proof);
    const [errorMessage, setErrorMessage] = useState(null);
    const [inputUniversity, setInputUniversity] = useState(false);
    const [validationError, setValidationError] = useState(null); 
    const [selectedBranch, setSelectedBranch] = useState('');

    const submit = (e) => {
        e.preventDefault();

        if (!data.uni_branch_id && (!data.university || !data.campus)) {
            setValidationError('Please select a university or provide university and campus details.');
            return;
        }

        setValidationError(null); 

        // post('/register-institution', data, {
        //     onError: (errors) => {
        //         console.log(errors);
        //     },
        // });

        post('/register-institution', {
            onSuccess: (page) => {
                if (page.props.checkout_url) {
                    window.location.href = page.props.checkout_url;
                    // window.open(page.props.checkout_url, '_blank');
                }
            }
        });
    
    };

    useEffect(() => {
        console.log(plan);
        console.log(data);
        console.log('error', validationError);

        setData('total_amount', data.number_of_users * plan.plan_price);
    }, [data.number_of_users, plan.plan_price])

    useEffect(() => {
        
        axios
            .get('/api/universities-branches')
            .then((response) => {
                setUniversities(response.data);
            })
            .catch((error) => {
                console.error('Error fetching university data:', error);
            });
    }, []);

    const handleSuggestion = (e, content) => {
        const value = e.target.value;

        if(content === 'university') 
        {
            setData('university', value);
    
            const suggestions = value ? universities.filter((uni) =>
                uni.uni_name.toLowerCase().startsWith(value.toLowerCase())
            ) : [];
            setFilteredUniversities(suggestions);
        
            setBranches([]);
            setFilteredBranches([]);
            setSelectedBranch('');
        }

        else if(content === 'branch')
        {
            // setSelectedBranch(value);
            setData('campus', value)
    
            const suggestions = value ? branches.filter((branch) =>
                branch.uni_branch_name.toLowerCase().startsWith(value.toLowerCase())
            ) : [];
            setFilteredBranches(suggestions);
        }
      
    };

    const handleSelection = (value, content) => {

        setValidationError(null); 

        if(content === 'university')
        {
            setData('university', value.uni_name)
            setFilteredUniversities([]);
        
            setBranches(value.university_branch);
        }
        else if(content === 'branch')
        {
            setData('campus', value.uni_branch_name);
            checkIfUniversityExist(value.id);
            setFilteredBranches([]);
            
        }

    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setData('ins_admin_proof', file);
    };

    const checkIfUniversityExist = async (uni_branch_id) => {
        try {
            const response = await axios.get('/check-university-subscription', {
                params: { uni_branch_id },
            });
    
            if (response.status === 200) {
                setValidationError(response.data.message); 
            } else if (response.status === 204) {
                setValidationError(null);
            }
        } catch (error) {
            console.error('Error checking university subscription:', error);
            setValidationError('An error occurred while checking the subscription.');
        }
    };

    
    return (
        <div className="min-h-screen bg-customlightBlue flex flex-col items-center">
            <div className="w-full bg-customBlue">
                <img src="/images/banner.png" alt="Banner" className="w-full object-cover" />
            </div>

            
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg lg:-mt-24 m-5">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Institution Subscription Form
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Please fill out the form below to subscribe your institution.
                </p>

                <form onSubmit={submit} className="space-y-4 px-14">
                <div className=" flex flex-row space-x-5">
                    <div className="w-full space-y-3">
                        <div className=" text-xl font-semibold text-gray-700">Chosen Plan:</div>
                        <h3 className=" text-lg font-semibold text-gray-600 pl-5">{plan.plan_name}</h3>

                        <Divider/>

                        <div className=" flex flex-row space-x-2 mt-3">
                            <h1>Term:</h1>
                            <h1>{plan.plan_term}</h1>
                        </div>

                        
                        <div className=" flex flex-row space-x-2 mt-1">
                            <h1>Price:</h1>
                            <h1>{formatPrice(plan.plan_price)} per users</h1>
                        </div>

                        <div className=" flex flex-row space-x-2 mt-1">
                            <h1>Total Amount:</h1>
                            <h1>{formatPrice(data.total_amount || 0.00)}</h1>
                        </div>

                        <div className="my-1">
                            <InputLabel value="Number of Users" />
                            <TextInput
                                id="num_users"
                                type="number"
                                name="num_users"
                                value={data.number_of_users}
                                className="mt-1 block w-1/2"
                                placeholder="100"
                                onChange={(e) => setData('number_of_users', e.target.value)}
                                required
                            />
                            <InputError message={errors.number_of_users} className="mt-2" />
                        </div>


                    </div>
                <div className="w-full space-y-4">
                    <div>
                        <InputLabel value="Name" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            placeholder="Enter your name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            placeholder="example@gmail.com"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Contact Number" />
                        <TextInput
                            id="pnum"
                            type="number"
                            name="pnum"
                            value={data.pnum}
                            className="mt-1 block w-full"
                            placeholder="09XXXXXXX"
                            onChange={(e) => setData('pnum', e.target.value)}
                            required
                        />
                        <InputError message={errors.pnum} className="mt-2" />
                    </div>

                    <div>
                        {/* University Input */}
                        <label htmlFor="university">University</label>
                        <input
                            type="text"
                            id="university"
                            value={data.university}
                            onChange={(e) => handleSuggestion(e, 'university')}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Type to search for a university"
                        />
                        {filteredUniversities.length > 0 && (
                            <ul className="suggestions-list bg-gray-100">
                                {filteredUniversities.map((uni) => (
                                    <li
                                        key={uni.id}
                                        onClick={() => handleSelection(uni, 'university')}
                                        className="cursor-pointer p-2 hover:bg-gray-200 border-b-1"
                                    >
                                        {uni.uni_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        {/* Branch Input */}
                        <label htmlFor="branch">Branch</label>
                        <input
                            type="text"
                            id="branch"
                            value={data.campus}
                            onChange={(e) => handleSuggestion(e, 'branch')}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Type to search for a branch"
                            disabled={!data.university}
                        />
                        {filteredBranches.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredBranches.map((branch) => (
                                    <li
                                        key={branch.id}
                                        onClick={() => handleSelection(branch, 'branch')}
                                        className="cursor-pointer hover:bg-gray-100"
                                    >
                                        {branch.uni_branch_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                 

                    {validationError && (
                        <p className="text-red-500 text-sm mt-2">{validationError}</p>
                    )}

                    <div>
                        <InputLabel value="Proof of University Connection" />
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-12 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                <div className="flex flex-row space-x-2 items-center justify-between p-5">
                                    {selectedFile ? (
                                        <p className="text-sm text-blue-500 mt-2">
                                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500 font-semibold">
                                            Click to upload
                                        </p>
                                    )}
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                    </div>

                  
                
                </div>

                    <PrimaryButton className=" mt-4" type="submit" disabled={processing}>
                        Go to Payment
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
