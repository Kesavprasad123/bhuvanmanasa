/**
 * Wedding Accommodation Room Allocation Tracker Store.
 *
 * Designed for the wedding host/brother to dynamically track
 * guest room allocations across two stay locations:
 * 1. Krishna Inn (Flexible timings on 12 Dec 2026)
 * 2. SVPC Convention Hall 1 (Wedding Hall, 12 Dec 2026 9:00 AM to 13 Dec 2026 7:00 AM)
 */

import { PROPERTIES } from './accommodation.js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

const SUPABASE_URL = String(env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || '';

/** True when Supabase credentials are provided in the environment. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

const supabaseHeaders = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
});

const SESSION_STORAGE_KEY = 'weddingAccommodationHostSession';
export const TRACKER_STORAGE_KEY = 'wedding_accommodation_tracker_v5';
const HOST_PIN_KEY = 'wedding_host_pin_code_v5';
const ADMIN_PIN_KEY = 'wedding_admin_pin_code_v5';
const SYNC_CHANNEL_NAME = 'wedding_accommodation_sync_v5';

// Default 4-digit passcodes
const DEFAULT_HOST_PIN = '9229';
const DEFAULT_ADMIN_PIN = '1968';

export const bookingConfigured = true;
const WRONG_PIN = 'Incorrect passcode. Please try again.';

/**
 * Confirmed Seed Room Allocations from accommodation.xlsx & supabase/seed-bookings.sql
 * Guarantees that public guests and visitors immediately see the 16 allocated rooms across
 * both properties without starting with an empty screen.
 */
export const DEFAULT_SEED_ENTRIES = [
  // 1. Krishna Inn (8 Rooms)
  {
    id: 'seed-ki-1',
    propertyId: 'krishna-inn',
    roomNumber: '1',
    guestName: 'Sridhar',
    guestPhone: '',
    checkIn: '2026-12-10',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-2',
    propertyId: 'krishna-inn',
    roomNumber: '2',
    guestName: 'Radha Krisha',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-3',
    propertyId: 'krishna-inn',
    roomNumber: '3',
    guestName: 'K Subbarao',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-4',
    propertyId: 'krishna-inn',
    roomNumber: '4',
    guestName: 'Shekar, Surya',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-5',
    propertyId: 'krishna-inn',
    roomNumber: '5',
    guestName: 'Additional',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-6',
    propertyId: 'krishna-inn',
    roomNumber: '6',
    guestName: 'Teja - Director',
    guestPhone: '',
    checkIn: '2026-12-11',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-7',
    propertyId: 'krishna-inn',
    roomNumber: '7',
    guestName: 'Teja - Dheeraj',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-ki-8',
    propertyId: 'krishna-inn',
    roomNumber: '8',
    guestName: 'Teja - Hari & Kranthi',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },

  // 2. SVPC Convention Hall 1 (8 Rooms)
  {
    id: 'seed-svpc-1',
    propertyId: 'svpc',
    roomNumber: '1',
    guestName: 'Aneel, Bala, Shiva',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-2',
    propertyId: 'svpc',
    roomNumber: '2',
    guestName: 'Shristi',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-3',
    propertyId: 'svpc',
    roomNumber: '3',
    guestName: 'Btech Boys',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-4',
    propertyId: 'svpc',
    roomNumber: '4',
    guestName: 'Btech Girls',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-5',
    propertyId: 'svpc',
    roomNumber: '5',
    guestName: 'Btech Girls',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-6',
    propertyId: 'svpc',
    roomNumber: '6',
    guestName: 'Manisha, Teja, Shylu',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-7',
    propertyId: 'svpc',
    roomNumber: '7',
    guestName: 'Chanti Frnds',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'seed-svpc-8',
    propertyId: 'svpc',
    roomNumber: '8',
    guestName: 'Chanti Frnds',
    guestPhone: '',
    checkIn: '2026-12-12',
    checkOut: '2026-12-13',
    status: 'occupied',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z',
  },
];

/* ---------------------------------------------------------------- Passcode Management */

let memoryHostPin = null;
let memoryAdminPin = null;

export function getHostPin() {
  try {
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem(HOST_PIN_KEY);
      if (custom && /^\d{4}$/.test(custom)) return custom;
    } else if (memoryHostPin) {
      return memoryHostPin;
    }
  } catch {}
  return String(env.VITE_HOST_PIN || DEFAULT_HOST_PIN);
}

