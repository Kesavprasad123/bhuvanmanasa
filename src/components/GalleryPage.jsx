import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import MusicToggle from './MusicToggle';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/gallery.css';

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const asset = (p) => `${cleanBase}${p.replace(/^\/+/, '')}`;

export function parseYouTubeVideoId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Direct 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.searchParams.has('v')) {
      return url.searchParams.get('v');
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      if (id) return id;
    }
    const pathParts = url.pathname.split('/').filter(Boolean);
    const liveIdx = pathParts.findIndex((part) => ['live', 'embed', 'v', 'shorts'].includes(part));
    if (liveIdx !== -1 && pathParts[liveIdx + 1]) {
      return pathParts[liveIdx + 1].split('?')[0];
    }
  } catch {
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export const WEDDING_VIDEOS = [
  {
    id: 'groom-first',
    title: 'The Groom\'s Grand Reveal',
    teluguTitle: 'పెళ్ళికొడుకు ఆగమనం',
    subtitle: 'The magnificent first look of Bhuvan as the groom — dressed in regal tradition.',
    src: asset('videos/Bhuvan_Manasa_Groom_First_Full_HD.mp4'),
    poster: asset('assets/pellikoduku.webp'),
    badge: 'Groom First Look',
    category: 'videos',
    duration: 'Full HD',
  },
  {
    id: 'bride-pellikuthuru',
    title: 'The Bride\'s Sacred Glow',
    teluguTitle: 'పెళ్ళికూతురు మంగళ వేడుక',
    subtitle: 'The divine, radiant moments of Manasa as bride surrounded by love and family affection.',
    src: asset('videos/Manasa_Pellikuthuru_Corrected_HD.mp4'),
    poster: asset('assets/pellikuthuru.webp'),
    badge: 'Bride Ceremony',
    category: 'videos',
    duration: 'Full HD',
  },
  {
    id: 'save-the-date',
    title: 'Save The Date & Sacred Union',
    teluguTitle: 'సేవ్ ది డేట్ · శుభ ముహూర్తం',
    subtitle: 'A romantic glimpse into Bhuvan & Manasa’s journey of love and sacred celebrations.',
    src: asset('videos/Bhuvan_Manasa_Save_The_Date_Eyes_Corrected_HD.mp4'),
    poster: asset('assets/feature-img.webp'),
    badge: 'Save The Date',
    category: 'videos',
    duration: 'Full HD',
  },
  {
    id: 'cinema-invitation',
    title: 'Cinematic Wedding Invitation Film',
    teluguTitle: 'సినీమాటిక్ వెడ్డింగ్ ఇన్విటేషన్',
    subtitle: 'A grand cinematic presentation celebrating love and sacred traditions.',
    src: asset('videos/Bhuvan_Manasa_Cinema_Invitation_Clean_Full_HD.mp4'),
    poster: asset('assets/weddding1.webp'),
    badge: 'Cinematic Film',
    category: 'videos',
    duration: 'Full HD',
  },
  {
    id: 'events-animation',
    title: 'Wedding Events Animation Film',
    teluguTitle: 'వివాహ వేడుకల యానిమేషన్ చిత్రం',
    subtitle: 'Delightful animation walk-through of the seven sacred wedding festivities.',
    src: asset('videos/Bhuvan_Manasa_Wedding_Events_Clean_Full_HD.mp4'),
    poster: asset('assets/wedding.webp'),
    badge: 'Events Animation',
    category: 'videos',
    duration: 'Full HD',
  },
  {
    id: 'family-invitation',
    title: 'Family Invitation & Blessings',
    teluguTitle: 'కుటుంబ ఆశీర్వాదాలు',
    subtitle: 'A heartfelt invitation and auspicious blessings from both families.',
    src: asset('videos/Teja_Manasa_Telugu_Corrected_HD.mp4'),
    poster: asset('assets/Card.webp'),
    badge: 'Family Invitation',
    category: 'videos',
    duration: 'Full HD',
  },
];

export const GALLERY_ITEMS = [
  // --- Pelli Koduku Collection ---
  {
    id: 'pk-main',
    title: 'Pelli Koduku Ceremony',
    teluguTitle: 'పెళ్ళికొడుకు సంబరం',
    subtitle: 'Traditional groom-to-be ceremony with sacred rituals & blessings',
    category: 'pellikoduku',
    src: asset('assets/pellikoduku.webp'),
    badge: 'Pelli Koduku',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'pk-namaste',
    title: 'The Groom · Seeking Blessings',
    teluguTitle: 'శుభారంభం · ఆశీస్సులు',
    subtitle: 'Bhuvan seated with folded hands in reverence and gratitude',
    category: 'pellikoduku',
    src: asset('assets/gallery/A25I8942.webp'),
    badge: 'Pelli Koduku',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'pk-elegance',
    title: 'Groom Elegance',
    teluguTitle: 'వరుని దర్పం',
    subtitle: 'Bhuvan in celebration attire for the pre-wedding celebrations',
    category: 'pellikoduku',
    src: asset('assets/gallery/A25I9108.webp'),
    badge: 'Pelli Koduku',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },

  // --- Pelli Kuturu Collection ---
  {
    id: 'pku-main',
    title: 'Pelli Kuturu Ceremony',
    teluguTitle: 'పెళ్ళికూతురు వేడుక',
    subtitle: 'Mangalasnanam, radiant bridal rites & cherished family affection',
    category: 'pellikuthuru',
    src: asset('assets/pellikuthuru.webp'),
    badge: 'Pelli Kuturu',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'pku-haldi-bride',
    title: 'Haldi Snanam · Radiant Grace',
    teluguTitle: 'హల్దీ స్నానం · వధువు కాంతి',
    subtitle: 'Manasa glowing during traditional turmeric water ceremony',
    category: 'pellikuthuru',
    src: asset('assets/haldi_bride.webp'),
    badge: 'Pelli Kuturu',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'pku-namaste',
    title: 'The Bride · Sacred Devotion',
    teluguTitle: 'వధువు నమస్కారం',
    subtitle: 'Manasa seated in quiet grace offering prayers for marital bliss',
    category: 'pellikuthuru',
    src: asset('assets/gallery/A25I8939.webp'),
    badge: 'Pelli Kuturu',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'pku-grace',
    title: 'Bridal Splendor',
    teluguTitle: 'వధువు సౌందర్యం',
    subtitle: 'Manasa adorned in auspicious silk saree holding sacred dravyam',
    category: 'pellikuthuru',
    src: asset('assets/gallery/A25I8862.webp'),
    badge: 'Pelli Kuturu',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },

  // --- Ceremonies & Couple Festivities ---
  {
    id: 'cp-prayer',
    title: 'Auspicious Beginnings',
    teluguTitle: 'మంగళ ప్రార్థన',
    subtitle: 'Bhuvan & Manasa seated together in prayer during wedding rituals',
    category: 'ceremonies',
    src: asset('assets/gallery/A25I8946.webp'),
    badge: 'Holy Ritual',
    width: 1800,
    height: 1274,
    aspect: 'landscape',
  },
  {
    id: 'cp-harmony',
    title: 'Together in Harmony',
    teluguTitle: 'సమ్మోహన బంధం',
    subtitle: 'Two souls united in love and a lifetime of shared dreams',
    category: 'ceremonies',
    src: asset('assets/gallery/A25I9163.webp'),
    badge: 'Couple Portrait',
    width: 1800,
    height: 1200,
    aspect: 'landscape',
  },
  {
    id: 'cp-bouquet',
    title: 'Blossoms of Love',
    teluguTitle: 'ప్రేమ పుష్పాలు',
    subtitle: 'Bhuvan & Manasa holding celebratory floral bouquet',
    category: 'ceremonies',
    src: asset('assets/gallery/A25I9462.webp'),
    badge: 'Cherished Moments',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'cp-smiles',
    title: 'Smiles of Joy',
    teluguTitle: 'చిరునవ్వుల వేడుక',
    subtitle: 'Joyful smiles anticipating the sacred wedding day',
    category: 'ceremonies',
    src: asset('assets/gallery/A25I9111.webp'),
    badge: 'Forever Us',
    width: 1200,
    height: 1800,
    aspect: 'portrait',
  },
  {
    id: 'cp-fun-ride',
    title: 'Fun Ride & Laughter',
    teluguTitle: 'ఆనంద తరంగాలు',
    subtitle: 'Candid smiles and playful joy on the celebration ride',
    category: 'ceremonies',
    src: asset('assets/gallery/bhuvan_manasa_fun-ride.webp'),
    badge: 'Candid Joy',
    width: 1148,
    height: 1370,
    aspect: 'portrait',
  },
  {
    id: 'cp-haldi',
    title: 'Haldi Celebration',
    teluguTitle: 'హల్దీ వేడుక',
    subtitle: 'Golden turmeric ceremonies filled with music & playful laughter',
    category: 'ceremonies',
    src: asset('assets/haldi.webp'),
    badge: 'Haldi',
    width: 1200,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 'cp-mehendi',
    title: 'Mehendi Radiance',
    teluguTitle: 'మెహెందీ రంగులు',
    subtitle: 'Intricate henna designs symbolizing auspicious love and affection',
    category: 'ceremonies',
    src: asset('assets/mehendi.webp'),
    badge: 'Mehendi',
    width: 1200,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 'cp-sangeeth',
    title: 'Sangeeth Musical Night',
    teluguTitle: 'సంగీత్ రాత్రి',
    subtitle: 'Dance, music, and electrifying family celebration under the stars',
    category: 'ceremonies',
    src: asset('assets/sangeeth.webp'),
    badge: 'Sangeeth',
    width: 1200,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 'cp-wedding',
    title: 'The Sacred Wedding Muhurtham',
    teluguTitle: 'కళ్యాణ మహోత్సవం',
    subtitle: 'Jeelakarra Bellam & Mangalasutra dharana at the auspicious hour',
    category: 'ceremonies',
    src: asset('assets/wedding.webp'),
    badge: 'Muhurtham',
    width: 1200,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 'cp-wedding-rituals',
    title: 'Seven Sacred Vows',
    teluguTitle: 'సప్తపది ప్రమాణాలు',
    subtitle: 'Walking around the sacred fire taking eternal vows of companionship',
    category: 'ceremonies',
    src: asset('assets/weddding1.webp'),
    badge: 'Kalyanam',
    width: 1200,
    height: 1600,
    aspect: 'portrait',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Celebrations', icon: '✨' },
  { id: 'live', label: 'YouTube Live', icon: '🔴' },
  { id: 'videos', label: 'Reels & Videos', icon: '🎥' },
  { id: 'pellikoduku', label: 'Pelli Koduku', icon: '🌸' },
  { id: 'pellikuthuru', label: 'Pelli Kuturu', icon: '🌺' },
  { id: 'ceremonies', label: 'Ceremonies', icon: '💍' },
];

function GalleryPage({
  musicPlaying,
  onToggleMusic,
  isDark,
  onToggleTheme,
  onBackToInvitation,
  onNavigateToAccommodation,
  onPauseMusic,
  onResumeMusic,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});

  const youtubeLiveConfig = (
    import.meta.env.VITE_YOUTUBE_LIVE_URL ||
    import.meta.env.VITE_YOUTUBE_LIVE_ID ||
    ''
  ).trim();
  const liveVideoId = parseYouTubeVideoId(youtubeLiveConfig);

  useScrollReveal(activeCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
    const prevTitle = document.title;
    document.title = 'Wedding Gallery & Videos | Bhuvan & Manasa';

    // Support deep-linking to #live or #youtube-live or #videos
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('live')) {
        setActiveCategory('live');
        setTimeout(() => {
          const el = document.getElementById('youtube-live');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else if (hash.includes('video')) {
        setActiveCategory('videos');
      }
    }

    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Filter items
  const showLive = activeCategory === 'all' || activeCategory === 'live';
  const showVideos = activeCategory === 'all' || activeCategory === 'videos';
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return GALLERY_ITEMS;
    if (activeCategory === 'videos' || activeCategory === 'live') return [];
    return GALLERY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleVideoPlay = (id) => {
    setPlayingVideoId(id);
    // Pause other videos
    Object.keys(videoRefs.current).forEach((key) => {
      if (key !== id && videoRefs.current[key]) {
        videoRefs.current[key].pause();
      }
    });
    // Pause background wedding music while video plays
    if (onPauseMusic) {
      onPauseMusic();
    } else if (musicPlaying && onToggleMusic) {
      onToggleMusic();
    }
  };

  const handleVideoPauseOrEnd = (id) => {
    if (playingVideoId === id) {
      setPlayingVideoId(null);
      if (onResumeMusic) {
        onResumeMusic();
      }
    }
  };

  // Cleanup: resume background music if unmounting while playing video
  useEffect(() => {
    return () => {
      if (onResumeMusic && playingVideoId) {
        onResumeMusic();
      }
    };
  }, [onResumeMusic, playingVideoId]);

  // Lightbox navigation
  const openLightbox = (photo) => {
    setActivePhoto(photo);
  };

  const closeLightbox = useCallback(() => {
    setActivePhoto(null);
  }, []);

  const showNextPhoto = useCallback(() => {
    if (!activePhoto) return;
    const list = filteredPhotos.length > 0 ? filteredPhotos : GALLERY_ITEMS;
    const currentIndex = list.findIndex((item) => item.id === activePhoto.id);
    if (currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % list.length;
      setActivePhoto(list[nextIndex]);
    }
  }, [activePhoto, filteredPhotos]);

  const showPrevPhoto = useCallback(() => {
    if (!activePhoto) return;
    const list = filteredPhotos.length > 0 ? filteredPhotos : GALLERY_ITEMS;
    const currentIndex = list.findIndex((item) => item.id === activePhoto.id);
    if (currentIndex >= 0) {
      const prevIndex = (currentIndex - 1 + list.length) % list.length;
      setActivePhoto(list[prevIndex]);
    }
  }, [activePhoto, filteredPhotos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!activePhoto) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, closeLightbox, showNextPhoto, showPrevPhoto]);

  return (
    <div className="gallery-page">
      <MusicToggle playing={musicPlaying} onToggle={onToggleMusic} />

      {/* Top Header */}
      <header className="gallery-topbar">
        <button
          type="button"
          className="gallery-nav-link"
          onClick={onBackToInvitation}
        >
          ← Invitation
        </button>

        <div className="gallery-topbar-actions">
          {onNavigateToAccommodation && (
            <button
              type="button"
              className="gallery-nav-link"
              onClick={onNavigateToAccommodation}
            >
              విడిది ఇల్లు (Stay)
            </button>
          )}

          <button
            className="theme-toggle"
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={String(isDark)}
            onClick={onToggleTheme}
          >
            {isDark ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <main className="gallery-main">
        {/* Hero Section */}
        <section className="gallery-hero reveal">
          <p className="eyebrow">CELEBRATIONS &amp; MEMORIES · కళ్యాణ సంబరాలు</p>
          <h1>Wedding Gallery &amp; Videos</h1>
          <p className="gallery-subtitle">
            Relive the sacred ceremonies, cinematic invitation films, and timeless joy of Bhuvan &amp; Manasa.
          </p>

          <svg className="acc-ornament" viewBox="0 0 260 26" aria-hidden="true" focusable="false">
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
        </section>

        {/* Filter Tabs */}
        <div className="gallery-tabs-wrap reveal">
          <div className="gallery-filter-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`gallery-filter-tab${activeCategory === cat.id ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="tab-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* YOUTUBE LIVE SECTION */}
        {showLive && (
          <section id="youtube-live" className="gallery-live-section reveal">
            <div className="section-title-wrap">
              <span className="section-eyebrow live-eyebrow">
                <span className="live-dot-pulse" aria-hidden="true" />
                OFFICIAL LIVE STREAM · ప్రత్యక్ష ప్రసారం
              </span>
              <h2>Wedding Ceremony Live Broadcast</h2>
              <p className="gallery-live-sub">
                Watch the sacred Muhurtham ceremonies live from SVPC Conventions, Rajamahendravaram.
              </p>
            </div>

            <div className="gallery-live-card">
              {liveVideoId ? (
                <>
                  <div className="gallery-live-player-wrap">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${liveVideoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                      title="Bhuvan & Manasa Wedding Live Stream · ప్రత్యక్ష ప్రసారం"
                      className="gallery-live-iframe"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="gallery-live-card-meta">
                    <div className="gallery-live-badge-row">
                      <span className="live-active-tag">
                        <span className="live-dot-blink" />
                        LIVE STREAM ACTIVE
                      </span>
                      <span className="live-date-tag">📅 12 Dec 2026 · 8:26 PM IST</span>
                    </div>
                    <h3 className="gallery-live-title">
                      Bhuvan &amp; Manasa Kalyana Mahotsavam Live
                    </h3>
                    <p className="gallery-live-desc">
                      Tune into the live celebration and join both families in celebrating the sacred union.
                    </p>
                    <div className="gallery-live-actions">
                      <a
                        href={`https://www.youtube.com/watch?v=${liveVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gallery-live-btn"
                        onClick={() => {
                          if (onPauseMusic) onPauseMusic();
                        }}
                      >
                        <span aria-hidden="true">▶</span> Open in YouTube App
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="gallery-live-placeholder">
                  <div className="live-placeholder-icon" aria-hidden="true">
                    🔴
                  </div>
                  <span className="live-placeholder-badge">
                    WEDDING CEREMONY LIVE STREAM · ప్రత్యక్ష ప్రసారం
                  </span>
                  <h3 className="live-placeholder-title">
                    Sacred Wedding Live Stream
                  </h3>
                  <p className="live-placeholder-telugu">
                    శ్రీ భువన్ తేజ &amp; మానస కళ్యాణ మహోత్సవ ప్రత్యక్ష ప్రసారం
                  </p>
                  <div className="live-placeholder-details">
                    <div className="live-detail-item">
                      <span className="live-detail-icon">📅</span>
                      <div>
                        <strong>Date &amp; Muhurtham</strong>
                        <p>Saturday, 12 December 2026 · 8:26 PM IST</p>
                      </div>
                    </div>
                    <div className="live-detail-item">
                      <span className="live-detail-icon">🏛️</span>
                      <div>
                        <strong>Sacred Venue</strong>
                        <p>SVPC Conventions, Rajamahendravaram</p>
                      </div>
                    </div>
                  </div>
                  <p className="live-placeholder-note">
                    ✨ The official YouTube live stream will broadcast right here during the wedding ceremony. Stay tuned to witness the auspicious Jeelakarra Bellam &amp; Mangalasutra Dharana!
                  </p>
                  <div className="live-placeholder-hint">
                    <code>💡 Set VITE_YOUTUBE_LIVE_URL in .env to activate live streaming</code>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* VIDEOS SECTION */}
        {showVideos && (
          <section className="gallery-videos-section reveal">
            <div className="section-title-wrap">
              <span className="section-eyebrow">CINEMATIC INVITATIONS &amp; ANIMATION</span>
              <h2>Wedding Films &amp; Videos</h2>
            </div>

            <div className="gallery-videos-grid">
              {WEDDING_VIDEOS.map((vid) => (
                <div key={vid.id} className="gallery-video-card">
                  <div className="video-card-player-wrap">
                    <video
                      ref={(el) => {
                        videoRefs.current[vid.id] = el;
                      }}
                      src={vid.src}
                      poster={vid.poster}
                      playsInline
                      webkit-playsinline="true"
                      x5-playsinline="true"
                      preload="none"
                      controls
                      onPlay={() => handleVideoPlay(vid.id)}
                      onPause={() => handleVideoPauseOrEnd(vid.id)}
                      onEnded={() => handleVideoPauseOrEnd(vid.id)}
                      className="gallery-video-media"
                    />
                    <span className="video-badge-pill">{vid.badge}</span>
                  </div>

                  <div className="video-card-meta">
                    <span className="video-telugu-title">{vid.teluguTitle}</span>
                    <h3 className="video-main-title">{vid.title}</h3>
                    <p className="video-copy">{vid.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PHOTOS SECTION */}
        {filteredPhotos.length > 0 && (
          <section className="gallery-photos-section reveal">
            <div className="section-title-wrap">
              <span className="section-eyebrow">CEREMONY &amp; EVENT PHOTOGRAPHY</span>
              <h2>Wedding Ceremonies Gallery</h2>
            </div>

            <div className="gallery-photos-masonry">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`gallery-photo-card is-${photo.aspect}`}
                  onClick={() => openLightbox(photo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(photo);
                    }
                  }}
                >
                  <div className="gallery-photo-frame">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      width={photo.width}
                      height={photo.height}
                      className="gallery-photo-img"
                    />
                    <div className="gallery-photo-overlay">
                      <span className="photo-badge">{photo.badge}</span>
                      <h4 className="photo-title">{photo.title}</h4>
                      <p className="photo-sub">{photo.subtitle}</p>
                      <span className="photo-zoom-hint">🔍 Tap to Zoom</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* LIGHTBOX MODAL */}
      {activePhoto && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
        >
          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close photo view"
            >
              ✕
            </button>

            <button
              type="button"
              className="lightbox-nav-btn is-prev"
              onClick={showPrevPhoto}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <button
              type="button"
              className="lightbox-nav-btn is-next"
              onClick={showNextPhoto}
              aria-label="Next photo"
            >
              ›
            </button>

            <div className="lightbox-img-wrap">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="lightbox-img"
              />
            </div>

            <div className="lightbox-caption">
              <span className="lightbox-badge">{activePhoto.badge}</span>
              <h3 className="lightbox-title">{activePhoto.title}</h3>
              <p className="lightbox-sub">{activePhoto.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="gallery-footer">
        <p>Bhuvan &amp; Manasa · 12 December 2026</p>
        <button
          type="button"
          className="gallery-footer-link"
          onClick={onBackToInvitation}
        >
          ← Back to Wedding Invitation
        </button>
      </footer>
    </div>
  );
}

export default GalleryPage;
