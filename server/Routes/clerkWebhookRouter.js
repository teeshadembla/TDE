import express from 'express';
import { Webhook } from 'svix';
import userModel from '../Models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const clerkWebhookRouter = express.Router();

// Webhook handler for Clerk events
clerkWebhookRouter.post('/clerk', async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    const event = wh.verify(req.body, req.headers);
    
    console.log('Clerk Webhook Event:', event.type);

    if (event.type === 'user.created') {
      // Create a new MongoDB user when Clerk user is created
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      
      const newUser = new userModel({
        clerkId: id,
        FullName: `${first_name || ''} ${last_name || ''}`.trim(),
        email: email_addresses[0]?.email_address || email,
        profilePicture: image_url || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        role: 'user', // Default role - will be updated by user via post-signup form
        socialLinks: {
          twitter: "",
          LinkedIn: "",
          Instagram: ""
        },
        membership: [],
        eventsRegistered: [],
        eventsParticipated: [],
        eventsSpokenAt: [],
        referencesGiven: [],
        followedTopics: [],
        isSubscribedToNewsletter: false,
        expertise: [],
      });

      await newUser.save();
      console.log(`Created MongoDB user for Clerk ID: ${id}`);

      return res.status(200).json({ success: true, message: 'User created successfully' });
    }

    if (event.type === 'user.updated') {
      // Update MongoDB user when Clerk user is updated
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const updateData = {
        FullName: `${first_name || ''} ${last_name || ''}`.trim(),
        email: email_addresses[0]?.email_address,
      };

      if (image_url) {
        updateData.profilePicture = image_url;
      }

      const updatedUser = await userModel.findOneAndUpdate(
        { clerkId: id },
        updateData,
        { new: true }
      );

      console.log(`Updated MongoDB user for Clerk ID: ${id}`);

      return res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    }

    if (event.type === 'user.deleted') {
      // Handle user deletion - soft delete or cascade
      const { id } = event.data;

      // Option 1: Soft delete (keep data but mark as inactive)
      // const deletedUser = await userModel.findOneAndUpdate(
      //   { clerkId: id },
      //   { isActive: false, deletedAt: new Date() },
      //   { new: true }
      // );

      // Option 2: Hard delete (uncomment if you want to delete data)
      const deletedUser = await userModel.findOneAndDelete({ clerkId: id });

      console.log(`Deleted MongoDB user for Clerk ID: ${id}`);

      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    }

    // For other events, just acknowledge receipt
    return res.status(200).json({ success: true, message: 'Event acknowledged' });

  } catch (err) {
    console.error('Error processing Clerk webhook:', err);
    return res.status(400).json({ error: 'Webhook processing failed', details: err.message });
  }
});

export default clerkWebhookRouter;
