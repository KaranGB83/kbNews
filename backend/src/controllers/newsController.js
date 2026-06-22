import News from "../models/News.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllNews = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (search) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: escapeRegex(search), $options: "i" };
    }
    if (category && category !== "All") {
      filter.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      News.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("author", "name"),
      News.countDocuments(filter),
    ]);

    res.status(200).json({
      articles,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: pageNum < Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id).populate("author", "name");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Lazy init — only configures when first upload happens, not on every server start
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

// POST /api/news — handles file upload OR image URL OR neither
export const createNews = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let coverImage = "";

    if (req.file) {
      coverImage = await uploadBufferToCloudinary(req.file.buffer);
    } else if (imageUrl) {
      // fixed: use getCloudinary() instead of bare cloudinary
      const result = await getCloudinary().uploader.upload(imageUrl, { folder: "kbnews" });
      coverImage = result.secure_url;
    }

    const article = new News({ title, content, category, coverImage, author: req.userId });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/news/:id — only the author can update
export const updateNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own articles" });
    }

    const { title, content, category, imageUrl } = req.body;

    if (req.file) {
      article.coverImage = await uploadBufferToCloudinary(req.file.buffer);
    } else if (imageUrl) {
      // fixed: use getCloudinary() instead of bare cloudinary
      const result = await getCloudinary().uploader.upload(imageUrl, { folder: "kbnews" });
      article.coverImage = result.secure_url;
    }

    article.title = title ?? article.title;
    article.content = content ?? article.content;
    article.category = category ?? article.category;
    await article.save();

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/news/:id — only the author can delete
export const deleteNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own articles" });
    }

    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};