import express from "express";
import {
  requestScholarship,
  getScholarshipByApplication,
  getAllScholarships,
  reviewScholarship,
} from "../Controllers/scholarshipController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import requirePermission from "../middleware/requirePermission.js";

const scholarshipRouter = express.Router();

// User routes
scholarshipRouter.post(
  "/request",
  authenticateToken,
  requirePermission("apply_fellowship"),
  requestScholarship
);
scholarshipRouter.get(
  "/application/:applicationId",
  authenticateToken,
  requirePermission("apply_fellowship"),
  getScholarshipByApplication
);

// Admin routes
scholarshipRouter.get(
  "/all",
  authenticateToken,
  requirePermission("moderate_applications"),
  getAllScholarships
);
scholarshipRouter.patch(
  "/review/:id",
  authenticateToken,
  requirePermission("moderate_applications"),
  reviewScholarship
);

export default scholarshipRouter;
