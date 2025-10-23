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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-op-orange via-yellow-400 to-op-orange rounded-full opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-300"></div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search by episode number, arc, or saga..."
          className="relative w-full px-6 py-5 bg-gradient-to-r from-op-dark/90 to-gray-800/90 text-white rounded-full border-2 border-gray-600 focus:border-op-orange outline-none transition-all placeholder-gray-400 text-lg font-medium shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-op-orange to-red-500 hover:from-yellow-400 hover:to-op-orange text-white px-8 py-3 rounded-full transition-all font-bold shadow-lg hover:scale-105"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

