import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";
import { Pencil, Trash2, ArrowLeft, Save, X, ImagePlus, Link2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["General", "Technology", "Politics", "Sports", "Business", "Health", "World"];

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [loading, setLoading] = useState(true);

  const [imageMode, setImageMode] = useState("file"); // "file" | "url"
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/news/${id}`);
        setArticle(data);
        setForm({ title: data.title, content: data.content, category: data.category });
        setPreview(data.coverImage || null); // set preview only AFTER article loads
      } catch {
        toast.error("Article not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Only computed once article is guaranteed to exist (see loading guard below)
  const isOwner = user && article?.author && user._id === article.author._id;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl("");
    setPreview(URL.createObjectURL(file));
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setPreview(e.target.value || article?.coverImage || null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl("");
    setPreview(article?.coverImage || null); // revert to existing cover, not blank
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await axios.delete(`/news/${id}`);
      toast.success("Article deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);
      if (imageMode === "file" && imageFile) formData.append("coverImage", imageFile);
      if (imageMode === "url" && imageUrl) formData.append("imageUrl", imageUrl);

      const { data } = await axios.put(`/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setArticle(data);
      setPreview(data.coverImage || null);
      setImageFile(null);
      setImageUrl("");
      setEditing(false);
      toast.success("Article updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading || !article) {
    return (
      <div className="flex justify-center py-32">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate("/")} className="btn btn-ghost btn-sm mb-6 gap-2">
        <ArrowLeft size={16} /> Back
      </button>

      {!editing ? (
        <>
          {article.category && (
            <span className="badge badge-primary badge-outline mb-4">{article.category}</span>
          )}
          <h1 className="text-3xl font-extrabold mb-3">{article.title}</h1>
          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full max-h-96 object-cover rounded-lg mb-6"
            />
          )}
          <p className="text-base-content/50 text-sm mb-8">{formatDate(article.createdAt)}</p>
          <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">{article.content}</p>
          {isOwner && (
            <div className="flex gap-3 mt-10">
              <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm gap-2">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={handleDelete} className="btn btn-error btn-sm gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Edit Article</h2>

          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input input-bordered w-full"
          />

          <select
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="select select-bordered w-full"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Cover Image editor */}
          <div className="form-control gap-2">
            <label className="label"><span className="label-text">Cover Image (optional)</span></label>

            <div className="join">
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={`btn btn-sm join-item gap-2 ${imageMode === "file" ? "btn-primary" : "btn-outline"}`}
              >
                <ImagePlus size={14} /> Upload
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`btn btn-sm join-item gap-2 ${imageMode === "url" ? "btn-primary" : "btn-outline"}`}
              >
                <Link2 size={14} /> Image URL
              </button>
            </div>

            {imageMode === "file" ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full"
              />
            )}

            {preview && (
              <div className="relative w-fit mt-2">
                <img
                  src={preview}
                  alt="Cover preview"
                  className="h-40 rounded-lg object-cover border border-base-300"
                />
                {(imageFile || imageUrl) && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          <textarea
            name="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="textarea textarea-bordered w-full h-52 resize-none"
          />

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary btn-sm gap-2">
              <Save size={14} /> Save Changes
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost btn-sm gap-2">
              <X size={14} /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticlePage;