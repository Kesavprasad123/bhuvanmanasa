import { useLanguage } from '../context/LanguageContext';

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const featureImgSrc = `${cleanBase}assets/feature-img.webp`;

function FeatureImage() {
  const { t, language } = useLanguage();
  const isIndic = language !== 'en';

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
      <div className={`feature-copy reveal${isIndic ? ' is-indic' : ''}`}>
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
