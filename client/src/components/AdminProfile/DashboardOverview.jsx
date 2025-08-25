import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  Users, 
  FileText, 
  Plus,
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
  History,
  Target
} from 'lucide-react';
import StatsCard from "../../components/AdminProfile/StatsCard.jsx";

const DashboardOverview = ({ stats, recentApplications, onStatusChange, setActiveTab }) => {
  console.log('DashboardOverview props:', {
    stats: {
      monthlyApplications: stats?.monthlyApplications,
      pendingApplications: stats?.pendingApplications,
      activeFellowships: stats?.activeFellowships,
      totalRevenue: stats?.totalRevenue,
      totalFellowships: stats?.totalFellowships
    },
    recentApplicationsLength: recentApplications?.length,
    recentApplicationsFirst: recentApplications?.[0]
  });
  return (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Applications"
        value={stats.monthlyApplications || 0}
        icon={FileText}
        change={`${stats.monthlyApplications || 0} this month`}
        changeType="positive"
      />
      <StatsCard
        title="Pending Reviews"
        value={stats.pendingApplications?.length || 0}
        icon={AlertCircle}
        change="Needs review"
        changeType="neutral"
      />
      <StatsCard
        title="Active Fellowships"
        value={stats.activeFellowships || 0}
        icon={Award}
        change={`${stats.totalFellowships} total`}
        changeType="positive"
      />
      <StatsCard
        title="Total Revenue"
        value={`$${(stats.totalRevenue / 100)?.toLocaleString() || 0}`}
        icon={DollarSign}
        change="All time"
        changeType="positive"
      />
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Fellowship</h3>
        <p className="text-sm text-gray-600 mb-4">Launch a new fellowship program</p>
        <button onClick={() => setActiveTab('fellowships')} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Workgroup</h3>
        <p className="text-sm text-gray-600 mb-4">Create new research workgroups</p>
        <button onClick={() => setActiveTab('workgroups')} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Create Now
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <FileText className="w-8 h-8 text-orange-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Applications</h3>
        <p className="text-sm text-gray-600 mb-4">{stats.pendingApplications?.length || 0} pending reviews</p>
        <button onClick={() => setActiveTab('moderation')} className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Review Now
        </button>
      </div>
    </div>

    {/* Recent Applications Preview */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
        <button onClick={() => setActiveTab('moderation')} className="text-sm text-blue-600 hover:text-blue-800">View All</button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentApplications && recentApplications.map((application) => (
            <div key={application._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {application.user?.FullName?.charAt(0)?.toUpperCase() || application.userStat?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{application.user?.FullName || application.userStat}</p>
                  <p className="text-xs text-gray-500">
                    Amount: ${(application.amount/100)?.toLocaleString() || 0}
                    <span className="mx-2">•</span>
                    Created: {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status}
                </span>
                {application.status === 'PENDING' && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onStatusChange(application._id, 'ACCEPTED')}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Accept"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStatusChange(application._id, 'REJECTED')}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!recentApplications || recentApplications.length === 0) && (
            <div className="text-center py-6 text-gray-500">
              No pending applications to display
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default DashboardOverview;