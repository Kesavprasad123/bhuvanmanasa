import { useCallback, useEffect, useState } from 'react';
import { PROPERTIES } from '../data/accommodation';
import {
  bookingConfigured,
  isHostLoggedIn,
  logoutHost,
  restoreHostSession,
} from '../data/bookingStore';
import { HostLoginDialog } from './BookingControls';
import HostDashboard from './HostDashboard';
import MusicToggle from './MusicToggle';
import useScrollReveal from '../hooks/useScrollReveal';
import useWeddingMusic from '../hooks/useWeddingMusic';
import '../styles/accommodation.css';
import '../styles/booking.css';

/* ---------- decorative floral divider ---------- */
function Ornament({ className = '' }) {
  return (
    <svg className={`acc-ornament ${className}`} viewBox="0 0 260 26" aria-hidden="true" focusable="false">
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
  );
}

/* ---------- hand-drawn property artwork ---------- */
function StayArt({ variant, uid }) {
  const bgId = `acc-art-bg-${variant}-${uid}`;
  const glowId = `acc-art-glow-${variant}-${uid}`;
  const gold = '#e9cf9d';
  const soft = 'rgba(255, 248, 236, .78)';

  if (variant === 'svpc') {
    return (
      <svg className="acc-art" viewBox="0 0 400 210" role="img" aria-label="Illustration of the SVPC stay">
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4c5b47" />
            <stop offset="100%" stopColor="#2f3b30" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="rgba(233,207,157,.35)" />
            <stop offset="100%" stopColor="rgba(233,207,157,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="210" fill={`url(#${bgId})`} />
        <rect width="400" height="210" fill={`url(#${glowId})`} />
        <g stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round">
          {/* façade */}
          <path d="M70 170 V86 h260 v84" />
          <path d="M56 86 h288" />
          <path d="M64 70 h272 l-14 -16 H78 Z" />
          {/* columns */}
          <path d="M104 170 V96 M148 170 V96 M252 170 V96 M296 170 V96" />
          {/* entrance */}
          <path d="M170 170 v-42 a30 30 0 0 160 0 v42" />
          <path d="M200 170 v-58" strokeOpacity=".55" />
          {/* windows */}
          <path d="M116 122 v-12 a12 12 0 0 124 0 v12 Z" />
          <path d="M260 122 v-12 a12 12 0 0 124 0 v12 Z" />
          {/* steps */}
          <path d="M52 170 h296 M64 182 h272 M78 194 h244" strokeOpacity=".75" />
          {/* lamp posts */}
          <path d="M40 194 V120 M360 194 V120" strokeOpacity=".7" />
          <circle cx="40" cy="112" r="7" fill={gold} stroke="none" />
          <circle cx="360" cy="112" r="7" fill={gold} stroke="none" />
        </g>
        {/* festive toran string */}
        <g fill={gold} opacity=".9">
          <path d="M76 60 q124 34 248 0 l0 6 q-124 32 -248 0 Z" opacity=".55" />
          <circle cx="108" cy="68" r="3.5" />
          <circle cx="152" cy="76" r="3.5" />
          <circle cx="200" cy="79" r="4" />
          <circle cx="248" cy="76" r="3.5" />
          <circle cx="292" cy="68" r="3.5" />
        </g>
        <g fill={soft} opacity=".65">
          <circle cx="200" cy="34" r="3" />
          <circle cx="176" cy="44" r="2.2" />
          <circle cx="224" cy="44" r="2.2" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="acc-art" viewBox="0 0 400 210" role="img" aria-label="Illustration of Krishna Inn">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7d2c40" />
          <stop offset="100%" stopColor="#541d2d" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(240,214,164,.34)" />
          <stop offset="100%" stopColor="rgba(240,214,164,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="210" fill={`url(#${bgId})`} />
      <rect width="400" height="210" fill={`url(#${glowId})`} />
      <g stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round">
        {/* haveli block */}
        <path d="M96 174 V78 h208 v96" />
        <path d="M84 78 h232" />
        {/* central dome + finial */}
        <path d="M174 60 q26 -34 52 0 Z" />
        <path d="M200 43 v-7" />
        {/* side chhatris */}
        <path d="M120 78 q14 -22 28 0" />
        <path d="M252 78 q14 -22 28 0" />
        {/* arched doorway */}
        <path d="M174 174 v-44 a26 26 0 0 152 0 v44" />
        <path d="M200 174 v-66" strokeOpacity=".5" />
        {/* jharokha windows */}
        <path d="M114 132 v-16 a14 14 0 0 128 0 v16 Z" />
        <path d="M258 132 v-16 a14 14 0 0 128 0 v16 Z" />
        <path d="M128 132 v-30 M272 132 v-30" strokeOpacity=".55" />
        {/* balcony line */}
        <path d="M84 174 h232 M74 188 h252" strokeOpacity=".75" />
        {/* hanging lamps */}
        <path d="M150 78 v18 M250 78 v18" strokeOpacity=".7" />
        <circle cx="150" cy="102" r="7" fill={gold} stroke="none" />
        <circle cx="250" cy="102" r="7" fill={gold} stroke="none" />
        {/* side arches */}
        <path d="M46 174 v-40 a22 22 0 0 144 0 v40" strokeOpacity=".55" />
        <path d="M310 174 v-40 a22 22 0 0 144 0 v40" strokeOpacity=".55" />
      </g>
      <g fill={gold} opacity=".85">
        <path d="M200 22 l6.5 7 -6.5 7 -6.5 -7 Z" />
        <circle cx="200" cy="146" r="3.4" />
        <circle cx="144" cy="62" r="3" />
        <circle cx="256" cy="62" r="3" />
      </g>
      <g fill={soft} opacity=".6">
        <circle cx="60" cy="52" r="2.6" />
        <circle cx="340" cy="46" r="2.6" />
        <circle cx="366" cy="92" r="2" />
        <circle cx="34" cy="104" r="2" />
      </g>
    </svg>
  );
}

/** Resolves the root wedding invitation URL from the current window location. */
export function getHomeHref() {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname || '';
  const parent = pathname.replace(/\/accommodation(?:\/.*)?$/i, '');
  if (!parent || parent === '') return '/';
  return parent.endsWith('/') ? parent : `${parent}/`;
}

const getStoredTheme = () => {
  try {
    return localStorage.getItem('weddingTheme') === 'dark';
  } catch {
    return false;
  }
};

function Accommodation({
  musicPlaying: externalMusicPlaying,
  onToggleMusic: externalToggleMusic,
  isDark: externalIsDark,
  onToggleTheme: externalToggleTheme,
  onBackToInvitation,
  onNavigateToGallery,
} = {}) {
  const [homeHref, setHomeHref] = useState(getHomeHref);
  const [internalDark, setInternalDark] = useState(getStoredTheme);

  const isDark = externalIsDark !== undefined ? externalIsDark : internalDark;
  const toggleTheme =
    externalToggleTheme ||
    (() => {
      setInternalDark((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('weddingTheme', next ? 'dark' : 'light');
        } catch {}
        return next;
      });
    });

  // Background music handover: if parent provides external controls, use them!
  const localMusic = useWeddingMusic({ autoStartIfActive: !externalToggleMusic });
  const musicPlaying = externalMusicPlaying !== undefined ? externalMusicPlaying : localMusic.musicPlaying;
  const toggleMusic = externalToggleMusic || localMusic.toggleMusic;
  const audioRef = localMusic.audioRef;

  useEffect(() => {
    setHomeHref(getHomeHref());
  }, []);

  const handleBackToInvitation = useCallback(
    (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      if (onBackToInvitation) {
        onBackToInvitation();
      } else {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
          try {
            sessionStorage.setItem('weddingMusicActive', 'true');
            sessionStorage.setItem('weddingSongTime', String(audio.currentTime || 0));
          } catch {}
        }
        const target = getHomeHref();
        window.location.assign(target);
      }
    },
    [onBackToInvitation, audioRef]
  );

  // Host session & views
  const [showLogin, setShowLogin] = useState(false);
  const [hostLoggedIn, setHostLoggedIn] = useState(isHostLoggedIn);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const viewKey = dashboardOpen ? 'dashboard' : 'overview';
  useScrollReveal(viewKey);

  useEffect(() => {
    document.body.classList.remove('locked');
    document.body.classList.toggle('dark-theme', isDark);
  }, [isDark]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Wedding Accommodation | Bhuvan & Manasa';

    const robots = document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex, nofollow');
    document.head.appendChild(robots);

    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  // Restore host session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await restoreHostSession();
      if (!cancelled && token) {
        setHostLoggedIn(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setHostLoggedIn(true);
    setDashboardOpen(true);
  };

  const handleLogout = async () => {
    await logoutHost();
    setHostLoggedIn(false);
    setDashboardOpen(false);
  };

  const handleSessionExpired = () => {
    setHostLoggedIn(false);
    setDashboardOpen(false);
    setShowLogin(true);
  };

  return (
    <div className="acc-page">
      {!externalToggleMusic && (
        <audio
          ref={audioRef}
          onEnded={localMusic.handleSongEnded}
          onError={localMusic.handleAudioError}
          preload="none"
        />
      )}
      <MusicToggle playing={musicPlaying} onToggle={toggleMusic} />

      {/* Top Bar Navigation */}
      <header className="acc-topbar">
        <a className="acc-home-link" href={homeHref} onClick={handleBackToInvitation}>
          ← Invitation
        </a>

        <div className="acc-topbar-actions">
          {onNavigateToGallery && (
            <button
              type="button"
              className="acc-host-link"
              onClick={onNavigateToGallery}
            >
              🎥 చిత్రమాలిక &amp; వీడియోలు
            </button>
          )}

          {bookingConfigured && !hostLoggedIn && (
            <button
              type="button"
              className="acc-host-link"
              onClick={() => setShowLogin(true)}
              title="Host access for room allocation tracking"
            >
              🔒 Host Login
            </button>
          )}

          {hostLoggedIn && !dashboardOpen && (
            <button
              type="button"
              className="acc-host-link is-active-mode"
              onClick={() => setDashboardOpen(true)}
            >
              👑 Host Tracker
            </button>
          )}

          {hostLoggedIn && dashboardOpen && (
            <button
              type="button"
              className="acc-host-link"
              onClick={() => setDashboardOpen(false)}
            >
              👁️ Guest View
            </button>
          )}

          {hostLoggedIn && (
            <button
              type="button"
              className="acc-host-link is-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          <button
            className="theme-toggle"
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={String(isDark)}
            onClick={toggleTheme}
          >
            {isDark ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <main className="acc-main">
        {/* Hero Section */}
        <section className="acc-hero">
          <p className="eyebrow">BHUVAN &amp; MANASA · 12 DECEMBER 2026</p>
          <h1>Wedding Accommodation</h1>
          <p className="acc-subtitle">
            Comfortable stay arranged for our beloved family and guests.
          </p>
          <Ornament />
        </section>

        {/* HOST TRACKER DASHBOARD VIEW */}
        {dashboardOpen && hostLoggedIn ? (
          <HostDashboard
            onExit={() => setDashboardOpen(false)}
            onLogout={handleLogout}
            onSessionExpired={handleSessionExpired}
          />
        ) : (
          /* PUBLIC GUEST VIEW */
          <section className="acc-public-view">
            {/* Both Stay Locations Displayed Clearly */}
            <div className="acc-location-selector reveal">
              <span className="acc-selector-title">Accommodation Arranged at 2 Locations:</span>
            </div>

            <div className="acc-venues-showcase reveal">
              {PROPERTIES.map((property, idx) => (
                <div
                  key={property.id}
                  className="acc-showcase-card is-public-card"
                >
                  <div className="acc-showcase-art">
                    <StayArt variant={property.id} uid={`showcase-${property.id}`} />
                  </div>

                  <div className="acc-showcase-head">
                    <span className="acc-showcase-num-badge">
                      {idx === 0 ? '1. Family & Guests Stay' : '2. Wedding Hall Stay'}
                    </span>
                    <h2 className="acc-showcase-title">{property.name}</h2>
                    <p className="acc-showcase-blurb">{property.blurb}</p>
                    {property.address && (
                      <p className="acc-showcase-address">📍 {property.address}</p>
                    )}
                  </div>

                  <div className="acc-showcase-timing">
                    {property.flexibleTimings ? (
                      <span>
                        🕒 <strong>Flexible Timings</strong> · {property.dateLabel}
                      </span>
                    ) : (
                      <span>
                        🕒 <strong>{property.timingNote}</strong>
                      </span>
                    )}
                  </div>

                  <div className="acc-showcase-actions">
                    {property.mapUrl && (
                      <a
                        className="gold-button acc-showcase-map-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={property.mapUrl}
                      >
                        📍 Open in Google Maps
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Guest Assistance & Host Login Prompt */}
            <div className="acc-guest-footer-note reveal">
              <p>
                Comfortable stay arranged for our beloved family and wedding guests at both locations.
                For room assistance, arrival coordination, or queries, please contact the wedding coordinators or host.
              </p>
              {!hostLoggedIn && (
                <button
                  type="button"
                  className="acc-host-login-prompt"
                  onClick={() => setShowLogin(true)}
                >
                  👑 Are you the wedding host? Tap here to open the Room Allocation Tracker →
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Host Login Dialog */}
      <HostLoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />

      <footer className="acc-footer">
        <Ornament />
        <p>Bhuvan &amp; Manasa · 12 December 2026</p>
        <a className="acc-footer-link" href={homeHref} onClick={handleBackToInvitation}>
          ← Back to the wedding invitation
        </a>
      </footer>
    </div>
  );
}

export default Accommodation;
