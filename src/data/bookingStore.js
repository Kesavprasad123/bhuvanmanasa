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

const SESSION_STORAGE_KEY = 'weddingAccommodationHostSession';
export const TRACKER_STORAGE_KEY = 'wedding_accommodation_tracker_v5';
const HOST_PIN_KEY = 'wedding_host_pin_code_v5';
const SYNC_CHANNEL_NAME = 'wedding_accommodation_sync_v5';

// Default 4-digit host PIN
const DEFAULT_HOST_PIN = '9229';

export const bookingConfigured = true;
const WRONG_PIN = 'Incorrect passcode. Please try again.';

/* ---------------------------------------------------------------- Host PIN & Storage */

export function getHostPin() {
  try {
    const custom = localStorage.getItem(HOST_PIN_KEY);
    if (custom && /^\d{4}$/.test(custom)) return custom;
  } catch {}
  return String(env.VITE_HOST_PIN || DEFAULT_HOST_PIN);
}

export function setHostPin(currentPin, newPin) {
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
 * An entry is empty if it lacks a valid room number or lacks a valid guest name.
 */
export function isEntryEmpty(entry) {
  if (!entry || typeof entry !== 'object') return true;

  const room = String(entry.roomNumber || '').trim();
  const guest = String(entry.guestName || '').trim();

  // Room must be non-empty and not a placeholder
  if (!room || /^(not assigned|undefined|null|n\/a|none)$/i.test(room)) {
    return true;
  }

  // Guest name must be non-empty and not a placeholder
  if (!guest || /^(name not specified|unnamed|undefined|null|n\/a|none)$/i.test(guest)) {
    return true;
  }

  return false;
}

export function isEntryValid(entry) {
  return !isEntryEmpty(entry);
}

function cleanOldStorage() {
  try {
    if (!localStorage.getItem(MIGRATION_KEY)) {
      // Clear all legacy mock rooms keys
      localStorage.removeItem('wedding_accommodation_bookings_v2');
      localStorage.removeItem('wedding_accommodation_v3_migrated');
      localStorage.removeItem('wedding_host_pin_code');
      localStorage.removeItem(TRACKER_STORAGE_KEY);
      localStorage.setItem(MIGRATION_KEY, '1');
      localStorage.setItem(HOST_PIN_KEY, DEFAULT_HOST_PIN);
    }

    // Always wipe persistent session tokens so refreshing the page automatically logs out
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_STORAGE_KEY);
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }

    // Force purge all empty entries from storage immediately
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
 * Starts completely empty — no mock or pre-defined names!
 */
export function fetchTrackerEntries() {
  try {
    cleanOldStorage();
    if (typeof localStorage === 'undefined') {
      return memoryStore.filter(isEntryValid);
    }
    const raw = localStorage.getItem(TRACKER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out all empty, incomplete, or corrupted entries
    const valid = parsed.filter(isEntryValid);

    // If invalid/empty entries were found, immediately sync cleaned list back
    if (valid.length !== parsed.length) {
      writeTrackerEntries(valid);
    }
    return valid;
  } catch {
    return memoryStore.filter(isEntryValid);
  }
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

// In-memory host session token (does NOT persist across page refreshes)
let activeHostSessionToken = '';

function readSession() {
  return activeHostSessionToken;
}

function writeSession(token) {
  activeHostSessionToken = token ? String(token) : '';
  // Force wipe persistent storage to guarantee page refresh always logs out
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_STORAGE_KEY);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isHostLoggedIn() {
  return Boolean(readSession());
}

export async function loginHost(pin) {
  const value = String(pin || '').trim();
  if (!/^\d{4}$/.test(value)) {
    throw new Error('Please enter the 4-digit passcode.');
  }

  const currentPin = getHostPin();
  if (value !== currentPin) {
    throw new Error(WRONG_PIN);
  }

  const token = 'host_session_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  writeSession(token);
  return token;
}

export async function logoutHost() {
  writeSession('');
}

export async function restoreHostSession() {
  // Resets to empty/logged-out on refresh
  return activeHostSessionToken;
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
  return target;
}

/**
 * Deletes an entry from the tracker.
 */
export async function deleteTrackerEntry(id) {
  const entries = fetchTrackerEntries();
  const filtered = entries.filter((e) => e.id !== id);
  writeTrackerEntries(filtered);
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