export function getAdminPin() {
  try {
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem(ADMIN_PIN_KEY);
      if (custom && /^\d{4}$/.test(custom)) return custom;
    } else if (memoryAdminPin) {
      return memoryAdminPin;
    }
  } catch {}
  return String(env.VITE_ADMIN_PIN || DEFAULT_ADMIN_PIN);
}

/**
 * Updates passcodes for Host and/or Admin.
 * Strictly restricted to Admin authorization (verified by current Admin passcode).
 */
export function updatePasscodes({ currentAdminPin, newHostPin, newAdminPin }) {
  const activeAdminPin = getAdminPin();
  if (String(currentAdminPin || '').trim() !== activeAdminPin) {
    throw new Error('Current Admin Passcode is incorrect.');
  }

  let updatedAny = false;

  if (newHostPin) {
    const cleanHost = String(newHostPin).trim();
    if (!/^\d{4}$/.test(cleanHost)) {
      throw new Error('New Host Passcode must be exactly 4 digits.');
    }
    try {
      memoryHostPin = cleanHost;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(HOST_PIN_KEY, cleanHost);
      }
      updatedAny = true;
    } catch {
      throw new Error('Failed to update Host passcode in storage.');
    }
  }

  if (newAdminPin) {
    const cleanAdmin = String(newAdminPin).trim();
    if (!/^\d{4}$/.test(cleanAdmin)) {
      throw new Error('New Admin Passcode must be exactly 4 digits.');
    }
    try {
      memoryAdminPin = cleanAdmin;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ADMIN_PIN_KEY, cleanAdmin);
      }
      updatedAny = true;
    } catch {
      throw new Error('Failed to update Admin passcode in storage.');
    }
  }

  if (!updatedAny) {
    throw new Error('Please enter at least one new passcode to update.');
  }

  broadcastSync();
  return { success: true };
}

export function setHostPin(currentPin, newPin) {
  // Backward compatibility wrapper
  const activePin = getHostPin();
  if (String(currentPin).trim() !== activePin) {
    throw new Error('Current PIN is incorrect.');
  }
  const cleanNew = String(newPin || '').trim();
  if (!/^\d{4}$/.test(cleanNew)) {
    throw new Error('New PIN must be exactly 4 digits.');
  }
  try {
    localStorage.setItem(HOST_PIN_KEY, cleanNew);
    broadcastSync();
  } catch {
    throw new Error('Failed to update PIN in local storage.');
  }
}

/* ---------------------------------------------------------------- Tracker Storage Engine */

const MIGRATION_KEY = 'wedding_tracker_v5_migrated';
const EMPTY_PURGE_MIGRATION_KEY = 'wedding_tracker_empty_purged_v3';

/**
 * Determines if a tracker entry is empty, incomplete, or corrupted.
 * Occupied entries require both a room number and a guest name.
 * Vacant entries only require a valid room number.
 */
export function isEntryEmpty(entry) {
  if (!entry || typeof entry !== 'object') return true;

  const room = String(entry.roomNumber || '').trim();
  const guest = String(entry.guestName || '').trim();

  // Room must be non-empty and not a placeholder
  if (!room || /^(not assigned|undefined|null|n\/a|none)$/i.test(room)) {
    return true;
  }

  // Occupied rooms strictly require a guest name
  if (entry.status === 'occupied') {
    if (!guest || /^(name not specified|unnamed|undefined|null|n\/a|none)$/i.test(guest)) {
      return true;
    }
  }

  return false;
}

export function isEntryValid(entry) {
  return !isEntryEmpty(entry);
}

function cleanOldStorage() {
  try {
    if (!localStorage.getItem(MIGRATION_KEY)) {
      // Clear legacy storage keys
      localStorage.removeItem('wedding_accommodation_bookings_v2');
      localStorage.removeItem('wedding_accommodation_v3_migrated');
      localStorage.removeItem('wedding_host_pin_code');
      localStorage.setItem(MIGRATION_KEY, '1');
      localStorage.setItem(HOST_PIN_KEY, DEFAULT_HOST_PIN);
      localStorage.setItem(ADMIN_PIN_KEY, DEFAULT_ADMIN_PIN);

      // Pre-seed with default 16 rooms if not already stored
      if (!localStorage.getItem(TRACKER_STORAGE_KEY)) {
        localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_ENTRIES));
      }
    }

    // Always wipe persistent session tokens so refreshing the page automatically logs out
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_STORAGE_KEY);
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }

    // Force purge corrupted entries from storage immediately
    const raw = localStorage.getItem(TRACKER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(isEntryValid);
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(cleaned));
        }
      }
    }
  } catch {
    // ignore
  }
}

// Run cleanup immediately on load
if (typeof window !== 'undefined') {
  cleanOldStorage();
}

