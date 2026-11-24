import User from "../../backend/src/models/User.js";

/**
 * Middleware to verify that the authenticated user has administrator privileges.
 * Must be preceded by verifyToken middleware so req.userId is populated.
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — authentication required",
      });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin" && !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied — administrator privileges required",
      });
    }

    req.admin = user;
    next();
  } catch (error) {
    console.error("verifyAdmin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error verifying admin privileges",
    });
  }
};

export default verifyAdmin;
