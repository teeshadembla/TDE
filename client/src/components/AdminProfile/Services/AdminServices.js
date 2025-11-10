import axiosInstance from "../../../config/apiConfig";

// All API-related functions
export const fetchAdminStats = async () => {
  const response = await axiosInstance.get("/api/user/stats");
  return response.data;
};

export const fetchPastFellowships = async () => {
  const response = await axiosInstance.get("/api/fellowship/getAllPastFellowships");
  return response.data.fellowships || [];
};

export const fetchRegistrationCounts = async () => {
  const response = await axiosInstance.get("/api/fellowship/registrationCounts");
  return response.data.registrationCounts || {};
};

export const fetchFellowshipRegistrations = async () => {
  const response = await axiosInstance.get("/api/fellowship-registration/getFellowshipsNeedingReview");
  return response.data.registrations || [];
}

export const updateApplicationStatus = async (applicationId, newStatus) => {
  return await axiosInstance.post(
    `/api/fellowship-registration/${newStatus.toLowerCase()}FellowshipRegistration/${applicationId}`
  );
};

export const createFellowship = async (fellowshipData) => {
  return await axiosInstance.post("/api/fellowship/addNewFellowship", fellowshipData);
};

export const createWorkgroup = async (workgroupData) => {
  return await axiosInstance.post("/api/fellowship/addNewWorkgroup", workgroupData);
};