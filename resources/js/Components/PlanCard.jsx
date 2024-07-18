export default function PlanCard({title, text, price, term, features, planId, ...props }) {
    // const features = [
    //     {feature_name: 'Access Project'},
    //     {feature_name: 'Access Project'},
    //     {feature_name: 'Access Project'},
    //     {feature_name: 'Access Project'},
    //     {feature_name: 'Access Project'},
    // ];

    return (
        <div className="flex flex-col p-6 mx-auto min-w-80 max-w-md text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow">
            <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
            <p className="font-light text-gray-500 sm:text-lg">{text}</p>
            <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">P{price}</span>
                <span className="text-gray-500">{term}</span>
            </div>
            
            <ul role="list" className="mb-8 space-y-3 text-left">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        <span className="text-base font-normal leading-tight text-gray-500 ml-3"> 
                            {features.find(f => f.plan_id === planId)?.feature_name}
                        </span>
                    </li>
                ))}

               
            </ul>
            <a href="#" className="text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get started</a>
        </div>
    );
}
