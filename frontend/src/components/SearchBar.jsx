import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by episode number or title..."
          className="w-full px-6 py-4 bg-op-dark/50 text-white rounded-full border-2 border-gray-700 focus:border-op-orange outline-none transition-all placeholder-gray-400 text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-op-orange hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors font-semibold"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

