import logger from "../utils/logger.js";
import newsletterSubscriberModel from "../Models/newsletterSubscriberModel.js";
import {newsletterSubscriptionTemplate} from "../utils/SendGrid/htmlTemplateNewsletter.js";
import sgMail from "../utils/SendGrid/emailSetup.js";

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

    const msg = {
      to: email,
      from: "teesha@thedigitaleconomist.com",
      subject: "You have successfully subscribed to our newsletter service!",
      html: newsletterSubscriptionTemplate({dashboardUrl: `https://app.thedigitaleconomist.com/login`,eventsUrl: "https://app.thedigitaleconomist.com/events", publicationsUrl:"https://app.thedigitaleconomist.com/publications", 
  fellowshipUrl: "https://app.thedigitaleconomist.com/execFellowship" })
    }

    sgMail.send(msg)
    .then(()=> {console.log("Email for newsletter subscription has been sent")})
    .catch((err) => console.log(err))

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
