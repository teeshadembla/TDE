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

const ApplicationDetailsModal = ({ application, isOpen, onClose, onStatusChange }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <p className="text-gray-600 mt-1">Review and moderate application</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name: </span>
                    <span className="text-sm text-gray-900">{application.user.FullName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email: </span>
                    <span className="text-sm text-gray-900">{application.user.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Organization: </span>
                    <span className="text-sm text-gray-900">{application.user.company}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Position: </span>
                    <span className="text-sm text-gray-900">{application.user.title}</span>
                  </div>{/* 
                  <div>
                    <span className="text-sm font-medium text-gray-700">Experience: </span>
                    <span className="text-sm text-gray-900">{application.user.experience} years</span>
                  </div> */}
                  <div>
                    <span className="text-sm font-medium text-gray-700">LinkedIn: </span>
                    <a 
                      href={application.user.socialLinks.LinkedIn} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Fellowship: </span>
                    <span className="text-sm text-gray-900">{application.fellowship.cycle}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Workgroup: </span>
                    <span className="text-sm text-gray-900">{application.workgroupId.title}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Submitted: </span>
                    <span className="text-sm text-gray-900">{new Date(application.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Payment: </span>
                    <span className={`text-sm font-medium ${
                      application.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {application.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Motivation Statement</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{application.motivation}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h4>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status}
                </span>
              </div>

              {application.status === 'PENDING' && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      onStatusChange(application._id, 'ACCEPTED');
                      onClose();
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-6 hover:bg-green-700 transition-colors font-medium rounded-lg flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Accept Application
                  </button>
                  <button
                    onClick={() => {
                      onStatusChange(application._id, 'REJECTED');
                      onClose();
                    }}
                    className="flex-1 bg-red-600 text-white py-3 px-6 hover:bg-red-700 transition-colors font-medium rounded-lg flex items-center justify-center"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;