import { useState, useEffect, useRef, useCallback } from 'react';

export const SONG_FILES = [
  'assets/Ubhayakushala.mp3',
  'assets/Raarandoi-veduka-choodham.mp3',
  'assets/Alanati-Ramachandrudu.mp3',
  'assets/kalyanam-vybhogam.mp3',
  'assets/marriage.mp3',
  'assets/shararat.mp3',
  'assets/Shatamanam-Bhavati.mp3',
  'assets/jaya-mangalam.mp3',
];

/**
 * Resolves static asset URL relative to root deployment path.
 * Works on domain root (/), GitHub Pages subpath (/repo/), and local dev server,
 * from both / and /accommodation/ or /gallery/.
 * Ensures every path component is safely URI-encoded for Android & all browsers.
 */
export function getRootAssetUrl(relativePath) {
  const cleanRelative = relativePath.replace(/^\/+/, '');
  if (typeof window === 'undefined') return `/${cleanRelative}`;
  const pathname = window.location.pathname || '';
  const root = pathname.replace(/\/(?:accommodation|gallery)(?:\/.*)?$/i, '').replace(/\/index\.html$/i, '').replace(/\/$/, '');
  const base = root ? `${root}/` : '/';
  const encodedPath = cleanRelative
    .split('/')
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join('/');
  return `${base}${encodedPath}`;
}

export const WEDDING_LAST_SONG_KEY = 'weddingLastSongIndex';

// Module-level cache: ensured to calculate next song ONCE per page refresh
let pageLoadStartingIndex = null;

export function getNextRefreshSongIndex() {
  if (pageLoadStartingIndex !== null) {
    return pageLoadStartingIndex;
  }

  try {
    const raw = localStorage.getItem(WEDDING_LAST_SONG_KEY);
    if (raw === null) {
      pageLoadStartingIndex = 0;
      localStorage.setItem(WEDDING_LAST_SONG_KEY, '0');
      return 0;
    }

    const prev = parseInt(raw, 10);
    const validPrev = !isNaN(prev) && prev >= 0 ? prev : 0;
    const next = (validPrev + 1) % SONG_FILES.length;

    pageLoadStartingIndex = next;
    localStorage.setItem(WEDDING_LAST_SONG_KEY, String(next));
    return next;
  } catch {
    pageLoadStartingIndex = 0;
    return 0;
  }
}

/**
 * Shared wedding background music hook for Main Invitation & Accommodation.
 *
 * Requirements handled:
 * 1. Immediate playback on site open: User tap starts song without delay.
 * 2. Sequential auto-play: When a song completes, automatically advances to the next song (never repeats).
 * 3. On every refresh: Guaranteed to start with a different song in rotation.
 * 4. Cross-page continuity: Seamlessly keeps playing when switching to Accommodation and back.
 */
