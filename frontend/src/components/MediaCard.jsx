import { useNavigate } from 'react-router-dom';

const MediaCard = ({ media, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'movie') {
      navigate(`/watch/movie-${media.id}`);
    } else if (type === 'special') {
      navigate(`/watch/special-${media.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-gradient-to-br from-op-dark to-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-op-orange/50 border border-gray-700 hover:border-op-orange"
    >
      {/* Media Color Banner */}
      {media.color && (
        <div className="relative h-48 overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-br ${media.color} group-hover:scale-110 transition-transform duration-300 opacity-80`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-op-dark via-op-dark/50 to-transparent"></div>
          {/* Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
              {type === 'movie' ? '🎬' : '📺'}
            </div>
          </div>
          {/* Featured Badge */}
          {media.featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ⭐ FEATURED
            </div>
          )}
          {/* Type Badge */}
          {media.type && (
            <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {media.type}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex justify-between items-start">
          <span className="text-op-orange text-sm font-semibold">{media.year}</span>
          {media.duration && (
            <span className="text-gray-400 text-xs">{media.duration}</span>
          )}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{media.title}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{media.description}</p>
        <button className="w-full bg-gradient-to-r from-op-orange to-red-600 hover:from-yellow-500 hover:to-op-orange text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-op-orange/50">
          Watch Now
        </button>
      </div>
    </div>
  );
};

export default MediaCard;

