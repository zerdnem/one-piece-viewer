import { useParams, Link, useNavigate } from 'react-router-dom';
import { allEpisodes, episodeTitles, TOTAL_EPISODES } from '../data/onePieceData';
import VideoPlayer from '../components/VideoPlayer';

const Watch = () => {
  const { episodeNumber } = useParams();
  const navigate = useNavigate();
  const epNum = parseInt(episodeNumber);

  // Find episode details
  const episodeData = allEpisodes.find(e => e.episodeNumber === epNum);
  const episodeTitle = episodeTitles[epNum] || 'One Piece';

  const handlePrevious = () => {
    if (epNum > 1) {
      navigate(`/watch/${epNum - 1}`);
    }
  };

  const handleNext = () => {
    if (epNum < TOTAL_EPISODES) {
      navigate(`/watch/${epNum + 1}`);
    }
  };

  const handleRandom = () => {
    const randomEp = Math.floor(Math.random() * TOTAL_EPISODES) + 1;
    navigate(`/watch/${randomEp}`);
  };

  if (!episodeData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl text-white mb-4">Episode not found</h2>
        <Link to="/" className="text-op-orange hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link to="/" className="text-op-orange hover:underline mb-6 inline-block">
          ← Back to Browse
        </Link>

        {/* Episode Info Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-op-orange/20 text-op-orange px-3 py-1 rounded-full text-sm font-semibold">
              {episodeData.sagaName}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{episodeData.arcName}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Episode {epNum}: {episodeTitle}
          </h1>
          <p className="text-gray-400">{episodeData.description}</p>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer 
            key={epNum}
            episodeNumber={epNum} 
            nextEpisode={epNum < TOTAL_EPISODES ? epNum + 1 : null}
            hasNextEpisode={epNum < TOTAL_EPISODES}
          />
        </div>

        {/* Navigation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={epNum <= 1}
            className={`py-4 rounded-lg font-semibold text-lg transition-all ${
              epNum <= 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-op-dark hover:bg-gray-800 text-white border border-gray-700 hover:border-op-orange'
            }`}
          >
            ← Previous Episode
          </button>

          <button
            onClick={handleRandom}
            className="bg-gradient-to-r from-op-orange to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-lg font-semibold text-lg transition-all"
          >
            🎲 Random Episode
          </button>

          <button
            onClick={handleNext}
            disabled={epNum >= TOTAL_EPISODES}
            className={`py-4 rounded-lg font-semibold text-lg transition-all ${
              epNum >= TOTAL_EPISODES
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-op-dark hover:bg-gray-800 text-white border border-gray-700 hover:border-op-orange'
            }`}
          >
            Next Episode →
          </button>
        </div>

        {/* More Episodes from This Arc */}
        <div className="bg-op-dark/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            More from {episodeData.arcName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allEpisodes
              .filter(ep => ep.arcName === episodeData.arcName)
              .slice(0, 12)
              .map(ep => (
                <Link
                  key={ep.episodeNumber}
                  to={`/watch/${ep.episodeNumber}`}
                  className={`p-3 rounded-lg text-center transition-all ${
                    ep.episodeNumber === epNum
                      ? 'bg-op-orange text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-op-orange'
                  }`}
                >
                  <div className="font-bold">Ep {ep.episodeNumber}</div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;

