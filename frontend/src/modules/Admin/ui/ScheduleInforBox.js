import React from 'react'

export default function ScheduleInforBox() {
  return (
    <div className="bg-gray-700/30 p-4 rounded-xl mb-8 border border-gray-600 border-dashed">
        <h3 className="text-rose-400 font-semibold mb-2">ℹ️ How it works:</h3>
        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
            <li>The system will start scheduling from <strong>09:00 AM</strong> to <strong>11:00 PM</strong>.</li>
            <li>Movies will be rotated evenly among selected halls (Round Robin).</li>
            <li>Wait time between shows: <strong>20 minutes</strong> (Cleaning).</li>
        </ul>
    </div>
  )
}
