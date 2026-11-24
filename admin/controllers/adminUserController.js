import bcryptjs from "bcryptjs";
import User from "../../backend/src/models/User.js";
import News from "../../backend/src/models/News.js";

// GET /api/admin/users — List users with pagination, search & filters
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "all", // "all" | "verified" | "unverified"
      role = "all",   // "all" | "admin" | "user"
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (search.trim()) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = { $regex: escapeRegex(search.trim()), $options: "i" };
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    if (status === "verified") filter.isVerified = true;
    if (status === "unverified") filter.isVerified = false;

    if (role === "admin") {
      filter.$or = filter.$or
        ? [{ $and: [{ $or: filter.$or }, { $or: [{ role: "admin" }, { isAdmin: true }] }] }]
        : [{ role: "admin" }, { isAdmin: true }];
    } else if (role === "user") {
      filter.role = { $ne: "admin" };
      filter.isAdmin = { $ne: true };
    }

    const sortOption = {};
    sortOption[sort] = order === "asc" ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select("-password"),
      User.countDocuments(filter),
    ]);

    // Attach article count for each returned user
    const userIds = users.map((u) => u._id);
    const articleCounts = await News.aggregate([
      { $match: { author: { $in: userIds } } },
      { $group: { _id: "$author", count: { $sum: 1 } } },
    ]);
    const articleCountMap = articleCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const usersWithCounts = users.map((u) => ({
      ...u.toObject(),
      articleCount: articleCountMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      users: usersWithCounts,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: pageNum < Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("admin getUsers error:", error);
    res.status(500).json({ success: false, message: "Server error fetching users" });
  }
};

// POST /api/admin/users — Fast user creation by Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user", isVerified = true } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      isAdmin: role === "admin",
      isVerified: Boolean(isVerified),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    console.error("admin createUser error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// PUT /api/admin/users/:id — Edit user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isVerified } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: id } });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: "Email is already taken" });
      }
      user.email = email;
    }

    if (password && password.trim()) {
      user.password = await bcryptjs.hash(password, 10);
    }

    if (role !== undefined) {
      user.role = role === "admin" ? "admin" : "user";
      user.isAdmin = role === "admin";
    }

    if (isVerified !== undefined) {
      user.isVerified = Boolean(isVerified);
      if (user.isVerified) {
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    console.error("admin updateUser error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// PATCH /api/admin/users/:id/verify — Fast 1-click toggle / manual verification
export const toggleVerifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Toggle or manually verify
    user.isVerified = !user.isVerified;
    if (user.isVerified) {
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User is now ${user.isVerified ? "Verified" : "Unverified"}`,
      isVerified: user.isVerified,
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    console.error("admin toggleVerifyUser error:", error);
    res.status(500).json({ success: false, message: "Server error updating verification status" });
  }
};

// DELETE /api/admin/users/:id — Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.userId === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete articles authored by this user
    await News.deleteMany({ author: id });
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and associated articles deleted successfully",
    });
  } catch (error) {
    console.error("admin deleteUser error:", error);
    res.status(500).json({ success: false, message: "Server error deleting user" });
  }
};
