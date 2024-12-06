import AdminLayout from '@/Layouts/AdminLayout'
import React from 'react'
import ErrorPage from './ErrorPage'

export default function Unauthorized({ user }) {

    return (
        <AdminLayout user={user}>
            <ErrorPage
                errorCode="403"
                errorMessage="Access Denied"
                description={<>You do not have permission to view this page. Please contact the
                    super admin if you believe this is a mistake.</>}
                heightClass='min-h-[75vh]'
            />
        </AdminLayout>
    )
}
