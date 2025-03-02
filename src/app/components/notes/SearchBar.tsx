import { categoryColors } from "@/app/types/common";
import { useState } from "react";

// Props for the SearchBar component
interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    onSearch(searchQuery, event.target.value);
  };

  return (
    <div className="flex gap-4 items-center mb-6">
      {/* Search Input */}
      <div className="flex-grow">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search notes..."
          className="w-full p-3 h-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      {/* Category Filter */}
      <div className="w-1/2">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-3 h-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Categories</option>
          {Object.keys(categoryColors).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}