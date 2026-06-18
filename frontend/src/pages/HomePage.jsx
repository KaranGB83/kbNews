import { useEffect, useState } from "react";
import axios from "../lib/axios";
import NewsCard from "../components/NewsCard";
import NewsNotFound from "../components/NewsNotFound";
import RateLimitedUI from "../components/RateLimitedUI";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchArticles = async () => {
    try {
      const { data } = await axios.get("/news");
      setArticles(data);
    } catch (error) {
      if (error.response?.status === 429) setRateLimited(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = (deletedId) => {
    setArticles((prev) => prev.filter((a) => a._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (rateLimited) return <RateLimitedUI />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        Latest <span className="text-primary">News</span>
      </h1>
      {articles.length === 0 ? (
        <NewsNotFound />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;