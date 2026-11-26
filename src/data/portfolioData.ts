export type PortfolioCategory =
  | 'All Works'
  | 'Brand Identity'
  | 'Packaging Design'
  | 'Product Visualization'
  | 'Advertising'
  | 'Creative Campaigns'
  | 'Visual Communication';

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'All Works',
  'Brand Identity',
  'Packaging Design',
  'Product Visualization',
  'Advertising',
  'Creative Campaigns',
  'Visual Communication',
];

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
  subSeries?: string;
  aspect: 'square' | 'landscape' | 'portrait';
}

export interface PortfolioProject {
  id: string;
  index: string;
  title: string;
  brand: string;
  subtitle: string;
  categories: Exclude<PortfolioCategory, 'All Works'>[];
  primaryDiscipline: string;
  summary: string;
  deliverables: string[];
  accentHex: string;
  coverImage: string;
  coverAlt: string;
  coverFit?: 'cover' | 'contain';
  coverBackdropSrc?: string;
  layoutHint: 'wide' | 'tall' | 'standard';
  images: ProjectImage[];
}

export const DESIGNER_PROFILE = {
  name: 'Ihab Nasr',
  role: 'Graphic Designer',
  extendedRole: 'Creative Visual Designer',
  disciplines: ['Brand Identity', 'Packaging', 'Advertising', 'Visual Design'],
  logoSrc: '/portfolio/hero-1.png',
  logoAlt: 'Ihab Nasr Graphic Designer monogram logo',
  emblemHeroSrc: '/assets/aistudio/ChatGPT_Image_Nov_24__2026__08_26_32_AM_3cace4ea.png',
  emblemHeroAlt: 'Ihab Nasr Graphic Designer brushed metallic cyan and silver monogram logo',
  ambientVideoSrc: null as string | null,
  bioLead:
    'I’m Ihab Nasr, a Graphic Designer focused on creating clean and impactful visual designs.',
  bioDetail:
    'I specialize in Brand Identity, Packaging, Advertising, and Visual Design — crafting cohesive product systems, high-impact retail packaging, and commercial visual narratives.',
  experience: [
    {
      role: 'Graphic Designer',
      company: 'LAYALINA TOBACCO MANUFACTURING F.Z.C',
      description:
        'Working on branding, packaging, and advertising design projects in a professional environment.',
    },
  ],
  education: [
    {
      degree: 'Bachelor’s Degree in Social Work',
      institution: 'Delta University for Science and Technology, Mansoura, Egypt',
      status: 'Graduated',
    },
  ],
  contactEmail: 'ihabnasrx@gmail.com',
  contactPhone: '+201012330832',
  whatsappUrl: 'https://wa.me/201012330832',
  sourceArchiveUrl: 'https://sites.google.com/view/ihabnasr/home',
};

export interface IcedFrostedPlate {
  id: string;
  flavorName: string;
  arabicTitle?: string;
  brand: string;
  seriesLabel: string;
  caption: string;
  alt: string;
  src: string;
  aspect: 'square' | 'landscape' | 'portrait';
  frostAccentHex: string;
  projectId: string;
}

