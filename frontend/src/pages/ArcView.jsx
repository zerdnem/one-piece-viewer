import { useParams, Link } from 'react-router-dom';
import { onePieceArcs, allEpisodes } from '../data/onePieceData';
import EpisodeCard from '../components/EpisodeCard';

const ArcView = () => {
  const { arcId } = useParams();
  
  // Find the arc
  let currentArc = null;
  let currentSaga = null;
  
  for (const saga of onePieceArcs) {
    const arc = saga.arcs.find(a => a.id === parseInt(arcId));
    if (arc) {
      currentArc = arc;
      currentSaga = saga;
      break;
    }
  }

  if (!currentArc) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl text-white mb-4">Arc not found</h2>
        <Link to="/" className="text-op-orange hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  // Get episode details for this arc
  const arcEpisodes = currentArc.episodes.map(epNum => {
    const epData = allEpisodes.find(e => e.episodeNumber === epNum);
    return epData || { episodeNumber: epNum, arcName: currentArc.name, sagaName: currentSaga.saga };
  });

  return (
    <div className="min-h-screen pb-12 w-full">
      {/* Arc Header with Background Color */}
      <div className="relative overflow-hidden w-full">
        {/* Background Gradient */}
        {currentArc.color && (
          <div className="absolute inset-0 h-96">
            <div className={`w-full h-full bg-gradient-to-br ${currentArc.color}`}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-op-dark/80 via-op-dark/90 to-op-dark"></div>
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="text-[20rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">⚓</div>
            </div>
          </div>
        )}
        
        <div className="relative py-12 mb-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-op-orange hover:text-yellow-400 transition-colors mb-6 text-lg font-semibold"
            >
              <span>←</span> Back to All Arcs
            </Link>
            
            <div className="bg-gradient-to-br from-op-dark/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-op-orange/30 shadow-2xl">
              <div className="mb-4">
                <span className="bg-gradient-to-r from-op-orange to-yellow-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                  {currentSaga.saga}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-op-orange via-yellow-400 to-op-orange mb-6">
                {currentArc.name}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl">
                {currentArc.description}
              </p>
              
              <div className="flex flex-wrap gap-6 text-gray-200">
                <div className="bg-op-orange/20 px-6 py-3 rounded-xl border border-op-orange/40">
                  <span className="text-3xl font-bold text-op-orange">{currentArc.episodes.length}</span>
                  <span className="ml-2">Episodes</span>
                </div>
                <div className="bg-blue-500/20 px-6 py-3 rounded-xl border border-blue-500/40">
                  <span className="text-gray-300">Episodes</span>
                  <span className="ml-2 text-2xl font-bold text-blue-400">
                    {currentArc.episodes[0]} - {currentArc.episodes[currentArc.episodes.length - 1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="container mx-auto px-4 max-w-7xl w-full">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-op-orange to-yellow-400 mb-2">
            All Episodes
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-op-orange to-yellow-400 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arcEpisodes.map(ep => (
            <EpisodeCard
              key={ep.episodeNumber}
              episodeNumber={ep.episodeNumber}
              arcName={ep.arcName}
              sagaName={ep.sagaName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArcView;

