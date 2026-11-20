import { useMemo } from 'react';

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
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/*
 * =========================================================================
 * WEDDING PHOTO GALLERY (TEMPORARILY COMMENTED OUT PER USER REQUEST)
 * Un-comment this block if the photo celebration collage is re-enabled later.
 * =========================================================================
 *
 * const BASE = import.meta.env.BASE_URL || './';
 * const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
 * const asset = (p) => `${cleanBase}${p.replace(/^\/+/, '')}`;
 *
 * const GALLERY_IMAGES = [
 *   {
 *     id: 'celebration-prayer',
 *     src: asset('assets/gallery/A25I8946.webp'),
 *     alt: 'Bhuvan and Manasa seated together in prayer during auspicious wedding rituals',
 *     title: 'Auspicious Beginnings',
 *     subtitle: 'Bhuvan & Manasa • Seated in sacred prayer',
 *     badge: 'Holy Matrimony',
 *     orientation: 'landscape',
 *     width: 1800,
 *     height: 1274,
 *     objectPosition: 'center 28%',
 *     desktopClass: 'pos-1',
 *     mobileOrderClass: 'order-m-1',
 *   },
 *   {
 *     id: 'celebration-harmony',
 *     src: asset('assets/gallery/A25I9163.webp'),
 *     alt: 'Bhuvan and Manasa standing together in harmony and celebratory glow',
 *     title: 'Together in Harmony',
 *     subtitle: 'Two souls, one timeless journey',
 *     badge: 'Celebration',
 *     orientation: 'landscape',
 *     width: 1800,
 *     height: 1200,
 *     objectPosition: 'center 22%',
 *     desktopClass: 'pos-2',
 *     mobileOrderClass: 'order-m-4',
 *   },
 *   {
 *     id: 'groom-namaste',
 *     src: asset('assets/gallery/A25I8942.webp'),
 *     alt: 'Groom Bhuvan seated with folded hands in namaste seeking blessings',
 *     title: 'The Groom',
 *     subtitle: 'Bhuvan • Seeking sacred blessings',
 *     badge: 'Pelli Koduku',
 *     orientation: 'portrait',
 *     width: 1200,
 *     height: 1800,
 *     objectPosition: 'center 25%',
 *     desktopClass: 'pos-3',
 *     mobileOrderClass: 'order-m-2',
 *   },
 *   {
 *     id: 'couple-bouquet',
 *     src: asset('assets/gallery/A25I9462.webp'),
 *     alt: 'Bhuvan and Manasa holding flower bouquet together with joyful smiles',
 *     title: 'Blossoms of Love',
 *     subtitle: 'Floral joy & warm wishes',
 *     badge: 'Cherished Moments',
 *     orientation: 'portrait',
 *     width: 1200,
 *     height: 1800,
 *     objectPosition: 'center 22%',
 *     desktopClass: 'pos-4',
 *     mobileOrderClass: 'order-m-7',
 *   },
 *   {
 *     id: 'bride-namaste',
 *     src: asset('assets/gallery/A25I8939.webp'),
 *     alt: 'Bride Manasa seated with folded hands in namaste radiant in grace',
 *     title: 'The Bride',
 *     subtitle: 'Manasa • Radiant in sacred grace',
 *     badge: 'Pelli Kuturu',
 *     orientation: 'portrait',
 *     width: 1200,
 *     height: 1800,
 *     objectPosition: 'center 25%',
 *     desktopClass: 'pos-5',
 *     mobileOrderClass: 'order-m-3',
 *   },
 *   {
 *     id: 'groom-elegance',
 *     src: asset('assets/gallery/A25I9108.webp'),
 *     alt: 'Groom Bhuvan standing handsome in black wedding celebration suit',
 *     title: 'Groom Elegance',
 *     subtitle: 'Bhuvan in celebration attire',
 *     badge: 'Wedding Splendor',
 *     orientation: 'portrait',
 *     width: 1200,
 *     height: 1800,
 *     objectPosition: 'center 18%',
 *     desktopClass: 'pos-6',
 *     mobileOrderClass: 'order-m-5',
 *   },
 *   {
 *     id: 'couple-smiles',
 *     src: asset('assets/gallery/A25I9111.webp'),
 *     alt: 'Bhuvan and Manasa standing smiling together warmly',
 *     title: 'Smiles of Joy',
 *     subtitle: 'Every smile a cherished chapter',
 *     badge: 'Forever Us',
 *     orientation: 'portrait',
 *     width: 1200,
 *     height: 1800,
 *     objectPosition: 'center 20%',
 *     desktopClass: 'pos-7',
 *     mobileOrderClass: 'order-m-8',
 *   },
 *   {
 *     id: 'bridal-grace',
 *     src: asset('assets/gallery/A25I8862.webp'),
 *     alt: 'Bride Manasa standing in traditional silk saree holding auspicious coconut',
 *     title: 'Bridal Grace',
 *     subtitle: 'Manasa with auspicious dravyam',
 *     badge: 'Traditional Splendor',
 *     orientation: 'portrait',
 *     width: 1200,
 *     height: 1800,
 *     objectPosition: 'center 20%',
 *     desktopClass: 'pos-8',
 *     mobileOrderClass: 'order-m-6',
 *   },
 * ];
 */

function Gallery({ onPauseMusic }) {
  // Read configured YouTube Live URL or video ID from .env
  const youtubeLiveConfig = (
    import.meta.env.VITE_YOUTUBE_LIVE_URL ||
    import.meta.env.VITE_YOUTUBE_LIVE_ID ||
    ''
  ).trim();

  const liveVideoId = useMemo(() => parseYouTubeVideoId(youtubeLiveConfig), [youtubeLiveConfig]);

  return (
    <section id="celebration" className="gallery-section section-paper">
      {/* Anchor aliases for backward compatibility with #gallery, #live, and #youtube-live */}
      <span id="gallery" style={{ position: 'absolute', top: '-80px' }} aria-hidden="true" />
      <span id="live" style={{ position: 'absolute', top: '-80px' }} aria-hidden="true" />
      <span id="youtube-live" style={{ position: 'absolute', top: '-80px' }} aria-hidden="true" />

      <div className="section-inner wide reveal">
        <p className="eyebrow live-eyebrow">
          <span className="live-dot-pulse" aria-hidden="true" />
          WEDDING LIVE STREAM · ప్రత్యక్ష ప్రసారం
        </p>
        <h2>Our Celebration</h2>
        <p className="gallery-lead">
          Watch the sacred Muhurtham ceremonies and auspicious wedding rituals live from SVPC Conventions, Rajamahendravaram.
        </p>

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
    </section>
  );
}

export default Gallery;
