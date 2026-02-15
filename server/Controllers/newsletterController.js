import logger from "../utils/logger.js";
import newsletterSubscriberModel from "../Models/newsletterSubscriberModel.js";

export const subscribeUserToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      logger.warn(
        { email },
        "Attempt to subscribe to newsletter with missing email"
      );
      return res.status(400).json({
        msg: "Email is required to subscribe to the newsletter"
      });
    }

    const subscriber = await newsletterSubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        $setOnInsert: {
          subscribedAt: new Date()
        },
        $set: {
          isActive: true
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    logger.info(
      { email },
      "Newsletter subscription successful"
    );

    return res.status(200).json({
      msg: "Subscription successful",
      data: subscriber
    });

  } catch (err) {
    logger.error(
      {
        errorMessage: err.message,
        stack: err.stack,
        email: req.body.email
      },
      "Error subscribing user to newsletter"
    );

    return res.status(500).json({
      msg: "Failed to subscribe to newsletter"
    });
  }
};