export const ICED_FROSTED_PLATES: IcedFrostedPlate[] = [
  {
    id: 'ya-layl-frosty',
    flavorName: 'Frosty',
    arabicTitle: 'فروستي',
    brand: 'YA LAYL MOLASSES',
    seriesLabel: 'Alpine Snowdrift Edition',
    caption: 'Frosty — Crystalline Ice Carton in Alpine Snow',
    alt: 'Ya Layl Molasses Frosty carton covered in crystalline ice frost resting in alpine snow with sun flare',
    src: '/assets/aistudio/Ya-Layl-Fruit-Illustration-Collection_b9b4d404.jpg',
    aspect: 'square',
    frostAccentHex: '#38BDF8',
    projectId: 'ya-layl-frosted',
  },
  {
    id: 'ya-layl-lemon-lime-ice',
    flavorName: 'Lemon Lime Ice',
    arabicTitle: 'ليمون لايم مثلج',
    brand: 'YA LAYL MOLASSES',
    seriesLabel: 'Glacier Ledge Mist',
    caption: 'Lemon Lime Ice — Frozen Citrus Cube & Frosted Lime',
    alt: 'Ya Layl Molasses Lemon Lime Ice carton on misty frozen stone beside a lemon trapped inside an ice block and a frosted lime',
    src: '/assets/aistudio/lemon-lime-ice-2_36ef3d37.jpg',
    aspect: 'square',
    frostAccentHex: '#A3E635',
    projectId: 'ya-layl-frosted',
  },
  {
    id: 'ya-layl-frosty-blueberry',
    flavorName: 'Frosty Blueberry',
    arabicTitle: 'فروستي توت بري',
    brand: 'YA LAYL MOLASSES',
    seriesLabel: 'Crushed Ice Studio',
    caption: 'Frosty Blueberry — Crushed Ice & Frosted Berry Clusters',
    alt: 'Ya Layl Molasses Frosty Blueberry carton nestled in crushed crystal ice cubes with frost-dusted blueberries',
    src: '/assets/aistudio/Frosty-Blueberry_91b100cb.jpg',
    aspect: 'square',
    frostAccentHex: '#60A5FA',
    projectId: 'ya-layl-frosted',
  },
  {
    id: 'ya-layl-frosty-mango-peach-alpine',
    flavorName: 'Frosty Mango Peach',
    arabicTitle: 'مانجا خوخ مثلج',
    brand: 'YA LAYL MOLASSES',
    seriesLabel: 'Winter Evergreen Forest',
    caption: 'Frosty Mango Peach — Snow-Topped Alpine Forest Scene',
    alt: 'Ya Layl Molasses Frosty Mango Peach carton dusted with fresh snow resting on a frosted log in a snowy evergreen forest',
    src: '/assets/aistudio/Firefly_Gemini_Flash_i_want_add_this_box_to_frosty_background__i_want_add_it_to_natural_backgroud_that_eve_789811_7897c731.png',
    aspect: 'portrait',
    frostAccentHex: '#FBBF24',
    projectId: 'ya-layl-frosted',
  },
  {
    id: 'ya-layl-frosty-mango-peach-ice',
    flavorName: 'Frosty Mango Peach',
    arabicTitle: 'مانجا خوخ مثلج',
    brand: 'YA LAYL MOLASSES',
    seriesLabel: 'Crushed Ice Studio',
    caption: 'Frosty Mango Peach — Crushed Ice & Frosted Stone Fruit',
    alt: 'Ya Layl Molasses Frosty Mango Peach carton staged on crushed ice cubes beside a frosted peach and mango slice',
    src: '/assets/aistudio/Frosty-mango-peach_6e0cd794.jpg',
    aspect: 'portrait',
    frostAccentHex: '#F59E0B',
    projectId: 'ya-layl-frosted',
  },
  {
    id: 'ya-layl-frosty-raspberry-winter',
    flavorName: 'Frosty Raspberry',
    arabicTitle: 'توت احمر مثلج',
    brand: 'YA LAYL MOLASSES',
    seriesLabel: 'Snow Forest & Studio Diptych',
    caption: 'Frosty Raspberry — Dual Blizzard & Glacier Snow Diptych',
    alt: 'Ya Layl Molasses Frosty Raspberry diptych contrasting a snowy pine forest on the left with frosted raspberries on studio snow on the right',
    src: '/assets/aistudio/111_c80a501d.jpg',
    aspect: 'landscape',
    frostAccentHex: '#F43F5E',
    projectId: 'ya-layl-frosted',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'cwench',
    index: '01',
    title: 'CWENCH — Hydration Mix',
    brand: 'CWENCH',
    subtitle: 'Box & Stick Pack Packaging System',
    categories: ['Packaging Design', 'Product Visualization', 'Advertising'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'Complete retail packaging and hyper-real commercial visualization for CWENCH Hydration Mix across 16-packet cylindrical canisters and single-serve electrolyte stick packs in Berry Crush, Rainbow Swirl, and Cherry Lime.',
    deliverables: [
      '16-Packet Retail Box Artwork',
      'Single-Serve Stick Pack System',
      'Commercial Splash Visualization',
      'Flavor Variant Color Architecture',
    ],
    accentHex: '#2F6FED',
    coverImage: '/portfolio/cwench-box-1.png',
    coverAlt: 'CWENCH Hydration Mix Berry Crush box and stick pack underwater product render',
    layoutHint: 'wide',
    images: [
      {
        src: '/portfolio/cwench-box-1.png',
        alt: 'CWENCH Berry Crush Hydration Mix canister and stick pack',
        caption: 'Berry Crush — 16 Individual Packets Box & Stick Pack',
        subSeries: 'CWENCH — Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/cwench-box-2.png',
        alt: 'CWENCH Rainbow Swirl Hydration Mix canister and stick pack at ocean sunset',
        caption: 'Rainbow Swirl — 16 Individual Packets Box & Stick Pack',
        subSeries: 'CWENCH — Box',
        aspect: 'square',
      },
      {
        src: '/assets/aistudio/ChatGPT_Image_Jul_7__2026__03_11_53_AM_8d2ff4bd.png',
        alt: 'CWENCH Cherry Lime Hydration Mix canister and stick pack in overhead turquoise water splash with lime, cherries, and berries',
        caption: 'Cherry Lime — 16 Individual Packets Box & Overhead Crystal Splash',
        subSeries: 'CWENCH — Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/cwench-stick-pack-1.jpg',
        alt: 'CWENCH Rainbow Swirl stick pack with citrus and berry splash',
        caption: 'Rainbow Swirl — Stick Pack Action Key Visual',
        subSeries: 'CWENCH — Stick Pack',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/cwench-stick-pack-2.jpg',
        alt: 'CWENCH Berry Crush stick pack with raspberries and blueberries',
        caption: 'Berry Crush — Stick Pack Action Key Visual',
        subSeries: 'CWENCH — Stick Pack',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/cwench-stick-pack-3.jpg',
        alt: 'CWENCH Cherry Lime stick pack with lime slices and cherries',
        caption: 'Cherry Lime — Stick Pack Action Key Visual',
        subSeries: 'CWENCH — Stick Pack',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/cwench-stick-pack-4.png',
        alt: 'CWENCH Cherry Lime and Berry Crush stick packs side-by-side liquid ripple flatlay',
        caption: 'Cherry Lime & Berry Crush — Dual Surface Ripple Campaign',
        subSeries: 'CWENCH — Stick Pack',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'kuiq-vape',
    index: '02',
    title: 'KUIQ VAPE — Kuiq Bar',
    brand: 'KUIQ VAPE',
    subtitle: 'Product Advertising & Flavor Key Visuals',
    categories: ['Advertising', 'Product Visualization', 'Creative Campaigns'],
    primaryDiscipline: 'Advertising',
    summary:
      'High-impact commercial campaign series for KUIQ Bar featuring dynamic flavor explosions, tactile hardware framing, and bold distressed typography across five signature blends.',
    deliverables: [
      'Flavor Launch Key Visuals',
      'Hardware Product Visualization',
      'Campaign Display Typography',
      'Dual-Panel Promotional Layouts',
    ],
    accentHex: '#E03E36',
    coverImage: '/portfolio/kuiq-vape-selected-works-1.png',
    coverAlt: 'KUIQ Bar Pear Strawberry Rasp Ice key visual with suspended fruit and ice',
    layoutHint: 'tall',
    images: [
      {
        src: '/portfolio/kuiq-vape-selected-works-1.png',
        alt: 'KUIQ Bar Pear Strawberry Rasp Ice commercial poster',
        caption: 'Pear Strawberry Rasp Ice — Single Hero Poster',
        subSeries: 'Selected Works',
        aspect: 'portrait',
      },
      {
        src: '/portfolio/kuiq-vape-selected-works-2.png',
        alt: 'KUIQ Bar Mango Mania and Banana Milkshake split campaign visual',
        caption: 'Mango Mania & Banana Milkshake — Split Campaign',
        subSeries: 'Selected Works',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/kuiq-vape-selected-works-3.png',
        alt: 'KUIQ Bar Mixed Berries and Kiwi Passion Fruit Guava split campaign visual',
        caption: 'Mixed Berries & Kiwi Passion Fruit Guava — Split Campaign',
        subSeries: 'Selected Works',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'fitfuel-products',
    index: '03',
    title: 'FITFUEL — Branded Products',
    brand: 'FITFUEL',
    subtitle: 'Merchandise, Cups & Shaker Visual Identity',
    categories: ['Brand Identity', 'Packaging Design', 'Visual Communication'],
    primaryDiscipline: 'Brand Identity',
    summary:
      'Tactile matte-black brand applications for FitFuel ("Fuel Your Fitness"), translating bespoke fitness line-art patterns, brush logotype, and social QR integration onto takeaway cups and athletic shakers.',
    deliverables: [
      'Takeaway Cup Pattern & Layout',
      'Matte Athletic Shaker Branding',
      'Atmospheric Studio Lighting Visuals',
      'QR & Social Ecosystem Integration',
    ],
    accentHex: '#A3A8B2',
    coverImage: '/portfolio/fitfuel-products-selected-works-1.jpg',
    coverAlt: 'FitFuel matte black takeaway cup with fitness icon pattern and QR code',
    layoutHint: 'standard',
    images: [
      {
        src: '/portfolio/fitfuel-products-selected-works-1.jpg',
        alt: 'FitFuel matte black cup in dramatic studio spotlight',
        caption: 'Branded Takeaway Cup — Studio Spotlight',
        subSeries: 'FitFuel Products',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/fitfuel-products-selected-works-2.jpg',
        alt: 'FitFuel matte black athletic shaker with water droplets and neon rim lighting',
        caption: 'FitFuel Shaker — Condensation & Dual Rim Light',
        subSeries: 'FitFuel Products',
        aspect: 'portrait',
      },
      {
        src: '/portfolio/fitfuel-products-selected-works-3.jpg',
        alt: 'FitFuel paper cup floating in moody gym environment',
        caption: 'Branded Takeaway Cup — Gym Environmental Render',
        subSeries: 'FitFuel Products',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/fitfuel-products-selected-works-4.png',
        alt: 'FitFuel matte black shaker in rain storm setting',
        caption: 'FitFuel Shaker — Rain & Steel Atmosphere',
        subSeries: 'FitFuel Products',
        aspect: 'portrait',
      },
    ],
  },
  {
    id: 'fitfuel-flavors',
    index: '04',
    title: 'FITFUEL — Functional Bar Flavors',
    brand: 'FITFUEL',
    subtitle: 'Cookie De La Crème · Choco Cherry · Strawberry Soufflé',
    categories: ['Packaging Design', 'Product Visualization', 'Advertising'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'Packaging architecture and flavor storytelling for FitFuel’s 20g Protein Functional Bar line, balancing crisp nutritional callouts (20g Protein, No Added Sugar, 9 EAAs) with dynamic studio and botanical environment renders.',
    deliverables: [
      'Functional Bar Wrapper Design',
      'Cookie De La Crème Key Visuals',
      'Choco Cherry Key Visuals',
      'Strawberry Soufflé Key Visuals',
    ],
    accentHex: '#D1485F',
    coverImage: '/portfolio/fitfuel-flavors-selected-works-1.png',
    coverAlt: 'FitFuel Functional Bar Cookie De La Creme floating in milk splash',
    layoutHint: 'standard',
    images: [
      {
        src: '/portfolio/fitfuel-flavors-selected-works-1.png',
        alt: 'FitFuel Cookie De La Creme functional bar with milk splash and cookies',
        caption: 'Cookie De La Crème — Floating Splash Visualization',
        subSeries: 'Cookie De La Crème',
        aspect: 'portrait',
      },
      {
        src: '/portfolio/cookie-de-la-creme-1.png',
        alt: 'FitFuel Choco Cherry functional bar with chocolate splash and cherries',
        caption: 'Choco Cherry — Chocolate Splash Visualization',
        subSeries: 'Choco Cherry',
        aspect: 'portrait',
      },
      {
        src: '/portfolio/choco-cherry-1.png',
        alt: 'FitFuel Strawberry Souffle functional bar with strawberries and red syrup',
        caption: 'Strawberry Soufflé — Red Velvet Splash Visualization',
        subSeries: 'Strawberry Soufflé',
        aspect: 'portrait',
      },
      {
        src: '/portfolio/strawberry-souffle-1.png',
        alt: 'FitFuel Cookie De La Creme bar resting on dewy forest moss',
        caption: 'Cookie De La Crème — Dewy Moss Editorial',
        subSeries: 'Botanical Trio',
        aspect: 'square',
      },
      {
        src: '/portfolio/strawberry-souffle-2.png',
        alt: 'FitFuel Choco Cherry bar resting on moss with autumn leaves',
        caption: 'Choco Cherry — Forest Floor Editorial',
        subSeries: 'Botanical Trio',
        aspect: 'square',
      },
      {
        src: '/portfolio/strawberry-souffle-3.jpg',
        alt: 'FitFuel Strawberry Souffle bar resting on fresh moss with strawberries',
        caption: 'Strawberry Soufflé — Botanical Moss Editorial',
        subSeries: 'Botanical Trio',
        aspect: 'square',
      },
    ],
  },
  {
    id: 'kuiq-charcoal-v1',
    index: '05',
    title: 'KUIQ CHARCOAL — Edition V1',
    brand: 'KUIQ CHARCOAL',
    subtitle: '100% Coconut Shell Charcoal Packaging & Lifestyle',
    categories: ['Packaging Design', 'Brand Identity', 'Product Visualization'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'First-generation packaging identity and tactile lifestyle art direction for Kuiq 100% Coconut Shell Charcoal, pairing bold geometric typography with amber sunset iconography and dark ember studio scenes.',
    deliverables: [
      'Retail Carton Structural Graphics',
      'Amber Iconography & Feature Badges',
      'Product Lifestyle Photography Direction',
      'Isometric Box Renders',
    ],
    accentHex: '#E89B2D',
    coverImage: '/portfolio/kuiq-charcoal-v1-1.png',
    coverAlt: 'Hands lighting Kuiq charcoal cubes with torch beside black V1 box',
    layoutHint: 'standard',
    images: [
      {
        src: '/portfolio/kuiq-charcoal-v1-1.png',
        alt: 'Lighting Kuiq charcoal cubes with blue torch flame next to V1 carton',
        caption: 'Torch Ignition — Action Lifestyle Scene',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
      {
        src: '/portfolio/kuiq-charcoal-v1-2.png',
        alt: 'Hands holding Kuiq V1 charcoal box in dark studio',
        caption: 'Tactile Scale — Studio Hand Framing',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
      {
        src: '/portfolio/kuiq-charcoal-v1-3.png',
        alt: 'Hands holding Kuiq 100% Coconut Shell Charcoal V1 box straight-on',
        caption: 'Front Carton Display — Dual Hand Hold',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
      {
        src: '/portfolio/kuiq-charcoal-v1-4.png',
        alt: 'Placing charcoal cubes into glowing stainless chimney starter with Kuiq V1 box',
        caption: 'Chimney Preparation — Smoke & Ember Detail',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
      {
        src: '/portfolio/kuiq-charcoal-v1-5.png',
        alt: 'Pouring glowing charcoal briquettes onto grill beside Kuiq V1 box',
        caption: 'Ember Pour — High-Heat Lifestyle',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
      {
        src: '/portfolio/kuiq-charcoal-v1-6.jpg',
        alt: 'Isometric render of Kuiq 72 PCS coconut shell charcoal V1 box on dark slate',
        caption: 'Isometric Studio Carton Render',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
      {
        src: '/portfolio/kuiq-charcoal-v1-7.png',
        alt: 'Hands presenting Kuiq 72 PCS V1 box in warm hookah lounge',
        caption: 'Lounge Ambience — Hospitality Context',
        subSeries: 'KUIQ Charcoal V1',
        aspect: 'square',
      },
    ],
  },
  {
    id: 'kuiq-charcoal-v2',
    index: '06',
    title: 'KUIQ CHARCOAL — Edition V2',
    brand: 'KUIQ CHARCOAL',
    subtitle: '72 PCS & 96 PCS Botanical Box System',
    categories: ['Packaging Design', 'Brand Identity', 'Visual Communication'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'Evolved Edition V2 packaging architecture introducing custom script wordmark styling, emerald palm foliage accents, and a unified 6-pillar side-panel iconography system across both 72 PCS and 96 PCS retail formats.',
    deliverables: [
      'Edition V2 Wordmark & Botanical Refresh',
      '72 PCS Retail Box Packaging',
      '96 PCS Retail Box Packaging',
      'Volcanic & Lounge Key Visuals',
    ],
    accentHex: '#6AB04C',
    coverImage: '/portfolio/72-pcs-box-1.png',
    coverAlt: 'Kuiq V2 72 PCS charcoal box on glowing volcanic lava rock',
    layoutHint: 'standard',
    images: [
      {
        src: '/portfolio/72-pcs-box-1.png',
        alt: 'Kuiq V2 72 PCS box staged on glowing volcanic magma stone',
        caption: '72 PCS Box — Volcanic Magma Stage',
        subSeries: '72 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/72-pcs-box-2.png',
        alt: 'Kuiq V2 72 PCS box with subtle smoke trails in dark studio',
        caption: '72 PCS Box — Smoke & Matte Charcoal Studio',
        subSeries: '72 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/72-pcs-box-3.png',
        alt: 'Kuiq V2 72 PCS box with raw coconut shell and glowing ember cube',
        caption: '72 PCS Box — Natural Coconut & Glowing Ember',
        subSeries: '72 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/72-pcs-box-4.jpg',
        alt: 'Kuiq V2 72 PCS box beside fresh split coconut and clay hookah bowl',
        caption: '72 PCS Box — Lounge & Coconut Origin',
        subSeries: '72 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/96-pcs-box-1.png',
        alt: 'Kuiq V2 96 PCS box on cooled lava rock with glowing fissures',
        caption: '96 PCS Box — Volcanic Rock Stage',
        subSeries: '96 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/96-pcs-box-2.jpg',
        alt: 'Kuiq V2 96 PCS box in warm upscale lounge with coconuts and hookah bowl',
        caption: '96 PCS Box — Luxury Lounge Interior',
        subSeries: '96 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/96-pcs-box-3.png',
        alt: 'Kuiq V2 96 PCS box studio render on obsidian pedestal',
        caption: '96 PCS Box — Obsidian Studio Pedestal',
        subSeries: '96 PCS Box',
        aspect: 'square',
      },
      {
        src: '/portfolio/96-pcs-box-4.png',
        alt: 'Kuiq V2 96 PCS box on weathered timber table with smoke and coconut',
        caption: '96 PCS Box — Rustic Wood & Smoke',
        subSeries: '96 PCS Box',
        aspect: 'square',
      },
    ],
  },
  {
    id: 'ya-layl-flavors',
    index: '07',
    title: 'YA LAYL — Hookah Flavor Collection',
    brand: 'YA LAYL MOLASSES',
    subtitle: '10-SKU Bilingual Packaging Series',
    categories: ['Packaging Design', 'Brand Identity', 'Visual Communication'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'Extensive bilingual Arabic/English packaging system for Ya Layl Molasses, pairing each flavor’s unique narrative artwork—from Havana and Miami Pink to Wild Dragon and Red Kiss—with disciplined brand architecture.',
    deliverables: [
      'Bilingual Arabic / English Typography',
      '10 Distinct Flavor Carton Designs',
      'Color-Coded Background Presentations',
      'Print-Ready Die-Line Packaging',
    ],
    accentHex: '#C8A46B',
    coverImage: '/portfolio/ya-layl-hookah-flavor-selected-works-1.jpg',
    coverAlt: 'Ya Layl Molasses Englyzi packaging box with London Big Ben twilight artwork',
    layoutHint: 'standard',
    images: [
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-1.jpg',
        alt: 'Ya Layl Molasses Englyzi carton box mockup',
        caption: 'Englyzi — London Twilight Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-2.jpg',
        alt: 'Ya Layl Molasses Havana carton box mockup',
        caption: 'Havana — Classic Boulevard Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-3.jpg',
        alt: 'Ya Layl Molasses Lady Slayer crimson neon carton box mockup',
        caption: 'Lady Slayer — Crimson Noir Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-4.jpg',
        alt: 'Ya Layl Molasses Hawaii tropical beach carton box mockup',
        caption: 'Hawaii — Coastal Palm Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-5.jpg',
        alt: 'Ya Layl Molasses Love XO smoke heart carton box mockup',
        caption: 'Love XO — Luminous Smoke Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-6.jpg',
        alt: 'Ya Layl Molasses Mango Tango illustrated carton box mockup',
        caption: 'Mango Tango — Illustrated Gold Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-7.jpg',
        alt: 'Ya Layl Molasses Miami Pink Ocean Drive carton box mockup',
        caption: 'Miami Pink — Art Deco Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-8.jpg',
        alt: 'Ya Layl Molasses Red Kiss monochrome portrait carton box mockup',
        caption: 'Red Kiss — Monochrome Portrait Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'square',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-9.jpg',
        alt: 'Ya Layl Molasses Spring Water emerald waterfall carton box mockup',
        caption: 'Spring Water — Emerald Cascade Edition',
        subSeries: 'Ya Layl Molasses',
        aspect: 'landscape',
      },
      {
        src: '/portfolio/ya-layl-hookah-flavor-selected-works-10.jpg',
        alt: 'Ya Layl Molasses Wild Dragon berry dragon fruit carton box mockup',
        caption: 'Wild Dragon — Wild Berry & Dragon Fruit',
        subSeries: 'Ya Layl Molasses',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'ya-layl-christmas',
    index: '08',
    title: 'YA LAYL — Holiday Campaign',
    brand: 'YA LAYL MOLASSES',
    subtitle: 'Merry Christmas & New Year Visual Diptych',
    categories: ['Creative Campaigns', 'Advertising', 'Visual Communication'],
    primaryDiscipline: 'Creative Campaigns',
    summary:
      'Festive seasonal campaign diptych placing Ya Layl Molasses flagship flavors—Frosty Raspberry and Dubai Nights—into atmospheric winter lighting, bokeh snow, and dual typographic holiday lockups.',
    deliverables: [
      'Seasonal Social & Print Diptych',
      'Festive Art Direction & Lighting',
      'Dual Typographic Lockups',
    ],
    accentHex: '#C93B3B',
    coverImage: '/portfolio/ya-layl-merry-christmas-1.png',
    coverAlt: 'Ya Layl Molasses Merry Christmas campaign featuring Frosty Raspberry and Dubai Nights boxes',
    layoutHint: 'standard',
    images: [
      {
        src: '/portfolio/ya-layl-merry-christmas-1.png',
        alt: 'Ya Layl Merry Christmas and Happy New Year diptych featuring Frosty Raspberry and Dubai Nights',
        caption: 'Frosty Raspberry & Dubai Nights — Winter Holiday Diptych',
        subSeries: 'Seasonal Campaign',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'lyon-double-twist',
    index: '09',
    title: 'LYON — Double Twist Cigarettes',
    brand: 'LYON',
    subtitle: 'Iridescent Dual-Capsule Packaging & Luxury Product Visualization',
    categories: ['Packaging Design', 'Brand Identity', 'Product Visualization'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'Matte-black American Blend cigarette carton architecture featuring holographic blue-to-magenta side streaks, dual click-capsule iconography, embossed silver lion crest branding, and high-realism lounge still-life visualization.',
    deliverables: [
      'Matte Hard-Pack Structural Graphics',
      'Dual-Capsule Iridescent Color System',
      'Silver Lion Crest & Metallic Wordmark',
      'Hyper-Realistic Lounge & Studio Renders',
    ],
    accentHex: '#3B82F6',
    coverImage: '/assets/aistudio/Premium_Lyon_Double_Twist_Pack-6_197b04ca.png',
    coverAlt:
      'LYON Double Twist matte black American Blend cigarette pack with iridescent blue and magenta side streak artwork',
    layoutHint: 'standard',
    images: [
      {
        src: '/assets/aistudio/Premium_Lyon_Double_Twist_Pack-6_197b04ca.png',
        alt: 'LYON Double Twist pack front-right three-quarter render with blue 20 cigarettes seal on dark slate',
        caption: 'Matte Black Carton — Blue & Magenta Streak Key Visual',
        subSeries: 'Studio Render',
        aspect: 'portrait',
      },
      {
        src: '/assets/aistudio/Lyon_Double_Twist_Premium_Pack-4_88ccce9c.png',
        alt: 'LYON Double Twist pack angled studio render featuring green Premium 20 Cigarettes seal',
        caption: 'Premium 20 Seal — Front-Right Studio Isometric',
        subSeries: 'Studio Render',
        aspect: 'portrait',
      },
      {
        src: '/assets/aistudio/Iridescent_LYON_Double_Twist_Pack-1_374e75ab.png',
        alt: 'LYON Double Twist pack angled from barcode and specification side on reflective dark studio floor',
        caption: 'Side Specification & Barcode — Gloss Studio Reflection',
        subSeries: 'Technical Pack Detail',
        aspect: 'portrait',
      },
      {
        src: '/assets/aistudio/Hyper-Realistic_LYON_Cigarette_Pack_Still_Life-3_71765c28.png',
        alt: 'LYON Double Twist pack staged beside crystal ashtray with smoke, lighter, and leather notebook',
        caption: 'Crystal Ashtray & Smoke — Luxury Lounge Still Life',
        subSeries: 'Editorial Still Life',
        aspect: 'portrait',
      },
      {
        src: '/assets/aistudio/LYON_Double_Twist_Cigarette_Pack-2_eed695ca.png',
        alt: 'LYON Double Twist pack on dark veined marble table with soft foliage and glass vessel depth',
        caption: 'Veined Marble Lounge — Atmospheric Table Composition',
        subSeries: 'Editorial Still Life',
        aspect: 'portrait',
      },
      {
        src: '/assets/aistudio/Premium_Double_Twist_Lyon_Cigarette_Pack-5_a9142a5d.png',
        alt: 'LYON Double Twist pack overhead diagonal flatlay on textured dark slate stone',
        caption: 'Dark Slate Surface — Overhead Diagonal Study',
        subSeries: 'Surface Study',
        aspect: 'portrait',
      },
    ],
  },
  {
    id: 'ya-layl-frosted',
    index: '10',
    title: 'YA LAYL — Iced & Frosted Editions',
    brand: 'YA LAYL MOLASSES',
    subtitle: 'Sub-Zero Menthol & Frosted Fruit Packaging Series',
    categories: ['Packaging Design', 'Product Visualization', 'Creative Campaigns'],
    primaryDiscipline: 'Packaging Design',
    summary:
      'Atmospheric sub-zero campaign and bilingual carton series placing Ya Layl Molasses chilled blends—Frosty, Lemon Lime Ice, Frosty Blueberry, Frosty Mango Peach, and Frosty Raspberry—across alpine snowdrifts, crushed crystal ice studios, and blizzard forests.',
    deliverables: [
      'Frosted Bilingual Carton Series',
      'Alpine & Glacier Composite Direction',
      'Crushed Ice Macro Studio Staging',
      'Sub-Zero Cooling Color Harmonies',
    ],
    accentHex: '#38BDF8',
    coverImage: '/assets/aistudio/Ya-Layl-Fruit-Illustration-Collection_b9b4d404.jpg',
    coverAlt: 'Ya Layl Molasses Frosty carton encrusted with ice crystals in alpine snowdrift',
    layoutHint: 'standard',
    images: ICED_FROSTED_PLATES.map((plate) => ({
      src: plate.src,
      alt: plate.alt,
      caption: plate.caption,
      subSeries: plate.seriesLabel,
      aspect: plate.aspect,
    })),
  },
];

export interface ExpertiseCapability {
  id: string;
  index: string;
  title: string;
  headline: string;
  description: string;
  techniques: string[];
  linkedProjectIds: string[];
}

export const EXPERTISE_CAPABILITIES: ExpertiseCapability[] = [
  {
    id: 'brand-identity',
    index: '01',
    title: 'Brand Identity',
    headline: 'Cohesive visual systems built for recognition and shelf authority.',
    description:
      'Developing distinctive logotypes, monogram marks, bilingual Arabic/English typographic hierarchies, and unified brand patterns that scale seamlessly across physical and digital touchpoints.',
    techniques: ['Logotype & Monogram Systems', 'Bilingual Brand Architecture', 'Pattern & Color Tokens'],
    linkedProjectIds: ['fitfuel-products', 'kuiq-charcoal-v2', 'ya-layl-flavors', 'lyon-double-twist'],
  },
  {
    id: 'packaging-design',
    index: '02',
    title: 'Packaging Design',
    headline: 'Tactile, print-ready packaging engineered for commercial impact.',
    description:
      'End-to-end carton, canister, pouch, and stick-pack surface design—balancing bold shelf visibility with clear nutritional callouts, iconography, and multi-SKU flavor architecture.',
    techniques: ['Retail Cartons & Canisters', 'Flexible Stick Packs & Bars', 'Multi-SKU Flavor Systems'],
    linkedProjectIds: [
      'cwench',
      'fitfuel-flavors',
      'kuiq-charcoal-v1',
      'kuiq-charcoal-v2',
      'ya-layl-flavors',
      'ya-layl-frosted',
      'lyon-double-twist',
    ],
  },
  {
    id: 'product-visualization',
    index: '03',
    title: 'Product Visualization',
    headline: 'Studio-grade product staging with dramatic lighting and atmosphere.',
    description:
      'Hyper-detailed 3D and composite product renders utilizing condensation, liquid dynamics, volumetric lighting, and natural environments to elevate physical packaging into hero campaign assets.',
    techniques: ['Studio Lighting & Rim Craft', 'Liquid & Botanical Composites', 'Atmospheric Product Staging'],
    linkedProjectIds: [
      'cwench',
      'kuiq-vape',
      'fitfuel-flavors',
      'kuiq-charcoal-v1',
      'ya-layl-frosted',
      'lyon-double-twist',
    ],
  },
  {
    id: 'advertising-campaigns',
    index: '04',
    title: 'Advertising & Visual Design',
    headline: 'Campaign key visuals designed to command immediate attention.',
    description:
      'High-contrast promotional posters, split-frame flavor launches, and seasonal brand campaigns tailored for retail displays, digital media, and commercial brand storytelling.',
    techniques: ['Campaign Key Visuals', 'Seasonal Brand Diptychs', 'Art Direction & Typography'],
    linkedProjectIds: ['kuiq-vape', 'ya-layl-christmas', 'ya-layl-frosted', 'cwench'],
  },
];
