import { Link } from 'react-router-dom';

const ArcCard = ({ arc, sagaName }) => {
  const episodeCount = arc.episodes.length;
  const episodeRange = `Ep ${arc.episodes[0]} - ${arc.episodes[arc.episodes.length - 1]}`;

  return (
    <Link to={`/arc/${arc.id}`}>
      <div className="bg-gradient-to-br from-op-dark to-gray-800 rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-op-orange/50 border border-gray-700 hover:border-op-orange">
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
    </Link>
  );
};

export default ArcCard;