let memoryStore = [];

/**
 * Reads all tracker entries from local storage (or memory fallback in Node/SSR).
 * Defaults to confirmed seed entries so all public guests see the 16 allocated rooms.
 */
export function fetchTrackerEntries() {
  try {
    cleanOldStorage();
    if (typeof localStorage === 'undefined') {
      return (memoryStore.length ? memoryStore : DEFAULT_SEED_ENTRIES).filter(isEntryValid);
    }
    const raw = localStorage.getItem(TRACKER_STORAGE_KEY);
    if (!raw) {
      writeTrackerEntries(DEFAULT_SEED_ENTRIES);
      return DEFAULT_SEED_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      writeTrackerEntries(DEFAULT_SEED_ENTRIES);
      return DEFAULT_SEED_ENTRIES;
    }

    // Filter out all empty, incomplete, or corrupted entries
    const valid = parsed.filter(isEntryValid);

    if (valid.length === 0) {
      writeTrackerEntries(DEFAULT_SEED_ENTRIES);
      return DEFAULT_SEED_ENTRIES;
    }

    // If invalid/empty entries were found, immediately sync cleaned list back
    if (valid.length !== parsed.length) {
      writeTrackerEntries(valid);
    }
    return valid;
  } catch {
    return (memoryStore.length ? memoryStore : DEFAULT_SEED_ENTRIES).filter(isEntryValid);
  }
}

/**
 * Real-time cloud sync: fetches live allocations from Supabase if configured,
 * otherwise falls back to local storage and confirmed seed entries.
 */
