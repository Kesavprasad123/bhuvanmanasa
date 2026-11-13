# 💍 Bhuvan & Manasa — Wedding Invitation

A beautiful and interactive digital wedding invitation website created for **Bhuvan & Manasa**.

## ✨ Features

* 🕉️ Traditional wedding-themed design
* 🪔 Lord Ganesha blessing section
* 💌 Interactive scratch & reveal date
* 🎵 Background wedding music with rotation on every refresh
* ⏳ Wedding countdown timer
* 💑 Bride & Groom details
* 📍 Wedding venue information
* 📱 Fully responsive for mobile, tablet, and desktop
* 🌸 Elegant animations and decorative elements
* 🎨 Traditional Indian wedding-inspired design

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Google Fonts

## 📱 Responsive Design

The website is designed to provide a smooth experience across:

* 📱 Mobile phones
* 💻 Laptops
* 🖥️ Desktop screens
* 📲 Tablets


## 💑 Couple

**Bhuvan & Manasa**


The expected addresses are:

* `https://bhuvanmanasa.in`
* `https://www.bhuvanmanasa.in`

## 🎶 Wedding Background Music & Rotation System

The website features an immersive, mobile-optimized wedding background soundtrack managed by `useWeddingMusic`:

* **8-Song Wedding Playlist**:
  1. `Ubhayakushala` *(Starting song in rotation, 192 kbps MP3)*
  2. `Raarandoi veduka choodham`
  3. `Alanati Ramachandrudu`
  4. `Kalyanam Vybhogam`
  5. `Marriage`
  6. `Shararat`
  7. `Shatamanam Bhavati`
  8. `Jaya Mangalam`
* **Rotation on Every Page Refresh**:
  - On every browser refresh (Cmd+R / F5), the player automatically rotates to the next song in the sequence via `getNextRefreshSongIndex()`.
  - Song index is cached at the module level so internal React re-renders or theme toggles do not skip tracks prematurely.
* **Sequential Auto-Play**:
  - When any song finishes playing naturally, it automatically advances to the next track in the playlist without repetition.
* **Continuous Audio Across Views**:
  - The single root `<audio>` element persists continuously across in-app navigation (`/`, `/accommodation/`, `/gallery/`), preventing music interruptions during page changes.
* **Mobile Efficiency**:
  - Audio uses `preload="none"` to strictly comply with mobile bandwidth standards, preventing data buffering before user interaction.

## ✨ Interactive Exploration & Auto-Reveal Scratch Card

* **"Explore our celebration ↓" Cinematic Auto-Scroll**:
  - Tapping the explore button in the Hero section starts a slow, gentle auto-scroll (~90px/sec) that glides down to the Scratch Card section.
  - Automatically scratches and reveals the golden foil with romantic dissolution, shine effects, and celebratory bursts (hearts, champagne sparkles, rose petals).
  - Pauses for ~3.2 seconds so guests can admire the revealed wedding date (`12 December 2026, 8:26 PM IST`), then continues scrolling slowly through the entire invitation.
  - Any screen tap, swipe, or scroll immediately cancels the auto-scroll and returns full manual control to the guest.
  - If the explore button is not tapped, default behavior is preserved: the card remains covered in gold foil for manual scratching.

## 🛏️ Accommodation & Room Allocation Tracker

`/accommodation` provides a live reference tracker for the two stay locations:
1. **Krishna Inn** (Danavaipeta — flexible timings on 12 Dec 2026)
2. **SVPC Convention Hall 1** (Wedding Hall — 12 Dec 9:00 AM to 13 Dec 7:00 AM)

* **Dual-Role Access Control (Host & Admin)**:
  - **Host Mode**: Protected by a 4-digit host passcode. Hosts can add guest entries, edit contact/room details, and mark rooms as Vacant. When a room is marked Vacant, it is immediately archived and hidden from both Host and Guest views. Hosts cannot delete records or alter passcodes.
  - **Admin Mode**: Protected by a confidential 4-digit administrator passcode. Administrators have full visibility into all records (both occupied and vacated history), exclusive permission to delete entries, and exclusive controls to update passcodes for both Host and Admin accounts.
  - **In-Memory Session Security**: Sessions are held in runtime memory only. **Refreshing the page automatically logs out both Host and Admin**, instantly returning devices to the read-only Guest view.
* **Tracker Controls & Validation**:
  - Requires Room Number and Guest Name for all entries.
  - Blank/empty submissions are blocked, and corrupted entries are automatically purged on load.
  - Includes quick phone calling and 1-tap WhatsApp summary generation.
  - Guests have a clean, read-only view of active allocated rooms; vacated rooms and administrative controls are strictly hidden.
## ⚡ Global Performance Standards & AI Guidelines

This project enforces strict global standards for load speed and mobile responsiveness.

- **WebP Only**: All production images must be in `.webp` format. Never use `.png` or `.jpg` in `public/assets/`.
- **Raw Photos**: Keep raw original photos in `raw_photos/` (gitignored), never in `public/assets/`.
- **AI Agent Rules**: If using AI tools (Cursor, Copilot, Antigravity, etc.), please read [AGENTS.md](./AGENTS.md). The workspace skill is located in `.agents/skills/wedding-performance-standards/SKILL.md`.
- **Standards Check**: Run `npm run check:standards` to verify compliance before committing.

## 📄 License

This project is created as a personal wedding invitation website.