export function useWeddingMusic({ autoStartIfActive = false } = {}) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize with the freshly rotated song for this page load
  const [currentSongIndex, setCurrentSongIndex] = useState(() => getNextRefreshSongIndex());
  const songIndexRef = useRef(currentSongIndex);

  // Save playback state before unloading
  useEffect(() => {
    const handleBeforeUnload = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        try {
          sessionStorage.setItem('weddingMusicActive', 'true');
          sessionStorage.setItem('weddingSongIndex', String(songIndexRef.current));
          sessionStorage.setItem('weddingSongTime', String(audio.currentTime || 0));
        } catch {}
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Continuously record playback position so transitions or refreshes can resume seamlessly
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let lastSaved = 0;
    const handleTimeUpdate = () => {
      const now = Date.now();
      if (now - lastSaved > 1000) {
        lastSaved = now;
        try {
          if (!audio.paused) {
            sessionStorage.setItem('weddingMusicActive', 'true');
            sessionStorage.setItem('weddingSongIndex', String(songIndexRef.current));
            sessionStorage.setItem('weddingSongTime', String(audio.currentTime || 0));
          }
        } catch {}
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const errorRetriesRef = useRef(0);

  const playSongAtIndex = useCallback(async (index, startTime = 0) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Guarantee index is a valid integer number
    const num = typeof index === 'number' && !isNaN(index) ? index : 0;
    const safeIndex = ((num % SONG_FILES.length) + SONG_FILES.length) % SONG_FILES.length;

    songIndexRef.current = safeIndex;
    setCurrentSongIndex(safeIndex);
    pageLoadStartingIndex = safeIndex;

    try {
      localStorage.setItem(WEDDING_LAST_SONG_KEY, String(safeIndex));
      sessionStorage.setItem('weddingMusicActive', 'true');
    } catch {}

    let targetFile = SONG_FILES[safeIndex];
    if (
      targetFile === 'assets/Ubhayakushala.mp3' &&
      typeof audio.canPlayType === 'function' &&
      audio.canPlayType('audio/mp4')
    ) {
      targetFile = 'assets/Ubhayakushala.m4a';
    }

    const songUrl = getRootAssetUrl(targetFile);
    const currentSrc = audio.getAttribute('src') || audio.src || '';
    const isSameSrc =
      currentSrc === songUrl ||
      currentSrc.endsWith(targetFile) ||
      currentSrc.endsWith(encodeURI(targetFile));

    if (!isSameSrc) {
      audio.src = songUrl;
      try {
        audio.load();
      } catch {}
    }

    // Safely set startTime after metadata is loaded (prevents Android InvalidStateError)
    if (startTime > 0) {
      if (audio.readyState >= 1) {
        try {
          audio.currentTime = startTime;
        } catch {}
      } else {
        const handleLoadedMetadata = () => {
          try {
            audio.currentTime = startTime;
          } catch {}
        };
        audio.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
      }
    }

    try {
      audio.volume = 0.7;
    } catch {}

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setMusicPlaying(true);
      errorRetriesRef.current = 0;
    } catch (err) {
      console.warn('Wedding music play deferred until user interaction:', err && err.message);
      setMusicPlaying(false);
    }
  }, []);

  const playNextSong = useCallback(() => {
    const currentIndex = typeof songIndexRef.current === 'number' ? songIndexRef.current : 0;
    const nextIndex = (currentIndex + 1) % SONG_FILES.length;
    playSongAtIndex(nextIndex, 0);
  }, [playSongAtIndex]);

  const startMusic = useCallback(() => {
    errorRetriesRef.current = 0;
    const currentIndex = typeof songIndexRef.current === 'number' ? songIndexRef.current : 0;
    playSongAtIndex(currentIndex, 0);
  }, [playSongAtIndex]);

  const stopMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setMusicPlaying(false);
    try {
      sessionStorage.setItem('weddingMusicActive', 'false');
      sessionStorage.removeItem('weddingSongTime');
    } catch {}
  }, []);

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
    setMusicPlaying(false);
  }, []);

  const resumeMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio && (audio.src || audio.getAttribute('src'))) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicPlaying(true);
            try {
              sessionStorage.setItem('weddingMusicActive', 'true');
            } catch {}
          })
          .catch(() => {
            startMusic();
          });
      }
    } else {
      startMusic();
    }
  }, [startMusic]);

  const toggleMusic = useCallback(() => {
    if (musicPlaying) {
      stopMusic();
    } else {
      const audio = audioRef.current;
      if (audio && (audio.src || audio.getAttribute('src')) && audio.currentTime > 0) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setMusicPlaying(true);
              try {
                sessionStorage.setItem('weddingMusicActive', 'true');
              } catch {}
            })
            .catch(() => {
              startMusic();
            });
        }
      } else {
        startMusic();
      }
    }
  }, [musicPlaying, startMusic, stopMusic]);

  // Handle song completion: automatically play next song in playlist
  const handleSongEnded = useCallback(() => {
    errorRetriesRef.current = 0;
    playNextSong();
  }, [playNextSong]);

  const handleAudioError = useCallback((e) => {
    console.warn('Audio error encountered:', e);
    // Prevent rapid infinite error looping on Android
    if (errorRetriesRef.current < 2) {
      errorRetriesRef.current += 1;
      setTimeout(() => {
        playNextSong();
      }, 300);
    } else {
      setMusicPlaying(false);
    }
  }, [playNextSong]);

  // Auto-start on pages like Accommodation if music was already active in the session
  useEffect(() => {
    if (!autoStartIfActive) return;

    let wasActive = false;
    let savedTime = 0;
    try {
      wasActive = sessionStorage.getItem('weddingMusicActive') === 'true';
      const storedTime = parseFloat(sessionStorage.getItem('weddingSongTime') || '0');
      if (!isNaN(storedTime) && storedTime > 0) {
        savedTime = storedTime;
      }
    } catch {}

    if (wasActive) {
      const idx = typeof songIndexRef.current === 'number' ? songIndexRef.current : 0;
      playSongAtIndex(idx, savedTime);
    }
  }, [autoStartIfActive, playSongAtIndex]);

  return {
    audioRef,
    musicPlaying,
    currentSongIndex,
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    toggleMusic,
    playNextSong,
    handleSongEnded,
    handleAudioError,
  };
}

export default useWeddingMusic;
