import { Link } from 'react-router-dom';
import { episodeTitles } from '../data/onePieceData';

const EpisodeCard = ({ episodeNumber, arcName, sagaName }) => {
  const episodeTitle = episodeTitles[episodeNumber] || `Episode ${episodeNumber}`;

  return (
    <Link to={`/watch/${episodeNumber}`}>
      <div className="bg-gradient-to-r from-op-dark to-gray-800 rounded-lg p-4 hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-op-orange/30 border border-gray-700 hover:border-op-orange">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-op-orange font-bold text-xl mb-1">
              Episode {episodeNumber}
            </div>
            <div className="text-white text-sm mb-2 line-clamp-1">
              {episodeTitle}
            </div>
            <div className="text-gray-400 text-xs">
              {arcName} • {sagaName}
            </div>
          </div>
          <div className="ml-4">
            <button className="bg-op-orange hover:bg-orange-600 text-white rounded-full p-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard;

