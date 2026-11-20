import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const asset = (p) => {
  const clean = p.replace(/^\/+/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    try {
      return new URL(clean, new URL(cleanBase, window.location.origin)).href;
    } catch {
      return `${window.location.origin}/${clean}`;
    }
  }
  return `/${clean}`;
};

/**
 * Parses any YouTube link into a clean 11-character video ID.
 * Supports:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://youtube.com/live/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - Raw 11-char ID (dQw4w9WgXcQ)
 */
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
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/
    );
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * 8 Celebration Gallery Images:
 * - 2 Landscape photos of the couple together (1800x1274 & 1800x1200)
 * - 6 Portrait photos of ceremonies and wedding attire (1200x1800)
 *
 * Each image specifies its native resolution, orientation, and focal point
 * for pixel-perfect alignment across iOS/Android mobile and desktop/4K displays.
 */
const GALLERY_IMAGES = [
  // --- Pair 1: Signature Landscape Celebrations ---
  {
    id: 'celebration-prayer',
    src: asset('assets/gallery/A25I8946.webp'),
    alt: 'Bhuvan and Manasa seated together in prayer during auspicious wedding rituals',
    title: 'Auspicious Beginnings',
    subtitle: 'Bhuvan & Manasa • Seated in sacred prayer',
    badge: 'Holy Matrimony',
    orientation: 'landscape',
    width: 1800,
    height: 1274,
    objectPosition: 'center 28%',
    desktopClass: 'pos-1',
    mobileOrderClass: 'order-m-1',
  },
  {
    id: 'celebration-harmony',
    src: asset('assets/gallery/A25I9163.webp'),
    alt: 'Bhuvan and Manasa standing together in harmony and celebratory glow',
    title: 'Together in Harmony',
    subtitle: 'Two souls, one timeless journey',
    badge: 'Celebration',
    orientation: 'landscape',
    width: 1800,
    height: 1200,
    objectPosition: 'center 22%',
    desktopClass: 'pos-2',
    mobileOrderClass: 'order-m-4',
  },

  // --- Row 2 Portraits: Groom Namaste, Couple Bouquet, Bride Namaste ---
  {
    id: 'groom-namaste',
    src: asset('assets/gallery/A25I8942.webp'),
    alt: 'Groom Bhuvan seated with folded hands in namaste seeking blessings',
    title: 'The Groom',
    subtitle: 'Bhuvan • Seeking sacred blessings',
    badge: 'Pelli Koduku',
    orientation: 'portrait',
    width: 1200,
    height: 1800,
    objectPosition: 'center 25%',
    desktopClass: 'pos-3',
    mobileOrderClass: 'order-m-2',
  },
  {
    id: 'couple-bouquet',
    src: asset('assets/gallery/A25I9462.webp'),
    alt: 'Bhuvan and Manasa holding flower bouquet together with joyful smiles',
    title: 'Blossoms of Love',
    subtitle: 'Floral joy & warm wishes',
    badge: 'Cherished Moments',
    orientation: 'portrait',
    width: 1200,
    height: 1800,
    objectPosition: 'center 22%',
    desktopClass: 'pos-4',
    mobileOrderClass: 'order-m-7',
  },
  {
    id: 'bride-namaste',
    src: asset('assets/gallery/A25I8939.webp'),
    alt: 'Bride Manasa seated with folded hands in namaste radiant in grace',
    title: 'The Bride',
    subtitle: 'Manasa • Radiant in sacred grace',
    badge: 'Pelli Kuturu',
    orientation: 'portrait',
    width: 1200,
    height: 1800,
    objectPosition: 'center 25%',
    desktopClass: 'pos-5',
    mobileOrderClass: 'order-m-3',
  },

  // --- Row 3 Portraits: Groom Elegance, Couple Smiles, Bridal Grace ---
  {
    id: 'groom-elegance',
    src: asset('assets/gallery/A25I9108.webp'),
    alt: 'Groom Bhuvan standing handsome in black wedding celebration suit',
    title: 'Groom Elegance',
    subtitle: 'Bhuvan in celebration attire',
    badge: 'Wedding Splendor',
    orientation: 'portrait',
    width: 1200,
    height: 1800,
    objectPosition: 'center 18%',
    desktopClass: 'pos-6',
    mobileOrderClass: 'order-m-5',
  },
  {
    id: 'couple-smiles',
    src: asset('assets/gallery/A25I9111.webp'),
    alt: 'Bhuvan and Manasa standing smiling together warmly',
    title: 'Smiles of Joy',
    subtitle: 'Every smile a cherished chapter',
    badge: 'Forever Us',
    orientation: 'portrait',
    width: 1200,
    height: 1800,
    objectPosition: 'center 20%',
    desktopClass: 'pos-7',
    mobileOrderClass: 'order-m-8',
  },
  {
    id: 'bridal-grace',
    src: asset('assets/gallery/A25I8862.webp'),
    alt: 'Bride Manasa standing in traditional silk saree holding auspicious coconut',
    title: 'Bridal Grace',
    subtitle: 'Manasa with auspicious dravyam',
    badge: 'Traditional Splendor',
    orientation: 'portrait',
    width: 1200,
    height: 1800,
    objectPosition: 'center 20%',
    desktopClass: 'pos-8',
    mobileOrderClass: 'order-m-6',
  },
];

