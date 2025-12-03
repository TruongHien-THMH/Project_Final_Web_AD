import React from 'react'

export default function DateRangePicker({ fromDate, setFromDate, toDate, setToDate }) {
    // Để tái sử dụng cho các class input khác
    const inputClass = "w-full bg-gray-900 border border-gray-600 rounded-xl py-3 px-4 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none";
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <label className="block text-gray-300 font-medium mb-2">From Date</label>
                <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={inputClass}
                />
            </div>
            <div>
                <label className="block text-gray-300 font-medium mb-2">To Date</label>
                <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={inputClass}
                />
            </div>
        </div>
    )
}
