import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const CATEGORIES = ["All", "General", "Technology", "Politics", "Sports", "Business", "Health", "World"];

const SearchBar = ({ onSearchChange, onCategoryChange, category }) => {
  const [input, setInput] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(input.trim());
    }, 300); // debounce: waits 300ms after typing stops before firing the search

    return () => clearTimeout(debounceRef.current);
  }, [input]);

  const clearSearch = () => setInput("");

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search articles by title..."
          className="input input-bordered w-full pl-10 pr-10"
        />
        {input && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="select select-bordered w-full sm:w-48"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;