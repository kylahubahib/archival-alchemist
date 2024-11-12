{
    (() => {
        switch (userType) {
            case "institution_admin":
                return (
                    <CheckboxGroup
                        label={<>Manage Institution Admin Operations for <br /><strong>{username}</strong></>}
                        defaultValue={adminAccess}
                        onChange={setAdminAccess}
                    >
                        {!isDataLoading ? (
                            <>
                                <Checkbox value="can_add">Can add</Checkbox>
                                <Checkbox value="can_edit">Can edit</Checkbox>
                                <Checkbox value="can_delete">Can delete</Checkbox>
                            </>
                        ) : (
                            <>
                                {insAdminSkeletonRows.map((_, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Skeleton className="h-5 w-6 rounded-lg" />
                                        <Skeleton className="h-4 w-20 rounded-lg" />
                                    </div>
                                ))}
                            </>
                        )}
                    </CheckboxGroup>
                );

            case "super_admin":
                return (
                    <CheckboxGroup
                        label={<>Manage Super Admin Page Access for <strong>{username}</strong></>}
                        defaultValue={adminAccess}
                        onChange={setAdminAccess}
                    >
                        <div className="flex gap-10">
                            {!isDataLoading ? (
                                <>
                                    <div className="flex flex-col gap-1 pl-2">
                                        <Checkbox value="dashboard_access">Dashboard</Checkbox>
                                        <Checkbox value="users_access">Users</Checkbox>
                                        <Checkbox value="archives_access">Archives</Checkbox>
                                        <Checkbox value="subscriptions_and_billings_access">Subscriptions & Billings</Checkbox>
                                        <Checkbox value="user_reports_access">User Reports</Checkbox>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Checkbox value="user_feedbacks_access">User Feedbacks</Checkbox>
                                        <Checkbox value="terms_and_conditions_access">Terms & Conditions</Checkbox>
                                        <Checkbox value="subscription_plans_access">Subscription Plans</Checkbox>
                                        <Checkbox value="faqs_access">FAQs</Checkbox>
                                        <Checkbox value="advanced_access">Advanced</Checkbox>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2 pl-2">
                                        {superAdminSkeletonRows.map((_, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Skeleton className="h-5 w-6 rounded-lg" />
                                                <Skeleton className="h-4 w-40 rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {superAdminSkeletonRows.map((_, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Skeleton className="h-5 w-6 rounded-lg" />
                                                <Skeleton className="h-4 w-40 rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </CheckboxGroup>
                );

            default:
                return null;
        }
    })()
}