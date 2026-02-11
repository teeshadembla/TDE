import mongoose from 'mongoose';

const organizationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String,
            enum: ["owner", "admin", "member"],
            default: "member"
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membership",
        default: null
    },
    maxMembers: {
        type: Number,
        default: 3  // Organizational plan allows 3 users
    },
    // Contact and billing information
    billingEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });

// Indexes
organizationSchema.index({ owner: 1 });
organizationSchema.index({ 'members.user': 1 });
organizationSchema.index({ status: 1 });

// Virtual to check if organization is at capacity
organizationSchema.virtual('isAtCapacity').get(function() {
    return this.members.length >= this.maxMembers;
});

// Method to check if user is a member
organizationSchema.methods.isMember = function(userId) {
    return this.members.some(member => 
        member.user.toString() === userId.toString()
    );
};

// Method to check if user is owner or admin
organizationSchema.methods.canManage = function(userId) {
    const member = this.members.find(m => 
        m.user.toString() === userId.toString()
    );
    return member && ['owner', 'admin'].includes(member.role);
};

const organizationModel = mongoose.model("Organization", organizationSchema);
export default organizationModel;