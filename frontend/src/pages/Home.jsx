import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onePieceArcs, allEpisodes, TOTAL_EPISODES } from '../data/onePieceData';
import ArcCard from '../components/ArcCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(null);

  const handleRandomEpisode = () => {
    const randomEpisode = Math.floor(Math.random() * TOTAL_EPISODES) + 1;
    navigate(`/watch/${randomEpisode}`);
  };

  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    
    // Try to parse as episode number
    const episodeNum = parseInt(term);
    if (!isNaN(episodeNum) && episodeNum > 0 && episodeNum <= TOTAL_EPISODES) {
      navigate(`/watch/${episodeNum}`);
      return;
    }

    // Search in episode titles and arc names
    const results = allEpisodes.filter(ep => 
      ep.arcName.toLowerCase().includes(term) ||
      ep.sagaName.toLowerCase().includes(term) ||
      ep.episodeNumber.toString().includes(term)
    );

    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-op-dark to-transparent py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-white mb-4">
              Set Sail on the Grand Line
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Watch One Piece by arc, random episode, or search
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Random Episode Button */}
          <div className="text-center mb-12">
            <button
              onClick={handleRandomEpisode}
              className="bg-gradient-to-r from-op-orange to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-op-orange/50"
            >
              🎲 Watch Random Episode
            </button>
            <p className="text-gray-400 mt-3 text-sm">
              Feeling adventurous? Let fate choose your episode!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-op-dark/50 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-4xl font-bold text-op-orange mb-2">{TOTAL_EPISODES}+</div>
              <div className="text-gray-300">Total Episodes</div>
            </div>
            <div className="bg-op-dark/50 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-4xl font-bold text-op-orange mb-2">
                {onePieceArcs.reduce((acc, saga) => acc + saga.arcs.length, 0)}
              </div>
              <div className="text-gray-300">Story Arcs</div>
            </div>
            <div className="bg-op-dark/50 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-4xl font-bold text-op-orange mb-2">{onePieceArcs.length}</div>
              <div className="text-gray-300">Sagas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="container mx-auto px-4 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-white">
              Search Results ({searchResults.length})
            </h3>
            <button
              onClick={clearSearch}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.slice(0, 20).map(ep => (
                <div
                  key={ep.episodeNumber}
                  onClick={() => navigate(`/watch/${ep.episodeNumber}`)}
                  className="bg-op-dark/50 rounded-lg p-4 cursor-pointer hover:bg-op-dark transition-colors border border-gray-700 hover:border-op-orange"
                >
                  <div className="text-op-orange font-bold text-lg mb-1">
                    Episode {ep.episodeNumber}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {ep.arcName} • {ep.sagaName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No episodes found</p>
            </div>
          )}
        </div>
      )}

      {/* Browse by Arc */}
      {!searchResults && (
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-white mb-8 text-center">
            Browse by Arc
          </h3>

          {onePieceArcs.map(saga => (
            <div key={saga.id} className="mb-12">
              <h4 className="text-3xl font-bold text-op-orange mb-6 flex items-center">
                <span className="bg-op-orange/20 px-4 py-2 rounded-lg">
                  {saga.saga}
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saga.arcs.map(arc => (
                  <ArcCard key={arc.id} arc={arc} sagaName={saga.saga} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

