import { Link } from "react-router-dom";
import { formatDate } from "../lib/utils";
import { Trash2 } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const NewsCard = ({ article, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await axios.delete(`/news/${article._id}`);
      toast.success("Article deleted");
      onDelete(article._id);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="card bg-base-200 border border-base-300 hover:border-primary transition-all duration-200">
      <div className="card-body gap-3">
        {article.category && (
          <span className="badge badge-primary badge-outline text-xs w-fit">
            {article.category}
          </span>
        )}
        <Link to={`/article/${article._id}`}>
          <h2 className="card-title text-lg hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="text-base-content/70 text-sm line-clamp-3">{article.content}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-base-content/50">{formatDate(article.createdAt)}</span>
          <button onClick={handleDelete} className="btn btn-ghost btn-xs text-error">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;