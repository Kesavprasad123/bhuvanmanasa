import { useState, useRef, useEffect, useCallback } from 'react';

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const asset = (p) => `${cleanBase}${p.replace(/^\/+/, '')}`;

const REEL_VIDEOS = [
  {
    id: 'groom-first',
    src: asset('videos/Bhuvan_Manasa_Groom_First_Full_HD.mp4'),
    title: "The Groom's Grand Reveal",
    teluguTitle: 'పెళ్ళికొడుకు ఆగమనం',
    subtitle: 'The magnificent first look of Bhuvan as groom',
    badge: 'Groom First Look',
    icon: '👑',
  },
  {
    id: 'cinema-invitation',
    src: asset('videos/Bhuvan_Manasa_Cinema_Invitation_Clean_Full_HD.mp4'),
    title: 'Cinematic Invitation Film',
    teluguTitle: 'సినీమాటిక్ వెడ్డింగ్ ఆహ్వానం',
    subtitle: 'A grand cinematic film celebrating sacred traditions',
    badge: 'Cinematic Film',
    icon: '🎬',
  },
  {
    id: 'events-animation',
    src: asset('videos/Bhuvan_Manasa_Wedding_Events_Clean_Full_HD.mp4'),
    title: 'Events Animation Film',
    teluguTitle: 'వివాహ వేడుకల యానిమేషన్',
    subtitle: 'Animated tour of the seven sacred ceremonies',
    badge: 'Events Animation',
    icon: '🎨',
  },
  {
    id: 'family-invitation',
    src: asset('videos/Teja_Manasa_Telugu_Corrected_HD.mp4'),
    title: 'Family Invitation & Blessings',
    teluguTitle: 'కుటుంబ ఆశీర్వాదాలు',
    subtitle: 'Heartfelt invitation and blessings from both families',
    badge: 'Family Blessings',
    icon: '🙏',
  },
];

