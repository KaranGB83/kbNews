import { useEffect, useState } from "react";
import axios from "../lib/axios";
import NewsCard from "../components/NewsCard";
import NewsNotFound from "../components/NewsNotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== "All") params.category = category;

      const { data } = await axios.get("/news", { params });
      setArticles(data);
      setRateLimited(false);
    } catch (error) {
      if (error.response?.status === 429) setRateLimited(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, category]);

  const handleDelete = (deletedId) => {
    setArticles((prev) => prev.filter((a) => a._id !== deletedId));
  };

  if (rateLimited) return <RateLimitedUI />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        Latest <span className="text-primary">News</span>
      </h1>

      <SearchBar
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        category={category}
      />

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : articles.length === 0 ? (
        search || category !== "All" ? (
          <div className="text-center py-24">
            <p className="text-lg text-base-content/60">
              No articles found{search && <> for "<span className="text-base-content">{search}</span>"</>}
              {category !== "All" && <> in <span className="text-base-content">{category}</span></>}.
            </p>
          </div>
        ) : (
          <NewsNotFound />
        )
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