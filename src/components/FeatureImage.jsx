import { useLanguage } from '../context/LanguageContext';

const BASE = import.meta.env.BASE_URL || './';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const featureImgSrc = `${cleanBase}assets/feature-img.webp`;

function FeatureImage() {
  const { t } = useLanguage();

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
      <div className="feature-copy reveal">
        <p>{t('gallery.featureEyebrow', 'THE BEGINNING OF FOREVER')}</p>
        <br />
        <h2>
          <span>{t('hero.groomFirstName', 'Bhuvan')}</span>
          <i>&hearts;</i>
          <span>{t('hero.brideFirstName', 'Manasa')}</span>
        </h2>
        <span>{t('gallery.featureDate', '12 • 12 • 2026')}</span>
      </div>
    </section>
  );
}

export default FeatureImage;
