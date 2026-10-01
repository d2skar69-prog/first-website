export interface SceneBase {}

export interface HeroVideoScene extends SceneBase {
  layout: "hero-video";
  video: string;
  /** Optional scale multiplier. <1 shrinks the video and reveals the background behind it. */
  scale?: number;
}

export interface VerticalReelScene extends SceneBase {
  layout: "vertical-reel";
  video: string;
  /** Optional scale multiplier applied to the video element (default 1). */
  scale?: number;
}

export interface HeroPhotoScene extends SceneBase {
  layout: "hero-photo";
  photo: string;
}

export interface VideoPhotoScene extends SceneBase {
  layout: "video-photo";
  video: string;
  photo: string;
}

export interface GalleryItemPhoto {
  type: "photo";
  src: string;
}

export interface GalleryItemVideo {
  type: "video";
  src: string;
}

export type GalleryItem = GalleryItemPhoto | GalleryItemVideo;

export interface Gallery3Scene extends SceneBase {
  layout: "gallery-3";
  /** Exactly 3 items, each an independent photo or video pane. */
  items: [GalleryItem, GalleryItem, GalleryItem];
  /**
   * "cover" (default) — panels fill a fixed height, images cropped to fill.
   * "contain" — panels sized by aspect ratio so the full image is visible,
   *             matching an editorial / PDF-reference layout.
   */
  fit?: "cover" | "contain";
}

export interface MixedScene extends SceneBase {
  layout: "mixed";
  video: string;
  photo: string;
  /** Which asset appears first (left/top) in the split layout. */
  order: "photo-first" | "video-first";
}

export interface PhotoSplitScene extends SceneBase {
  layout: "photo-split";
  photoLeft: string;
  photoRight: string;
}

export type Scene =
  | HeroVideoScene
  | VerticalReelScene
  | HeroPhotoScene
  | VideoPhotoScene
  | Gallery3Scene
  | MixedScene
  | PhotoSplitScene;

export interface WorkProject {
  title: string;
  category: string;
  production: string;
  client: string;
  deliverables: string;
  coffee: number;
  note: string;
  /** One or more full-screen scenes shown back-to-back for this project. */
  scenes: Scene[];
}

