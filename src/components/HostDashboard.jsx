import { useCallback, useEffect, useMemo, useState } from 'react';
import { PROPERTIES } from '../data/accommodation.js';
import {
  deleteTrackerEntry,
  fetchTrackerEntries,
  fetchTrackerStats,
  generateWhatsAppSummary,
  saveTrackerEntry,
  subscribeToDatabaseChanges,
  toggleEntryStatus,
} from '../data/bookingStore.js';
import { ChangePinDialog, ConfirmDialog } from './BookingControls.jsx';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateShort(iso) {
  if (!iso) return '—';
  const parts = String(iso).split('-');
  if (parts.length < 3) return iso;
  const monthIdx = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  return `${day} ${MONTHS[monthIdx] || ''}`;
}

export default function HostDashboard({
  onExit,
  onLogout,
  onSessionExpired,
}) {
  const [entries, setEntries] = useState([]);
  const [activePropertyId, setActivePropertyId] = useState('all'); // 'all' | 'krishna-inn' | 'svpc'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'occupied' | 'vacant'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Form State (Guest name, Guest Number, Room Num assigned, Calendar, Allocate & Vacant buttons)
  const [editingId, setEditingId] = useState(null);
  const [formPropertyId, setFormPropertyId] = useState('krishna-inn');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [checkIn, setCheckIn] = useState('2026-12-12');
  const [checkOut, setCheckOut] = useState('2026-12-13');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dialog states
  const [showChangePin, setShowChangePin] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const loadEntries = useCallback(() => {
    try {
      const data = fetchTrackerEntries();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load tracker entries:', err);
    }
  }, []);

  useEffect(() => {
    loadEntries();
    const unsub = subscribeToDatabaseChanges(() => {
      loadEntries();
    });
    return () => unsub();
  }, [loadEntries]);

  // Sync form property when host selects a location tab
  const handleLocationTabSelect = (propId) => {
    setActivePropertyId(propId);
    if (propId !== 'all') {
      setFormPropertyId(propId);
    }
  };

  // Metrics
  const stats = useMemo(() => fetchTrackerStats(entries), [entries]);

  // Filtered entries for tracker list/table
  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return entries.filter((item) => {
      // Location filter
      if (activePropertyId !== 'all' && item.propertyId !== activePropertyId) {
        return false;
      }
      // Status filter
      if (statusFilter === 'occupied' && item.status !== 'occupied') return false;
      if (statusFilter === 'vacant' && item.status !== 'vacant') return false;

      // Search query
      if (query) {
        const matchName = String(item.guestName || '').toLowerCase().includes(query);
        const matchPhone = String(item.guestPhone || '').toLowerCase().includes(query);
        const matchRoom = String(item.roomNumber || '').toLowerCase().includes(query);
        return matchName || matchPhone || matchRoom;
      }
      return true;
    });
  }, [entries, activePropertyId, statusFilter, searchQuery]);

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setGuestName('');
    setGuestPhone('');
    setRoomNumber('');
    setCheckIn('2026-12-12');
    setCheckOut('2026-12-13');
    setFormError('');
  };

  // Start editing an entry
  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setFormPropertyId(entry.propertyId);
    setGuestName(entry.guestName || '');
    setGuestPhone(entry.guestPhone || '');
    setRoomNumber(entry.roomNumber || '');
    setCheckIn(entry.checkIn || '2026-12-12');
    setCheckOut(entry.checkOut || '2026-12-13');
    setFormError('');

    // Scroll to form smoothly
    const formEl = document.getElementById('acc-tracker-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Form Submission (Save with Allocate or Vacant)
  const handleSubmitForm = async (targetStatus = 'occupied') => {
    setFormError('');

    if (!roomNumber.trim() && targetStatus === 'occupied') {
      setFormError('Please enter the Room Number assigned.');
      return;
    }

    if (!guestName.trim() && targetStatus === 'occupied') {
      setFormError('Please enter the Guest Name.');
      return;
    }

    setSubmitting(true);
    try {
      await saveTrackerEntry({
        id: editingId,
        propertyId: formPropertyId,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        roomNumber: roomNumber.trim(),
        checkIn,
        checkOut,
        status: targetStatus,
      });

      loadEntries();
      showToast(
        targetStatus === 'occupied'
          ? `✓ Room ${roomNumber.trim()} allocated to ${guestName.trim()}!`
          : `✓ Room ${roomNumber.trim() || 'entry'} marked as Vacant.`
      );
      resetForm();
    } catch (err) {
      setFormError((err && err.message) || 'Failed to save room entry.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Entry status (Occupied <-> Vacant)
  const handleToggleStatus = async (id, currentStatus, room) => {
    try {
      await toggleEntryStatus(id);
      loadEntries();
      const next = currentStatus === 'occupied' ? 'Vacant' : 'Occupied';
      showToast(`Room ${room} is now marked ${next}.`);
    } catch (err) {
      showToast('Could not update status: ' + err.message);
    }
  };

  // Delete Entry
  const handleDeleteEntry = async (id) => {
    try {
      await deleteTrackerEntry(id);
      loadEntries();
      showToast('Entry removed from tracker.');
    } catch (err) {
      showToast('Could not delete entry: ' + err.message);
    }
  };

  // Copy WhatsApp Summary
  const handleCopyWhatsApp = async () => {
    const summary = generateWhatsAppSummary(activePropertyId === 'all' ? null : activePropertyId);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = summary;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('📋 WhatsApp allocation tracker summary copied!');
    } catch {
      showToast('Summary prepared. Please copy manually.');
    }
  };

  const selectedFormProperty = PROPERTIES.find((p) => p.id === formPropertyId) || PROPERTIES[0];

  return (
    <section className="acc-dash" aria-labelledby="acc-dash-title">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="acc-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="acc-dash-head reveal">
        <div className="acc-dash-title-block">
          <div className="acc-host-badge-row">
            <span className="acc-host-badge">👑 HOST ROOM TRACKER</span>
            <span className="acc-live-pulse-badge">● Live Sync</span>
          </div>
          <h2 id="acc-dash-title">Accommodation Allocation Tracker</h2>
          <p className="acc-dash-sub">
            Reference tracker for guest room assignments across Krishna IN and SVPC Convention Hall 1.
          </p>
        </div>

        <div className="acc-dash-head-actions">
          <button
            type="button"
            className="acc-whatsapp-button"
            onClick={handleCopyWhatsApp}
            title="Copy WhatsApp-formatted summary to paste into family groups"
          >
            📋 Copy WhatsApp Summary
          </button>
          <button
            type="button"
            className="acc-ghost-button"
            onClick={() => setShowChangePin(true)}
            title="Change your secret 4-digit PIN code"
          >
            🔑 PIN Code
          </button>
          <button type="button" className="acc-ghost-button" onClick={onExit}>
            ← Guest View
          </button>
          <button type="button" className="acc-ghost-button is-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="acc-metrics-strip reveal">
        <div
          className={`acc-metric-card is-primary${activePropertyId === 'all' ? ' is-active-location' : ''}`}
          onClick={() => handleLocationTabSelect('all')}
          role="button"
          tabIndex={0}
        >
          <span className="acc-metric-label">All Locations</span>
          <span className="acc-metric-val">
            {stats.totalOccupied} <small>Occupied</small>
          </span>
          <span className="acc-metric-note">
            {stats.totalVacant} vacated · {stats.totalEntries} total tracked
          </span>
        </div>

        <div
          className={`acc-metric-card${activePropertyId === 'krishna-inn' ? ' is-active-location' : ''}`}
          onClick={() => handleLocationTabSelect('krishna-inn')}
          role="button"
          tabIndex={0}
        >
          <span className="acc-metric-label">1. Krishna IN</span>
          <span className="acc-metric-val">
            {stats.krishna.occupied} <small>Occupied</small>
          </span>
          <span className="acc-metric-note">
            Flexible timings · 12 Dec 2026
          </span>
        </div>

        <div
          className={`acc-metric-card${activePropertyId === 'svpc' ? ' is-active-location' : ''}`}
          onClick={() => handleLocationTabSelect('svpc')}
          role="button"
          tabIndex={0}
        >
          <span className="acc-metric-label">2. SVPC Convention Hall 1</span>
          <span className="acc-metric-val">
            {stats.svpc.occupied} <small>Occupied</small>
          </span>
          <span className="acc-metric-note">
            Wedding Hall · 12 Dec 9 AM → 13 Dec 7 AM
          </span>
        </div>
      </div>

      {/* CREATE / EDIT ENTRY FORM (As requested by user) */}
      <div id="acc-tracker-form" className="acc-tracker-form-card reveal">
        <div className="acc-form-header">
          <div>
            <h3 className="acc-form-title">
              {editingId ? '✏️ Edit Room Entry' : '➕ Create Entry for Room Allocation'}
            </h3>
            <p className="acc-form-subtitle">
              Enter guest information upon arrival to track which room is assigned.
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              className="acc-ghost-button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitForm('occupied');
          }}
          className="acc-tracker-form"
        >
          {/* Stay Location Radio Switcher */}
          <div className="acc-field acc-location-field">
            <label className="acc-label">Select Stay Location:</label>
            <div className="acc-location-radios" role="radiogroup">
              {PROPERTIES.map((prop) => (
                <button
                  key={prop.id}
                  type="button"
                  role="radio"
                  aria-checked={formPropertyId === prop.id}
                  className={`acc-location-choice-btn${formPropertyId === prop.id ? ' is-selected' : ''}`}
                  onClick={() => setFormPropertyId(prop.id)}
                >
                  <span className="acc-choice-radio" />
                  <span className="acc-choice-text">{prop.name}</span>
                </button>
              ))}
            </div>
            <div className="acc-timing-hint">
              {selectedFormProperty.flexibleTimings ? (
                <span>🕒 <strong>Krishna IN:</strong> Flexible check-in / check-out on 12th Dec 2026</span>
              ) : (
                <span>🕒 <strong>SVPC Hall 1:</strong> 12 Dec 2026, 9:00 AM → 13 Dec 2026, 7:00 AM (Fixed)</span>
              )}
            </div>
          </div>

          {/* Form Input Fields Grid */}
          <div className="acc-form-row">
            {/* Guest Name */}
            <div className="acc-field">
              <label htmlFor="tr-guest-name" className="acc-label">
                Guest Name : <span className="acc-required">*</span>
              </label>
              <input
                id="tr-guest-name"
                type="text"
                autoComplete="off"
                placeholder="e.g. Ramesh family, Suresh Rao"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            {/* Guest Number (Phone) */}
            <div className="acc-field">
              <label htmlFor="tr-guest-number" className="acc-label">
                Guest Number : <small>(Phone / WhatsApp)</small>
              </label>
              <input
                id="tr-guest-number"
                type="tel"
                autoComplete="off"
                placeholder="e.g. 9848012345"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
            </div>

            {/* Room Num Assigned */}
            <div className="acc-field">
              <label htmlFor="tr-room-num" className="acc-label">
                Room Num Assigned : <span className="acc-required">*</span>
              </label>
              <input
                id="tr-room-num"
                type="text"
                autoComplete="off"
                placeholder="e.g. 101, 204, Room 4"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Calendar (Dates) */}
          <div className="acc-form-row acc-dates-row">
            <div className="acc-field">
              <label htmlFor="tr-checkin" className="acc-label">
                Calendar Check-in :
              </label>
              <input
                id="tr-checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="acc-field">
              <label htmlFor="tr-checkout" className="acc-label">
                Calendar Check-out :
              </label>
              <input
                id="tr-checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          {formError && (
            <p className="acc-form-error" role="alert">
              ⚠️ {formError}
            </p>
          )}

          {/* Action Buttons: Allocate & Vacant Button */}
          <div className="acc-form-actions-row">
            <button
              type="submit"
              className="gold-button acc-allocate-btn"
              disabled={submitting}
              title="Save entry and mark as Occupied"
            >
              🔴 {editingId ? 'Update & Allocate' : 'Allocate Room'}
            </button>

            <button
              type="button"
              className="acc-vacant-btn"
              disabled={submitting}
              onClick={() => handleSubmitForm('vacant')}
              title="Save or mark entry as Vacant / Available"
            >
              🟢 Mark as Vacant
            </button>

            {editingId && (
              <button
                type="button"
                className="acc-ghost-button"
                onClick={resetForm}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TRACKER ENTRIES LIST / TABLE */}
      <div className="acc-tracker-section reveal">
        <div className="acc-tracker-header">
          <div>
            <h3 className="acc-tracker-title">
              Live Room Allocation Tracker ({filteredEntries.length})
            </h3>
            <p className="acc-tracker-subtitle">
              Reference record of occupied and vacated rooms.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="acc-filter-pills" role="group" aria-label="Filter status">
            <button
              type="button"
              className={`acc-filter-pill${statusFilter === 'all' ? ' is-active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({entries.length})
            </button>
            <button
              type="button"
              className={`acc-filter-pill is-occupied${statusFilter === 'occupied' ? ' is-active' : ''}`}
              onClick={() => setStatusFilter('occupied')}
            >
              🔴 Occupied ({stats.totalOccupied})
            </button>
            <button
              type="button"
              className={`acc-filter-pill is-available${statusFilter === 'vacant' ? ' is-active' : ''}`}
              onClick={() => setStatusFilter('vacant')}
            >
              🟢 Vacant ({stats.totalVacant})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="acc-search-bar">
          <span className="acc-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            autoComplete="off"
            placeholder="Search by guest name, phone number, or room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="acc-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tracker Table / Cards */}
        {filteredEntries.length === 0 ? (
          <div className="acc-empty-tracker">
            <span className="acc-empty-icon" aria-hidden="true">📭</span>
            <h4>No room entries found</h4>
            <p>
              {searchQuery
                ? `No entries match "${searchQuery}".`
                : 'No room allocations recorded yet. Use the Create Entry form above to log guests as they arrive.'}
            </p>
          </div>
        ) : (
          <div className="acc-tracker-list">
            {filteredEntries.map((entry) => {
              const prop = PROPERTIES.find((p) => p.id === entry.propertyId) || PROPERTIES[0];
              const isOccupied = entry.status === 'occupied';

              return (
                <div
                  key={entry.id}
                  className={`acc-tracker-card${isOccupied ? ' is-occupied' : ' is-vacant'}`}
                >
                  <div className="acc-card-main">
                    {/* Room & Status */}
                    <div className="acc-card-top-row">
                      <div className="acc-card-room-badge">
                        <span className="acc-room-label">ROOM</span>
                        <strong className="acc-room-val">{entry.roomNumber}</strong>
                      </div>

                      <span className="acc-loc-pill">
                        {prop.name}
                      </span>

                      <button
                        type="button"
                        className={`acc-status-tag${isOccupied ? ' is-occupied' : ' is-vacant'}`}
                        onClick={() => handleToggleStatus(entry.id, entry.status, entry.roomNumber)}
                        title="Click to toggle status between Occupied and Vacant"
                      >
                        <span className="acc-status-dot" />
                        <span>{isOccupied ? 'Occupied' : 'Vacant'}</span>
                      </button>
                    </div>

                    {/* Guest Name & Number */}
                    <div className="acc-card-guest-info">
                      <div className="acc-guest-name-row">
                        <span className="acc-detail-label">Guest:</span>
                        <strong className="acc-guest-name">
                          {entry.guestName || <em className="acc-unnamed">Name not specified</em>}
                        </strong>
                      </div>

                      {entry.guestPhone && (
                        <div className="acc-guest-phone-row">
                          <span className="acc-detail-label">Phone:</span>
                          <span className="acc-phone-val">{entry.guestPhone}</span>
                          <a
                            href={`tel:${entry.guestPhone.replace(/[^\d+]/g, '')}`}
                            className="acc-phone-action"
                            title="Call guest"
                          >
                            📞 Call
                          </a>
                          <a
                            href={`https://wa.me/${entry.guestPhone.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="acc-phone-action is-whatsapp"
                            title="Message on WhatsApp"
                          >
                            💬 WhatsApp
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Dates / Timings */}
                    <div className="acc-card-dates-row">
                      <span className="acc-dates-pill">
                        📅 {formatDateShort(entry.checkIn)} → {formatDateShort(entry.checkOut)}
                      </span>
                      <span className="acc-timings-note">
                        {prop.flexibleTimings
                          ? 'Flexible Timings'
                          : '12 Dec 9 AM → 13 Dec 7 AM'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="acc-card-actions">
                    <button
                      type="button"
                      className={`acc-card-btn${isOccupied ? ' is-vacate' : ' is-allocate'}`}
                      onClick={() => handleToggleStatus(entry.id, entry.status, entry.roomNumber)}
                    >
                      {isOccupied ? 'Mark Vacant' : 'Mark Occupied'}
                    </button>

                    <button
                      type="button"
                      className="acc-card-btn is-edit"
                      onClick={() => handleStartEdit(entry)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      className="acc-card-btn is-delete"
                      onClick={() => setDeleteConfirmId(entry.id)}
                      title="Remove entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Change Host PIN Dialog */}
      <ChangePinDialog
        open={showChangePin}
        onClose={() => setShowChangePin(false)}
        onSuccess={() => showToast('🔑 Host PIN updated successfully!')}
      />

      {/* Confirm Delete Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          open={Boolean(deleteConfirmId)}
          title="Remove Room Entry?"
          message="Are you sure you want to delete this room allocation entry from the tracker?"
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={async () => {
            await handleDeleteEntry(deleteConfirmId);
            setDeleteConfirmId(null);
          }}
          onClose={() => setDeleteConfirmId(null)}
        />
      )}
    </section>
  );
}
