import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const VideoPlayer = ({ episodeNumber }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('default');

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call backend API
        const response = await axios.get(`${API_URL}/api/episode/${episodeNumber}/video`);
        
        if (response.data.success) {
          setVideoData(response.data);
          
          // Set default quality
          const qualities = Object.keys(response.data.video_urls);
          if (qualities.length > 0) {
            setSelectedQuality(qualities[0]);
          }
        } else {
          setError(response.data.error || 'Failed to load video');
        }
        
      } catch (err) {
        console.error('Video loading error:', err);
        
        if (err.response) {
          setError(err.response.data.detail || 'Failed to load video');
        } else if (err.request) {
          setError('Cannot connect to backend. Make sure the backend server is running on http://localhost:8000');
        } else {
          setError('Failed to load video. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [episodeNumber]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-op-dark rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-op-orange mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Episode {episodeNumber}...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching video from sources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-op-dark rounded-xl flex items-center justify-center">
        <div className="text-center px-6 max-w-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-white text-xl mb-2">Error Loading Video</p>
          <p className="text-gray-400 mb-4">{error}</p>
          {error.includes('backend') && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 text-sm">
                <strong>Backend Not Running:</strong><br/>
                Start the backend server with: <code className="bg-black/30 px-2 py-1 rounded">python main.py</code>
              </p>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-op-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!videoData || !videoData.video_urls) {
    return (
      <div className="w-full aspect-video bg-op-dark rounded-xl flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-white text-xl mb-2">No Video Found</p>
          <p className="text-gray-400">Could not find video source for this episode</p>
        </div>
      </div>
    );
  }

  const currentVideoUrl = videoData.video_urls[selectedQuality] || videoData.video_urls['default'];
  const availableQualities = Object.keys(videoData.video_urls).filter(q => q !== 'provider' && q !== 'source');
  
  // Use proxy URL to handle CORS and headers
  const proxyUrl = `${API_URL}/api/proxy/video?url=${encodeURIComponent(currentVideoUrl)}`;

  return (
    <div className="w-full">
      <div className="bg-op-dark rounded-xl overflow-hidden shadow-2xl">
        {/* Video Player */}
        <video 
          key={proxyUrl}
          controls 
          autoPlay
          className="w-full aspect-video bg-black"
          src={proxyUrl}
          crossOrigin="anonymous"
          onError={(e) => {
            console.error('Video playback error:', e);
            console.error('Attempted URL:', proxyUrl);
            setError('Error playing video. The source may be unavailable or blocked.');
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
          }}
        >
          Your browser does not support video playback.
        </video>
      </div>
      
      {/* Video Info and Controls */}
      <div className="mt-4 space-y-4">
        {/* Quality Selector */}
        {availableQualities.length > 1 && (
          <div className="bg-op-dark/50 rounded-lg p-4">
            <label className="text-white font-semibold mb-2 block">Quality:</label>
            <div className="flex gap-2 flex-wrap">
              {availableQualities.map((quality) => (
                <button
                  key={quality}
                  onClick={() => setSelectedQuality(quality)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedQuality === quality
                      ? 'bg-op-orange text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Video Metadata */}
        <div className="bg-op-dark/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Provider:</span>
              <span className="text-white ml-2">{videoData.provider?.replace('Scraper', '')}</span>
            </div>
            <div>
              <span className="text-gray-400">Cached:</span>
              <span className="text-white ml-2">{videoData.cached ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

