const AdminHeader = ({ account, adminData }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage fellowships, applications, and system settings</p>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="text-right mr-4">
            <p className="text-sm font-medium text-gray-900">{account.name}</p>
            <p className="text-xs text-gray-500">{account.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
                src={adminData.user.profilePicture} 
                alt={adminData.user.name}
                className="w-full h-full object-cover"
            />
            </div>
        </div>
        </div>
    </header>
  )
}

export default AdminHeader;