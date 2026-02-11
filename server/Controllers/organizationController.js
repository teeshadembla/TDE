import organizationModel from "../Models/organizationModel.js";
import membershipModel from "../Models/membershipModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";

/**
 * Create organization
 */
export const createOrganization = async (req, res) => {
  const { userId, name, billingEmail } = req.body;

  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already owns an organization
    const existingOrg = await organizationModel.findOne({ owner: userId });
    
    if (existingOrg) {
      return res.status(400).json({ 
        message: "You already own an organization" 
      });
    }

    // Create organization
    const organization = await organizationModel.create({
      name,
      owner: userId,
      billingEmail: billingEmail || user.email,
      members: [{
        user: userId,
        role: 'owner',
        addedAt: new Date(),
        addedBy: userId
      }]
    });

    // Update user
    user.organization = organization._id;
    await user.save();

    logger.info({ userId, organizationId: organization._id }, "Organization created");

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization
    });

  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, 
      "Error creating organization");
    res.status(500).json({ message: "Failed to create organization" });
  }
};

/**
 * Get organization details
 */
export const getOrganization = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const organization = await organizationModel
      .findById(organizationId)
      .populate('owner', 'FullName email profilePicture')
      .populate('members.user', 'FullName email profilePicture')
      .populate('members.addedBy', 'FullName')
      .populate('membership');

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({
      success: true,
      organization
    });

  } catch (err) {
    logger.error({ organizationId: req.params.organizationId, errorMsg: err.message, stack: err.stack }, 
      "Error fetching organization");
    res.status(500).json({ message: "Failed to fetch organization" });
  }
};

/**
 * Add member to organization
 */
export const addMember = async (req, res) => {
  const { organizationId, memberEmail, addedByUserId } = req.body;

  try {
    const organization = await organizationModel
      .findById(organizationId)
      .populate('membership');

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if requester can manage organization
    if (!organization.canManage(addedByUserId)) {
      return res.status(403).json({ 
        message: "You don't have permission to add members" 
      });
    }

    // Check if organization is at capacity
    if (organization.isAtCapacity) {
      return res.status(400).json({ 
        message: `Organization is at maximum capacity (${organization.maxMembers} members)` 
      });
    }

    // Check if organization has active membership
    if (!organization.membership || 
        !['active', 'trialing'].includes(organization.membership.status)) {
      return res.status(400).json({ 
        message: "Organization must have an active membership to add members" 
      });
    }

    // Find user by email
    const newMember = await userModel.findOne({ email: memberEmail });
    
    if (!newMember) {
      return res.status(404).json({ 
        message: "User not found with this email" 
      });
    }

    // Check if already a member
    if (organization.isMember(newMember._id)) {
      return res.status(400).json({ 
        message: "User is already a member of this organization" 
      });
    }

    // Check if user has their own active membership
    const userMembership = await membershipModel.findOne({
      user: newMember._id,
      status: { $in: ['active', 'trialing'] }
    });

    if (userMembership) {
      return res.status(400).json({ 
        message: "User already has an active personal membership. They must cancel it first." 
      });
    }

    // Add member
    organization.members.push({
      user: newMember._id,
      role: 'member',
      addedAt: new Date(),
      addedBy: addedByUserId
    });

    await organization.save();

    // Update user's organization reference
    newMember.organization = organization._id;
    await newMember.save();

    // Send invitation email
    

    logger.info({ organizationId, newMemberId: newMember._id }, "Member added to organization");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      organization
    });

  } catch (err) {
    logger.error({ organizationId: req.body.organizationId, errorMsg: err.message, stack: err.stack }, 
      "Error adding member");
    res.status(500).json({ message: "Failed to add member" });
  }
};

/**
 * Remove member from organization
 */
export const removeMember = async (req, res) => {
  const { organizationId, memberUserId, removedByUserId } = req.body;

  try {
    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if requester can manage organization
    if (!organization.canManage(removedByUserId)) {
      return res.status(403).json({ 
        message: "You don't have permission to remove members" 
      });
    }

    // Can't remove owner
    if (organization.owner.toString() === memberUserId.toString()) {
      return res.status(400).json({ 
        message: "Cannot remove organization owner" 
      });
    }

    // Check if user is a member
    const memberIndex = organization.members.findIndex(
      m => m.user.toString() === memberUserId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({ 
        message: "User is not a member of this organization" 
      });
    }

    // Remove member
    organization.members.splice(memberIndex, 1);
    await organization.save();

    // Update user's organization reference
    const removedUser = await userModel.findById(memberUserId);
    removedUser.organization = null;
    await removedUser.save();

    // Send notification email
    

    logger.info({ organizationId, removedMemberId: memberUserId }, "Member removed from organization");

    res.status(200).json({
      success: true,
      message: "Member removed successfully"
    });

  } catch (err) {
    logger.error({ organizationId: req.body.organizationId, errorMsg: err.message, stack: err.stack }, 
      "Error removing member");
    res.status(500).json({ message: "Failed to remove member" });
  }
};

/**
 * Update member role
 */
export const updateMemberRole = async (req, res) => {
  const { organizationId, memberUserId, newRole, updatedByUserId } = req.body;

  try {
    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Only owner can change roles
    if (organization.owner.toString() !== updatedByUserId.toString()) {
      return res.status(403).json({ 
        message: "Only organization owner can change member roles" 
      });
    }

    // Can't change owner's role
    if (organization.owner.toString() === memberUserId.toString()) {
      return res.status(400).json({ 
        message: "Cannot change owner's role" 
      });
    }

    // Validate new role
    if (!['admin', 'member'].includes(newRole)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be 'admin' or 'member'" 
      });
    }

    // Find and update member
    const member = organization.members.find(
      m => m.user.toString() === memberUserId.toString()
    );

    if (!member) {
      return res.status(404).json({ 
        message: "User is not a member of this organization" 
      });
    }

    member.role = newRole;
    await organization.save();

    logger.info({ organizationId, memberUserId, newRole }, "Member role updated");

    res.status(200).json({
      success: true,
      message: "Member role updated successfully"
    });

  } catch (err) {
    logger.error({ organizationId: req.body.organizationId, errorMsg: err.message, stack: err.stack }, 
      "Error updating member role");
    res.status(500).json({ message: "Failed to update member role" });
  }
};

/**
 * Leave organization (for non-owner members)
 */
export const leaveOrganization = async (req, res) => {
  const { userId, organizationId } = req.body;

  try {
    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Can't leave if you're the owner
    if (organization.owner.toString() === userId.toString()) {
      return res.status(400).json({ 
        message: "Organization owner cannot leave. Transfer ownership or delete organization instead." 
      });
    }

    // Check if user is a member
    const memberIndex = organization.members.findIndex(
      m => m.user.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({ 
        message: "You are not a member of this organization" 
      });
    }

    // Remove member
    organization.members.splice(memberIndex, 1);
    await organization.save();

    // Update user
    const user = await userModel.findById(userId);
    user.organization = null;
    await user.save();

    logger.info({ userId, organizationId }, "User left organization");

    res.status(200).json({
      success: true,
      message: "Successfully left organization"
    });

  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, 
      "Error leaving organization");
    res.status(500).json({ message: "Failed to leave organization" });
  }
};

export default {
  createOrganization,
  getOrganization,
  addMember,
  removeMember,
  updateMemberRole,
  leaveOrganization
};