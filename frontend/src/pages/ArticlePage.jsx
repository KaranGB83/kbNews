import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";
import { Pencil, Trash2, ArrowLeft, Save, X } from "lucide-react";

const CATEGORIES = ["General", "Technology", "Politics", "Sports", "Business", "Health", "World"];

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isOwner = user && article.author && user._id === article.author._id;

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/news/${id}`);
        setArticle(data);
        setForm({ title: data.title, content: data.content, category: data.category });
      } catch {
        toast.error("Article not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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
      const { data } = await axios.put(`/news/${id}`, form);
      setArticle(data);
      setEditing(false);
      toast.success("Article updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) {
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