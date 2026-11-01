import { useState, useRef, useEffect, useCallback } from 'react';

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const asset = (p) => `${cleanBase}${p.replace(/^\/+/, '')}`;

const FAMILY_VIDEO_URL = asset('videos/Teja_Manasa_Invitation_Family_Photo_Full_HD.mp4');

function HomeVideoSection({ onNavigateToGallery, onPauseMusic, onResumeMusic }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  const handlePlayToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // Pause background wedding music while watching video
      if (onPauseMusic) onPauseMusic();
      video.play().then(() => {
        setIsPlaying(true);
        setVideoStarted(true);
      }).catch((err) => {
        console.warn('Video playback deferred:', err.message);
      });
    } else {
      video.pause();
      setIsPlaying(false);
      // Resume background music when video paused
      if (onResumeMusic) onResumeMusic();
    }
  }, [onPauseMusic, onResumeMusic]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    // Resume background music when video ends
    if (onResumeMusic) onResumeMusic();
  }, [onResumeMusic]);

  const handleMuteToggle = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleFullscreen = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      // iOS Safari support
      video.webkitEnterFullscreen();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
        if (onResumeMusic) onResumeMusic();
      }
    };
  }, [onResumeMusic]);

  return (
    <section id="wedding-video" className="home-video-section section-cream">
      <div className="section-inner wide reveal">
        <p className="eyebrow">WEDDING INVITATION FILM · ఆహ్వాన వీడియో</p>
        <h2>Family Invitation &amp; Blessings</h2>
        <p className="section-subtitle">
          A heartwarming wedding invitation from Bhuvan, Manasa, and their families.
        </p>

        {/* Video Player Frame */}
        <div className="video-player-container">
          <div className="video-frame">
            <video
              ref={videoRef}
              src={FAMILY_VIDEO_URL}
              playsInline
              preload="metadata"
              controls={videoStarted}
              onEnded={handleVideoEnded}
              onPause={() => setIsPlaying(false)}
              onPlay={() => {
                setIsPlaying(true);
                setVideoStarted(true);
                if (onPauseMusic) onPauseMusic();
              }}
              className="home-video-element"
            >
              Your browser does not support the video tag.
            </video>

            {/* Custom Overlay before user initiates playback */}
            {!videoStarted && (
              <div
                className="video-custom-overlay"
                onClick={handlePlayToggle}
                role="button"
                tabIndex={0}
                aria-label="Play wedding invitation video"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlayToggle();
                  }
                }}
              >
                <div className="video-play-pulse-btn">
                  <span className="play-triangle" aria-hidden="true">▶</span>
                </div>
                <div className="video-overlay-caption">
                  <span className="caption-badge">Full HD Invitation</span>
                  <span className="caption-title">Tap to Play Invitation Video</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick controls bar below video when started */}
          {videoStarted && (
            <div className="video-quick-controls">
              <button
                type="button"
                className="video-ctrl-btn"
                onClick={handlePlayToggle}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                type="button"
                className="video-ctrl-btn"
                onClick={handleMuteToggle}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? '🔇 Unmute' : '🔊 Mute'}
              </button>
              <button
                type="button"
                className="video-ctrl-btn"
                onClick={handleFullscreen}
                aria-label="Fullscreen video"
              >
                ⛶ Fullscreen
              </button>
            </div>
          )}
        </div>

        {/* Call to Action Banner to Gallery Page */}
        <div className="video-gallery-cta-banner reveal">
          <div className="cta-banner-text">
            <span className="cta-eyebrow">CELEBRATIONS &amp; MEMORIES</span>
            <h3>Explore All Wedding Videos &amp; Ceremony Photos</h3>
            <p>
              Watch the Cinematic Wedding Film, Events Animation Video, and view Haldi, Mehendi,
              Pellikoduku, and Pellikuthuru ceremonial photo galleries.
            </p>
          </div>
          <button
            type="button"
            className="gold-button cta-gallery-btn"
            onClick={onNavigateToGallery}
          >
            🎥 View Full Gallery &amp; Videos →
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomeVideoSection;
