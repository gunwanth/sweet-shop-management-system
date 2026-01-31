import React from 'react'

export default function ActivityFeed({ activities = [] }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow">
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">Recent Activity</h3>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
        {activities.length === 0 && <li className="text-gray-500">No recent activity</li>}
        {activities.map((a: any) => (
          <li key={a.id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200">
              {a.icon || '•'}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{a.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{a.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
