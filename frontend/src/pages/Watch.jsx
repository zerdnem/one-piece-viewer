import { useParams, Link, useNavigate } from 'react-router-dom';
import { allEpisodes, episodeTitles, TOTAL_EPISODES, onePieceMovies, onePieceSpecials } from '../data/onePieceData';
import VideoPlayer from '../components/VideoPlayer';

const Watch = () => {
  const { episodeNumber } = useParams();
  const navigate = useNavigate();
  
  // Check if it's a movie or special
  const isMovie = episodeNumber.startsWith('movie-');
  const isSpecial = episodeNumber.startsWith('special-');
  
  let contentData = null;
  let contentType = 'episode';
  
  if (isMovie) {
    const movieId = parseInt(episodeNumber.replace('movie-', ''));
    contentData = onePieceMovies.find(m => m.id === movieId);
    contentType = 'movie';
  } else if (isSpecial) {
    const specialId = parseInt(episodeNumber.replace('special-', ''));
    contentData = onePieceSpecials.find(s => s.id === specialId);
    contentType = 'special';
  } else {
    const epNum = parseInt(episodeNumber);
    contentData = allEpisodes.find(e => e.episodeNumber === epNum);
    if (contentData) {
      contentData.title = episodeTitles[epNum] || 'One Piece';
      contentData.episodeNumber = epNum;
    }
  }

  const handlePrevious = () => {
    if (contentType === 'episode' && contentData.episodeNumber > 1) {
      navigate(`/watch/${contentData.episodeNumber - 1}`);
    } else if (contentType === 'movie' && contentData.id > 1) {
      navigate(`/watch/movie-${contentData.id - 1}`);
    } else if (contentType === 'special' && contentData.id > 1) {
      navigate(`/watch/special-${contentData.id - 1}`);
    }
  };

  const handleNext = () => {
    if (contentType === 'episode' && contentData.episodeNumber < TOTAL_EPISODES) {
      navigate(`/watch/${contentData.episodeNumber + 1}`);
    } else if (contentType === 'movie' && contentData.id < onePieceMovies.length) {
      navigate(`/watch/movie-${contentData.id + 1}`);
    } else if (contentType === 'special' && contentData.id < onePieceSpecials.length) {
      navigate(`/watch/special-${contentData.id + 1}`);
    }
  };

  const handleRandom = () => {
    const randomEp = Math.floor(Math.random() * TOTAL_EPISODES) + 1;
    navigate(`/watch/${randomEp}`);
  };

  if (!contentData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl text-white mb-4">Content not found</h2>
        <Link to="/" className="text-op-orange hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const hasPrevious = (contentType === 'episode' && contentData.episodeNumber > 1) ||
                      (contentType === 'movie' && contentData.id > 1) ||
                      (contentType === 'special' && contentData.id > 1);
  
  const hasNext = (contentType === 'episode' && contentData.episodeNumber < TOTAL_EPISODES) ||
                  (contentType === 'movie' && contentData.id < onePieceMovies.length) ||
                  (contentType === 'special' && contentData.id < onePieceSpecials.length);

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link to="/" className="text-op-orange hover:underline mb-6 inline-block">
          ← Back to Browse
        </Link>

        {/* Content Info Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {contentType === 'episode' && (
              <>
                <span className="bg-op-orange/20 text-op-orange px-3 py-1 rounded-full text-sm font-semibold">
                  {contentData.sagaName}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{contentData.arcName}</span>
              </>
            )}
            {contentType === 'movie' && (
              <>
                <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                  🎬 Movie
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{contentData.year}</span>
                {contentData.duration && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{contentData.duration}</span>
                  </>
                )}
              </>
            )}
            {contentType === 'special' && (
              <>
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                  📺 {contentData.type}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{contentData.year}</span>
                {contentData.duration && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{contentData.duration}</span>
                  </>
                )}
              </>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {contentType === 'episode' 
              ? `Episode ${contentData.episodeNumber}: ${contentData.title}`
              : contentData.title
            }
          </h1>
          <p className="text-gray-400">{contentData.description}</p>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer 
            key={episodeNumber}
            episodeNumber={contentType === 'episode' ? contentData.episodeNumber : episodeNumber} 
            nextEpisode={hasNext ? (contentType === 'episode' ? contentData.episodeNumber + 1 : null) : null}
            hasNextEpisode={hasNext}
          />
        </div>

        {/* Navigation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`py-4 rounded-lg font-semibold text-lg transition-all ${
              !hasPrevious
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-op-dark hover:bg-gray-800 text-white border border-gray-700 hover:border-op-orange'
            }`}
          >
            ← Previous {contentType === 'movie' ? 'Movie' : contentType === 'special' ? 'Special' : 'Episode'}
          </button>

          <button
            onClick={handleRandom}
            className="bg-gradient-to-r from-op-orange to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-lg font-semibold text-lg transition-all"
          >
            🎲 Random Episode
          </button>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`py-4 rounded-lg font-semibold text-lg transition-all ${
              !hasNext
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-op-dark hover:bg-gray-800 text-white border border-gray-700 hover:border-op-orange'
            }`}
          >
            Next {contentType === 'movie' ? 'Movie' : contentType === 'special' ? 'Special' : 'Episode'} →
          </button>
        </div>

        {/* More Episodes from This Arc / Related Content */}
        {contentType === 'episode' && (
          <div className="bg-op-dark/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              More from {contentData.arcName}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {allEpisodes
                .filter(ep => ep.arcName === contentData.arcName)
                .slice(0, 12)
                .map(ep => (
                  <Link
                    key={ep.episodeNumber}
                    to={`/watch/${ep.episodeNumber}`}
                    className={`p-3 rounded-lg text-center transition-all ${
                      ep.episodeNumber === contentData.episodeNumber
                        ? 'bg-op-orange text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-op-orange'
                    }`}
                  >
                    <div className="font-bold">Ep {ep.episodeNumber}</div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {contentType === 'movie' && (
          <div className="bg-op-dark/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              More Movies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {onePieceMovies.slice(0, 10).map(movie => (
                <Link
                  key={movie.id}
                  to={`/watch/movie-${movie.id}`}
                  className={`p-3 rounded-lg text-center transition-all ${
                    movie.id === contentData.id
                      ? 'bg-op-orange text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-op-orange'
                  }`}
                >
                  <div className="font-bold text-sm">{movie.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{movie.year}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {contentType === 'special' && (
          <div className="bg-op-dark/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              More Specials & OVAs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {onePieceSpecials.map(special => (
                <Link
                  key={special.id}
                  to={`/watch/special-${special.id}`}
                  className={`p-3 rounded-lg text-center transition-all ${
                    special.id === contentData.id
                      ? 'bg-op-orange text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-op-orange'
                  }`}
                >
                  <div className="font-bold text-sm">{special.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{special.type}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;