function ReelCard({
  video,
  isUnmuted,
  isModalOpen,
  shouldPlay,
  onToggleMute,
  onVideoPause,
  onVideoPlayWithSound,
  onOpenExpand,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Set Android-compatible autoplay attributes on DOM mount
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.defaultMuted = true;
    el.muted = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', 'true');
    el.setAttribute('x5-playsinline', 'true');
  }, []);

  // Declarative playback management: prevents hardware decoder starvation on Android
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isModalOpen || !shouldPlay) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.muted = !isUnmuted;
      if (!isUnmuted) {
        el.setAttribute('muted', '');
      } else {
        el.removeAttribute('muted');
      }
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [shouldPlay, isModalOpen, isUnmuted]);

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (isUnmuted) onVideoPlayWithSound();
          })
          .catch((err) => console.warn('Play error:', err));
      }
    } else {
      el.pause();
      setIsPlaying(false);
      if (isUnmuted) onVideoPause();
    }
  };

  const handleSoundClick = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (el) {
      if (!isUnmuted) {
        // Direct synchronous user gesture: ensures Android Chrome unblocks audio
        el.muted = false;
        el.removeAttribute('muted');
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              onVideoPlayWithSound();
            })
            .catch((err) => console.warn('Unmute play error:', err));
        }
      } else {
        el.muted = true;
        el.setAttribute('muted', '');
      }
    }
    onToggleMute(video.id);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    onOpenExpand(video);
  };

  return (
    <div className={`hvs-reel-card${isUnmuted ? ' is-audio-active' : ''}`}>
      {/* 9:16 Portrait Reel Frame */}
      <div className="hvs-reel-frame" onClick={handleTogglePlay}>
        <video
          ref={videoRef}
          src={video.src}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          muted={!isUnmuted}
          loop
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onPause={() => {
            setIsPlaying(false);
            if (isUnmuted) onVideoPause();
          }}
          onPlay={() => {
            setIsPlaying(true);
            if (isUnmuted) onVideoPlayWithSound();
          }}
          className="hvs-reel-video"
        >
          Your browser does not support vertical video playback.
        </video>

        {/* Top Floating Controls Bar */}
        <div className="hvs-reel-top-bar" onClick={(e) => e.stopPropagation()}>
          <span className="hvs-reel-badge">
            <span className="hvs-reel-badge-icon" aria-hidden="true">{video.icon}</span>
            {video.badge}
          </span>

          {/* Sound Toggle Pill Button */}
          <button
            type="button"
            className={`hvs-sound-pill${isUnmuted ? ' is-unmuted' : ''}`}
            onClick={handleSoundClick}
            aria-label={isUnmuted ? `Mute ${video.title}` : `Unmute ${video.title} for sound`}
            title={isUnmuted ? 'Mute' : 'Unmute for video sound'}
          >
            {isUnmuted ? (
              <>
                <span className="hvs-sound-waves" aria-hidden="true">
                  <span className="wave wave-1" />
                  <span className="wave wave-2" />
                  <span className="wave wave-3" />
                </span>
                <span className="hvs-sound-label">Sound ON</span>
              </>
            ) : (
              <>
                <span className="hvs-sound-icon" aria-hidden="true">🔇</span>
                <span className="hvs-sound-label">Tap for Sound</span>
              </>
            )}
          </button>
        </div>

        {/* Center Pause Indicator Overlay */}
        {!isPlaying && (
          <div className="hvs-reel-paused-overlay">
            <div className="hvs-reel-paused-btn" aria-hidden="true">
              ▶
            </div>
            <span className="hvs-reel-paused-hint">Tap to Resume</span>
          </div>
        )}

        {/* Bottom Metadata & Controls Overlay */}
        <div className="hvs-reel-bottom" onClick={(e) => e.stopPropagation()}>
          <div className="hvs-reel-meta">
            <h3 className="hvs-reel-title">{video.title}</h3>
            <p className="hvs-reel-telugu">{video.teluguTitle}</p>
          </div>

          <div className="hvs-reel-action-bar">
            <button
              type="button"
              className="hvs-reel-btn"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
            >
              <span className="hvs-btn-icon" aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
              <span className="hvs-btn-text">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              className={`hvs-reel-btn${isUnmuted ? ' is-active' : ''}`}
              onClick={handleSoundClick}
              aria-label={isUnmuted ? 'Mute audio' : 'Unmute audio'}
            >
              <span className="hvs-btn-icon" aria-hidden="true">{isUnmuted ? '🔊' : '🔈'}</span>
              <span className="hvs-btn-text">{isUnmuted ? 'Mute' : 'Sound'}</span>
            </button>
            <button
              type="button"
              className="hvs-reel-btn hvs-expand-btn"
              onClick={handleExpandClick}
              aria-label="Extend and watch full video in high resolution"
              title="Extend / Full View"
            >
              <span className="hvs-btn-icon" aria-hidden="true">⛶</span>
              <span className="hvs-btn-text">Extend</span>
            </button>
          </div>

          {/* Thin Progress Bar Along Bottom Edge */}
          <div className="hvs-reel-progress-track" aria-hidden="true">
            <div
              className="hvs-reel-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeVideoSection({ onNavigateToGallery, onPauseMusic, onResumeMusic }) {
  const [unmutedId, setUnmutedId] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeReelDot, setActiveReelDot] = useState(0);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const modalVideoRef = useRef(null);
  const sectionRef = useRef(null);
  const showcaseRef = useRef(null);

  // Track mobile viewport for single-reel playback vs desktop multi-card preview
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShowcaseScroll = useCallback(() => {
    const el = showcaseRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild ? el.firstElementChild.offsetWidth + 14 : 280;
    const newIndex = Math.min(
      REEL_VIDEOS.length - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    setActiveReelDot(newIndex);
  }, []);

  // Keep a stable ref of audio activity for unmount cleanup ONLY
  const isAudioActiveRef = useRef(false);
  isAudioActiveRef.current = !!(unmutedId || expandedVideo);

  const handleToggleMute = useCallback((id) => {
    setUnmutedId((prev) => {
      if (prev === id) {
        if (onResumeMusic) onResumeMusic();
        return null;
      }
      if (onPauseMusic) onPauseMusic();
      return id;
    });
  }, [onPauseMusic, onResumeMusic]);

  const handleVideoPause = useCallback(() => {
    if (!expandedVideo && onResumeMusic) onResumeMusic();
  }, [expandedVideo, onResumeMusic]);

  const handleVideoPlayWithSound = useCallback(() => {
    if (onPauseMusic) onPauseMusic();
  }, [onPauseMusic]);

  // Open extended full view: PAUSES website music immediately
  const handleOpenExpand = useCallback((video) => {
    // 1. Immediately pause the website background music
    if (onPauseMusic) onPauseMusic();
    // 2. Mute card videos so only extended video has sound
    setUnmutedId(null);
    // 3. Set extended video
    setExpandedVideo(video);
    setShowExitConfirm(false);
  }, [onPauseMusic]);

  // When user attempts to exit (clicked empty backdrop space or close button)
  const handleBackdropClick = useCallback(() => {
    // Do NOT immediately dismiss! Request user confirmation first
    setShowExitConfirm(true);
  }, []);

  // User confirmed exit from the confirmation dialog
  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setExpandedVideo(null);
    // Resume website music from exact paused spot!
    if (onResumeMusic) {
      onResumeMusic();
    }
  }, [onResumeMusic]);

  // User chose to stay and keep watching
  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
    // Make sure modal video keeps playing with sound
    if (modalVideoRef.current && modalVideoRef.current.paused) {
      modalVideoRef.current.play().catch(() => {});
    }
    if (onPauseMusic) onPauseMusic();
  }, [onPauseMusic]);

  // Lightbox Next/Prev navigation
  const handleNextExpand = useCallback(() => {
    if (!expandedVideo) return;
    const currentIndex = REEL_VIDEOS.findIndex((v) => v.id === expandedVideo.id);
    const nextIndex = (currentIndex + 1) % REEL_VIDEOS.length;
    setExpandedVideo(REEL_VIDEOS[nextIndex]);
    setShowExitConfirm(false);
  }, [expandedVideo]);

  const handlePrevExpand = useCallback(() => {
    if (!expandedVideo) return;
    const currentIndex = REEL_VIDEOS.findIndex((v) => v.id === expandedVideo.id);
    const prevIndex = (currentIndex - 1 + REEL_VIDEOS.length) % REEL_VIDEOS.length;
    setExpandedVideo(REEL_VIDEOS[prevIndex]);
    setShowExitConfirm(false);
  }, [expandedVideo]);

  // Ensure website music stays paused while modal video is open
  useEffect(() => {
    if (expandedVideo && onPauseMusic) {
      onPauseMusic();
    }
  }, [expandedVideo, onPauseMusic]);

  // Keyboard navigation for extended view
  useEffect(() => {
    if (!expandedVideo) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowExitConfirm(true);
      }
      if (e.key === 'ArrowRight') handleNextExpand();
      if (e.key === 'ArrowLeft') handlePrevExpand();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedVideo, handleNextExpand, handlePrevExpand]);

  // Cleanup on unmount ONLY
  useEffect(() => {
    return () => {
      if (isAudioActiveRef.current && onResumeMusic) {
        onResumeMusic();
      }
    };
  }, [onResumeMusic]);

  // Observer to manage playback: only decode/play videos when section is in viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsSectionInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSectionInView(entry.isIntersecting);
          if (!entry.isIntersecting && !expandedVideo) {
            if (unmutedId) {
              setUnmutedId(null);
              if (onResumeMusic) onResumeMusic();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [unmutedId, expandedVideo, onResumeMusic]);

  const currentReelIndex = expandedVideo
    ? REEL_VIDEOS.findIndex((v) => v.id === expandedVideo.id) + 1
    : 1;

  return (
    <section id="wedding-video" ref={sectionRef} className="home-video-section section-cream">
      <div className="section-inner wide">
        {/* Section Heading */}
        <div className="hvs-header reveal">
          <p className="eyebrow">WEDDING REELS · వివాహ వేడుకల రీల్స్</p>
          <h2>Cinematic Wedding Reels &amp; Moments</h2>
          <p className="hvs-header-sub">
            Continuous moments of joy, sacred rituals, and family love. Tap any reel to listen with sound!
          </p>

          {/* Ornamental Divider */}
          <svg className="hvs-ornament" viewBox="0 0 260 26" aria-hidden="true" focusable="false">
            <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
              <path d="M6 13 H92" />
              <path d="M168 13 H254" />
              <path d="M96 13 q8-7 16 0 q-8 7-16 0" />
              <path d="M164 13 q-8-7-16 0 q8 7 16 0" />
            </g>
            <g fill="currentColor">
              <circle cx="130" cy="6.5" r="3.4" />
              <circle cx="130" cy="19.5" r="3.4" />
              <circle cx="123" cy="13" r="3.4" />
              <circle cx="137" cy="13" r="3.4" />
              <circle cx="130" cy="13" r="2.6" fill="var(--paper)" />
            </g>
          </svg>
        </div>

        {/* 4-Reels Showcase Container */}
        <div
          ref={showcaseRef}
          className="hvs-reels-showcase reveal"
          onScroll={handleShowcaseScroll}
        >
          {REEL_VIDEOS.map((video, index) => {
            // Android-safe playback allocation:
            // 1. Off-screen: nothing plays (0 decoders used)
            // 2. Modal open: cards pause
            // 3. Mobile screen: ONLY active reel plays (1 decoder max)
            // 4. If any card unmuted: only that unmuted reel plays
            const isThisCardUnmuted = unmutedId === video.id;
            const isAnyCardUnmuted = unmutedId !== null;
            const shouldPlay =
              isSectionInView &&
              !expandedVideo &&
              (isAnyCardUnmuted
                ? isThisCardUnmuted
                : isMobile
                ? index === activeReelDot
                : true);

            return (
              <ReelCard
                key={video.id}
                video={video}
                isUnmuted={isThisCardUnmuted}
                isModalOpen={!!expandedVideo}
                shouldPlay={shouldPlay}
                onToggleMute={handleToggleMute}
                onVideoPause={handleVideoPause}
                onVideoPlayWithSound={handleVideoPlayWithSound}
                onOpenExpand={handleOpenExpand}
              />
            );
          })}
        </div>

        {/* Mobile carousel indicator dots */}
        <div className="hvs-mobile-dots" aria-label="Reel indicator dots">
          {REEL_VIDEOS.map((video, index) => (
            <button
              key={video.id}
              type="button"
              className={`hvs-dot${activeReelDot === index ? ' is-active' : ''}`}
              onClick={() => {
                const el = showcaseRef.current;
                if (el && el.children[index]) {
                  el.children[index].scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                }
              }}
              aria-label={`Scroll to reel ${index + 1}: ${video.title}`}
            />
          ))}
        </div>

        {/* Call to Action Banner to Gallery Page */}
        <div className="video-gallery-cta-banner reveal">
          <div className="cta-banner-text">
            <span className="cta-eyebrow">PHOTO GALLERIES &amp; MEMORIES</span>
            <h3>Explore Ceremony Photos &amp; More</h3>
            <p>
              Browse Pellikoduku, Pellikuthuru, Haldi Snanam, Mehendi, Sangeeth, and sacred Muhurtham ceremonies.
            </p>
          </div>
          <button
            type="button"
            className="gold-button cta-gallery-btn"
            onClick={onNavigateToGallery}
          >
            📸 View Full Gallery →
          </button>
        </div>
      </div>

      {/* EXTENDED FULL REEL LIGHTBOX MODAL */}
      {expandedVideo && (
        <div
          className="hvs-expand-modal-backdrop"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={`Extended view of ${expandedVideo.title}`}
        >
          {/* Top Bar inside modal */}
          <div className="hvs-modal-top-bar" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hvs-modal-back-btn"
              onClick={() => setShowExitConfirm(true)}
              aria-label="Return to wedding invitation"
            >
              ← Back to Invitation
            </button>

            <span className="hvs-modal-counter">
              Reel {currentReelIndex} of {REEL_VIDEOS.length}
            </span>

            <button
              type="button"
              className="hvs-modal-close-btn"
              onClick={() => setShowExitConfirm(true)}
              aria-label="Close video reel"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Modal Center Content (Video Frame + Nav Arrows) */}
          <div
            className="hvs-expand-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Reel Arrow */}
            <button
              type="button"
              className="hvs-modal-nav-btn is-prev"
              onClick={handlePrevExpand}
              aria-label="Previous reel"
              title="Previous Reel"
            >
              ‹
            </button>

            {/* Next Reel Arrow */}
            <button
              type="button"
              className="hvs-modal-nav-btn is-next"
              onClick={handleNextExpand}
              aria-label="Next reel"
              title="Next Reel"
            >
              ›
            </button>

            {/* 9:16 Portrait Video Player Frame */}
            <div className="hvs-modal-player-wrap">
              <video
                ref={modalVideoRef}
                key={expandedVideo.id}
                src={expandedVideo.src}
                controls
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                autoPlay
                loop
                onPlay={() => {
                  if (onPauseMusic) onPauseMusic();
                }}
                className="hvs-modal-video"
              >
                Your browser does not support vertical video playback.
              </video>
            </div>

            {/* Bottom Caption */}
            <div className="hvs-modal-meta">
              <div className="hvs-modal-badge">
                <span>{expandedVideo.icon}</span>
                <span>{expandedVideo.badge}</span>
              </div>
              <h3 className="hvs-modal-title">{expandedVideo.title}</h3>
              <p className="hvs-modal-telugu">{expandedVideo.teluguTitle}</p>
            </div>

            {/* INTELLIGENT CONFIRMATION DIALOG (Protects against accidental dismissals on empty space) */}
            {showExitConfirm && (
              <div
                className="hvs-confirm-overlay"
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="hvs-confirm-title"
              >
                <div className="hvs-confirm-card">
                  <div className="hvs-confirm-icon" aria-hidden="true">🎬</div>
                  <h4 id="hvs-confirm-title" className="hvs-confirm-title">
                    Return to Wedding Invitation?
                  </h4>
                  <p className="hvs-confirm-telugu">వెడ్డింగ్ ఆహ్వానానికి తిరిగి వెళ్ళాలా?</p>
                  <p className="hvs-confirm-desc">
                    You are currently watching <strong>"{expandedVideo.title}"</strong>.
                    Would you like to continue watching this reel, or return to the website?
                  </p>
                  <div className="hvs-confirm-actions">
                    <button
                      type="button"
                      className="gold-button hvs-confirm-btn-stay"
                      onClick={handleCancelExit}
                    >
                      ▶ Keep Watching Reel
                    </button>
                    <button
                      type="button"
                      className="hvs-confirm-btn-exit"
                      onClick={handleConfirmExit}
                    >
                      ✕ Yes, Return to Website
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default HomeVideoSection;
