import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { PORTFOLIO_PROJECTS, type PortfolioProject } from '../data/portfolioData';
import { getAdjacentProjectIds } from '../utils/portfolioFilters';
import { ArtworkImage } from './ArtworkImage';

interface ProjectModalProps {
  projectId: string | null;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
}

export function ProjectModal({
  projectId,
  onClose,
  onSelectProject,
}: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project: PortfolioProject | undefined = PORTFOLIO_PROJECTS.find(
    (p) => p.id === projectId
  );

  const { prevId, nextId } = getAdjacentProjectIds(PORTFOLIO_PROJECTS, projectId);
  const prevProject = PORTFOLIO_PROJECTS.find((p) => p.id === prevId);
  const nextProject = PORTFOLIO_PROJECTS.find((p) => p.id === nextId);

  useEffect(() => {
    setLightboxIndex(null);
  }, [projectId]);

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      } else if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((i) =>
            i === null ? 0 : (i + 1) % project.images.length
          );
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((i) =>
            i === null ? 0 : (i - 1 + project.images.length) % project.images.length
          );
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, lightboxIndex, onClose]);

  if (!project) return null;

  const activeLightboxImage =
    lightboxIndex !== null ? project.images[lightboxIndex] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Case Study`}
      data-testid="project-showcase-modal"
      className="fixed inset-0 z-[70] bg-[#050506]/96 backdrop-blur-md overflow-y-auto"
    >
      {/* Sticky Top Modal Header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#050506]/90 backdrop-blur-md px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono tabular-nums text-xs text-[#C8A46B]">
            {project.index}
          </span>
          <span aria-hidden="true" className="text-white/25">
            /
          </span>
          <span className="text-sm font-medium text-[#F4F1EA] truncate">
            {project.title}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close project showcase"
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] text-xs font-medium tracking-[0.12em] uppercase border border-white/15 bg-[#0C0C0F] text-[#F4F1EA] hover:border-[#C8A46B] hover:text-[#C8A46B] transition-colors cursor-pointer shrink-0"
        >
          <span>Close</span>
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Main Showcase Body */}
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12 py-10 md:py-16">
        {/* Editorial Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-b border-white/10 pb-10 md:pb-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#C8A46B]">
              <span>{project.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{project.categories.join(' · ')}</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F4F1EA] [text-wrap:balance]">
              {project.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#B8B2A7] max-w-2xl">
              {project.summary}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-[#9A958C]">
                Scope &amp; Deliverables
              </p>
              <ul className="mt-2.5 space-y-1.5 text-sm text-[#F4F1EA]">
                {project.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="text-[#C8A46B]" aria-hidden="true">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-[#9A958C] pt-2 border-t border-white/10">
              <span>Original Artwork Preserved Unmodified</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span className="font-mono tabular-nums text-[#F4F1EA]">
                {project.images.length}{' '}
                {project.images.length === 1 ? 'Plate' : 'Plates'}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Layout Original Artwork Gallery */}
        <div className="mt-12 space-y-10">
          {/* Featured First Plate Full-Width */}
          <figure className="border border-white/10 bg-[#0A0A0D]">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={`Zoom artwork: ${project.images[0].caption}`}
              data-cursor="Zoom"
              className="group relative w-full flex items-center justify-center bg-[#09090C] p-3 sm:p-6 cursor-pointer"
            >
              <ArtworkImage
                src={project.images[0].src}
                alt={project.images[0].alt}
                fit="contain"
                priority
                className="max-h-[72vh] w-auto max-w-full transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-[#050506]/85 border border-white/15 text-[#F4F1EA] opacity-90 group-hover:border-[#C8A46B]">
                <Maximize2 className="w-3.5 h-3.5 text-[#C8A46B]" aria-hidden="true" />
                <span>Inspect Plate</span>
              </span>
            </button>
            <figcaption className="px-5 py-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#B8B2A7]">
              <span>{project.images[0].caption}</span>
              <span className="font-mono tabular-nums text-[#9A958C]">
                Plate 01 / {String(project.images.length).padStart(2, '0')}
              </span>
            </figcaption>
          </figure>

          {/* Remaining Plates in Balanced 2-Column Editorial Gallery */}
          {project.images.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.images.slice(1).map((img, idx) => {
                const realIdx = idx + 1;
                const isLastOddWide =
                  img.aspect === 'landscape' &&
                  realIdx === project.images.length - 1 &&
                  (project.images.length - 1) % 2 === 1;

                return (
                  <figure
                    key={img.src}
                    className={`border border-white/10 bg-[#0A0A0D] flex flex-col justify-between ${
                      isLastOddWide ? 'md:col-span-2' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(realIdx)}
                      aria-label={`Zoom artwork: ${img.caption}`}
                      data-cursor="Zoom"
                      className="group relative flex-1 flex items-center justify-center bg-[#09090C] p-3 sm:p-5 cursor-pointer"
                    >
                      <ArtworkImage
                        src={img.src}
                        alt={img.alt}
                        fit="contain"
                        className="max-h-[540px] w-auto max-w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                      />
                      <span className="absolute bottom-3 right-3 p-2 bg-[#050506]/85 border border-white/15 text-[#F4F1EA] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5 text-[#C8A46B]" aria-hidden="true" />
                      </span>
                    </button>
                    <figcaption className="px-4 py-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-[#B8B2A7]">
                      <span className="truncate">{img.caption}</span>
                      <span className="font-mono tabular-nums text-[#9A958C] shrink-0">
                        {String(realIdx + 1).padStart(2, '0')}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          )}
        </div>

        {/* Seamless Project-to-Project Navigation */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevProject && (
            <button
              type="button"
              onClick={() => onSelectProject(prevProject.id)}
              className="group flex items-center justify-between gap-4 p-5 border border-white/10 bg-[#0A0A0D] hover:border-[#C8A46B] transition-colors text-left cursor-pointer"
            >
              <div>
                <span className="text-[11px] tracking-[0.16em] uppercase text-[#9A958C]">
                  Previous Project
                </span>
                <p className="mt-1 text-base font-medium text-[#F4F1EA] group-hover:text-[#C8A46B] transition-colors">
                  {prevProject.title}
                </p>
              </div>
              <ArrowLeft
                className="w-4 h-4 text-[#9A958C] group-hover:text-[#C8A46B]"
                aria-hidden="true"
              />
            </button>
          )}

          {nextProject && (
            <button
              type="button"
              onClick={() => onSelectProject(nextProject.id)}
              className="group flex items-center justify-between gap-4 p-5 border border-white/10 bg-[#0A0A0D] hover:border-[#C8A46B] transition-colors text-left cursor-pointer"
            >
              <div>
                <span className="text-[11px] tracking-[0.16em] uppercase text-[#9A958C]">
                  Next Project
                </span>
                <p className="mt-1 text-base font-medium text-[#F4F1EA] group-hover:text-[#C8A46B] transition-colors">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 text-[#9A958C] group-hover:text-[#C8A46B]"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>

      {/* Unobstructed Fullscreen Lightbox Viewer */}
      {activeLightboxImage && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Artwork Lightbox"
          className="fixed inset-0 z-[80] bg-black/95 flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-[#B8B2A7]">
              {activeLightboxImage.caption} ·{' '}
              <span className="font-mono tabular-nums text-[#C8A46B]">
                {lightboxIndex + 1} / {project.images.length}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs uppercase tracking-[0.12em] border border-white/20 bg-[#0C0C0F] text-[#F4F1EA] hover:border-[#C8A46B] cursor-pointer shrink-0"
            >
              <span>Exit</span>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <ArtworkImage
              src={activeLightboxImage.src}
              alt={activeLightboxImage.alt}
              fit="contain"
              priority
              className="max-h-[82vh] max-w-full w-auto"
            />
          </div>

          {project.images.length > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous plate"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + project.images.length) %
                      project.images.length
                  )
                }
                className="px-5 py-2.5 min-h-[44px] text-xs uppercase tracking-wider border border-white/15 bg-[#0C0C0F] text-[#F4F1EA] hover:border-[#C8A46B] cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                aria-label="Next plate"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % project.images.length)
                }
                className="px-5 py-2.5 min-h-[44px] text-xs uppercase tracking-wider border border-white/15 bg-[#0C0C0F] text-[#F4F1EA] hover:border-[#C8A46B] cursor-pointer inline-flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