function Gallery({ onPauseMusic }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [isCaptureShielded, setIsCaptureShielded] = useState(false);
  const [protectionToast, setProtectionToast] = useState('');
  const toastTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);

  // Read configured YouTube Live URL or video ID from .env
  const youtubeLiveConfig = (
    import.meta.env.VITE_YOUTUBE_LIVE_URL ||
    import.meta.env.VITE_YOUTUBE_LIVE_ID ||
    ''
  ).trim();

  const liveVideoId = useMemo(() => parseYouTubeVideoId(youtubeLiveConfig), [youtubeLiveConfig]);

  const showProtectionToast = useCallback(
    (msg = '🔒 Protected Moments · Wedding photos cannot be downloaded or captured.') => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setProtectionToast(msg);
      toastTimeoutRef.current = setTimeout(() => {
        setProtectionToast('');
      }, 2600);
    },
    []
  );

  const handlePhotoContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      showProtectionToast('🔒 Private Wedding Collection · Saving and downloading photos is disabled.');
    },
    [showProtectionToast]
  );

  const handlePhotoDragStart = useCallback((e) => {
    e.preventDefault();
  }, []);

  const openLightbox = (index) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActivePhotoIndex(null);
    setIsCaptureShielded(false);
  }, []);

  const showNext = useCallback(() => {
    setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null));
  }, []);

  const showPrev = useCallback(() => {
    setActivePhotoIndex((prev) =>
      prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null
    );
  }, []);

  // Keyboard navigation, screenshot blocking & snipping tool defense
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape closes lightbox
      if (e.key === 'Escape') {
        closeLightbox();
        return;
      }
      // Left / Right arrows navigate
      if (activePhotoIndex !== null) {
        if (e.key === 'ArrowRight') {
          showNext();
          return;
        }
        if (e.key === 'ArrowLeft') {
          showPrev();
          return;
        }
      }

      // 1. PrintScreen key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setIsCaptureShielded(true);
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        showProtectionToast('🔒 Screen Capture Blocked · Photographs of Bhuvan & Manasa are protected.');
        setTimeout(() => setIsCaptureShielded(false), 2400);
        return;
      }

      // 2. Block Print (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        showProtectionToast('🔒 Printing Disabled · Wedding photography is protected.');
        return;
      }

      // 3. Block Save Page / Image (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        showProtectionToast('🔒 Saving Disabled · Wedding photography is protected.');
        return;
      }

      // 4. Mac Screenshot shortcuts (Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5)
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        setIsCaptureShielded(true);
        showProtectionToast('🔒 Screenshot Blocked · Wedding photos are protected.');
        setTimeout(() => setIsCaptureShielded(false), 2400);
        return;
      }

      // 5. Windows Snipping shortcut (Win+Shift+S / Ctrl+Shift+S)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setIsCaptureShielded(true);
        showProtectionToast('🔒 Screen Clipping Blocked · Wedding photos are protected.');
        setTimeout(() => setIsCaptureShielded(false), 2400);
        return;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        setIsCaptureShielded(true);
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        showProtectionToast('🔒 Screen Capture Blocked · Photographs of Bhuvan & Manasa are protected.');
        setTimeout(() => setIsCaptureShielded(false), 2400);
      }
    };

    // When Snipping Tool or screenshot utility takes focus away from browser
    const handleWindowBlur = () => {
      if (activePhotoIndex !== null) {
        setIsCaptureShielded(true);
      }
    };

    const handleWindowFocus = () => {
      setIsCaptureShielded(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    const originalOverflow = document.body.style.overflow;
    if (activePhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.body.style.overflow = originalOverflow;
    };
  }, [activePhotoIndex, closeLightbox, showNext, showPrev, showProtectionToast]);

  // Touch swipe support for mobile lightbox
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;
    touchStartXRef.current = null;

    if (deltaX > 45) {
      showNext();
    } else if (deltaX < -45) {
      showPrev();
    }
  };

  const activePhoto = activePhotoIndex !== null ? GALLERY_IMAGES[activePhotoIndex] : null;

  return (
    <section id="celebration" className="gallery-section section-paper">
      {/* Anchor aliases for backward compatibility with #gallery, #live, and #youtube-live */}
      <span id="gallery" style={{ position: 'absolute', top: '-80px' }} aria-hidden="true" />
      <span id="live" style={{ position: 'absolute', top: '-80px' }} aria-hidden="true" />
      <span id="youtube-live" style={{ position: 'absolute', top: '-80px' }} aria-hidden="true" />

      <div className="section-inner wide reveal">
        <p className="eyebrow">A FEW MOMENTS OF JOY</p>
        <h2>Our Celebration</h2>
        <p className="gallery-lead">
          Snapshots of warmth, laughter, and timeless traditions on our journey to forever.
        </p>

        {/* 1. ORIGINAL 8 CELEBRATION PHOTOS OF BRIDE & GROOM */}
        <div className="photo-collage" role="region" aria-label="Wedding Photo Celebration Gallery">
          {GALLERY_IMAGES.map((img, index) => {
            const isLandscape = img.orientation === 'landscape';
            return (
              <button
                type="button"
                key={img.id}
                className={`collage-item ${isLandscape ? 'is-landscape' : 'is-portrait'} ${img.desktopClass} ${img.mobileOrderClass}`}
                onClick={() => openLightbox(index)}
                onContextMenu={handlePhotoContextMenu}
                onDragStart={handlePhotoDragStart}
                aria-label={`View ${img.title} photo full size`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  width={img.width}
                  height={img.height}
                  style={{ objectPosition: img.objectPosition }}
                  sizes={
                    isLandscape
                      ? '(max-width: 600px) 95vw, (max-width: 900px) 94vw, 580px'
                      : '(max-width: 600px) 46vw, (max-width: 900px) 46vw, 380px'
                  }
                />
                {/* Invisible Anti-Download Protective Shield */}
                <div
                  className="photo-protect-shield"
                  aria-hidden="true"
                  onContextMenu={handlePhotoContextMenu}
                  onDragStart={handlePhotoDragStart}
                />
                <div className="collage-card-overlay">
                  <div className="collage-card-top-bar">
                    <span className="collage-badge">{img.badge}</span>
                    <span className="collage-expand-btn" aria-hidden="true" title="Expand photo">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </span>
                  </div>
                  <div className="collage-caption">
                    <h3 className="collage-title">{img.title}</h3>
                    <p className="collage-subtitle">{img.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. YOUTUBE LIVE STREAM SECTION PLACED DIRECTLY UNDER THE CELEBRATION PHOTOS */}
        <div className="celebration-live-wrapper" style={{ marginTop: 'clamp(48px, 6vw, 72px)' }}>
          <div className="celebration-live-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p className="eyebrow live-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="live-dot-pulse" aria-hidden="true" />
              WEDDING LIVE STREAM · ప్రత్యక్ష ప్రసారం
            </p>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              color: 'var(--wine)',
              margin: '6px 0',
            }}>
              Wedding Ceremony Live Broadcast
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'var(--ink)',
              opacity: 0.88,
              maxWidth: '640px',
              margin: '0 auto',
            }}>
              Watch the sacred Muhurtham ceremonies and auspicious wedding rituals live from SVPC Conventions, Rajamahendravaram.
            </p>
          </div>

          {/* Global standard 16:9 responsive YouTube Live player or luxury fallback card */}
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
        </div>
      </div>

      {/* ===== INTERACTIVE FULLSCREEN LIGHTBOX MODAL WITH FULL SCREENSHOT & COPY PROTECTION ===== */}
      {activePhoto && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activePhoto.title} preview`}
          onClick={closeLightbox}
          onContextMenu={handlePhotoContextMenu}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close photo preview"
              title="Close preview (Esc)"
            >
              &times;
            </button>

            <button
              type="button"
              className="lightbox-nav-btn lightbox-prev-btn"
              onClick={showPrev}
              aria-label="Previous photo"
              title="Previous photo (Left arrow)"
            >
              &#8249;
            </button>

            <div className={`lightbox-stage${isCaptureShielded ? ' is-shielded' : ''}`}>
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                decoding="async"
                draggable="false"
                onContextMenu={handlePhotoContextMenu}
                onDragStart={handlePhotoDragStart}
              />

              {/* Protective Shield Overlay (interception against right-clicks / long-presses) */}
              <div
                className="photo-protect-shield"
                aria-hidden="true"
                onContextMenu={handlePhotoContextMenu}
                onDragStart={handlePhotoDragStart}
              />

              {/* Subtle Luxury Watermark Overlay */}
              <div className="lightbox-watermark" aria-hidden="true">
                <span className="watermark-text">
                  💍 Bhuvan &amp; Manasa · Sacred Matrimony · Protected Wedding Collection
                </span>
              </div>

              {/* Screen Capture Blocker Shield (triggers on PrintScreen, screenshot hotkey, or window blur/snipping) */}
              {isCaptureShielded && (
                <div className="lightbox-capture-shield" aria-hidden="true">
                  <div className="capture-shield-badge">
                    <span className="shield-icon">🔒</span>
                    <h4>Screen Capture Protected</h4>
                    <p>Wedding photos of Bhuvan &amp; Manasa cannot be screenshot or saved.</p>
                    <p className="capture-shield-telugu">శ్రీ భువన్ తేజ &amp; మానస వివాహ చిత్రాలు రక్షించబడ్డాయి</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="lightbox-nav-btn lightbox-next-btn"
              onClick={showNext}
              aria-label="Next photo"
              title="Next photo (Right arrow)"
            >
              &#8250;
            </button>

            <div className="lightbox-footer">
              <div className="lightbox-info">
                <h3 className="lightbox-title">{activePhoto.title}</h3>
                <p className="lightbox-subtitle">{activePhoto.subtitle}</p>
              </div>
              <span className="lightbox-counter">
                {activePhotoIndex + 1} / {GALLERY_IMAGES.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Photo Protection Toast */}
      {protectionToast && (
        <div className="photo-protect-toast" role="alert" aria-live="assertive">
          <span className="toast-icon">🛡️</span>
          <span className="toast-text">{protectionToast}</span>
        </div>
      )}
    </section>
  );
}

export default Gallery;
