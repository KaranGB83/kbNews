import { useEffect, useState, useCallback, useRef } from "react";
import axios from "../lib/axios";
import NewsCard from "../components/NewsCard";
import NewsNotFound from "../components/NewsNotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import SearchBar from "../components/SearchBar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const LIMIT = 12;

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Use a ref for page so fetchMore always reads the latest value
  // without needing to be recreated on every page increment
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Fetch page 1 fresh whenever search or category changes
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setArticles([]);
      // reset refs
      pageRef.current = 1;
      hasMoreRef.current = true;
      loadingMoreRef.current = false;
      setHasMore(true);

      try {
        const params = { page: 1, limit: LIMIT };
        if (search) params.search = search;
        if (category !== "All") params.category = category;

        const { data } = await axios.get("/news", { params });
        setArticles(data.articles);
        setHasMore(data.hasMore);
        hasMoreRef.current = data.hasMore;
        setRateLimited(false);
      } catch (error) {
        if (error.response?.status === 429) setRateLimited(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [search, category]);

  // fetchMore reads page from ref — never stale, never needs to be recreated
  const fetchMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;
      const params = { page: nextPage, limit: LIMIT };
      if (search) params.search = search;
      if (category !== "All") params.category = category;

      const { data } = await axios.get("/news", { params });
      setArticles((prev) => [...prev, ...data.articles]);
      setHasMore(data.hasMore);
      hasMoreRef.current = data.hasMore;
      pageRef.current = nextPage;
    } catch (error) {
      console.error(error);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [search, category]); // removed page/hasMore/loadingMore — all read from refs now

  const sentinelRef = useInfiniteScroll(fetchMore, hasMore);

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
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : articles.length === 0 ? (
        search || category !== "All" ? (
          <div className="text-center py-24">
            <p className="text-lg text-base-content/60">
              No articles found
              {search && <> for "<span className="text-base-content">{search}</span>"</>}
              {category !== "All" && <> in <span className="text-base-content">{category}</span></>}.
            </p>
          </div>
        ) : (
          <NewsNotFound />
        )
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article._id} article={article} onDelete={handleDelete} />
            ))}
          </div>

          {/* Sentinel — observed by IntersectionObserver to trigger next page load */}
          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <p className="text-center text-base-content/40 text-sm py-8">
              You've reached the end
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;