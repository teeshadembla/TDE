import discountModel from "../Models/discountModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import logger from "../utils/logger.js";

/* ============================
   Admin: Create discount code
============================ */
export const createDiscount = async (req, res) => {
  const { code, type, value, expiresAt } = req.body;
  const adminId = req.body.adminId || req.user?._id;

  try {
    if (!code || !type || !value || !expiresAt) {
      return res.status(400).json({ message: "code, type, value, and expiresAt are required" });
    }
    if (!["percentage", "fixed"].includes(type)) {
      return res.status(400).json({ message: "type must be 'percentage' or 'fixed'" });
    }
    if (type === "percentage" && (value <= 0 || value > 100)) {
      return res.status(400).json({ message: "Percentage value must be between 1 and 100" });
    }
    if (type === "fixed" && value <= 0) {
      return res.status(400).json({ message: "Fixed value must be greater than 0" });
    }
    if (new Date(expiresAt) <= new Date()) {
      return res.status(400).json({ message: "Expiry date must be in the future" });
    }

    const existing = await discountModel.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "A discount code with this name already exists" });
    }

    const discount = await discountModel.create({
      code: code.toUpperCase().trim(),
      type,
      value,
      expiresAt: new Date(expiresAt),
      createdBy: adminId,
    });

    logger.info({ discountId: discount._id, code: discount.code }, "Discount code created");
    return res.status(201).json({ success: true, discount });
  } catch (err) {
    logger.error({ errorMsg: err.message, stack: err.stack }, "Error creating discount code");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Admin: List all discount codes
============================ */
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await discountModel
      .find()
      .populate("createdBy", "FullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, discounts });
  } catch (err) {
    logger.error({ errorMsg: err.message, stack: err.stack }, "Error fetching discount codes");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Admin: Deactivate discount code
============================ */
export const deactivateDiscount = async (req, res) => {
  const { id } = req.params;
  try {
    const discount = await discountModel.findById(id);
    if (!discount) return res.status(404).json({ message: "Discount code not found" });

    discount.isActive = false;
    await discount.save();

    logger.info({ discountId: id }, "Discount code deactivated");
    return res.status(200).json({ success: true, message: "Discount code deactivated" });
  } catch (err) {
    logger.error({ discountId: req.params.id, errorMsg: err.message }, "Error deactivating discount");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   User: Validate & apply discount code
============================ */
export const validateDiscountCode = async (req, res) => {
  const { code, applicationId, userId } = req.body;

  try {
    if (!code || !applicationId || !userId) {
      return res.status(400).json({ message: "code, applicationId, and userId are required" });
    }

    const discount = await discountModel.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!discount) {
      return res.status(404).json({ message: "Invalid or inactive discount code" });
    }

    if (new Date(discount.expiresAt) < new Date()) {
      return res.status(400).json({ message: "This discount code has expired" });
    }

    // Check 1x per user limit
    const alreadyUsed = discount.usedBy.some(
      (entry) => entry.user.toString() === userId.toString()
    );
    if (alreadyUsed) {
      return res.status(400).json({ message: "You have already used this discount code" });
    }

    const application = await fellowshipRegistrationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (application.isScholarshipApplied) {
      return res.status(400).json({ message: "A scholarship is already applied to this application. Discounts and scholarships cannot be combined." });
    }
    if (application.discountCodeId) {
      return res.status(400).json({ message: "A discount code is already applied to this application" });
    }

    // Compute discount amount
    const originalAmount = application.originalAmount || application.amount;
    let discountAmount = 0;

    if (discount.type === "percentage") {
      discountAmount = Math.round(originalAmount * (discount.value / 100));
    } else {
      // fixed — value is in dollars, convert to cents
      discountAmount = Math.min(discount.value * 100, originalAmount);
    }

    const finalAmount = Math.max(0, originalAmount - discountAmount);

    return res.status(200).json({
      success: true,
      discount: {
        id: discount._id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
      },
      originalAmount,
      discountAmount,
      finalAmount,
    });
  } catch (err) {
    logger.error({ errorMsg: err.message, stack: err.stack }, "Error validating discount code");
    return res.status(500).json({ message: "Server error" });
  }
};
