import { useLanguage } from '../context/LanguageContext';

function FinalSection() {
  const { t } = useLanguage();

  return (
    <section className="final-section">
      <div className="final-decor">{t('final.decor', '❀ ❁ ❀')}</div>
      <p className="eyebrow light-text">{t('final.eyebrow', 'YOUR PRESENCE IS OUR BLESSING')}</p>
      <h2>{t('final.title', "We Can't Wait to Celebrate With You")}</h2>
      <p className="final-date">{t('final.date', '12 December 2026')}</p>
      <p className="telugu light-telugu">{t('final.waiting', 'మీ రాక కోసం ఎదురుచూస్తూ...')}</p>
      <div className="final-names">
        <span>{t('hero.groomFirstName', 'Bhuvan')}</span>
        <span>&hearts;</span>
        <span>{t('hero.brideFirstName', 'Manasa')}</span>
      </div>
    </section>
  );
}

export default FinalSection;
