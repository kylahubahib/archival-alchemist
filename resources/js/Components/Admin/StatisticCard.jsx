import React from 'react'
import { FaUser } from 'react-icons/fa'

export default function StatisticCard() {
    return (
        <div className="max-w-[200px] p-4 bg-white rounded-md">
            <div>
                <div className="text-customDarkBlue font-bold">
                    Subscriptions
                </div>
            </div>
            <hr className="bg-orange-300 h-1" />
            <div className="flex gap-3 h-full p-4">
                <div>
                    see
                </div>
                <div>
                    <FaUser />
                </div>
            </div>
        </div>
    )
}
