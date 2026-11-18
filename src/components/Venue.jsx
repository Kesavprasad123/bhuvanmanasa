const SVPC_MAPS_URL =
  'https://www.google.com/maps/place/SVPC+CONVENTIONS/@17.0438279,81.794505,12.69z/data=!4m6!3m5!1s0x3a37a173580ba0c1:0xf660ea509c425358!8m2!3d17.0387557!4d81.8332866!16s%2Fg%2F11nz344pws?entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D';

const KRISHNA_INN_MAPS_URL =
  'https://www.google.com/maps/place/KRISHNA+INN/@17.0014322,81.7789812,15.43z/data=!4m9!3m8!1s0x3a37a3c32a1391cd:0x54b963c115fb69b1!5m2!4m1!1i2!8m2!3d17.0069703!4d81.790074!16s%2Fg%2F11rf6ly2tb?entry=ttu';

function Venue() {
  return (
    <section id="venue" className="venue-section section-sage">
      <div className="venue-card reveal">
        <p className="eyebrow">LOCATION &amp; ACCOMMODATION</p>
        <h2>Venue &amp; Stay Maps</h2>
        <p className="venue-copy">
          We would be honoured to have you with us as we begin our new chapter. Find directions to our wedding venue and guest accommodation below.
        </p>

        <div className="venue-dual-maps">
          {/* 1. SVPC CONVENTIONS */}
          <div className="venue-single-map">
            <span className="venue-map-badge">🏛️ WEDDING VENUE &amp; HALL 1 STAY</span>
            <h3>SVPC CONVENTIONS</h3>
            <p className="venue-card-telugu">కళ్యాణ వేదిక &amp; హాల్ 1 వసతి</p>
            <p className="venue-card-address">
              📍 SVPC Conventions, Rajamahendravaram, Andhra Pradesh
            </p>
            <p className="venue-card-timing">
              ✨ <strong>Muhurtham:</strong> 12 Dec 2026, 8:26 PM &amp; Hall 1 Stay
            </p>
            <div className="map-wrap">
              <iframe
                title="SVPC Conventions location on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=SVPC%20CONVENTIONS%2C%2017.0387557%2C81.8332866&z=15&output=embed"
              />
            </div>
            <a
              className="gold-button"
              target="_blank"
              rel="noopener noreferrer"
              href={SVPC_MAPS_URL}
            >
              📍 Open SVPC in Google Maps
            </a>
          </div>

          {/* 2. KRISHNA INN */}
          <div className="venue-single-map">
            <span className="venue-map-badge">🏨 GUEST ACCOMMODATION</span>
            <h3>KRISHNA INN</h3>
            <p className="venue-card-telugu">కుటుంబ &amp; బంధుమిత్రుల వసతి గృహం</p>
            <p className="venue-card-address">
              📍 Prakasam Nagar (Near Danavaipeta), Rajamahendravaram, Andhra Pradesh
            </p>
            <p className="venue-card-timing">
              🛏️ <strong>Stay:</strong> Family &amp; Wedding Guests Stay
            </p>
            <div className="map-wrap">
              <iframe
                title="Krishna Inn location on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=KRISHNA+INN+Rajahmundry&z=16&output=embed"
              />
            </div>
            <a
              className="gold-button"
              target="_blank"
              rel="noopener noreferrer"
              href={KRISHNA_INN_MAPS_URL}
            >
              📍 Open Krishna Inn in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Venue;
