import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const CATEGORIES = ["General", "Technology", "Politics", "Sports", "Business", "Health", "World"];

const CreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "General" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return toast.error("Title and content are required");
    }
    setLoading(true);
    try {
      await axios.post("/news", form);
      toast.success("Article published!");
      navigate("/");
    } catch {
      toast.error("Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">
        Write an <span className="text-primary">Article</span>
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-control gap-1">
          <label className="label"><span className="label-text">Title</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter headline..."
          />
        </div>
        <div className="form-control gap-1">
          <label className="label"><span className="label-text">Category</span></label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-control gap-1">
          <label className="label"><span className="label-text">Content</span></label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-52 resize-none"
            placeholder="Write your article..."
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Publish Article"}
        </button>
      </form>
    </div>
  );
};

export default CreatePage;