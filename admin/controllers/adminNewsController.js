import News from "../../backend/src/models/News.js";
import { v2 as cloudinary } from "cloudinary";

const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream(
      { folder: "kbnews" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// GET /api/admin/news — List all articles with filters and pagination
export const getAllNews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "All",
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
      filter.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const sortOption = {};
    sortOption[sort] = order === "asc" ? 1 : -1;

    const [articles, total] = await Promise.all([
      News.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate("author", "name email"),
      News.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      articles,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: pageNum < Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("admin getAllNews error:", error);
    res.status(500).json({ success: false, message: "Server error fetching articles" });
  }
};

// POST /api/admin/news — Admin publishing
export const createNewsAsAdmin = async (req, res) => {
  try {
    const { title, content, category = "General", imageUrl, authorId } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    let coverImage = "";

    if (req.file) {
      coverImage = await uploadBufferToCloudinary(req.file.buffer);
    } else if (imageUrl) {
      const result = await getCloudinary().uploader.upload(imageUrl, { folder: "kbnews" });
      coverImage = result.secure_url;
    }

    const article = new News({
      title,
      content,
      category,
      coverImage,
      author: authorId || req.userId,
    });

    await article.save();
    const populated = await News.findById(article._id).populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Article published successfully",
      article: populated,
    });
  } catch (error) {
    console.error("admin createNews error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// PUT /api/admin/news/:id — Admin update any article
export const updateNewsAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await News.findById(id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    const { title, content, category, imageUrl, authorId } = req.body;

    if (req.file) {
      article.coverImage = await uploadBufferToCloudinary(req.file.buffer);
    } else if (imageUrl) {
      const result = await getCloudinary().uploader.upload(imageUrl, { folder: "kbnews" });
      article.coverImage = result.secure_url;
    }

    if (title) article.title = title;
    if (content) article.content = content;
    if (category) article.category = category;
    if (authorId) article.author = authorId;

    await article.save();
    const populated = await News.findById(article._id).populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article: populated,
    });
  } catch (error) {
    console.error("admin updateNews error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// DELETE /api/admin/news/:id — Admin delete any article
export const deleteNewsAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await News.findById(id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    await News.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("admin deleteNews error:", error);
    res.status(500).json({ success: false, message: "Server error deleting article" });
  }
};
