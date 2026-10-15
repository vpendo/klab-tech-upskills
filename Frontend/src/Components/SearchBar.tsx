import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) return;

    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="w-full max-w-md"
    >
      <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 sm:px-4">
        <Search
          size={20}
          aria-hidden="true"
          className="shrink-0 text-orange-500"
        />

        <input
          type="search"
          name="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search shoes, clothes..."
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent py-1 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="submit"
          disabled={!query.trim()}
          className="shrink-0 rounded-full bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
