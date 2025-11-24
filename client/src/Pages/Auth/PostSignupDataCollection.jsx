import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axiosInstance from '../../config/apiConfig';
import { toast } from 'react-toastify';

export default function PostSignupDataCollection() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'user',
    socialLinks: {
      twitter: '',
      LinkedIn: '',
      Instagram: ''
    },
    followedTopicsArray: [],
    isSubscribedToNewsletter: false,
    location: '',
    title: '',
    department: '',
    company: '',
    expertiseArray: [],
    discoverySource: '',
    introduction: ''
  });

  const [topicInput, setTopicInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('social')) {
      const [_, platform] = name.split('.');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addTopic = () => {
    if (topicInput.trim()) {
      setFormData(prev => ({
        ...prev,
        followedTopicsArray: [...prev.followedTopicsArray, topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const removeTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      followedTopicsArray: prev.followedTopicsArray.filter((_, i) => i !== index)
    }));
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        expertiseArray: [...prev.expertiseArray, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      expertiseArray: prev.expertiseArray.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role || !formData.discoverySource) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const idToken = await user.getIdToken();
      
      await axiosInstance.post('/api/user/sync', formData, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      toast.success('Profile completed successfully!');
      navigate('/user/profile');
    } catch (err) {
      console.error('Error syncing user data:', err);
      toast.error(err.response?.data?.msg || 'Error completing profile');
    } finally {
      setLoading(false);
    }
  };

  const discoveryOptions = [
    "LinkedIn", "Twitter/X", "Instagram", "Email Newsletter", "College/University",
    "Company/Organization", "Hackathon or Event", "Friend", "Family", "Colleague",
    "Google Search", "News Article or Blog", "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role * <span className="text-red-500">Required</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="core">Core Team</option>
              <option value="chair">Chair</option>
            </select>
          </div>

          {/* Discovery Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you discover us? * <span className="text-red-500">Required</span>
            </label>
            <select
              name="discoverySource"
              value={formData.discoverySource}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {discoveryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Your location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Your job title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Your department"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your company"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Followed Topics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topics of Interest</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                placeholder="Add a topic"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.followedTopicsArray.map((topic, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                  {topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                placeholder="Add your expertise"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addExpertise}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.expertiseArray.map((exp, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                  {exp}
                  <button
                    type="button"
                    onClick={() => removeExpertise(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                name="social.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                name="social.LinkedIn"
                value={formData.socialLinks.LinkedIn}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                name="social.Instagram"
                value={formData.socialLinks.Instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Introduction</label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleInputChange}
              placeholder="Tell us about yourself (max 500 characters)"
              maxLength="500"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">{formData.introduction.length}/500</p>
          </div>

          {/* Newsletter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isSubscribedToNewsletter"
              checked={formData.isSubscribedToNewsletter}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Subscribe to our newsletter for updates
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Completing Profile...' : 'Complete Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user/profile')}
              className="flex-1 bg-gray-300 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
