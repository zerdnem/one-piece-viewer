import { Link } from 'react-router-dom';

const ArcCard = ({ arc, sagaName }) => {
  const episodeCount = arc.episodes.length;
  const episodeRange = `Ep ${arc.episodes[0]} - ${arc.episodes[arc.episodes.length - 1]}`;

  return (
    <Link to={`/arc/${arc.id}`}>
      <div className="group relative bg-gradient-to-br from-op-dark to-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-op-orange/50 border border-gray-700 hover:border-op-orange">
        {/* Arc Color Banner */}
        {arc.color && (
          <div className="relative h-48 overflow-hidden">
            <div className={`w-full h-full bg-gradient-to-br ${arc.color} group-hover:scale-110 transition-transform duration-300 opacity-80`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-op-dark via-op-dark/50 to-transparent"></div>
            {/* Arc Icon/Pattern Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">🏴‍☠️</div>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <span className="text-op-orange text-sm font-semibold">{sagaName}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{arc.name}</h3>
          <p className="text-gray-300 mb-4 line-clamp-2">{arc.description}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="bg-op-orange/20 text-op-orange px-3 py-1 rounded-full">
              {episodeCount} Episodes
            </span>
            <span className="text-gray-400">{episodeRange}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArcCard;

