import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const featureImgSrc = `${cleanBase}assets/feature-img.webp`;

function FeatureImage() {
  const { t, language } = useLanguage();
  const copyRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;

    if (el.classList.contains('visible') && !revealed) {
      setRevealed(true);
      return;
    }

    const checkVisibility = () => {
      const node = copyRef.current;
      if (!node) return;
      if (node.classList.contains('visible')) {
        setRevealed(true);
        return;
      }
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (rect.top < vh + 160 && rect.bottom > -160) {
        node.classList.add('visible');
        setRevealed(true);
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [revealed, language]);

  return (
    <section className="feature-section">
      <img
        src={featureImgSrc}
        alt="Sita Rama Kalyanam - Sacred union of Bhuvan and Manasa"
        loading="lazy"
        decoding="async"
        width="1672"
        height="941"
        sizes="100vw"
      />
      <div className="feature-overlay"></div>
      <div
        ref={copyRef}
        className={`feature-copy reveal${revealed ? ' visible' : ''}`}
      >
        <p className="feature-eyebrow">{t('gallery.featureEyebrow', 'THE BEGINNING OF FOREVER')}</p>
        <h2 className="feature-names">
          <span className="feature-name">{t('hero.groomFirstName', 'Bhuvan')}</span>
          <span className="feature-heart" aria-hidden="true">&hearts;</span>
          <span className="feature-name">{t('hero.brideFirstName', 'Manasa')}</span>
        </h2>
        <span className="feature-date">{t('gallery.featureDate', '12 • 12 • 2026')}</span>
      </div>
    </section>
  );
}

export default FeatureImage;
