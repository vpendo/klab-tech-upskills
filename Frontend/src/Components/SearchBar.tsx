import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) return;

    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
        <Search size={20} className="text-gray-500" />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shoes, clothes..."
          className="ml-3 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          className="ml-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;