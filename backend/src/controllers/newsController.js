import News from "../models/News.js";
import cloudinary from "../config/cloudinary.js";

export const getAllNews = async (req, res) => {
  try {
    const articles = await News.find().sort({ createdAt: -1 }).populate("author", "name");
    res.status(200).json(articles);
  } catch (error) {
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

// POST /api/news — create article
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
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
      // Priority 1: an uploaded file
      coverImage = await uploadBufferToCloudinary(req.file.buffer);
    } else if (imageUrl) {
      // Priority 2: a pasted image URL — upload it to Cloudinary too,
      // so it benefits from the same hosting/optimization and won't break if the source goes down
      const result = await cloudinary.uploader.upload(imageUrl, { folder: "kbnews" });
      coverImage = result.secure_url;
    }
    // else: no image — coverImage stays "", which is fine, it's optional

    const article = new News({ title, content, category, coverImage, author: req.userId });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/news/:id — update article
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
      const result = await cloudinary.uploader.upload(imageUrl, { folder: "kbnews" });
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

// DELETE /api/news/:id — delete article
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