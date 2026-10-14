import { useSearchParams } from "react-router-dom";

function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedGender = searchParams.get("gender") || "";

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Reset search when changing filters
    newParams.delete("search");

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <aside className="w-full rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Filter Products
        </h2>

        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
        >
          Clear all
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-gray-800">Category</h3>

        <div className="space-y-3">
          {["Shoes", "Clothes"].map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => updateFilter("category", category)}
                className="h-4 w-4 accent-orange-500"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Gender filter */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-800">Shop by Gender</h3>

        <div className="space-y-3">
          {["Men", "Women"].map((gender) => (
            <label
              key={gender}
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={selectedGender === gender}
                onChange={() => updateFilter("gender", gender)}
                className="h-4 w-4 accent-orange-500"
              />
              {gender}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default CategoryFilter;