import { useLanguage } from '../context/LanguageContext';

function Hero({ onExplore }) {
  const { t } = useLanguage();

  const handleClick = (e) => {
    if (onExplore) {
      e.preventDefault();
      onExplore();
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-floral hero-floral-left"></div>
      <div className="hero-floral hero-floral-right"></div>
      <div className="hero-content reveal">
        <p className="eyebrow light-text">{t('hero.blessings', 'WITH THE BLESSINGS OF OUR FAMILIES')}</p>
        <br />
        <div className="hero-om">ॐ</div>
        <p className="hero-intro">{t('hero.intro', 'Two hearts • One beautiful journey')}</p>
        <br />
        <br />
        <h1>
          <span>{t('hero.groomFirstName', 'Bhuvan')}</span>
          <i>&hearts;</i>
          <span>{t('hero.brideFirstName', 'Manasa')}</span>
        </h1>
        <a
          href="#countdown"
          onClick={handleClick}
          className="scroll-button"
          style={{ touchAction: 'manipulation' }}
        >
          {t('hero.explore', 'Explore our celebration ↓')}
        </a>
      </div>
    </section>
  );
}

export default Hero;
