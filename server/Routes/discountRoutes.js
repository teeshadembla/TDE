import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  deactivateDiscount,
  validateDiscountCode,
} from "../Controllers/discountController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import requirePermission from "../middleware/requirePermission.js";

const discountRouter = express.Router();

// Admin routes
discountRouter.post(
  "/create",
  authenticateToken,
  requirePermission("moderate_applications"),
  createDiscount
);
discountRouter.get(
  "/all",
  authenticateToken,
  requirePermission("moderate_applications"),
  getAllDiscounts
);
discountRouter.patch(
  "/deactivate/:id",
  authenticateToken,
  requirePermission("moderate_applications"),
  deactivateDiscount
);

// User route — validate a code against their application
discountRouter.post(
  "/validate",
  authenticateToken,
  requirePermission("apply_fellowship"),
  validateDiscountCode
);

export default discountRouter;
