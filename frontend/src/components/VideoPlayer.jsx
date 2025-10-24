import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Dynamically determine API URL based on current host (for LAN access)
const API_URL = import.meta.env.VITE_API_URL || 
  `http://${window.location.hostname}:8000`;

// One Piece MyAnimeList ID for AniSkip API
const ONE_PIECE_MAL_ID = 21;

const VideoPlayer = ({ episodeNumber, nextEpisode, hasNextEpisode }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('default');
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [skipTimestamps, setSkipTimestamps] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [autoSkipEnabled, setAutoSkipEnabled] = useState(() => {
    // Load setting from localStorage, default to false
    const saved = localStorage.getItem('autoSkipEnabled');
    return saved === 'true';
  });
  
  const [autoPlayNextEnabled, setAutoPlayNextEnabled] = useState(() => {
    // Load setting from localStorage, default to true (for backwards compatibility)
    const saved = localStorage.getItem('autoPlayNextEnabled');
    return saved === null ? true : saved === 'true';
  });
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const countdownTimerRef = useRef(null);
  const dialogTimeoutRef = useRef(null);
  const hasAutoSkippedIntroRef = useRef(false);
  const hasAutoSkippedOutroRef = useRef(false);

  // Fetch skip timestamps from AniSkip API (only for regular episodes)
  useEffect(() => {
    // Skip timestamp fetching is only for regular episodes, not movies or specials
    const isMovie = typeof episodeNumber === 'string' && episodeNumber.startsWith('movie-');
    const isSpecial = typeof episodeNumber === 'string' && episodeNumber.startsWith('special-');
    
    if (isMovie || isSpecial) {
      // Movies and specials don't have consistent intro/outro patterns
      setSkipTimestamps(null);
      return;
    }
    
    const fetchSkipTimestamps = async () => {
      try {
        // AniSkip API endpoint
        const response = await axios.get(
          `https://api.aniskip.com/v2/skip-times/${ONE_PIECE_MAL_ID}/${episodeNumber}`,
          {
            params: {
              types: ['op', 'ed', 'mixed-op', 'mixed-ed'],
              episodeLength: 0
            }
          }
        );
        
        if (response.data && response.data.found && response.data.results) {
          const timestamps = {};
          response.data.results.forEach(item => {
            if (item.skipType === 'op' || item.skipType === 'mixed-op') {
              timestamps.intro = {
                start: item.interval.startTime,
                end: item.interval.endTime
              };
            } else if (item.skipType === 'ed' || item.skipType === 'mixed-ed') {
              timestamps.outro = {
                start: item.interval.startTime,
                end: item.interval.endTime
              };
            }
          });
          
          setSkipTimestamps(timestamps);
          console.log('Skip timestamps loaded:', timestamps);
        } else {
          console.log('No skip timestamps found for this episode');
          setSkipTimestamps(null);
        }
      } catch (err) {
        // AniSkip API doesn't have data for this episode - use fallback timestamps
        const isNotFound = err.response?.status === 404;
        if (isNotFound) {
          console.log(`ℹ️ No skip data found for episode ${episodeNumber}, using default timestamps`);
        } else {
          console.log('Could not fetch skip timestamps:', err.message);
        }
        // Fallback to default timestamps
        setSkipTimestamps({
          intro: { start: 5, end: 90 },
          outro: null
        });
      }
    };

    fetchSkipTimestamps();
  }, [episodeNumber]);


  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the new content endpoint that supports episodes, movies, and specials
        const response = await axios.get(`${API_URL}/api/content/${episodeNumber}/video`);
        
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
          setError(`Cannot connect to backend. Make sure the backend server is running on ${API_URL}`);
        } else {
          setError('Failed to load video. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
    // Reset auto-skip flags when episode changes
    hasAutoSkippedIntroRef.current = false;
    hasAutoSkippedOutroRef.current = false;
  }, [episodeNumber]);

  // Handle skip intro/outro visibility and auto-skip
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.log('⏳ No video element yet, waiting...');
      return;
    }
    
    if (!videoData) {
      console.log('⏳ No video data yet, waiting...');
      return;
    }
    
    if (!skipTimestamps) {
      console.log('⏳ No skip timestamps yet, waiting...');
      return;
    }

    console.log('✅ All ready! Setting up skip handlers with timestamps:', skipTimestamps);
    console.log('✅ Auto-skip enabled:', autoSkipEnabled);

    let lastLoggedSecond = -1; // To avoid spamming console
    
    const handleTimeUpdate = () => {
      // Check if video is ready and has valid duration
      if (!video.duration || isNaN(video.duration) || video.readyState < 2) {
        // Video not ready yet (readyState < 2 means not enough data)
        return;
      }
      
      const currentTime = video.currentTime;
      const currentSecond = Math.floor(currentTime);
      
      // Log every 5 seconds for debugging (only when near intro/outro)
      if (skipTimestamps.intro || skipTimestamps.outro) {
        const introStart = skipTimestamps.intro?.start || 0;
        const introEnd = skipTimestamps.intro?.end || 0;
        const outroStart = skipTimestamps.outro?.start || 0;
        
        // Log when near intro or outro
        if ((currentSecond % 5 === 0 && currentSecond !== lastLoggedSecond) &&
            ((Math.abs(currentTime - introStart) < 20) || 
             (Math.abs(currentTime - outroStart) < 20))) {
          console.log(`⏱️ Video time: ${currentTime.toFixed(1)}s (intro: ${introStart}-${introEnd}, autoSkip: ${autoSkipEnabled})`);
          lastLoggedSecond = currentSecond;
        }
      }
      
      // Handle intro skipping
      if (skipTimestamps.intro) {
        const { start, end } = skipTimestamps.intro;
        
        // Auto-skip intro if enabled and video is ready
        if (autoSkipEnabled && currentTime >= start && currentTime < end && !hasAutoSkippedIntroRef.current && end < video.duration) {
          console.log(`🎬 AUTO-SKIPPING INTRO: ${currentTime.toFixed(1)}s -> ${end}s`);
          try {
            video.currentTime = end;
            hasAutoSkippedIntroRef.current = true;
            console.log(`✅ Intro skipped! New time: ${video.currentTime.toFixed(1)}s`);
          } catch (error) {
            console.error('❌ Failed to skip intro:', error);
          }
        }
        
        // Show manual skip intro button (only if auto-skip is disabled)
        if (!autoSkipEnabled && currentTime >= start && currentTime < end) {
          setShowSkipIntro(true);
        } else {
          setShowSkipIntro(false);
        }
      }
      
      // Handle outro skipping
      if (skipTimestamps.outro) {
        const { start, end } = skipTimestamps.outro;
        
        // Auto-skip outro if enabled (jumps to next episode if available)
        if (autoSkipEnabled && currentTime >= start && currentTime < end && !hasAutoSkippedOutroRef.current) {
          if (hasNextEpisode && video.duration > 0) {
            console.log(`🎬 AUTO-SKIPPING OUTRO: ${currentTime.toFixed(1)}s -> end`);
            try {
              // Skip to end to trigger next episode
              video.currentTime = Math.max(0, video.duration - 1);
              hasAutoSkippedOutroRef.current = true;
              console.log(`✅ Outro skipped! Jumping to end to trigger next episode`);
            } catch (error) {
              console.error('❌ Failed to skip outro:', error);
            }
          } else {
            console.log(`⚠️ In outro range but no next episode available`);
          }
        }
        
        // Show manual skip outro button (only if auto-skip is disabled)
        if (!autoSkipEnabled && currentTime >= start && currentTime < end) {
          setShowSkipOutro(true);
        } else {
          setShowSkipOutro(false);
        }
      }
    };

    const handleVideoEnded = () => {
      console.log('📺 Video ended! hasNextEpisode:', hasNextEpisode, 'autoPlayNext:', autoPlayNextEnabled);
      
      if (hasNextEpisode && autoPlayNextEnabled) {
        console.log('✅ Auto-play next enabled, starting countdown...');
        setShowNextEpisode(true);
        startCountdown();
      } else if (hasNextEpisode && !autoPlayNextEnabled) {
        console.log('⏸️ Auto-play next disabled, showing manual prompt...');
        setShowNextEpisode(true);
        setCountdown(null); // No countdown, just show the option
        // Auto-dismiss dialog after 10 seconds if user doesn't interact
        dialogTimeoutRef.current = setTimeout(() => {
          console.log('⏰ Dialog timeout - auto-dismissing');
          setShowNextEpisode(false);
        }, 10000);
      } else {
        console.log('🛑 No next episode available');
      }
    };

    console.log('🎉 Event listeners attached to video element successfully!');
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      console.log('🧹 Cleaning up event listeners');
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      if (dialogTimeoutRef.current) {
        clearTimeout(dialogTimeoutRef.current);
      }
    };
  }, [hasNextEpisode, autoSkipEnabled, autoPlayNextEnabled, skipTimestamps, videoData]);

  const skipIntro = () => {
    const video = videoRef.current;
    if (video && skipTimestamps?.intro && video.duration && video.readyState >= 2) {
      const skipTo = skipTimestamps.intro.end;
      if (skipTo < video.duration) {
        try {
          video.currentTime = skipTo;
          setShowSkipIntro(false);
          hasAutoSkippedIntroRef.current = true;
          console.log(`✅ Manually skipped intro to ${skipTo}s`);
        } catch (error) {
          console.error('❌ Failed to skip intro manually:', error);
        }
      }
    }
  };

  const skipOutro = () => {
    const video = videoRef.current;
    if (video && skipTimestamps?.outro && video.duration && video.readyState >= 2) {
      try {
        // Skip to the end of the video
        video.currentTime = Math.max(0, video.duration - 1);
        setShowSkipOutro(false);
        hasAutoSkippedOutroRef.current = true;
        console.log(`✅ Manually skipped outro to end`);
      } catch (error) {
        console.error('❌ Failed to skip outro manually:', error);
      }
    }
  };

  const startCountdown = () => {
    setCountdown(5);
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          goToNextEpisode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelAutoPlay = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (dialogTimeoutRef.current) {
      clearTimeout(dialogTimeoutRef.current);
    }
    setShowNextEpisode(false);
    setCountdown(null);
  };

  const goToNextEpisode = () => {
    if (nextEpisode) {
      console.log(`🎬 Going to next episode ${nextEpisode}`);
      navigate(`/watch/${nextEpisode}`);
    }
  };

  const toggleAutoSkip = () => {
    const newValue = !autoSkipEnabled;
    setAutoSkipEnabled(newValue);
    localStorage.setItem('autoSkipEnabled', newValue.toString());
    console.log('🔄 Auto-skip intros/outros', newValue ? 'ENABLED ✅' : 'DISABLED ❌');
  };

  const toggleAutoPlayNext = () => {
    const newValue = !autoPlayNextEnabled;
    setAutoPlayNextEnabled(newValue);
    localStorage.setItem('autoPlayNextEnabled', newValue.toString());
    console.log('🔄 Auto-play next episode', newValue ? 'ENABLED ✅' : 'DISABLED ❌');
  };

  if (loading) {
    const isMovie = typeof episodeNumber === 'string' && episodeNumber.startsWith('movie-');
    const isSpecial = typeof episodeNumber === 'string' && episodeNumber.startsWith('special-');
    const contentLabel = isMovie ? 'Movie' : isSpecial ? 'Special' : `Episode ${episodeNumber}`;
    
    return (
      <div className="w-full aspect-video bg-op-dark rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-op-orange mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading {contentLabel}...</p>
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
      <div ref={containerRef} className="bg-op-dark rounded-xl overflow-hidden shadow-2xl relative">
        {/* Video Player */}
        <video
          ref={videoRef}
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
          onLoadedMetadata={() => {
            console.log('✅ Video metadata loaded - duration:', videoRef.current?.duration);
            setIsBuffering(false);
          }}
          onLoadedData={() => {
            console.log('✅ Video data loaded successfully');
            setIsBuffering(false);
          }}
          onWaiting={() => {
            console.log('⏳ Video buffering...');
            setIsBuffering(true);
          }}
          onCanPlay={() => {
            console.log('✅ Video can play');
            setIsBuffering(false);
          }}
          onPlaying={() => {
            setIsBuffering(false);
          }}
        >
          Your browser does not support video playback.
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-op-orange mx-auto mb-2"></div>
              <p className="text-white text-sm">Buffering...</p>
            </div>
          </div>
        )}

        {/* Skip Intro Button */}
        {showSkipIntro && (
          <button
            onClick={skipIntro}
            className="absolute bottom-24 right-8 bg-white/90 hover:bg-white text-black font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10"
          >
            Skip Intro →
          </button>
        )}

        {/* Skip Outro Button */}
        {showSkipOutro && (
          <button
            onClick={skipOutro}
            className="absolute bottom-24 right-8 bg-op-gold/90 hover:bg-op-gold text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10"
          >
            Skip Outro →
          </button>
        )}

        {/* Next Episode Overlay */}
        {showNextEpisode && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="bg-op-dark p-8 rounded-2xl shadow-2xl text-center max-w-md">
              <h3 className="text-2xl font-bold text-op-gold mb-4">
                Episode {episodeNumber} Completed!
              </h3>
              {countdown !== null ? (
                <p className="text-white text-lg mb-6">
                  Next episode starts in{' '}
                  <span className="text-op-gold font-bold text-3xl">{countdown}</span>
                </p>
              ) : (
                <p className="text-white text-lg mb-6">
                  Ready to watch Episode {nextEpisode}?
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={goToNextEpisode}
                  className="bg-op-gold hover:bg-op-gold-hover text-white font-bold px-8 py-3 rounded-lg transition-colors duration-200"
                >
                  {countdown !== null ? 'Play Now' : 'Watch Next Episode'}
                </button>
                <button
                  onClick={cancelAutoPlay}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg transition-colors duration-200"
                >
                  {countdown !== null ? 'Cancel' : 'Stay Here'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Info and Controls */}
      <div className="mt-4 space-y-4">
        {/* Auto-Skip Intro/Outro Toggle */}
        <div className="flex items-center justify-between bg-op-dark/50 rounded-lg p-4 border border-gray-700">
          <div>
            <h3 className="text-white font-semibold text-lg">Auto-Skip Intros/Outros</h3>
            <p className="text-gray-400 text-sm">
              {autoSkipEnabled 
                ? '✓ Automatically skip opening and ending sequences' 
                : '❌ Show manual skip buttons instead'}
            </p>
          </div>
          <button
            onClick={toggleAutoSkip}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-op-gold focus:ring-offset-2 focus:ring-offset-op-dark ${
              autoSkipEnabled ? 'bg-op-gold' : 'bg-gray-600'
            }`}
            aria-label="Toggle auto-skip"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                autoSkipEnabled ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Auto-Play Next Episode Toggle */}
        <div className="flex items-center justify-between bg-op-dark/50 rounded-lg p-4 border border-gray-700">
          <div>
            <h3 className="text-white font-semibold text-lg">Auto-Play Next Episode</h3>
            <p className="text-gray-400 text-sm">
              {autoPlayNextEnabled 
                ? '✓ Automatically play next episode with countdown' 
                : '❌ Show manual prompt to play next episode (auto-dismisses after 10s)'}
            </p>
          </div>
          <button
            onClick={toggleAutoPlayNext}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-op-gold focus:ring-offset-2 focus:ring-offset-op-dark ${
              autoPlayNextEnabled ? 'bg-op-gold' : 'bg-gray-600'
            }`}
            aria-label="Toggle auto-play next"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                autoPlayNextEnabled ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

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

