import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { ImagePlus, Link2, X } from "lucide-react";

const CATEGORIES = ["General", "Technology", "Politics", "Sports", "Business", "Health", "World"];

const CreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "General" });
  const [imageMode, setImageMode] = useState("file"); // "file" | "url"
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value || null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl("");
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return toast.error("Title and content are required");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);

      if (imageMode === "file" && imageFile) {
        formData.append("coverImage", imageFile);
      } else if (imageMode === "url" && imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      await axios.post("/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Article published!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish article");
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

        {/* Cover Image */}
        <div className="form-control gap-2">
          <label className="label"><span className="label-text">Cover Image (optional)</span></label>

          <div className="join">
            <button
              type="button"
              onClick={() => { setImageMode("file"); clearImage(); }}
              className={`btn btn-sm join-item gap-2 ${imageMode === "file" ? "btn-primary" : "btn-outline"}`}
            >
              <ImagePlus size={14} /> Upload
            </button>
            <button
              type="button"
              onClick={() => { setImageMode("url"); clearImage(); }}
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
              <img src={preview} alt="Cover preview" className="h-40 rounded-lg object-cover border border-base-300" />
              <button
                type="button"
                onClick={clearImage}
                className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2"
              >
                <X size={12} />
              </button>
            </div>
          )}
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