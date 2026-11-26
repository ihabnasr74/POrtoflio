import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomCursor } from './components/CustomCursor';
import { GlobalAmbientBackdrop } from './components/GlobalAmbientBackdrop';
import { FrostViewportOverlay } from './components/FrostViewportOverlay';
import { Navbar } from './components/Navbar';
import { IntroEmblemHero } from './components/IntroEmblemHero';
import { HeroSection } from './components/HeroSection';
import { EditorialMarquee } from './components/EditorialMarquee';
import { PinnedShowcase } from './components/PinnedShowcase';
import { AboutMonograph } from './components/AboutMonograph';
import { SelectedWorks } from './components/SelectedWorks';
import { IcedFlavorsSection } from './components/IcedFlavorsSection';
import { FullScreenExhibition } from './components/FullScreenExhibition';
import { ExpertiseSection } from './components/ExpertiseSection';
import { ProjectModal } from './components/ProjectModal';
import { ContactFooter } from './components/ContactFooter';
import { PORTFOLIO_PROJECTS } from './data/portfolioData';

import { computeLogoDockProgress } from './utils/logoDock';
import { unlockCrtAudio } from './utils/crtAudio';
import { syncSensorySoundscape } from './utils/sensoryAudio';
import {
  classifyPlateSensoryMood,
  resolveActiveSensoryMood,
  type SensoryMood,
} from './utils/sensoryMood';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logoDockProgress, setLogoDockProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  const lenisRef = useRef<Lenis | null>(null);

  const [isIcedFreezeActive, setIsIcedFreezeActive] = useState(false);
  const [heroAudioState, setHeroAudioState] = useState<{
    visible: boolean;
    mood: SensoryMood;
  }>({ visible: false, mood: 'neutral' });
  const [exhibitionAudioState, setExhibitionAudioState] = useState<{
    visible: boolean;
    mood: SensoryMood;
  }>({ visible: false, mood: 'neutral' });

  const modalMood = useMemo<SensoryMood | null>(() => {
    if (!activeProjectId) return null;
    const proj = PORTFOLIO_PROJECTS.find((p) => p.id === activeProjectId);
    if (!proj) return null;
    return classifyPlateSensoryMood({
      projectId: proj.id,
      caption: proj.title,
      subSeries: proj.subtitle,
    });
  }, [activeProjectId]);

  const activeSensoryMood = useMemo(
    () =>
      resolveActiveSensoryMood({
        isMuted,
        modalMood,
        icedInView: isIcedFreezeActive,
        exhibitionInView: exhibitionAudioState.visible,
        exhibitionMood: exhibitionAudioState.mood,
        heroInView: heroAudioState.visible,
        heroMood: heroAudioState.mood,
      }),
    [
      isMuted,
      modalMood,
      isIcedFreezeActive,
      exhibitionAudioState.visible,
      exhibitionAudioState.mood,
      heroAudioState.visible,
      heroAudioState.mood,
    ]
  );

  useEffect(() => {
    syncSensorySoundscape(activeSensoryMood, isMuted);
  }, [activeSensoryMood, isMuted]);

  const handleHeroMoodStateChange = useCallback(
    (visible: boolean, mood: SensoryMood) => {
      setHeroAudioState((prev) =>
        prev.visible === visible && prev.mood === mood ? prev : { visible, mood }
      );
    },
    []
  );

  const handleExhibitionMoodStateChange = useCallback(
    (visible: boolean, mood: SensoryMood) => {
      setExhibitionAudioState((prev) =>
        prev.visible === visible && prev.mood === mood ? prev : { visible, mood }
      );
    },
    []
  );

  useEffect(() => {
    const handleFirstGesture = () => {
      unlockCrtAudio(isMutedRef.current);
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleToggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (!nextMuted) {
        unlockCrtAudio(false);
      }
      return nextMuted;
    });
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateProgress = () => {
      const y = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(y / maxScroll);
      }
      const dockEnd = Math.max(320, window.innerHeight * 0.58);
      setLogoDockProgress(computeLogoDockProgress(y, 0, dockEnd));
    };

    updateProgress();

    if (reduced) {
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      return () => {
        window.removeEventListener('scroll', updateProgress);
        window.removeEventListener('resize', updateProgress);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      updateProgress();
    });

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    const handleNativeScroll = () => {
      ScrollTrigger.update();
      updateProgress();
    };

    const refreshTriggers = () => {
      ScrollTrigger.refresh();
      updateProgress();
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    window.addEventListener('load', refreshTriggers);
    document.fonts?.ready.then(refreshTriggers).catch(() => {});

    const rafRefresh = requestAnimationFrame(refreshTriggers);

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      cancelAnimationFrame(rafRefresh);
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('load', refreshTriggers);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (activeProjectId) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [activeProjectId]);

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    if (lenisRef.current) {
      if (sectionId === 'intro') {
        lenisRef.current.scrollTo(0);
      } else if (sectionId === 'exhibition') {
        lenisRef.current.scrollTo(target, { offset: 0 });
      } else {
        lenisRef.current.scrollTo(target, { offset: -64 });
      }
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      data-active-mood={activeSensoryMood}
      className="relative min-h-screen bg-[#050506] text-[#F4F1EA]"
    >
      <GlobalAmbientBackdrop />
      <FrostViewportOverlay isActive={isIcedFreezeActive} />
      <CustomCursor />

      <Navbar
        scrollProgress={scrollProgress}
        logoDockProgress={logoDockProgress}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onNavigate={scrollToSection}
      />

      <main className="relative z-10">
        <IntroEmblemHero
          onEnterPortfolio={() => scrollToSection('hero')}
          logoDockProgress={logoDockProgress}
        />
        <HeroSection
          onExploreWorks={() => scrollToSection('selected-works')}
          onSelectProject={setActiveProjectId}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onHeroMoodStateChange={handleHeroMoodStateChange}
        />
        <EditorialMarquee />
        <PinnedShowcase onSelectProject={setActiveProjectId} />
        <AboutMonograph />
        <SelectedWorks onSelectProject={setActiveProjectId} />
        <IcedFlavorsSection
          onSelectProject={setActiveProjectId}
          onFreezeActiveChange={setIsIcedFreezeActive}
        />
        <FullScreenExhibition
          onSelectProject={setActiveProjectId}
          onBackToWorks={() => scrollToSection('selected-works')}
          onSkipToExpertise={() => scrollToSection('expertise')}
          onExhibitionMoodStateChange={handleExhibitionMoodStateChange}
        />
        <ExpertiseSection onSelectProject={setActiveProjectId} />
      </main>

      <div className="relative z-10">
        <ContactFooter />
      </div>

      <ProjectModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
        onSelectProject={setActiveProjectId}
      />
    </div>
  );
}
