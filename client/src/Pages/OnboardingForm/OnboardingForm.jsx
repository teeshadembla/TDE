import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Save, Send, Loader2, CheckCircle } from 'lucide-react';
import axiosInstance from '../../config/apiConfig';
import { InputField, TextArea } from '../../components/OnboardingForm/UiComponents/InputParams';
import FormCard from '../../components/OnboardingForm/UiComponents/FormCard';
import ImageUpload from '../../components/OnboardingForm/UiComponents/ImageUpload';
import DynamicList from '../../components/OnboardingForm/UiComponents/DynamicList';
import PortfolioItem from '../../components/OnboardingForm/UiComponents/PortfolioItem';
import ProgressIndicator from '../../components/OnboardingForm/UiComponents/ProgressIndicator';
import axios from 'axios';
import { toast } from 'react-toastify';

const OnboardingForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false); 
  const [existingImageUrl, setExistingImageUrl] = useState(null); 
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    displayName: '',
    headline: '',
    bio: '',
    currentRole: { title: '', organization: '' },
    expertise: ['', '', ''],
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    },
    portfolioItems: []
  });

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const total = 7;
    
    if (imagePreview) completed++;
    if (formData.displayName) completed++;
    if (formData.headline) completed++;
    if (formData.bio.length >= 100) completed++;
    if (formData.currentRole.title && formData.currentRole.organization) completed++;
    if (formData.expertise.filter(e => e.trim()).length >= 3) completed++;
    if (Object.values(formData.socialLinks).some(link => link.trim())) completed++;
    
    return { completed, total };
  };

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/fellow-profile/getDraft/${userId}`
        );
        if (response.data) {
          setFormData(response.data);
          if (response.data.professionalHeadshotUrl) {
            setImagePreview(response.data.professionalHeadshotUrl);
            setExistingImageUrl(response.data.professionalHeadshotUrl); // Store existing URL
          }
        }
      } catch (error) {
        console.log('No existing draft found');
      }
    };
    loadDraft();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleExpertiseChange = (index, value) => {
    const newExpertise = [...formData.expertise];
    newExpertise[index] = value;
    setFormData(prev => ({ ...prev, expertise: newExpertise }));
  };

  const addExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, '']
    }));
  };

  const removeExpertise = (index) => {
    if (formData.expertise.length > 3) {
      const newExpertise = formData.expertise.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, expertise: newExpertise }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 10MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'File must be an image' }));
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);
      setHasNewImage(true); // Mark that image has changed
      
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }));

      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleImageRemove = async () => {
    // If there's an existing image in S3, delete it
    if (existingImageUrl && !hasNewImage) {
      try {
        await axiosInstance.delete(
          `/api/fellow-profile/headshot/delete/${userId}`
        );
        toast.success('Image deleted successfully');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      }
    }

    // Clear local state
    setImagePreview(null);
    setImageFile(null);
    setHasNewImage(true); // Mark as changed (removed)
    setExistingImageUrl(null);
    setFormData(prev => ({ ...prev, professionalHeadshot: '' }));
  };

  const addPortfolioItem = () => {
    setFormData(prev => ({
      ...prev,
      portfolioItems: [
        ...prev.portfolioItems,
        { title: '', description: '', url: '', type: 'project' }
      ]
    }));
  };

  const updatePortfolioItem = (index, field, value) => {
    const newItems = [...formData.portfolioItems];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, portfolioItems: newItems }));
  };

  const removePortfolioItem = (index) => {
    const newItems = formData.portfolioItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, portfolioItems: newItems }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.displayName?.trim() || formData.displayName.length < 2) {
      newErrors.displayName = 'Display name is required (min 2 characters)';
    }
    if (!formData.headline?.trim() || formData.headline.length < 10) {
      newErrors.headline = 'Headline is required (min 10 characters)';
    }
    if (!formData.bio?.trim() || formData.bio.length < 100) {
      newErrors.bio = `Bio must be at least 100 characters (current: ${formData.bio.length})`;
    }
    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must not exceed 500 characters';
    }
    if (!formData.currentRole.title?.trim()) {
      newErrors.roleTitle = 'Current role title is required';
    }
    if (!formData.currentRole.organization?.trim()) {
      newErrors.roleOrg = 'Organization is required';
    }
    if (!imagePreview) {
      newErrors.image = 'Professional headshot is required';
    }
    
    const validExpertise = formData.expertise.filter(e => e.trim().length > 0);
    if (validExpertise.length < 3) {
      newErrors.expertise = 'At least 3 areas of expertise are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Prepare data to send
      const dataToSend = {
        ...formData,
        hasNewImage // Tell backend if image changed
      };

      // Step 1: Save draft (backend will conditionally return presigned URL)
      const response = await axiosInstance.post(
        `/api/fellow-profile/presigned-url/headshot/${userId}`,
        dataToSend
      );

      const { profileId, presignedUrl, key } = response.data;

      // Step 2: Upload image ONLY if there's a new one
      if (hasNewImage && presignedUrl && imageFile) {
        await axios.put(presignedUrl, imageFile, {
          headers: {
            'Content-Type': imageFile.type,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImgUploadProgress(progress);
          },
        });

        // Step 3: Confirm upload
        const confirmResponse = await axiosInstance.put('/api/fellow-profile/headshot/confirmUpload', {
          documentId: profileId
        });


        console.log(confirmResponse);

        // Reload draft to get new signed URL
        const draftResponse = await axiosInstance.get(
          `/api/fellow-profile/getDraft/${userId}`
        );
        
        if (draftResponse.data.professionalHeadshot) {
          setImagePreview(draftResponse.data.professionalHeadshotUrl);
          setExistingImageUrl(draftResponse.data.professionalHeadshotUrl);
        }
        
        setHasNewImage(false); // Reset flag
        setImageFile(null);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      toast.success("Draft saved successfully!");

    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
      setImgUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/fellow-profile/submit/${userId}`,
        formData,
        hasNewImage,
      );
      toast.success('Profile submitted successfully!');

      const { profileId, presignedUrl, key } = response.data;

      console.log("If we have new image:", hasNewImage);
      console.log("presigned Url", presignedUrl);
      console.log("imageFile", imageFile);
      
      // Step 2: Upload image ONLY if there's a new one
      if (hasNewImage && presignedUrl && imageFile) {
        await axios.put(presignedUrl, imageFile, {
          headers: {
            'Content-Type': imageFile.type,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImgUploadProgress(progress);
          },
        })
      }

      // Step 3: Confirm upload
        const confirmResponse = await axiosInstance.put('/api/fellow-profile/headshot/confirmUpload', {
          documentId: profileId
        });

        console.log("Image is getting uploaded");
      /* navigate('/user/profile'); */
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast.error('Failed to submit profile');
    } finally {
      setLoading(false);
    }
  };

  const { completed, total } = calculateCompletion();

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-white'>
            Onboarding Form
          </h1>
          <p className='text-neutral-500 text-sm sm:text-base lg:text-lg leading-relaxed'>
            Create your public fellow's profile. This information will be reviewed by our team. 
            If everything meets our standards, you'll be onboarded with this information. 
            Otherwise, you'll receive feedback on what to change.
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator completed={completed} total={total} />

        {/* Success Message */}
        {showSuccess && (
          <div className='mb-6 bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-center gap-3 animate-fade-in'>
            <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
            <span className='text-green-400 text-sm'>Draft saved successfully!</span>
          </div>
        )}

        {/* Upload Progress */}
        {imgUploadProgress > 0 && imgUploadProgress < 100 && (
          <div className='mb-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-blue-400 text-sm'>Uploading image...</span>
              <span className='text-blue-400 text-sm'>{imgUploadProgress}%</span>
            </div>
            <div className='w-full bg-neutral-800 rounded-full h-2'>
              <div 
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                style={{ width: `${imgUploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Professional Headshot */}
          <FormCard title='Professional Headshot' required>
            <ImageUpload
              preview={imagePreview}
              onUpload={handleImageUpload}
              onRemove={() => {
                setImagePreview(null);
                setImageFile(null);
                setHasNewImage(true); // Mark as changed (removed)
                setExistingImageUrl(null);
              }}
              error={errors.image}
            />
          </FormCard>

          {/* Display Name */}
          <FormCard title='Display Name' required>
            <InputField
              type='text'
              name='displayName'
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder='How you want to be known publicly'
              maxLength={100}
              error={errors.displayName}
            />
          </FormCard>

          {/* Professional Headline */}
          <FormCard 
            title='Professional Headline' 
            description='A brief description of your professional identity'
            required
          >
            <InputField
              type='text'
              name='headline'
              value={formData.headline}
              onChange={handleInputChange}
              placeholder='AI Researcher | Machine Learning Engineer'
              maxLength={150}
              error={errors.headline}
            />
            <p className='text-xs text-neutral-500 mt-2'>{formData.headline.length}/150</p>
          </FormCard>

          {/* Bio */}
          <FormCard 
            title='Bio' 
            description='Tell us about yourself (100-500 characters)'
            required
          >
            <TextArea
              name='bio'
              value={formData.bio}
              onChange={handleInputChange}
              placeholder='Share your background, interests, and what drives you...'
              rows={6}
              maxLength={500}
              charCount={formData.bio.length}
              error={errors.bio}
            />
          </FormCard>

          {/* Current Role */}
          <FormCard title='Current Role' required>
            <div className='space-y-4'>
              <InputField
                type='text'
                label='Job Title'
                value={formData.currentRole.title}
                onChange={(e) => handleNestedChange('currentRole', 'title', e.target.value)}
                placeholder='Software Engineer'
                error={errors.roleTitle}
              />
              <InputField
                type='text'
                label='Organization'
                value={formData.currentRole.organization}
                onChange={(e) => handleNestedChange('currentRole', 'organization', e.target.value)}
                placeholder='Tech Company Inc.'
                error={errors.roleOrg}
              />
            </div>
          </FormCard>

          {/* Areas of Expertise */}
          <FormCard 
            title='Areas of Expertise' 
            description='Add at least 3 areas (e.g., Machine Learning, Web Development)'
            required
          >
            <DynamicList
              items={formData.expertise}
              onChange={handleExpertiseChange}
              onAdd={addExpertise}
              onRemove={removeExpertise}
              placeholder='Area'
              minItems={3}
              error={errors.expertise}
            />
          </FormCard>

          {/* Social Links */}
          <FormCard title='Social Links' description='Connect your professional profiles'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <InputField
                type='url'
                label='LinkedIn'
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                placeholder='https://linkedin.com/in/username'
              />
              <InputField
                type='url'
                label='Twitter/X'
                value={formData.socialLinks.twitter}
                onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                placeholder='https://twitter.com/username'
              />
              <InputField
                type='url'
                label='GitHub'
                value={formData.socialLinks.github}
                onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)}
                placeholder='https://github.com/username'
              />
              <InputField
                type='url'
                label='Website'
                value={formData.socialLinks.website}
                onChange={(e) => handleNestedChange('socialLinks', 'website', e.target.value)}
                placeholder='https://yourwebsite.com'
              />
            </div>
          </FormCard>

          {/* Portfolio Items */}
          <FormCard 
            title='Portfolio' 
            description='Showcase your work, publications, or talks (optional)'
          >
            {formData.portfolioItems.map((item, index) => (
              <PortfolioItem
                key={index}
                item={item}
                index={index}
                onUpdate={(field, value) => updatePortfolioItem(index, field, value)}
                onRemove={() => removePortfolioItem(index)}
              />
            ))}
            <button
              type='button'
              onClick={addPortfolioItem}
              className='flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm transition-colors'
            >
              <Plus className='w-4 h-4' /> Add portfolio item
            </button>
          </FormCard>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sticky bottom-4 sm:static'>
            <button
              type='button'
              onClick={handleSaveDraft}
              disabled={saving}
              className='w-full sm:flex-1 bg-neutral-800 border border-neutral-700 text-white px-6 py-3 sm:py-4 rounded-lg font-medium hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {saving ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span className='hidden sm:inline'>Saving...</span>
                </>
              ) : (
                <>
                  <Save className='w-5 h-5' />
                  <span className='hidden sm:inline'>Save Draft</span>
                  <span className='sm:hidden'>Save</span>
                </>
              )}
            </button>
            <button
              type='submit'
              disabled={loading}
              className='w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 sm:py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span className='hidden sm:inline'>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className='w-5 h-5' />
                  <span className='hidden sm:inline'>Submit for Review</span>
                  <span className='sm:hidden'>Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;