// ─── Approved 20-project Work sequence ──────────────────────────────────────
export const workProjects: WorkProject[] = [
  // ── 01 ────────────────────────────────────────────────────────────────────
  {
    title: "American Eagle",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "American Eagle",
    deliverables: "Brand Film",
    coffee: 4,
    note: "37 mosquito bites later, still worth it.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/american-eagle.mp4" },
    ],
  },

  // ── 02 ────────────────────────────────────────────────────────────────────
  {
    title: "NBA Style",
    category: "Brand Campaign",
    production: "Run Frenzy Studio",
    client: "NBA Style",
    deliverables: "Brand Campaign",
    coffee: 6,
    note: "Courtside at 6am. Worth every second.",
    scenes: [
      {
        layout: "gallery-3",
        items: [
          { type: "photo", src: "/assets/photos/nba-throne.jpg" },
          { type: "video", src: "/assets/videos/nba-glam-reel.mp4" },
          { type: "photo", src: "/assets/photos/nba-roses.jpg" },
        ],
      },
    ],
  },

  // ── 03 ────────────────────────────────────────────────────────────────────
  {
    title: "Davidoff Parfums",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "Davidoff Parfums",
    deliverables: "Brand Film",
    coffee: 5,
    note: "Fuelled by late nights and impossible deadlines.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/davidoff.mp4" },
    ],
  },

  // ── 04 ────────────────────────────────────────────────────────────────────
  {
    title: "Call Me Bae S2",
    category: "Season Promo",
    production: "Dharmatic Entertainment",
    client: "Call Me Bae S2",
    deliverables: "Season Promo",
    coffee: 4,
    note: "Pink skies, tighter deadlines.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/call-me-bae-s2-season-promo.mp4" },
    ],
  },

  // ── 05 ────────────────────────────────────────────────────────────────────
  {
    title: "Cult Gaia",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "Cult Gaia",
    deliverables: "Brand Film",
    coffee: 3,
    note: "Shot on film. Finished on feelings.",
    scenes: [
      { layout: "vertical-reel", video: "/assets/videos/cult-gaia.mp4" },
    ],
  },

  // ── 06 ────────────────────────────────────────────────────────────────────
  {
    title: "hydRo365",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "hydRo365",
    deliverables: "Brand Film",
    coffee: 3,
    note: "Details pending — ask the founders about this one.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/hydro365.mp4" },
    ],
  },

  // ── 07 ────────────────────────────────────────────────────────────────────
  {
    title: "What The Hell Navya",
    category: "Vodcast",
    production: "Run Frenzy Studio",
    client: "What The Hell Navya",
    deliverables: "Vodcast",
    coffee: 4,
    note: "Same brief, three cuts, one keeper.",
    scenes: [
      {
        layout: "video-photo",
        video: "/assets/videos/what-the-hell-navya.mp4",
        photo: "/assets/photos/what-the-hell-navya.jpg",
      },
    ],
  },

  // ── 08 ────────────────────────────────────────────────────────────────────
  {
    title: "Koffee With Karan S8",
    category: "Promo",
    production: "Run Frenzy Studio",
    client: "Koffee With Karan S8",
    deliverables: "Promo",
    coffee: 5,
    note: "The brief was one line. The execution was everything.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/koffee-with-karan.mp4" },
    ],
  },

  // ── 09 ────────────────────────────────────────────────────────────────────
  {
    title: "Meta - Facebook",
    category: "Brand Campaign",
    production: "Run Frenzy Studio",
    client: "Meta - Facebook",
    deliverables: "Brand Campaign",
    coffee: 3,
    note: "Storytelling, one fold at a time.",
    scenes: [
      { layout: "vertical-reel", video: "/assets/videos/meta.mp4", scale: 1.05 },
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    title: "Bastian Riviera",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "Bastian Riviera",
    deliverables: "Brand Film",
    coffee: 3,
    note: "Sunset call time, sand in every shot.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/bastian.mp4" },
    ],
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  {
    title: "Do You Wanna Partner",
    category: "Title Sequence",
    production: "Run Frenzy Studio",
    client: "Do You Wanna Partner",
    deliverables: "Title Sequence",
    coffee: 4,
    note: "Two title cards, one bottle of patience.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/do-you-wanna-partner.mp4" },
    ],
  },

  // ── 12 — Bastian gallery composite ────────────────────────────────────────
  {
    title: "Bastian Riviera",
    category: "Photography",
    production: "Run Frenzy Studio",
    client: "Bastian Riviera",
    deliverables: "Photography",
    coffee: 3,
    note: "Sunset call time, sand in every shot.",
    scenes: [
      { layout: "hero-photo", photo: "/assets/photos/bastian-gallery.png" },
    ],
  },

  // ── 13 ────────────────────────────────────────────────────────────────────
  {
    title: "Edamama x Reliance Brands Ltd.",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "Edamama x Reliance Brands Ltd.",
    deliverables: "Brand Film",
    coffee: 4,
    note: "Sand in every camera bag, worth it for that light.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/edemama.mp4", scale: 0.7225 },
    ],
  },

  // ── 14 — American Eagle vertical reel ────────────────────────────────────
  {
    title: "American Eagle",
    category: "Brand Campaign",
    production: "Run Frenzy Studio",
    client: "American Eagle",
    deliverables: "Brand Campaign",
    coffee: 4,
    note: "37 mosquito bites later, still worth it.",
    scenes: [
      { layout: "vertical-reel", video: "/assets/videos/american-eagle-vertical.mp4" },
    ],
  },

  // ── 15 ────────────────────────────────────────────────────────────────────
  {
    title: "Aap Jaisa Koi",
    category: "Title Sequence",
    production: "Run Frenzy Studio",
    client: "Aap Jaisa Koi",
    deliverables: "Title Sequence",
    coffee: 4,
    note: "Hand-drawn frame by frame, coffee by coffee.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/aap-jaisa-koi.mp4" },
    ],
  },

  // ── 16 ────────────────────────────────────────────────────────────────────
  {
    title: "Anmol Jewellers",
    category: "Photography",
    production: "Run Frenzy Studio",
    client: "Anmol Jewellers",
    deliverables: "Photography",
    coffee: 3,
    note: "Split screen, double the charm.",
    scenes: [
      {
        layout: "gallery-3",
        fit: "contain",
        items: [
          { type: "photo", src: "/assets/photos/anmol-01.jpg" },
          { type: "photo", src: "/assets/photos/anmol-02.jpg" },
          { type: "photo", src: "/assets/photos/anmol-03.jpg" },
        ],
      },
    ],
  },

  // ── 17 ────────────────────────────────────────────────────────────────────
  {
    title: "Samoh by Tata",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "Samoh by Tata",
    deliverables: "Brand Film",
    coffee: 4,
    note: "A Diwali affair, six wardrobe changes deep.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/samoh.mp4" },
    ],
  },

  // ── 18 ────────────────────────────────────────────────────────────────────
  {
    title: "Nykaa Fashion",
    category: "Brand Campaign",
    production: "Run Frenzy Studio",
    client: "Nykaa Fashion",
    deliverables: "Brand Campaign",
    coffee: 4,
    note: "Getting ready was never this cinematic.",
    scenes: [
      { layout: "vertical-reel", video: "/assets/videos/nykaa-fashion-shanaya.mp4" },
    ],
  },

  // ── 19 ────────────────────────────────────────────────────────────────────
  {
    title: "LoveChild by Masaba",
    category: "Brand Film",
    production: "Run Frenzy Studio",
    client: "LoveChild by Masaba",
    deliverables: "Brand Film",
    coffee: 4,
    note: "Three shades, one muse, zero retakes.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/lovechild-masaba.mp4", scale: 0.7225 },
    ],
  },

  // ── 20 ────────────────────────────────────────────────────────────────────
  {
    title: "CRED",
    category: "Brand Series",
    production: "Run Frenzy Studio",
    client: "CRED",
    deliverables: "Brand Series",
    coffee: 4,
    note: "Worth every sunrise call time.",
    scenes: [
      { layout: "hero-video", video: "/assets/videos/cred.mp4" },
    ],
  },

];

export interface FlattenedScene {
  scene: Scene;
  project: WorkProject;
  projectIndex: number;
  sceneIndexInProject: number;
  isFirstSceneOfProject: boolean;
}

/** Flattens all projects' scenes into a single ordered list for rendering. */
export function flattenScenes(projects: WorkProject[]): FlattenedScene[] {
  const flat: FlattenedScene[] = [];
  projects.forEach((project, projectIndex) => {
    project.scenes.forEach((scene, sceneIndexInProject) => {
      flat.push({
        scene,
        project,
        projectIndex,
        sceneIndexInProject,
        isFirstSceneOfProject: sceneIndexInProject === 0,
      });
    });
  });
  return flat;
}