export async function syncFromCloud() {
  if (!supabaseConfigured) {
    return fetchTrackerEntries();
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/accommodation_tracker?select=*&order=createdAt.desc`, {
      method: 'GET',
      headers: supabaseHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const valid = data.filter(isEntryValid);
        if (valid.length > 0) {
          memoryStore = [...valid];
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(valid));
          }
          broadcastSync();
          return valid;
        }
      }
    }
  } catch (err) {
    console.warn('Could not sync tracker entries from Supabase cloud:', err);
  }

  return fetchTrackerEntries();
}

function writeTrackerEntries(entries) {
  try {
    memoryStore = [...entries];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(entries));
    }
    broadcastSync();
  } catch (err) {
    console.warn('Failed to save entries to localStorage:', err);
  }
}

// Cross-tab synchronization via BroadcastChannel & storage events
let syncChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch {
    syncChannel = null;
  }
}

function broadcastSync() {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'sync', timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
}

export function subscribeToDatabaseChanges(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = () => callback();
  const handleStorage = (event) => {
    if (
      event.key === TRACKER_STORAGE_KEY ||
      event.key === HOST_PIN_KEY ||
      event.key === ADMIN_PIN_KEY ||
      event.key === SESSION_STORAGE_KEY
    ) {
      callback();
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

/* ---------------------------------------------------------------- Session Management */

// In-memory session state (strictly resets to 'guest' on page refresh)
let activeSessionRole = 'guest'; // 'guest' | 'host' | 'admin'
let activeSessionToken = '';

export function getActiveRole() {
  return activeSessionRole;
}

export function isHostLoggedIn() {
  return activeSessionRole === 'host' || activeSessionRole === 'admin';
}

export function isAdminLoggedIn() {
  return activeSessionRole === 'admin';
}

export async function loginUser(pin) {
  const value = String(pin || '').trim();
  if (!/^\d{4}$/.test(value)) {
    throw new Error('Please enter the 4-digit passcode.');
  }

  const currentAdminPin = getAdminPin();
  const currentHostPin = getHostPin();

  if (value === currentAdminPin) {
    activeSessionRole = 'admin';
    activeSessionToken = 'admin_session_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  } else if (value === currentHostPin) {
    activeSessionRole = 'host';
    activeSessionToken = 'host_session_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  } else {
    throw new Error(WRONG_PIN);
  }

  // Force wipe persistent storage to guarantee page refresh always logs out
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_STORAGE_KEY);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }

  return { role: activeSessionRole, token: activeSessionToken };
}

export async function loginHost(pin) {
  const res = await loginUser(pin);
  return res.token;
}

export async function logoutUser() {
  activeSessionRole = 'guest';
  activeSessionToken = '';
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_STORAGE_KEY);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function logoutHost() {
  return logoutUser();
}

export async function restoreHostSession() {
  // Resets to empty/logged-out on refresh
  return activeSessionRole !== 'guest' ? { role: activeSessionRole, token: activeSessionToken } : null;
}

export function isSessionExpired(error) {
  return /session has expired|log in again/i.test((error && error.message) || '');
}

/* ---------------------------------------------------------------- Entry Tracker CRUD */

/**
 * Saves or updates a room entry in the tracker.
 *
 * @param {Object} entry
 * @param {string} [entry.id] - Optional ID for editing an existing entry
 * @param {string} entry.propertyId - 'krishna-inn' | 'svpc'
 * @param {string} entry.guestName - Name of the guest or family
 * @param {string} [entry.guestPhone] - Contact phone number
 * @param {string} entry.roomNumber - Assigned room number (e.g. "101", "Room 4")
 * @param {string} [entry.checkIn] - Check-in date (YYYY-MM-DD)
 * @param {string} [entry.checkOut] - Check-out date (YYYY-MM-DD)
 * @param {'occupied'|'vacant'} [entry.status] - Status: 'occupied' or 'vacant'
 */
export async function saveTrackerEntry({
  id = null,
  propertyId = 'krishna-inn',
  guestName = '',
  guestPhone = '',
  roomNumber = '',
  checkIn = '2026-12-12',
  checkOut = '2026-12-13',
  status = 'occupied',
}) {
  const cleanName = String(guestName || '').trim();
  const cleanRoom = String(roomNumber || '').trim();
  const cleanPhone = String(guestPhone || '').replace(/\D/g, '').slice(0, 10);
  const cleanStatus = status === 'vacant' ? 'vacant' : 'occupied';

  if (!cleanRoom) {
    throw new Error('Please enter a room number.');
  }

  if (!cleanName && cleanStatus === 'occupied') {
    throw new Error('Please enter the guest name.');
  }

  const entries = fetchTrackerEntries();
  const now = new Date().toISOString();

  if (id) {
    // Edit existing entry
    const index = entries.findIndex((e) => e.id === id);
    if (index >= 0) {
      entries[index] = {
        ...entries[index],
        propertyId,
        guestName: cleanName,
        guestPhone: cleanPhone,
        roomNumber: cleanRoom,
        checkIn: checkIn || '2026-12-12',
        checkOut: checkOut || '2026-12-13',
        status: cleanStatus,
        updatedAt: now,
      };
      writeTrackerEntries(entries);

      if (supabaseConfigured) {
        try {
          fetch(`${SUPABASE_URL}/rest/v1/accommodation_tracker`, {
            method: 'POST',
            headers: {
              ...supabaseHeaders(),
              Prefer: 'resolution=merge-duplicates',
            },
            body: JSON.stringify(entries[index]),
          }).catch(() => {});
        } catch {}
      }

      return entries[index];
    }
  }

  // Create new entry
  const newEntry = {
    id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    propertyId,
    guestName: cleanName,
    guestPhone: cleanPhone,
    roomNumber: cleanRoom,
    checkIn: checkIn || '2026-12-12',
    checkOut: checkOut || '2026-12-13',
    status: cleanStatus,
    createdAt: now,
    updatedAt: now,
  };

  entries.unshift(newEntry); // Newest entries on top
  writeTrackerEntries(entries);

  if (supabaseConfigured) {
    try {
      fetch(`${SUPABASE_URL}/rest/v1/accommodation_tracker`, {
        method: 'POST',
        headers: {
          ...supabaseHeaders(),
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(newEntry),
      }).catch(() => {});
    } catch {}
  }

  return newEntry;
}

/**
 * Toggles status between 'occupied' and 'vacant'.
 */
export async function toggleEntryStatus(id) {
  const entries = fetchTrackerEntries();
  const target = entries.find((e) => e.id === id);
  if (!target) throw new Error('Entry not found');

  target.status = target.status === 'occupied' ? 'vacant' : 'occupied';
  target.updatedAt = new Date().toISOString();

  writeTrackerEntries(entries);

  if (supabaseConfigured) {
    try {
      fetch(`${SUPABASE_URL}/rest/v1/accommodation_tracker?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: supabaseHeaders(),
        body: JSON.stringify({ status: target.status, updatedAt: target.updatedAt }),
      }).catch(() => {});
    } catch {}
  }

  return target;
}

/**
 * Deletes an entry from the tracker.
 */
