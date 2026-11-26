import type { PortfolioCategory, PortfolioProject } from '../data/portfolioData';

export interface InquiryFormState {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export interface InquiryValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof InquiryFormState, string>>;
}

export function filterProjectsByCategory(
  projects: PortfolioProject[],
  category: PortfolioCategory
): PortfolioProject[] {
  if (category === 'All Works') {
    return projects;
  }
  return projects.filter((project) => project.categories.includes(category));
}

export function getCategoryCounts(
  projects: PortfolioProject[],
  categories: PortfolioCategory[]
): Record<PortfolioCategory, number> {
  const counts = {} as Record<PortfolioCategory, number>;
  for (const cat of categories) {
    counts[cat] = filterProjectsByCategory(projects, cat).length;
  }
  return counts;
}

export function getAdjacentProjectIds(
  projects: PortfolioProject[],
  activeId: string | null
): { prevId: string | null; nextId: string | null } {
  if (!activeId || projects.length === 0) {
    return { prevId: null, nextId: null };
  }
  const idx = projects.findIndex((p) => p.id === activeId);
  if (idx === -1) {
    return { prevId: null, nextId: null };
  }
  const prevIndex = (idx - 1 + projects.length) % projects.length;
  const nextIndex = (idx + 1) % projects.length;
  return {
    prevId: projects[prevIndex].id,
    nextId: projects[nextIndex].id,
  };
}

export function validateInquiryForm(form: InquiryFormState): InquiryValidationResult {
  const errors: Partial<Record<keyof InquiryFormState, string>> = {};
  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();
  const trimmedMessage = form.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your name.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (trimmedMessage.length < 10) {
    errors.message = 'Please share a brief overview (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildMailtoHref(form: InquiryFormState, recipient: string): string {
  const subject = `[Portfolio Inquiry] ${form.projectType || 'Design Project'} — ${form.name.trim()}`;
  const body = [
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Scope: ${form.projectType || 'General Inquiry'}`,
    '',
    'Project Details:',
    form.message.trim(),
  ].join('\n');

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export interface ExhibitionPlate {
  plateNumber: number;
  totalPlates: number;
  projectId: string;
  projectIndex: string;
  projectTitle: string;
  brand: string;
  primaryDiscipline: string;
  accentHex: string;
  src: string;
  alt: string;
  caption: string;
  subSeries?: string;
  aspect: 'square' | 'landscape' | 'portrait';
}

export interface ExhibitionProjectTab {
  id: string;
  label: string;
  count: number;
}

const EXHIBITION_TAB_LABELS: Record<string, string> = {
  cwench: 'CWENCH',
  'kuiq-vape': 'KUIQ Vape',
  'fitfuel-products': 'FitFuel Merch',
  'fitfuel-flavors': 'FitFuel Bars',
  'kuiq-charcoal-v1': 'Charcoal V1',
  'kuiq-charcoal-v2': 'Charcoal V2',
  'ya-layl-flavors': 'Ya Layl',
  'ya-layl-christmas': 'Holiday',
  'lyon-double-twist': 'LYON',
};

export function getExhibitionProjectTabs(
  projects: PortfolioProject[]
): ExhibitionProjectTab[] {
  const total = projects.reduce((sum, p) => sum + p.images.length, 0);
  return [
    { id: 'all', label: 'All Plates', count: total },
    ...projects.map((p) => ({
      id: p.id,
      label: EXHIBITION_TAB_LABELS[p.id] ?? p.title.split('—')[0].trim(),
      count: p.images.length,
    })),
  ];
}

export function flattenExhibitionPlates(
  projects: PortfolioProject[],
  projectId: string = 'all'
): ExhibitionPlate[] {
  const filtered =
    projectId === 'all'
      ? projects
      : projects.filter((p) => p.id === projectId);

  const flat = filtered.flatMap((project) =>
    project.images.map((image) => ({
      projectId: project.id,
      projectIndex: project.index,
      projectTitle: project.title,
      brand: project.brand,
      primaryDiscipline: project.primaryDiscipline,
      accentHex: project.accentHex,
      src: image.src,
      alt: image.alt,
      caption: image.caption,
      subSeries: image.subSeries,
      aspect: image.aspect,
    }))
  );

  return flat.map((item, idx) => ({
    ...item,
    plateNumber: idx + 1,
    totalPlates: flat.length,
  }));
}

export function getNextExhibitionIndex(
  currentIndex: number,
  delta: number,
  totalCount: number
): number {
  if (totalCount <= 0) return 0;
  return (((currentIndex + delta) % totalCount) + totalCount) % totalCount;
}
