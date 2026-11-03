import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  HOW TO ADD YOUR GOOGLE MAPS LINKS & COORDINATES               ║
 * ║                                                                ║
 * ║  For each event below, update these two fields:                ║
 * ║                                                                ║
 * ║  1. mapUrl  → paste the full Google Maps link for the venue    ║
 * ║     Example: 'https://maps.google.com/?q=17.3850,78.4867'     ║
 * ║                                                                ║
 * ║  2. coordinates → { lat: <latitude>, lng: <longitude> }       ║
 * ║     Example: { lat: 17.3850, lng: 78.4867 }                   ║
 * ║                                                                ║
 * ║  You can get lat/lng from Google Maps by right-clicking a      ║
 * ║  location and selecting the coordinates.                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const asset = (p) => `${cleanBase}${p.replace(/^\/+/, '')}`;

const EVENTS = [
  {
    number: '01',
    title: 'Pelli Koduku',
    teluguTitle: 'పెళ్ళికొడుకు',
    subtitle: 'Groom to be • A traditional beginning filled with auspicious blessings',
    image: asset('assets/pellikoduku.webp'),
    time: '09:00 AM',
    date: '10-12-2026',
    venue: 'Vihari Nivas - Rajamahendravaram',
    color: '#e69500',
    mapUrl: 'https://maps.app.goo.gl/DNF4svxa2FNRN3o27?g_st=iw',
    coordinates: { lat: 17.0253368, lng: 81.7834292 },
  },
  {
    number: '02',
    title: 'Pelli Kuturu',
    teluguTitle: 'పెళ్ళికూతురు',
    subtitle: 'Bride to be • Mangalasnanam, floral radiant rites & family affection',
    image: asset('assets/pellikuthuru.webp'),
    time: '09:00 AM',
    date: '10-12-2026',
    venue: 'Avinya Banquet & Suits',
    color: '#d44368',
    mapUrl: 'https://maps.app.goo.gl/rdH9ZzYK1vsZ3sDB8?g_st=iw',
    coordinates: { lat: 17.0082807, lng: 81.8058498 },
  },
  {
    number: '03',
    title: "Haldi (Groom's)",
    teluguTitle: "హల్దీ వేడుక (వరుడు)",
    subtitle: 'Turmeric showers, cheerful laughter, yellow hues & celebration',
    image: asset('assets/haldi.webp'),
    time: '03:00 PM',
    date: '10-12-2026',
    venue: 'Vihari Nivas - Rajamahendravaram',
    color: '#d99b00',
    mapUrl: 'https://maps.app.goo.gl/DNF4svxa2FNRN3o27?g_st=iw',
    coordinates: { lat: 17.0253368, lng: 81.7834292 },
  },
  {
    number: '04',
    title: "Haldi (Bride's)",
    teluguTitle: "హల్దీ వేడుక (వధువు)",
    subtitle: 'Golden sunshine radiance, marigold petals, joy & laughter',
    image: asset('assets/haldi_bride.webp'),
    time: '03:30 PM',
    date: '10-12-2026',
    venue: 'Avinya Banquet & Suits',
    color: '#e28d00',
    mapUrl: 'https://maps.app.goo.gl/rdH9ZzYK1vsZ3sDB8?g_st=iw',
    coordinates: { lat: 17.0082807, lng: 81.8058498 },
  },
  {
    number: '05',
    title: 'Sangeeth',
    teluguTitle: 'సంగీత్ సంబరం',
    subtitle: 'An enchanting starlit evening of beats, dance, sparkle & harmony',
    image: asset('assets/sangeeth.webp'),
    time: '7:00 PM onwards',
    date: '11-12-2026',
    venue: 'Avinya Banquet & Suits',
    color: '#4954b0',
    mapUrl: 'https://maps.app.goo.gl/rdH9ZzYK1vsZ3sDB8?g_st=iw',
    coordinates: { lat: 17.0082807, lng: 81.8058498 },
  },
  {
    number: '06',
    title: 'Mehandi',
    teluguTitle: 'మెహందీ వేడుక',
    subtitle: 'Delicate henna swirls, joyous songs & vibrant festive charm',
    image: asset('assets/mehendi.webp'),
    time: '5:00 PM onwards',
    date: '11-12-2026',
    venue: 'Avinya Banquet & Suits',
    color: '#3d8253',
    mapUrl: 'https://maps.app.goo.gl/rdH9ZzYK1vsZ3sDB8?g_st=iw',
    coordinates: { lat: 17.0082807, lng: 81.8058498 },
  },
  {
    number: '07',
    title: 'Marriage',
    teluguTitle: 'కళ్యాణ మహోత్సవం',
    subtitle: 'Two hearts, sacred vows, seven pheras & an eternal journey together',
    image: asset('assets/wedding.webp'),
    time: '8:26 PM (Muhurtham)',
    date: '12 December 2026',
    venue: 'SVPC CONVENTIONS',
    color: '#8e3045',
    mapUrl: 'https://maps.app.goo.gl/s6EFpBAJ4UScq46k6?g_st=iw',
    coordinates: { lat: 17.0387557, lng: 81.8332866 },
  },
];

