import axiosInstance from "../../../config/apiConfig";
import {toast} from "react-toastify";
import { updateApplicationStatus } from "../Services/AdminServices.js";
import "react-toastify/dist/ReactToastify.css";

export const useAdminActions = (setFellowshipRegistrations) => {
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setFellowshipRegistrations(prev => 
        prev.map(reg => 
          reg._id === applicationId ? { ...reg, status: newStatus } : reg
        )
      );
      toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Error updating application status');
    }
  };

  const handleCreateFellowship = async (fellowshipData) => {
    try {
      await createFellowship(fellowshipData);
      toast.success('Fellowship created successfully!');
    } catch (error) {
      console.error('Error creating fellowship:', error);
      toast.error('Error creating fellowship');
    }
  };

  const handleCreateWorkgroup = async (workgroupData) => {
    try {
      await createWorkgroup(workgroupData);
      toast.success('Workgroup created successfully!');
    } catch (error) {
      console.error('Error creating workgroup:', error);
      toast.error(error?.response?.data?.msg);
    }
  };

   // New handlers for additional tabs
  const handleFutureFellowshipEdit = (fellowship) => {
    console.log('Edit future fellowship:', fellowship);
    // Navigate to edit form or open modal
  };

  const handleFutureFellowshipDelete = (fellowshipId) => {
    console.log('Delete future fellowship:', fellowshipId);
    // API call to delete fellowship
  };

  const handleFutureFellowshipView = (fellowship) => {
    console.log('View future fellowship details:', fellowship);
    // Open detailed view modal
  };

  const handleProfileUpdate = (profileData) => {
    console.log('Update admin profile:', profileData);
    // Update admin profile via API
  };

  const handleWebsiteDelete = () => {
    console.log('Delete website requested');
    // Handle website deletion
  };

  const handleWorkgroupEdit = (workgroupId, workgroupData) => {
    console.log('Edit workgroup:', workgroupId, workgroupData);
    // Update workgroup via API
  };

  const handleWorkgroupDelete = (workgroupId) => {
    console.log('Delete workgroup:', workgroupId);
    // Delete workgroup via API
  };


  return {
    handleStatusChange,
    handleCreateFellowship,
    handleCreateWorkgroup,
    handleFutureFellowshipEdit,
    handleFutureFellowshipDelete,
    handleFutureFellowshipView,
    handleProfileUpdate,
    handleWebsiteDelete,
    handleWorkgroupEdit,
    handleWorkgroupDelete
  };
};