import News from "../models/News.js";

// GET /api/news — all articles, newest first
export const getAllNews = async (req, res) => {
  try {
    const articles = await News.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/news/:id — single article
export const getNewsById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/news — create article
export const createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const article = new News({ title, content, category });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/news/:id — update article
export const updateNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/news/:id — delete article
export const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};