export async function deleteTrackerEntry(id) {
  const entries = fetchTrackerEntries();
  const filtered = entries.filter((e) => e.id !== id);
  writeTrackerEntries(filtered);

  if (supabaseConfigured) {
    try {
      fetch(`${SUPABASE_URL}/rest/v1/accommodation_tracker?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: supabaseHeaders(),
      }).catch(() => {});
    } catch {}
  }

  return filtered;
}

/**
 * Clears all vacant entries from the tracker.
 */
export async function clearVacantEntries(propertyId = null) {
  const entries = fetchTrackerEntries();
  const filtered = entries.filter((e) => {
    if (propertyId && propertyId !== 'all' && e.propertyId !== propertyId) return true;
    return e.status !== 'vacant';
  });
  writeTrackerEntries(filtered);
  return filtered;
}

/**
 * Removes all empty, incomplete, or corrupted entries from the tracker.
 */
export async function removeEmptyEntries() {
  const entries = fetchTrackerEntries();
  const valid = entries.filter(isEntryValid);
  writeTrackerEntries(valid);
  return valid;
}

/**
 * Removes all entries from the tracker completely.
 */
export async function clearAllTrackerEntries() {
  writeTrackerEntries([]);
  return [];
}

/**
 * Computes live occupancy metrics for both locations.
 */
export function fetchTrackerStats(entriesList = null) {
  const source = entriesList || fetchTrackerEntries();
  const entries = source.filter(isEntryValid);

  const krishnaEntries = entries.filter((e) => e.propertyId === 'krishna-inn');
  const svpcEntries = entries.filter((e) => e.propertyId === 'svpc');

  const krishnaOccupied = krishnaEntries.filter((e) => e.status === 'occupied').length;
  const krishnaVacant = krishnaEntries.filter((e) => e.status === 'vacant').length;

  const svpcOccupied = svpcEntries.filter((e) => e.status === 'occupied').length;
  const svpcVacant = svpcEntries.filter((e) => e.status === 'vacant').length;

  const totalOccupied = krishnaOccupied + svpcOccupied;
  const totalVacant = krishnaVacant + svpcVacant;

  return {
    krishna: { occupied: krishnaOccupied, vacant: krishnaVacant, total: krishnaEntries.length },
    svpc: { occupied: svpcOccupied, vacant: svpcVacant, total: svpcEntries.length },
    totalOccupied,
    totalVacant,
    totalEntries: entries.length,
  };
}

/**
 * Formats a clean WhatsApp-ready allocation summary of the tracker.
 */
export function generateWhatsAppSummary(propertyId = null) {
  const entries = fetchTrackerEntries();
  const targetProperties = propertyId
    ? PROPERTIES.filter((p) => p.id === propertyId)
    : PROPERTIES;

  let lines = [
    '🏨 *BHUVAN & MANASA WEDDING ACCOMMODATION TRACKER*',
    '📅 *12 December 2026*',
    '----------------------------------------',
  ];

  targetProperties.forEach((prop) => {
    const propEntries = entries.filter((e) => e.propertyId === prop.id);
    const occupied = propEntries.filter((e) => e.status === 'occupied');

    lines.push('');
    lines.push(`📍 *${prop.name.toUpperCase()}* (${occupied.length} Rooms Occupied)`);
    if (prop.address) lines.push(`_${prop.address}_`);
    if (prop.timingNote) lines.push(`🕒 ${prop.timingNote}`);

    if (propEntries.length === 0) {
      lines.push('  _No entries added yet_');
    } else {
      propEntries.forEach((item) => {
        const icon = item.status === 'occupied' ? '🔴' : '🟢';
        const phone = item.guestPhone ? ` (Ph: ${item.guestPhone})` : '';
        const guest = item.guestName ? item.guestName : 'Guest';
        const dates = item.checkIn && item.checkOut ? ` [${item.checkIn.slice(5)} → ${item.checkOut.slice(5)}]` : '';
        lines.push(`${icon} Room ${item.roomNumber}: ${guest}${phone} - ${item.status.toUpperCase()}${dates}`);
      });
    }
  });

  lines.push('');
  lines.push('----------------------------------------');
  lines.push('✨ Generated from Wedding Room Allocation Tracker');

  return lines.join('\n');
}

/* ------------------------------------------------- Backward Compatibility Wrappers */

export async function fetchBookings() {
  return fetchTrackerEntries();
}

export async function fetchAvailability() {
  const stats = fetchTrackerStats();
  return {
    'krishna-inn': { count: stats.krishna.occupied },
    svpc: { count: stats.svpc.occupied },
  };
}

export async function saveRoomAllocation(values) {
  return saveTrackerEntry(values);
}

export async function clearRoomAllocation(propertyId, room) {
  const entries = fetchTrackerEntries();
  const target = entries.find((e) => e.propertyId === propertyId && String(e.roomNumber) === String(room));
  if (target) {
    return deleteTrackerEntry(target.id);
  }
  return entries;
}
