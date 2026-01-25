import  logger  from "../utils/logger.js";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user?._id || req._id;
    logger.debug({userId}, "Checking admin privileges");

    if (userId === "69395caf541181e114939124") {
      logger.debug({userId}, "Admin access granted");
      return next();
    }

    logger.warn({userId}, "Unauthorized access: User is not an admin");
    return res.status(403).json({
      msg: "Unauthorized access. You are not an admin and cannot perform this action.",
    });

  } catch (err) {
    logger.error({userId: req.user?._id || req._id, errorMsg: err.message, stack: err.stack}, "Error in isAdmin middleware");
    return res.status(500).json({
      msg: "Internal Server Error while checking admin privileges.",
    });
  }
};



export default {isAdmin}