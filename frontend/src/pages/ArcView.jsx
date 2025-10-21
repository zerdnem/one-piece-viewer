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
    <div className="min-h-screen pb-12">
      {/* Arc Header */}
      <div className="bg-gradient-to-b from-op-dark to-transparent py-12 mb-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-op-orange hover:underline mb-4 inline-block">
            ← Back to All Arcs
          </Link>
          
          <div className="bg-op-dark/50 rounded-2xl p-8 border border-gray-700">
            <div className="mb-4">
              <span className="bg-op-orange/20 text-op-orange px-4 py-2 rounded-full text-sm font-semibold">
                {currentSaga.saga}
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              {currentArc.name}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {currentArc.description}
            </p>
            
            <div className="flex gap-6 text-gray-300">
              <div>
                <span className="text-op-orange font-bold">{currentArc.episodes.length}</span> Episodes
              </div>
              <div>
                Episodes <span className="text-op-orange font-bold">
                  {currentArc.episodes[0]} - {currentArc.episodes[currentArc.episodes.length - 1]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-6">All Episodes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

