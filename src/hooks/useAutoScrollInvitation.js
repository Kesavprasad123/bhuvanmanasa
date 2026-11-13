import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to control the cinematic auto-scroll experience when
 * a user taps "Explore our celebration ↓" in the Hero section.
 *
 * Requirements:
 * 1. Smoothly and slowly scroll down to the Countdown / Scratch Card section.
 * 2. Auto-reveal the scratch card with celebratory bursts and romantic transitions.
 * 3. Pause briefly so the guest can admire the revealed date and time.
 * 4. Continue scrolling very slowly through the entire celebration till the end of the page.
 * 5. If no one taps the button, do nothing (keep everything default and manual).
 * 6. If the user touches or manually scrolls during the auto-scroll, stop cleanly.
 */
export default function useAutoScrollInvitation() {
  const [scratchAutoReveal, setScratchAutoReveal] = useState(false);
  const isAutoScrollingRef = useRef(false);
  const rafIdRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const hasRevealedRef = useRef(false);

  const stopAutoScroll = useCallback(() => {
    isAutoScrollingRef.current = false;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    window.removeEventListener('wheel', handleUserInterrupt);
    window.removeEventListener('touchstart', handleUserInterrupt);
    window.removeEventListener('pointerdown', handleUserInterrupt);
    window.removeEventListener('keydown', handleUserInterrupt);
  }, []);

  const handleUserInterrupt = useCallback((e) => {
    // Ignore clicks originating from the explore button itself
    if (
      e &&
      e.target &&
      typeof e.target.closest === 'function' &&
      e.target.closest('.scroll-button')
    ) {
      return;
    }
    stopAutoScroll();
  }, [stopAutoScroll]);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    isAutoScrollingRef.current = true;
    hasRevealedRef.current = false;

    // Attach user cancellation listeners after a small tick so the button click itself doesn't cancel
    setTimeout(() => {
      if (!isAutoScrollingRef.current) return;
      window.addEventListener('wheel', handleUserInterrupt, { passive: true });
      window.addEventListener('touchstart', handleUserInterrupt, { passive: true });
      window.addEventListener('pointerdown', handleUserInterrupt, { passive: true });
      window.addEventListener('keydown', handleUserInterrupt, { passive: true });
    }, 200);

    const getScratchCenterY = () => {
      const scratchEl =
        document.querySelector('.scratch-card') ||
        document.querySelector('.scratch-stage') ||
        document.getElementById('countdown');

      if (!scratchEl) {
        return window.innerHeight * 0.9;
      }
      const rect = scratchEl.getBoundingClientRect();
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const targetCenter = currentScroll + rect.top - (window.innerHeight - rect.height) / 2;
      return Math.max(0, targetCenter);
    };

    // Phase 1: Glide down from Hero to the Scratch Card
    const glideToScratch = () => {
      if (!isAutoScrollingRef.current) return;

      const currentY = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = getScratchCenterY();
      const diff = targetY - currentY;

      // Arrived at scratch card
      if (diff <= 4) {
        window.scrollTo(0, targetY);

        // Auto-reveal scratch card
        if (!hasRevealedRef.current) {
          hasRevealedRef.current = true;
          setScratchAutoReveal(true);
          window.dispatchEvent(new CustomEvent('wedding-auto-reveal-scratch'));
        }

        // Pause for 3.2s so the guest can admire the revealed wedding date & burst
        pauseTimerRef.current = setTimeout(() => {
          if (!isAutoScrollingRef.current) return;
          // Phase 2: Resume slow glide till end of page
          glideToEnd();
        }, 3200);

        return;
      }

      // Smooth easing step towards scratch card
      const step = Math.min(Math.max(diff * 0.045, 1.8), 5.0);
      window.scrollBy(0, step);
      rafIdRef.current = requestAnimationFrame(glideToScratch);
    };

    // Phase 2: Very slow, gentle glide through the celebration till end of page
    const glideToEnd = () => {
      if (!isAutoScrollingRef.current) return;

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      );
      const currentY = window.pageYOffset || document.documentElement.scrollTop;

      // Reached the end of the page
      if (currentY >= maxScroll - 3) {
        stopAutoScroll();
        return;
      }

      // "slowly very slowly" — approx 90-100px per second at 60fps
      const speed = 1.6;
      window.scrollBy(0, speed);
      rafIdRef.current = requestAnimationFrame(glideToEnd);
    };

    // Start Phase 1
    rafIdRef.current = requestAnimationFrame(glideToScratch);
  }, [stopAutoScroll, handleUserInterrupt]);

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  return {
    scratchAutoReveal,
    startAutoScroll,
    stopAutoScroll,
  };
}