/* Haversine formula — calculates distance (km) between two lat/lng points */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Events() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const tabRefs = useRef([]);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const total = EVENTS.length;

  const goToNext = useCallback(() => {
    setFlippedCards({});
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setFlippedCards({});
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Smoothly center the active card in the showcase track
  const updateTrackPosition = useCallback(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    const card = cardRefs.current[activeIndex];
    if (!track || !wrapper || !card) return;

    const wrapperCenter = wrapper.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    const targetTranslateX = wrapperCenter - cardCenter;
    track.style.transform = `translate3d(${targetTranslateX}px, 0, 0)`;
  }, [activeIndex]);

  useEffect(() => {
    updateTrackPosition();
    window.addEventListener('resize', updateTrackPosition);
    return () => window.removeEventListener('resize', updateTrackPosition);
  }, [updateTrackPosition]);

  // Keep active timeline tab pill in view on mobile
  useEffect(() => {
    if (tabRefs.current[activeIndex]) {
      tabRefs.current[activeIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  // Get user's geolocation for distance calculation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Silently fail — distance just won't show
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    }
  }, []);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 40;

    if (diff > minSwipeDistance) {
      goToNext();
    } else if (diff < -minSwipeDistance) {
      goToPrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Toggle flip for a card
  const toggleFlip = (index, e) => {
    e.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Calculate distance from user to venue
  const getDistance = (eventCoords) => {
    if (!userLocation || !eventCoords) return null;
    const dist = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      eventCoords.lat,
      eventCoords.lng
    );
    return dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`;
  };

  return (
    <section
      id="events"
      className="events-section section-cream"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Wedding Events Showcase"
    >
      <div className="section-inner wide reveal">
        <p className="eyebrow">SAVE THE DATES</p>
        <h2>Wedding Festivities</h2>
        <p className="section-subtitle">
          Seven sacred celebrations leading to a lifetime of togetherness.
        </p>

        {/* Quick Event Selector Timeline Bar */}
        <div className="events-timeline-nav" role="tablist" aria-label="Wedding events timeline">
          {EVENTS.map((event, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={event.number}
                ref={(el) => (tabRefs.current[index] = el)}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`events-timeline-pill${isSelected ? ' is-active' : ''}`}
                onClick={() => {
                  setFlippedCards({});
                  setActiveIndex(index);
                }}
              >
                <span className="pill-num">{event.number}</span>
                <span className="pill-title">{event.title}</span>
              </button>
            );
          })}
        </div>

        {/* Grand Showcase Slider Container */}
        <div
          ref={wrapperRef}
          className="events-showcase-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Event Button */}
          <button
            type="button"
            className="events-nav-chevron prev"
            onClick={goToPrev}
            aria-label="Previous event"
          >
            &#8249;
          </button>

          {/* Next Event Button */}
          <button
            type="button"
            className="events-nav-chevron next"
            onClick={goToNext}
            aria-label="Next event"
          >
            &#8250;
          </button>

          {/* Natural Horizontal Slider Track (Zero Wrapping Collisions) */}
          <div ref={trackRef} className="events-showcase-track">
            {EVENTS.map((event, index) => {
              const isActive = activeIndex === index;
              const isPrev = activeIndex - 1 === index;
              const isNext = activeIndex + 1 === index;
              const isFlipped = !!flippedCards[index];
              const distance = getDistance(event.coordinates);

              let statusClass = 'is-inactive';
              if (isActive) statusClass = 'is-active';
              else if (isPrev) statusClass = 'is-prev';
              else if (isNext) statusClass = 'is-next';

              return (
                <article
                  key={event.number}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`showcase-card ${statusClass} ${isFlipped ? 'is-flipped' : ''}`}
                  onClick={() => {
                    if (!isActive) {
                      setFlippedCards({});
                      setActiveIndex(index);
                    }
                  }}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-current={isActive ? 'true' : 'false'}
                  aria-label={`${event.title} - Event ${event.number}`}
                >
                  {/* ===== FRONT FACE ===== */}
                  <div
                    className="card-face card-front"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  >
                    {/* Gradient overlay */}
                    <div className="stage-card-overlay"></div>

                    {/* Top Badge */}
                    <div className="stage-card-top">
                      <span className="stage-event-badge">
                        EVENT {event.number} / 07
                      </span>
                      <span className="stage-event-telugu">{event.teluguTitle}</span>
                    </div>

                    {/* Card Main Info */}
                    <div className="stage-card-content">
                      <h3 className="stage-card-title">{event.title}</h3>
                      <p className="stage-card-subtitle">{event.subtitle}</p>

                      <div className="stage-card-meta">
                        <div className="meta-item">
                          <span className="meta-icon" aria-hidden="true">🕐</span>
                          <div className="meta-text">
                            <small>TIME</small>
                            <strong>{event.time}</strong>
                          </div>
                        </div>

                        <div className="meta-item">
                          <span className="meta-icon" aria-hidden="true">📅</span>
                          <div className="meta-text">
                            <small>DATE</small>
                            <strong>{event.date}</strong>
                          </div>
                        </div>

                        <div className="meta-item venue-meta">
                          <span className="meta-icon" aria-hidden="true">📍</span>
                          <div className="meta-text">
                            <small>VENUE</small>
                            <strong>{event.venue}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flip Trigger Button on Active Card */}
                    {isActive && (
                      <button
                        type="button"
                        className="flip-trigger-btn"
                        onClick={(e) => toggleFlip(index, e)}
                        aria-label="View venue location on map"
                      >
                        <span className="flip-arrow-icon">📍</span>
                        <span className="flip-arrow-text">View Venue Map &amp; Navigation</span>
                        <span className="flip-arrow-chevron" aria-hidden="true">↻</span>
                      </button>
                    )}
                  </div>

                  {/* ===== BACK FACE (Venue & Navigation) ===== */}
                  <div className="card-face card-back">
                    <div className="card-back-inner">
                      <div className="back-header">
                        <span className="back-event-badge">EVENT {event.number} / 07</span>
                        <h4 className="back-title">{event.title}</h4>
                        <p className="back-venue">{event.venue}</p>
                      </div>

                      {/* Embedded Map */}
                      <div className="back-map-container">
                        {event.coordinates ? (
                          <iframe
                            title={`Map for ${event.title}`}
                            className="back-map-iframe"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${event.coordinates.lat},${event.coordinates.lng}&hl=en&z=15&output=embed`}
                          />
                        ) : (
                          <div className="back-map-placeholder">
                            <span className="map-placeholder-icon">📍</span>
                            <p>Venue map coming soon</p>
                          </div>
                        )}
                      </div>

                      {/* Distance badge if available */}
                      {distance && (
                        <div className="back-distance">
                          <span className="distance-icon">🚗</span>
                          <span className="distance-text">
                            <strong>{distance}</strong> away from your location
                          </span>
                        </div>
                      )}

                      {/* Directions Link */}
                      {event.mapUrl ? (
                        <a
                          href={event.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="back-navigate-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>📍 Navigate to Venue</span>
                        </a>
                      ) : (
                        <div className="back-navigate-btn disabled">
                          <span>📍 Directions coming soon</span>
                        </div>
                      )}

                      {/* Flip back button */}
                      <button
                        type="button"
                        className="flip-back-btn"
                        onClick={(e) => toggleFlip(index, e)}
                        aria-label="Flip back to event details"
                      >
                        ↻ Back to Event
                      </button>
                    </div>
                  </div>

                  {/* Interactive hint for side cards */}
                  {!isActive && (
                    <div className="side-card-hint">
                      <span>{isPrev ? '‹ View Event' : 'View Event ›'}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Events Bottom Pagination & Counter */}
        <div className="events-stage-pagination" aria-label="Event indicator">
          <button
            type="button"
            className="events-page-arrow"
            onClick={goToPrev}
            aria-label="Previous event"
          >
            ‹
          </button>
          <div className="events-dots" role="tablist">
            {EVENTS.map((event, index) => (
              <button
                key={event.number}
                type="button"
                className={`event-dot${activeIndex === index ? ' is-active' : ''}`}
                onClick={() => {
                  setFlippedCards({});
                  setActiveIndex(index);
                }}
                aria-label={`Go to event ${event.number} - ${event.title}`}
                title={`Event ${event.number}: ${event.title}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="events-page-arrow"
            onClick={goToNext}
            aria-label="Next event"
          >
            ›
          </button>
          <span className="events-counter-label">
            Event {EVENTS[activeIndex].number} of 07 · {EVENTS[activeIndex].title}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Events;
