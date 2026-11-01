import useScrollReveal from '../hooks/useScrollReveal';
import MusicToggle from './MusicToggle';
import FloatingNav from './FloatingNav';
import Hero from './Hero';
import Countdown from './Countdown';
import Families from './Families';
import Events from './Events';
import HomeVideoSection from './HomeVideoSection';
import FeatureImage from './FeatureImage';
import Gallery from './Gallery';
import Venue from './Venue';
import FinalSection from './FinalSection';
import Footer from './Footer';

function MainInvitation({
  musicPlaying,
  onToggleMusic,
  isDark,
  onToggleTheme,
  onNavigateToAccommodation,
  onNavigateToGallery,
  onPauseMusic,
  onResumeMusic,
}) {
  useScrollReveal(true);

  return (
    <main id="site">
      <MusicToggle playing={musicPlaying} onToggle={onToggleMusic} />
      <FloatingNav
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNavigateToAccommodation={onNavigateToAccommodation}
        onNavigateToGallery={onNavigateToGallery}
      />
      <Hero />
      <Countdown />
      <Families />
      <Events />
      <HomeVideoSection
        onNavigateToGallery={onNavigateToGallery}
        onPauseMusic={onPauseMusic}
        onResumeMusic={onResumeMusic}
      />
      <FeatureImage />
      <Gallery />
      <Venue />
      <FinalSection />
      <Footer />
    </main>
  );
}

export default MainInvitation;
