const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user?._id || req._id;

    if (userId === "68811543bfb6788e458bb89b") {
      return next();
    }

    return res.status(403).json({
      msg: "Unauthorized access. You are not an admin and cannot perform this action.",
    });

  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    return res.status(500).json({
      msg: "Internal Server Error while checking admin privileges.",
    });
  }
};



export default {isAdmin}