import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  WEDDING CELEBRATIONS & SACRED FESTIVITIES                       ║
 * ║  7 Auspicious Ceremonies of Bhuvan & Manasa                      ║
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

/* Haversine distance formula */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  const timelineNavRef = useRef(null);
  const tabRefs = useRef([]);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const total = EVENTS.length;

  const displayEvents = useMemo(() => {
    return EVENTS.map((event, index) => {
      const itemData = t(`events.items.${index}`) || {};
      return {
        ...event,
        title: itemData.title || event.title,
        teluguTitle: itemData.teluguTitle || event.teluguTitle,
        subtitle: itemData.subtitle || event.subtitle,
        time: itemData.time || event.time,
        date: itemData.date || event.date,
        venue: itemData.venue || event.venue,
      };
    });
  }, [t]);

  const goToNext = useCallback(() => {
    setFlippedCards({});
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setFlippedCards({});
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Scroll ONLY the tab bar container horizontally when user changes tabs (NEVER the page window!)
  const scrollTabPillIntoView = useCallback((index) => {
    const nav = timelineNavRef.current;
    const tab = tabRefs.current[index];
    if (!nav || !tab) return;
    const navCenter = nav.clientWidth / 2;
    const tabCenter = tab.offsetLeft + tab.clientWidth / 2;
    nav.scrollTo({
      left: tabCenter - navCenter,
      behavior: 'smooth',
    });
  }, []);

  const handleSelectEvent = useCallback((index) => {
    setFlippedCards({});
    setActiveIndex(index);
    scrollTabPillIntoView(index);
  }, [scrollTabPillIntoView]);

  // Request user's location for venue distance estimation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {},
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
    const minSwipeDistance = 45;

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

  // Toggle 3D flip to view venue map
  const toggleFlip = (index, e) => {
    e.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Calculate distance
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

  // Card position logic: 1 active, 1 prev, 1 next; all others hidden (ZERO wrapping collisions!)
  const getCardStatus = (index) => {
    if (index === activeIndex) return 'is-active';
    if (index === (activeIndex - 1 + total) % total) return 'is-prev';
    if (index === (activeIndex + 1) % total) return 'is-next';
    return 'is-offstage';
  };

  return (
    <section
      id="events"
      className="events-section section-cream"
      onKeyDown={handleKeyDown}
      aria-label="Wedding Events Showcase"
    >
      <div className="section-inner wide reveal">
        <p className="eyebrow">{t('events.eyebrow', 'SAVE THE DATES')}</p>
        <h2>{t('events.title', 'Wedding Festivities')}</h2>
        <p className="section-subtitle">
          {t('events.subtitle', 'Seven sacred celebrations leading to a lifetime of togetherness.')}
        </p>

        {/* Quick Event Selector Timeline Bar */}
        <div
          ref={timelineNavRef}
          className="events-timeline-nav"
          role="tablist"
          aria-label={t('events.title', 'Wedding events timeline')}
        >
          {displayEvents.map((event, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={event.number}
                ref={(el) => (tabRefs.current[index] = el)}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`events-timeline-pill${isSelected ? ' is-active' : ''}`}
                onClick={() => handleSelectEvent(index)}
              >
                <span className="pill-num">{event.number}</span>
                <span className="pill-title">{event.title}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Container */}
        <div
          className="events-stage-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Chevrons */}
          <button
            type="button"
            className="events-nav-chevron prev"
            onClick={goToPrev}
            aria-label={t('events.prevCelebration', 'Previous celebration')}
          >
            &#8249;
          </button>

          <button
            type="button"
            className="events-nav-chevron next"
            onClick={goToNext}
            aria-label={t('events.nextCelebration', 'Next celebration')}
          >
            &#8250;
          </button>

          {/* 3-Card Stage Area */}
          <div className="events-stage-carousel">
            {displayEvents.map((event, index) => {
              const status = getCardStatus(index);
              const isActive = status === 'is-active';
              const isPrev = status === 'is-prev';
              const isNext = status === 'is-next';
              const isFlipped = !!flippedCards[index];
              const distance = getDistance(event.coordinates);

              // Off-stage cards are not rendered into the active visual stage to avoid any cross-flying
              if (status === 'is-offstage') {
                return (
                  <article
                    key={event.number}
                    className="stage-card is-offstage"
                    aria-hidden="true"
                  />
                );
              }

              return (
                <article
                  key={event.number}
                  className={`stage-card ${status} ${isFlipped ? 'is-flipped' : ''}`}
                  onClick={() => {
                    if (isPrev) goToPrev();
                    if (isNext) goToNext();
                  }}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-current={isActive ? 'true' : 'false'}
                  aria-label={`${event.title} - ${t('events.eventLabel', 'Event')} ${event.number}`}
                >
                  {/* ===== FRONT FACE ===== */}
                  <div
                    className="card-face card-front"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  >
                    {/* Gradient Overlay */}
                    <div className="stage-card-overlay"></div>

                    {/* Top Badge */}
                    <div className="stage-card-top">
                      <span className="stage-event-badge">
                        {t('events.eventLabel', 'EVENT')} {event.number} / 07
                      </span>
                      <span className="stage-event-telugu">{event.teluguTitle}</span>
                    </div>

                    {/* Card Content Details */}
                    <div className="stage-card-content">
                      <h3 className="stage-card-title">{event.title}</h3>
                      <p className="stage-card-subtitle">{event.subtitle}</p>

                      <div className="stage-card-meta">
                        <div className="meta-item">
                          <span className="meta-icon" aria-hidden="true">🕐</span>
                          <div className="meta-text">
                            <small>{t('events.timeLabel', 'TIME')}</small>
                            <strong>{event.time}</strong>
                          </div>
                        </div>

                        <div className="meta-item">
                          <span className="meta-icon" aria-hidden="true">📅</span>
                          <div className="meta-text">
                            <small>{t('events.dateLabel', 'DATE')}</small>
                            <strong>{event.date}</strong>
                          </div>
                        </div>

                        <div className="meta-item venue-meta">
                          <span className="meta-icon" aria-hidden="true">📍</span>
                          <div className="meta-text">
                            <small>{t('events.venueLabel', 'VENUE')}</small>
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
                        aria-label={t('events.viewMapBtn', 'View venue location on map')}
                      >
                        <span className="flip-arrow-icon">📍</span>
                        <span className="flip-arrow-text">{t('events.viewMapBtn', 'View Venue Map & Navigation')}</span>
                        <span className="flip-arrow-chevron" aria-hidden="true">↻</span>
                      </button>
                    )}
                  </div>

                  {/* ===== BACK FACE (Venue Map & Navigation) ===== */}
                  <div className="card-face card-back">
                    <div className="card-back-inner">
                      <div className="back-header">
                        <span className="back-event-badge">{t('events.eventLabel', 'EVENT')} {event.number} / 07</span>
                        <h4 className="back-title">{event.title}</h4>
                        <p className="back-venue">{event.venue}</p>
                      </div>

                      {/* Embedded Google Map */}
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
                            <p>{t('events.mapComingSoon', 'Venue map coming soon')}</p>
                          </div>
                        )}
                      </div>

                      {/* Distance badge */}
                      {distance && (
                        <div className="back-distance">
                          <span className="distance-icon">🚗</span>
                          <span className="distance-text">
                            <strong>{distance}</strong> {t('events.distanceAway', 'away from your location')}
                          </span>
                        </div>
                      )}

                      {/* Direct navigation link */}
                      {event.mapUrl ? (
                        <a
                          href={event.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="back-navigate-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{t('events.navigateBtn', '📍 Navigate to Venue')}</span>
                        </a>
                      ) : (
                        <div className="back-navigate-btn disabled">
                          <span>{t('events.directionsComingSoon', '📍 Directions coming soon')}</span>
                        </div>
                      )}

                      {/* Flip back button */}
                      <button
                        type="button"
                        className="flip-back-btn"
                        onClick={(e) => toggleFlip(index, e)}
                        aria-label={t('events.backToEventBtn', 'Flip back to event details')}
                      >
                        {t('events.backToEventBtn', '↻ Back to Event')}
                      </button>
                    </div>
                  </div>

                  {/* Visual click hint for side cards */}
                  {!isActive && (
                    <div className="side-card-hint">
                      <span>{isPrev ? `‹ ${event.title}` : `${event.title} ›`}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom Pagination & Event Counter */}
        <div className="events-stage-pagination" aria-label="Event indicator">
          <button
            type="button"
            className="events-page-arrow"
            onClick={goToPrev}
            aria-label={t('events.prevCelebration', 'Previous celebration')}
          >
            ‹
          </button>
          <div className="events-dots" role="tablist">
            {displayEvents.map((event, index) => (
              <button
                key={event.number}
                type="button"
                className={`event-dot${activeIndex === index ? ' is-active' : ''}`}
                onClick={() => handleSelectEvent(index)}
                aria-label={`Go to event ${event.number} - ${event.title}`}
                title={`Event ${event.number}: ${event.title}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="events-page-arrow"
            onClick={goToNext}
            aria-label={t('events.nextCelebration', 'Next celebration')}
          >
            ›
          </button>
          <span className="events-counter-label">
            {t('events.eventLabel', 'Event')} {displayEvents[activeIndex].number} / 07 · {displayEvents[activeIndex].title}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Events;
