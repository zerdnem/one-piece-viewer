import { Link } from 'react-router-dom';
import { episodeTitles } from '../data/onePieceData';

const EpisodeCard = ({ episodeNumber, arcName, sagaName }) => {
  const episodeTitle = episodeTitles[episodeNumber] || `Episode ${episodeNumber}`;

  return (
    <Link to={`/watch/${episodeNumber}`}>
      <div className="group bg-gradient-to-br from-op-dark to-gray-800 rounded-xl p-5 hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-op-orange/40 border-2 border-gray-700 hover:border-op-orange overflow-hidden relative">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-op-orange/0 via-op-orange/5 to-op-orange/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-op-orange to-yellow-400 font-black text-2xl mb-2">
              Episode {episodeNumber}
            </div>
            <div className="text-white text-base mb-2 line-clamp-1 font-semibold">
              {episodeTitle}
            </div>
            <div className="text-gray-400 text-sm">
              {arcName} • {sagaName}
            </div>
          </div>
          <div className="ml-4">
            <button className="bg-gradient-to-r from-op-orange to-red-500 hover:from-yellow-400 hover:to-op-orange text-white rounded-full p-3 transition-all group-hover:scale-110 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard;

