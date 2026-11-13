import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer>
      <p>{t('footer.madeWithLove', 'Made with love for a beautiful beginning')}</p>
      <p>{t('footer.blessing1', 'సకుటుంబ సపరివార సమేతంగా విచ్చేసి')}</p>
      <p>
        {t(
          'footer.blessing2',
          'మంగళ వాయిద్యాలతో, మేళతాళాలతో, మూడు ముళ్ల బంధంతో, నవనూతన జీవితంలోకి అడుగులు వేస్తూ స్వాగతం పలికే ఈ నూతన వధూవరులకు ఆశీస్సులు అందించాలని కోరుతున్నాము…'
        )}
      </p>
      <span>❦</span>

      <div className="footer-appreciation">
        <p className="appreciation-label">{t('footer.appreciationLabel', 'With Love & Gratitude')}</p>
        <p className="appreciation-text">{t('footer.designedBy', 'Website lovingly designed & developed by')}</p>
        <p className="appreciation-names">{t('footer.designerNames', 'Madhavi & Kesava')}</p>
        <p className="appreciation-relation">{t('footer.relation', "(Groom's Younger Sister & Brother)")}</p>
      </div>

      <div className="copyright">
        {t('footer.copyright', '© 2026 Bhuvan ♥ Manasa')}
        <br />
        {t('footer.allRights', 'All Rights Reserved.')}
      </div>
    </footer>
  );
}

export default Footer;
