import React, { useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/apiConfig.js';
import DataProvider from '../../context/DataProvider.jsx';

const ApplicationModal = ({ isOpen, onClose }) => {
  const { account } = useContext(DataProvider.DataContext);

  const [formData, setFormData] = useState({
    organization: '',
    position: '',
    experience: '',
    motivation: '',
    workGroupId: '',
    linkedin: '',
    cycle: '',
  });
  const [workGroups, setWorkGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    axiosInstance.get('/api/fellowship/getWorkgroups')
      .then((res) => setWorkGroups(res.data.data || []))
      .catch(() => toast.error('Failed to load workgroups'));
  }, [isOpen]);

  const getUpcomingCycles = () => {
    const today = new Date();
    const year = today.getFullYear();
    const cycleMonths = [
      { month: 0, name: 'January' },
      { month: 2, name: 'March' },
      { month: 5, name: 'June' },
      { month: 9, name: 'October' },
    ];
    let cycles = [];
    cycleMonths.forEach(({ month, name }) => {
      if (new Date(year, month, 1) >= today) {
        cycles.push({ id: `${name} ${year}`, name: `${name} ${year}` });
      }
    });
    const nextYear = year + 1;
    cycleMonths.forEach(({ month, name }) => {
      if (cycles.length < 4) {
        cycles.push({ id: `${name} ${nextYear}`, name: `${name} ${nextYear}` });
      }
    });
    return cycles;
  };

  const cycles = getUpcomingCycles();

  const validateForm = () => {
    const required = ['organization', 'position', 'experience', 'motivation', 'workGroupId', 'linkedin', 'cycle'];
    for (const field of required) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinRegex.test(formData.linkedin)) {
      toast.error('Please enter a valid LinkedIn profile URL.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/fellowship/registration/submitFellowshipApplication', {
        userId: account._id,
        workGroupId: formData.workGroupId,
        cycle: formData.cycle,
        experience: formData.experience,
        motivation: formData.motivation,
        organization: formData.organization,
        position: formData.position,
        linkedin: formData.linkedin,
      });

      if (response.data.success) {
        toast.success("Application submitted! We'll notify you once it's reviewed.");
        setFormData({ organization: '', position: '', experience: '', motivation: '', workGroupId: '', linkedin: '', cycle: '' });
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 bottom-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex max-w-6xl w-full max-h-[90vh] mt-16 sm:mt-24 rounded-2xl shadow-2xl overflow-hidden">

        {/* Form Section */}
        <div className="bg-white w-full lg:w-1/2 overflow-y-auto">
          <div className="p-6 sm:p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-light">Fellowship Application</h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Join the next generation of global leaders</p>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Organization & Position */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Organization *</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                    placeholder="Your current organization"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Current Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                    placeholder="Your job title"
                  />
                </div>
              </div>

              {/* Cycle & Experience */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Fellowship Cycle *</label>
                  <select
                    value={formData.cycle}
                    onChange={(e) => setFormData((p) => ({ ...p, cycle: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  >
                    <option value="">Select a cycle</option>
                    {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Years of Experience *</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-2">0–2 years</option>
                    <option value="3-5">3–5 years</option>
                    <option value="5-10">5–10 years</option>
                    <option value="10-15">10–15 years</option>
                    <option value="15-20">15–20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile *</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData((p) => ({ ...p, linkedin: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>

              {/* Workgroups */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Workgroup *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workGroups.map((wg) => (
                    <label
                      key={wg._id}
                      className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="workGroup"
                        checked={formData.workGroupId === wg._id}
                        onChange={() => !isSubmitting && setFormData((p) => ({ ...p, workGroupId: wg._id }))}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="text-sm font-medium">{wg.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Why are you interested in joining our Fellowship? *
                </label>
                <textarea
                  rows={5}
                  value={formData.motivation}
                  onChange={(e) => setFormData((p) => ({ ...p, motivation: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black resize-none transition-colors disabled:opacity-50"
                  placeholder="Describe your motivation, experience, and what you hope to contribute..."
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500">{formData.motivation.length}/1000</div>
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">What happens next?</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your application will be reviewed by our team. If approved, you will receive an email prompting you to complete your payment — no card details are required at this stage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </button>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-4 border-2 border-gray-300 hover:bg-gray-50 transition-colors font-medium rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section — hidden on small screens */}
        <div
          className="hidden lg:block lg:w-1/2"
          style={{
            backgroundImage: 'url("https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68662e2e70b9174c52186b5f_People%20seated%20at%20tables.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default ApplicationModal;
