/**
 * Accommodation properties for the wedding stay page.
 *
 * Two stay locations:
 * 1. Krishna Inn (Danavaipeta, Rajamahendravaram) - 8 rooms, flexible timings on 12 Dec 2026
 * 2. SVPC Convention Hall 1 (Wedding Hall) - 8 rooms, fixed: 12 Dec 2026 9 AM → 13 Dec 2026 7 AM
 */

/** Global default timings (used as fallback). */
export const CHECK_IN_TIME = '9:00 AM';
export const CHECK_OUT_TIME = '7:00 AM';

export const PROPERTIES = [
  {
    id: 'krishna-inn',
    name: 'Krishna Inn',
    shortName: 'Krishna Inn',
    sheet: 'Krishna-In',
    tagline: 'Family & Guests Stay',
    blurb: 'Comfortable rooms reserved for our beloved family and wedding guests. Flexible timings available on 12th December 2026.',
    address: 'Near Danavaipeta, Rajamahendravaram, Andhra Pradesh',
    mapUrl:
      'https://www.google.com/maps/place/KRISHNA+INN/@17.0014322,81.7789812,15.43z/data=!4m9!3m8!1s0x3a37a3c32a1391cd:0x54b963c115fb69b1!5m2!4m1!1i2!8m2!3d17.0069703!4d81.790074!16s%2Fg%2F11rf6ly2tb?entry=ttu',
    rooms: ['1', '2', '3', '4', '5', '6', '7', '8'],
    checkInTime: 'Flexible',
    checkOutTime: 'Flexible',
    dateLabel: '12 December 2026',
    timingNote: 'Flexible check-in / check-out timings',
    flexibleTimings: true,
  },
  {
    id: 'svpc',
    name: 'SVPC Convention Hall 1',
    shortName: 'SVPC Convention',
    sheet: 'SVPC',
    tagline: 'Wedding Hall & Accommodation',
    blurb: 'Stay right at the wedding venue! Accommodation provided on 12th December 2026 from 9:00 AM to 13th December 2026 at 7:00 AM.',
    address: 'SVPC Conventions, Rajamahendravaram, Andhra Pradesh',
    mapUrl:
      'https://www.google.com/maps/place/SVPC+CONVENTIONS/@17.0438279,81.794505,12.69z/data=!4m6!3m5!1s0x3a37a173580ba0c1:0xf660ea509c425358!8m2!3d17.0387557!4d81.8332866!16s%2Fg%2F11nz344pws?entry=ttu',
    rooms: ['1', '2', '3', '4', '5', '6', '7', '8'],
    checkInTime: '9:00 AM',
    checkOutTime: '7:00 AM (Next Day)',
    dateLabel: '12 Dec 2026, 9 AM → 13 Dec 2026, 7 AM',
    timingNote: '12 Dec 2026 9:00 AM to 13 Dec 2026 7:00 AM (Fixed)',
    flexibleTimings: false,
  },
];

export const getProperty = (id) => PROPERTIES.find((property) => property.id === id) || null;
