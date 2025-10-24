import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onePieceArcs, allEpisodes, TOTAL_EPISODES, onePieceMovies, onePieceSpecials } from '../data/onePieceData';
import ArcCard from '../components/ArcCard';
import MediaCard from '../components/MediaCard';
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
    <div className="min-h-screen pb-12 w-full">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden w-full">
        {/* Banner Background with Gradient Overlay */}
        <div className="relative h-96 bg-gradient-to-br from-red-900 via-op-dark to-blue-900 w-full">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-6 gap-8 text-9xl p-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="transform rotate-12">⚓</div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-op-dark via-op-dark/80 to-transparent"></div>
          
          {/* Hero Content */}
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            {/* One Piece Logo */}
            <div className="mb-6">
              <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-op-orange to-red-600 drop-shadow-[0_0_30px_rgba(251,146,60,0.5)] tracking-wider">
                ONE PIECE
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-white mt-2 tracking-widest">
                <span className="bg-gradient-to-r from-op-orange to-yellow-400 bg-clip-text text-transparent">
                  EPISODE VIEWER
                </span>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-3xl font-semibold drop-shadow-lg">
              Set Sail on the Grand Line
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Watch 1100+ episodes by arc, random episode, or search your favorite moments
            </p>
            
            {/* Quick Action Button */}
            <button
              onClick={handleRandomEpisode}
              className="bg-gradient-to-r from-op-orange via-red-600 to-red-700 hover:from-yellow-500 hover:via-op-orange hover:to-red-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-op-orange/50 border-2 border-yellow-400/30"
            >
              ⚓ Start Your Adventure
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gradient-to-b from-op-dark to-transparent py-12 w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Find Your Episode
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-10 max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-op-orange/20 to-red-900/20 rounded-xl p-6 text-center border-2 border-op-orange/30 hover:border-op-orange transition-colors duration-300 hover:scale-105 transform">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-op-orange to-yellow-400 mb-2">
                {TOTAL_EPISODES}+
              </div>
              <div className="text-gray-200 font-semibold text-sm">Episodes</div>
            </div>
            <div className="bg-gradient-to-br from-red-800/20 to-yellow-800/20 rounded-xl p-6 text-center border-2 border-red-500/30 hover:border-red-500 transition-colors duration-300 hover:scale-105 transform">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-2">
                {onePieceMovies.length}
              </div>
              <div className="text-gray-200 font-semibold text-sm">Movies</div>
            </div>
            <div className="bg-gradient-to-br from-purple-800/20 to-pink-800/20 rounded-xl p-6 text-center border-2 border-purple-500/30 hover:border-purple-500 transition-colors duration-300 hover:scale-105 transform">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                {onePieceSpecials.length}
              </div>
              <div className="text-gray-200 font-semibold text-sm">Specials</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-6 text-center border-2 border-blue-500/30 hover:border-blue-500 transition-colors duration-300 hover:scale-105 transform">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                {onePieceArcs.reduce((acc, saga) => acc + saga.arcs.length, 0)}
              </div>
              <div className="text-gray-200 font-semibold text-sm">Arcs</div>
            </div>
            <div className="bg-gradient-to-br from-teal-900/20 to-emerald-900/20 rounded-xl p-6 text-center border-2 border-teal-500/30 hover:border-teal-500 transition-colors duration-300 hover:scale-105 transform">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-2">
                {onePieceArcs.length}
              </div>
              <div className="text-gray-200 font-semibold text-sm">Sagas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="container mx-auto px-4 mb-12 max-w-7xl w-full">
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
        <>
          {/* Featured Movies Section */}
          <div className="container mx-auto px-4 max-w-7xl w-full mb-20">
            <div className="text-center mb-12">
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 mb-4">
                🎬 Movies
              </h3>
              <p className="text-gray-400 text-lg">
                Feature films and theatrical releases
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onePieceMovies.map(movie => (
                <MediaCard key={movie.id} media={movie} type="movie" />
              ))}
            </div>
          </div>

          {/* TV Specials & OVAs Section */}
          <div className="container mx-auto px-4 max-w-7xl w-full mb-20">
            <div className="text-center mb-12">
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-4">
                📺 TV Specials & OVAs
              </h3>
              <p className="text-gray-400 text-lg">
                Special episodes and original video animations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onePieceSpecials.map(special => (
                <MediaCard key={special.id} media={special} type="special" />
              ))}
            </div>
          </div>

          {/* Story Arcs Section */}
          <div className="container mx-auto px-4 max-w-7xl w-full">
            <div className="text-center mb-12">
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-op-orange via-red-500 to-yellow-400 mb-4">
                Browse by Arc
              </h3>
              <p className="text-gray-400 text-lg">
                Explore the epic journey from East Blue to the Final Saga
              </p>
            </div>

            {onePieceArcs.map((saga, index) => (
              <div key={saga.id} className="mb-16">
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gradient-to-r from-transparent via-op-orange to-transparent opacity-30"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-op-orange to-yellow-400 px-6 py-3 rounded-2xl bg-op-dark border-2 border-op-orange/50">
                      {saga.saga}
                    </h4>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {saga.arcs.map(arc => (
                    <ArcCard key={arc.id} arc={arc} sagaName={saga.saga} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

