import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../../lib/utils";
import {
  Search,
  PenTool,
  ExternalLink,
  Edit,
  Trash2,
  ImageOff,
  ImagePlus,
  Link2,
} from "lucide-react";

const CATEGORIES = ["All", "General", "Technology", "Politics", "Sports", "Business", "Health", "World"];

const AdminArticlesTab = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: "",
    content: "",
    category: "General",
    imageMode: "url", // "url" | "file"
    imageUrl: "",
    imageFile: null,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    category: "General",
    imageMode: "url",
    imageUrl: "",
    imageFile: null,
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (category !== "All") params.category = category;

      const { data } = await axios.get("/admin/news", { params });
      setArticles(data.articles);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, category]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchArticles();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Delete article
  const handleDelete = async (article) => {
    if (!window.confirm(`Delete article "${article.title}"?`)) return;
    try {
      await axios.delete(`/admin/news/${article._id}`);
      toast.success("Article deleted successfully");
      fetchArticles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete article");
    }
  };

  // Create article
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.content.trim()) {
      return toast.error("Title and content are required");
    }

    try {
      const formData = new FormData();
      formData.append("title", createForm.title);
      formData.append("content", createForm.content);
      formData.append("category", createForm.category);

      if (createForm.imageMode === "file" && createForm.imageFile) {
        formData.append("coverImage", createForm.imageFile);
      } else if (createForm.imageMode === "url" && createForm.imageUrl.trim()) {
        formData.append("imageUrl", createForm.imageUrl.trim());
      }

      await axios.post("/admin/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Article published!");
      setShowCreateModal(false);
      setCreateForm({
        title: "",
        content: "",
        category: "General",
        imageMode: "url",
        imageUrl: "",
        imageFile: null,
      });
      fetchArticles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish article");
    }
  };

  // Open edit modal
  const openEditModal = (a) => {
    setEditingArticle(a);
    setEditForm({
      title: a.title,
      content: a.content,
      category: a.category || "General",
      imageMode: "url",
      imageUrl: a.coverImage || "",
      imageFile: null,
    });
  };

  // Update article
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("content", editForm.content);
      formData.append("category", editForm.category);

      if (editForm.imageMode === "file" && editForm.imageFile) {
        formData.append("coverImage", editForm.imageFile);
      } else if (editForm.imageMode === "url" && editForm.imageUrl.trim()) {
        formData.append("imageUrl", editForm.imageUrl.trim());
      }

      await axios.put(`/admin/news/${editingArticle._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Article updated successfully!");
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update article");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar: Search, filters, publish */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-base-200 p-4 rounded-xl border border-base-300">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search articles by headline or content..."
              className="input input-sm input-bordered w-full pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select select-sm select-bordered"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-sm gap-2 whitespace-nowrap"
        >
          <PenTool size={16} /> Fast Publish
        </button>
      </div>

      {/* Articles Data Table */}
      <div className="overflow-x-auto bg-base-200 border border-base-300 rounded-xl shadow-sm">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300/60 text-xs text-base-content/70">
              <th>Article</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-base-content/50">
                  No articles found matching your filters.
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      {a.coverImage ? (
                        <img
                          src={a.coverImage}
                          alt={a.title}
                          className="w-12 h-12 rounded-lg object-cover border border-base-300 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center text-base-content/40 flex-shrink-0">
                          <ImageOff size={18} />
                        </div>
                      )}
                      <div className="max-w-md">
                        <Link
                          to={`/article/${a._id}`}
                          target="_blank"
                          className="font-bold hover:text-primary transition-colors line-clamp-1 text-sm"
                        >
                          {a.title}
                        </Link>
                        <p className="text-xs text-base-content/60 line-clamp-1 mt-0.5">
                          {a.content}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-primary badge-outline badge-sm text-xs">
                      {a.category || "General"}
                    </span>
                  </td>

                  <td>
                    <div className="text-xs font-medium">{a.author?.name || "Unknown"}</div>
                    <div className="text-[11px] text-base-content/50">{a.author?.email || "—"}</div>
                  </td>

                  <td className="text-xs text-base-content/70 whitespace-nowrap">
                    {formatDate(a.createdAt)}
                  </td>

                  <td className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/article/${a._id}`}
                        target="_blank"
                        className="btn btn-ghost btn-xs text-base-content/70"
                        title="View Live Article"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => openEditModal(a)}
                        className="btn btn-ghost btn-xs text-info"
                        title="Edit Article"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(a)}
                        className="btn btn-ghost btn-xs text-error"
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-base-content/60">
            Showing {articles.length} of {total} articles
          </span>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button className="join-item btn btn-sm btn-active">
              Page {page} of {totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL: FAST PUBLISH */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-200 border border-base-300 max-w-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <PenTool size={20} className="text-primary" /> Fast Publish Article
            </h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Headline / Title</span></label>
                <input
                  type="text"
                  required
                  className="input input-bordered input-sm"
                  placeholder="Enter news headline..."
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Category</span></label>
                <select
                  className="select select-bordered select-sm"
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Cover Image Toggle */}
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Cover Image (Optional)</span></label>
                <div className="join mb-2">
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, imageMode: "url" })}
                    className={`btn btn-xs join-item ${createForm.imageMode === "url" ? "btn-primary" : "btn-outline"}`}
                  >
                    <Link2 size={12} /> Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, imageMode: "file" })}
                    className={`btn btn-xs join-item ${createForm.imageMode === "file" ? "btn-primary" : "btn-outline"}`}
                  >
                    <ImagePlus size={12} /> File Upload
                  </button>
                </div>

                {createForm.imageMode === "url" ? (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="input input-bordered input-sm"
                    value={createForm.imageUrl}
                    onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-sm w-full"
                    onChange={(e) => setCreateForm({ ...createForm, imageFile: e.target.files[0] })}
                  />
                )}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Content</span></label>
                <textarea
                  required
                  rows={6}
                  className="textarea textarea-bordered text-sm"
                  placeholder="Full article content..."
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                />
              </div>

              <div className="modal-action mt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ARTICLE */}
      {editingArticle && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-200 border border-base-300 max-w-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Edit size={20} className="text-primary" /> Edit Article
            </h3>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Headline / Title</span></label>
                <input
                  type="text"
                  required
                  className="input input-bordered input-sm"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Category</span></label>
                <select
                  className="select select-bordered select-sm"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Cover Image</span></label>
                <div className="join mb-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, imageMode: "url" })}
                    className={`btn btn-xs join-item ${editForm.imageMode === "url" ? "btn-primary" : "btn-outline"}`}
                  >
                    <Link2 size={12} /> Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, imageMode: "file" })}
                    className={`btn btn-xs join-item ${editForm.imageMode === "file" ? "btn-primary" : "btn-outline"}`}
                  >
                    <ImagePlus size={12} /> Replace with File
                  </button>
                </div>

                {editForm.imageMode === "url" ? (
                  <input
                    type="url"
                    className="input input-bordered input-sm"
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-sm w-full"
                    onChange={(e) => setEditForm({ ...editForm, imageFile: e.target.files[0] })}
                  />
                )}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Content</span></label>
                <textarea
                  required
                  rows={6}
                  className="textarea textarea-bordered text-sm"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                />
              </div>

              <div className="modal-action mt-4">
                <button type="button" onClick={() => setEditingArticle(null)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticlesTab;
