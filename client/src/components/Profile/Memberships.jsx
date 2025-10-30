import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const Memberships = ({ userId }) => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMemberships();
    }, [userId]);

    const fetchMemberships = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/users/${userId}/memberships`);
            const data = await response.json();
            setMemberships(data.membership || []);
        } catch (error) {
            console.error('Error fetching memberships:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeMemberships = memberships.filter(m => m.status === 'active' && m.isActive);
    const pastMemberships = memberships.filter(m => m.status !== 'active' || !m.isActive);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getMembershipBadgeColor = (type) => {
        const colors = {
            digitali: 'bg-blue-100 text-blue-800',
            digitalc: 'bg-green-100 text-green-800',
            strategic: 'bg-purple-100 text-purple-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
            expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' },
            cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const MembershipCard = ({ membership, isPast = false }) => {
        const daysRemaining = getDaysRemaining(membership.endDate);
        const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;

        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                {membership.membershipType} Membership
                            </h3>
                            <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getMembershipBadgeColor(membership.membershipType)}`}>
                                {membership.membershipType.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    {getStatusBadge(membership.status)}
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium text-gray-900">{formatDate(membership.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium text-gray-900">{formatDate(membership.endDate)}</span>
                    </div>

                    {!isPast && daysRemaining > 0 && (
                        <div className={`mt-4 p-3 rounded-lg ${isExpiringSoon ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'}`}>
                            <div className="flex items-center gap-2">
                                {isExpiringSoon ? (
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <span className={`text-sm font-medium ${isExpiringSoon ? 'text-yellow-800' : 'text-blue-800'}`}>
                                    {daysRemaining} days remaining
                                </span>
                            </div>
                        </div>
                    )}

                    {membership.cancellationDate && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600">
                                Cancelled on {formatDate(membership.cancellationDate)}
                            </p>
                            {membership.cancellationReason && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Reason: {membership.cancellationReason}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {!isPast && membership.status === 'active' && (
                    <div className="mt-6 flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                            Renew Now
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Memberships</h2>
            <p className="text-gray-600 mb-6">View and manage your active and past memberships</p>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
                        activeTab === 'active'
                            ? 'text-purple-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Active Memberships
                    {activeMemberships.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                            {activeMemberships.length}
                        </span>
                    )}
                    {activeTab === 'active' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
                        activeTab === 'past'
                            ? 'text-purple-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Past Memberships
                    {pastMemberships.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">
                            {pastMemberships.length}
                        </span>
                    )}
                    {activeTab === 'past' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                    )}
                </button>
            </div>

            {activeTab === 'active' && (
                <div className="space-y-4">
                    {activeMemberships.length > 0 ? (
                        activeMemberships.map((membership, index) => (
                            <MembershipCard key={index} membership={membership} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Memberships</h3>
                            <p className="text-gray-600 mb-4">You don't have any active memberships at the moment</p>
                            <button onClick={()=>navigate("/join-us/pricing")} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                                Explore Memberships
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'past' && (
                <div className="space-y-4">
                    {pastMemberships.length > 0 ? (
                        pastMemberships.map((membership, index) => (
                            <MembershipCard key={index} membership={membership} isPast={true} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Memberships</h3>
                            <p className="text-gray-600">You don't have any membership history</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Memberships;