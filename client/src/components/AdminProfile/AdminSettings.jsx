import React, { useState, useEffect } from 'react';
import { Save, Plus, X , Trash} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/apiConfig.js';
import {useNavigate} from 'react-router-dom';


const ProfileSettings = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    FullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    title: '',
    department: '',
    company: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    introduction: '',
    expertise: [],
    followedTopics: []
  });
  const [currUser, setCurrUser] = useState(null);
  const [newExpertise, setNewExpertise] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance.get(`/api/user/${user._id}`);
        const currUser = response.data.user;
        console.log(currUser);
        setCurrUser(currUser);
        setFormData({
          FullName: currUser.FullName || '',
          email: currUser.email || '',
          password: '',
          confirmPassword: '',
          location: currUser.location || '',
          title: currUser.title || '',
          department: currUser.department || '',
          company: currUser.company || '',
          socialLinks: {
            twitter: currUser.socialLinks?.twitter || '',
            linkedin: currUser.socialLinks?.linkedin || '',
            instagram: currUser.socialLinks?.instagram || ''
          },
          introduction: currUser.introduction || '',
          expertise: currUser.expertise || [],
          followedTopics: currUser.followedTopics || []
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, [user]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social-')) {
      const platform = name.split('-')[1];
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

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        followedTopics: [...prev.followedTopics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      followedTopics: prev.followedTopics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      await axiosInstance.patch(`/api/user/update/${user._id}`, updateData);
      toast.success('Profile updated successfully');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.msg || 'Error updating profile');
    }
  };

  const handleDeleteProfile = async() =>{
  try{
    await axiosInstance.delete("api/user/logout");
    await axiosInstance.delete(`/api/user/delete/${user._id}`);
    console.log("User profile deleted successfully");
    toast.success('Profile deleted successfully');
    
  }catch(err){
    console.log("Some error occured in deleting user profile--->", err);
    toast.error(err.response.data?.msg || 'Error deleting profile');
  }
}


  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="FullName"
              value={formData.FullName}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.FullName || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.email || ''}   
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.title || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.department || ''}  
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.company || ''} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.location || ''}    
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter</label>
            <input
              type="url"
              name="social-twitter"
              value={formData.socialLinks.twitter}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.socialLinks?.twitter || "https://twitter.com/username"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              name="social-linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.socialLinks?.linkedin || "https://linkedin.com/in/username"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="url"
              name="social-instagram"
              value={formData.socialLinks.instagram}
              onChange={handleInputChange}
              className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder={currUser?.socialLinks?.instagram || "https://instagram.com/username"}
            />
          </div>
        </div>

        {/* Introduction */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Introduction</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            rows={4}
            className="text-black mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          />
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.expertise.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeExpertise(index)}
                  className="ml-2 inline-flex items-center"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              className="text-black flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="Add new expertise"
            />
            <button
              type="button"
              onClick={addExpertise}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Plus size={16} className="mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Followed Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Followed Topics</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.followedTopics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="ml-2 inline-flex items-center"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="text-black flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="Add new topic"
            />
            <button
              type="button"
              onClick={addTopic}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Plus size={16} className="mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>

        {/* Profile Delete button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            <Trash size={16} className="mr-2" />
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
