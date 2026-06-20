import News from "../models/News.js";

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
export const createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const article = new News({ title, content, category, author: req.userId });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
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

    const { title, content, category } = req.body;
    article.title = title ?? article.title;
    article.content = content ?? article.content;
    article.category = category ?? article.category;
    await article.save();

    res.status(200).json(article);
  } catch (error) {
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