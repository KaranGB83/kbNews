import User from "../../backend/src/models/User.js";
import News from "../../backend/src/models/News.js";

// GET /api/admin/stats — Dashboard summary metrics
export const getAdminStats = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      totalAdmins,
      newUsersLast7Days,
      totalArticles,
      newArticlesLast7Days,
      categoryCounts,
      recentUsers,
      recentArticles,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      User.countDocuments({ $or: [{ role: "admin" }, { isAdmin: true }] }),
      User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      News.countDocuments(),
      News.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      News.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password"),
      News.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("author", "name email"),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          admins: totalAdmins,
          newLast7Days: newUsersLast7Days,
        },
        articles: {
          total: totalArticles,
          newLast7Days: newArticlesLast7Days,
          byCategory: categoryCounts.map((c) => ({
            category: c._id || "Uncategorized",
            count: c.count,
          })),
        },
        recentUsers,
        recentArticles,
      },
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ success: false, message: "Server error fetching admin stats" });
  }
};
