import {BadgeCheck } from "lucide-react";
const AdminInfoSideBar = ({ adminData, adminStats,  account}) => {
    return(
        <div className="w-80 bg-white border-l border-gray-200 p-6 flex-shrink-0">
        <div className="text-center mb-6">
          <img
            src={account.profilePicture}
            alt={account.name}
            className="w-20 h-20 rounded-full mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-gray-900">{account.name}{account.verified && <BadgeCheck/>}</h3>
          <p className="text-sm text-gray-600">{account.email}</p>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
            {account.role}
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Reviews</span>
                <span className="font-medium text-orange-600">{adminStats.pendingApplications?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Fellowships</span>
                <span className="font-medium text-green-600">{adminStats.activeFellowships || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Users</span>
                <span className="font-medium">{adminStats.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Month Revenue</span>
                <span className="font-medium text-blue-600">${Math.round((adminStats.monthlyRevenue || 0) / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>3 new applications submitted today</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>2 applications approved yesterday</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>1 fellowship cycle started this week</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span>New workgroup created last week</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Health</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Server Status</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Gateway</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email Service</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Running
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
    )
}

export default AdminInfoSideBar;