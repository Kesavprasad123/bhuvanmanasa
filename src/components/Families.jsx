import { useLanguage } from '../context/LanguageContext';

function Families() {
  const { t } = useLanguage();

  return (
    <section id="story" className="families-section section-sage">
      <div className="family-panel reveal">
        <br />
        <p className="telugu top-telugu">{t('families.mangala', 'శ్రీరస్తు • శుభమస్తు • అవిఘ్నమస్తు')}</p>
        <p className="eyebrow">{t('families.eyebrow', 'WITH LOVE & BLESSINGS')}</p>
        <h2>{t('families.title', 'Two Families, One New Beginning')}</h2>
        <p className="family-intro">
          {t('families.intro', 'With the blessings of our parents and elders, we invite you to celebrate the wedding of')}
        </p>

        <div className="couple-names">
          <div className="person">
            <span className="role">{t('families.groomRole', 'GROOM')}</span>
            <h3>{t('families.groomName', 'Bhuvan Teja Harihara Kumar')}</h3>
            <p>{t('families.sonOf', 'S/o')}</p>
            <strong>
              {t('families.groomFather', 'Kotti Venkata Subbarao')}
              <br />
              &amp; {t('families.groomMother', 'Smt. Kotti Padma Tulasi')}
            </strong>
            <br />
            <strong>{t('families.groomBrother', 'Kotti Kesava Prasad (Younger)')}</strong>
          </div>
          <div className="ampersand">{t('families.ampersand', '&')}</div>
          <div className="person">
            <span className="role">{t('families.brideRole', 'BRIDE')}</span>
            <h3>{t('families.brideName', 'Cholendra Manasa')}</h3>
            <p>{t('families.daughterOf', 'D/o')}</p>
            <strong>
              {t('families.brideFather', 'Manyapu Satya Kiran')}
              <br />
              &amp; {t('families.brideMother', 'Smt. Manyapu Sujatha (Late)')}
            </strong>
            <br />
            <strong>{t('families.brideBrother', 'Manyapu Harsha Vardhan (Younger)')}</strong>
          </div>
        </div>
        <br />

        <div className="family-blessing">{t('families.blessing', '❧ With their love, blessings & warm wishes ❧')}</div>
      </div>
    </section>
  );
}

export default Families;
