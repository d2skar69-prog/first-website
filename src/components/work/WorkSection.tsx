import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type {
  Scene, HeroVideoScene, VerticalReelScene, HeroPhotoScene,
  VideoPhotoScene, Gallery3Scene, MixedScene, PhotoSplitScene,
} from "@/data/workProjects";

const SLIDE_TRANSITION = { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

function useAutoplayVideo(isActive: boolean, isMuted: boolean) {
  const ref = useRef<HTMLVideoElement>(null);
  const muted = !isActive || isMuted;
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = muted;
    if (isActive) {
      // rewind so a video that finished decoding while off-screen (loop) or
      // was paused mid-frame always resumes cleanly when it re-enters view
      v.play().catch(() => {});
    } else {
      // Pause immediately when a section leaves the active slot — only one
      // video should ever be actively decoding/playing at a time.
      v.pause();
    }
  }, [muted, isActive]);
  return { ref, muted };
}

interface SceneLayoutProps<T extends Scene> {
  scene: T;
  title: string;
  isActive: boolean;
  isMuted: boolean;
  /** True for the scene immediately after the active one — hints the browser to fetch it ahead of time. */
  isNext: boolean;
}

// ─── Layout A: Hero Film ──────────────────────────────────────────────────
function HeroVideoLayout({ scene, isActive, isMuted, isNext }: SceneLayoutProps<HeroVideoScene>) {
  const { ref, muted } = useAutoplayVideo(isActive, isMuted);
  const scale = scene.scale ?? 1;
  const scaled = scale < 1;
  return (
    <motion.div
      className={`absolute inset-0 max-md:flex max-md:items-center max-md:justify-center max-md:bg-white max-md:pt-24 max-md:pb-16 ${scaled ? "bg-white flex items-center justify-center" : ""}`}
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={SLIDE_TRANSITION}
    >
      {scaled ? (
        <video ref={ref} src={scene.video} muted={muted} autoPlay loop playsInline preload={isActive || isNext ? "auto" : "metadata"}
          className="max-md:!h-auto max-md:!w-full max-md:!max-h-[calc(100dvh-10rem)] max-md:!object-contain"
          style={{ width: `${scale * 100}%`, height: `${scale * 100}%`, objectFit: "cover" }} />
      ) : (
        <>
          <video ref={ref} src={scene.video} muted={muted} autoPlay loop playsInline preload={isActive || isNext ? "auto" : "metadata"}
            className="absolute inset-0 h-full w-full object-cover max-md:relative max-md:inset-auto max-md:h-auto max-md:max-h-[calc(100dvh-10rem)] max-md:object-contain" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 max-md:hidden" />
        </>
      )}
    </motion.div>
  );
}

// ─── Layout B: Vertical Reel ──────────────────────────────────────────────
function VerticalReelLayout({ scene, isActive, isMuted, isNext }: SceneLayoutProps<VerticalReelScene>) {
  const { ref, muted } = useAutoplayVideo(isActive, isMuted);
  return (
    <motion.div className="absolute inset-0 bg-white flex items-center justify-center px-8 sm:px-16 md:px-24 lg:px-32 py-24 md:py-28 max-md:px-4 max-md:pt-24 max-md:pb-16"
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={SLIDE_TRANSITION}>
      <video ref={ref} src={scene.video} muted={muted} autoPlay loop playsInline preload={isActive || isNext ? "auto" : "metadata"}
        className="h-full w-auto max-w-full object-contain max-md:!max-h-[calc(100dvh-10rem)] max-md:!transform-none" style={{ maxHeight: "calc(100vh - 14rem)", transform: scene.scale ? `scale(${scene.scale})` : undefined }} />
    </motion.div>
  );
}

// ─── Layout C: Hero Campaign Photo ────────────────────────────────────────
function HeroPhotoLayout({ scene, title, isActive, isNext }: SceneLayoutProps<HeroPhotoScene>) {
  const isBastianGallery = scene.photo === "/assets/photos/bastian-gallery.png";
  return (
    <motion.div className="absolute inset-0 bg-white flex items-center justify-center max-md:pt-24 max-md:pb-16"
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.98 }} transition={SLIDE_TRANSITION}>
      <div className={`flex items-center justify-center ${isBastianGallery ? "max-md:hidden" : "max-md:!h-[calc(100dvh-10rem)] max-md:!w-full max-md:px-6"}`} style={{ width: "78vw", height: "80vh" }}>
        <img src={scene.photo} alt={`${title} — campaign`} loading={isActive || isNext ? "eager" : "lazy"}
          className="max-w-full max-h-full object-contain select-none" />
      </div>
      {isBastianGallery && (
        <div className="flex h-[calc(100dvh-10rem)] w-full flex-col gap-3 px-6 md:hidden">
          {(["left", "center", "right"] as const).map((position, index) => (
            <div key={position} className="flex min-h-0 flex-1 justify-center">
              <div className="relative h-full max-w-full aspect-[2/3] overflow-hidden">
                <img src={scene.photo} alt={`${title} — ${position}`} loading={isActive || isNext ? "eager" : "lazy"}
                  className="absolute top-[-14%] w-[342%] max-w-none select-none"
                  style={{ left: `${[-14.7, -121.6, -228.1][index]}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Layout D: Video + Photo ──────────────────────────────────────────────
function VideoPhotoLayout({ scene, title, isActive, isMuted, isNext }: SceneLayoutProps<VideoPhotoScene>) {
  const { ref, muted } = useAutoplayVideo(isActive, isMuted);
  return (
    <motion.div className="absolute inset-0 bg-white flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-6 md:px-16 py-20 md:py-28 max-md:pt-24 max-md:pb-16"
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={SLIDE_TRANSITION}>
      <motion.div className="relative w-full md:w-auto md:h-full max-h-[45vh] md:max-h-full aspect-video overflow-hidden bg-black shrink-0 max-md:aspect-auto max-md:max-h-[calc((100dvh-11.5rem)/2)] max-md:bg-white"
        initial={{ scale: 1.02 }} animate={{ scale: isActive ? 1 : 1.02 }} transition={SLIDE_TRANSITION}>
        <video ref={ref} src={scene.video} muted={muted} autoPlay loop playsInline preload={isActive || isNext ? "auto" : "metadata"}
          className="absolute inset-0 h-full w-full object-cover max-md:static max-md:h-auto max-md:max-h-[calc((100dvh-11.5rem)/2)] max-md:object-contain" />
      </motion.div>
      <motion.div className="relative w-full md:w-auto md:h-full max-h-[45vh] md:max-h-full aspect-[3/4] flex items-center justify-center shrink-0 max-md:max-h-[calc((100dvh-11.5rem)/2)]"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
        transition={{ ...SLIDE_TRANSITION, delay: isActive ? 0.1 : 0 }}>
        <img src={scene.photo} alt={`${title} — campaign`} loading={isActive || isNext ? "eager" : "lazy"}
          className="h-full w-full object-cover select-none max-md:object-contain" />
      </motion.div>
    </motion.div>
  );
}

// ─── Layout E: Three-Pane Gallery (photo and/or video) ────────────────────
function Gallery3Pane({ item, title, index, isActive, isMuted, isNext, objectFit = "cover" }: {
  item: Gallery3Scene["items"][number]; title: string; index: number; isActive: boolean; isMuted: boolean; isNext: boolean;
  objectFit?: "cover" | "contain";
}) {
  const { ref, muted } = useAutoplayVideo(isActive, isMuted);
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  if (item.type === "video") {
    return (
      <video ref={ref} src={item.src} muted={muted} autoPlay loop playsInline preload={isActive || isNext ? "auto" : "metadata"}
        className={`w-full h-full ${fitClass} select-none max-md:bg-white max-md:object-contain`} />
    );
  }
  return (
    <img src={item.src} alt={`${title} — frame ${index + 1}`} loading={isActive || isNext ? "eager" : "lazy"}
      className={`w-full h-full ${fitClass} select-none max-md:object-contain`} />
  );
}

function Gallery3Layout({ scene, title, isActive, isMuted, isNext }: SceneLayoutProps<Gallery3Scene>) {
  const contain = scene.fit === "contain";
  return (
    <motion.div className="absolute inset-0 bg-white flex items-center justify-center px-6 md:px-16 max-md:pt-24 max-md:pb-16"
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={SLIDE_TRANSITION}>
      {contain ? (
        /* Editorial / PDF-reference mode — panels sized by image aspect ratio, no cropping */
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 gap-3 md:gap-5 w-full max-w-6xl max-md:h-[calc(100dvh-10rem)]">
          {scene.items.map((item, i) => (
            <motion.div key={item.src + i} className="relative w-full min-h-0 overflow-hidden md:aspect-[4/3]"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16, scale: isActive ? 1 : 0.98 }}
              transition={{ ...SLIDE_TRANSITION, delay: isActive ? 0.08 * i : 0 }}>
              <Gallery3Pane item={item} title={title} index={i} isActive={isActive} isMuted={isMuted} isNext={isNext} objectFit="cover" />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Default full-bleed mode — panels fill a fixed height */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl h-[70vh] max-md:h-[calc(100dvh-10rem)]">
          {scene.items.map((item, i) => (
            <motion.div key={item.src + i} className={`relative h-full overflow-hidden ${title === "NBA Style" && item.type === "photo" ? "max-md:hidden" : ""}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16, scale: isActive ? 1 : 0.98 }}
              transition={{ ...SLIDE_TRANSITION, delay: isActive ? 0.08 * i : 0 }}>
              <Gallery3Pane item={item} title={title} index={i} isActive={isActive} isMuted={isMuted} isNext={isNext} objectFit="cover" />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Layout F: Photo Split (two photos side-by-side) ─────────────────────
function PhotoSplitLayout({ scene, title, isActive, isNext }: SceneLayoutProps<PhotoSplitScene>) {
  return (
    <motion.div className="absolute inset-0 bg-white flex flex-col md:flex-row items-stretch max-md:pt-24 max-md:pb-16"
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={SLIDE_TRANSITION}>
      {/* Left pane — portrait */}
      <motion.div className="relative flex-none w-full md:w-[42%] h-1/2 md:h-full overflow-hidden"
        initial={{ opacity: 0, x: -12 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -12 }}
        transition={SLIDE_TRANSITION}>
        <img src={scene.photoLeft} alt={`${title} — left`} loading={isActive || isNext ? "eager" : "lazy"}
          className="w-full h-full object-cover select-none max-md:object-contain" />
      </motion.div>
      {/* Right pane — landscape */}
      <motion.div className="relative flex-1 h-1/2 md:h-full overflow-hidden"
        initial={{ opacity: 0, x: 12 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 12 }}
        transition={{ ...SLIDE_TRANSITION, delay: isActive ? 0.08 : 0 }}>
        <img src={scene.photoRight} alt={`${title} — right`} loading={isActive || isNext ? "eager" : "lazy"}
          className="w-full h-full object-cover select-none max-md:object-contain" />
      </motion.div>
    </motion.div>
  );
}

// ─── Layout G: Mixed (Photo + Vertical Reel) ──────────────────────────────
function MixedLayout({ scene, title, isActive, isMuted, isNext }: SceneLayoutProps<MixedScene>) {
  const { ref, muted } = useAutoplayVideo(isActive, isMuted);
  const photoFirst = scene.order === "photo-first";
  const photoPane = (
    <motion.div key="photo" className="relative flex-1 min-h-0 h-1/2 md:h-full flex items-center justify-center p-8 md:p-16 bg-white"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }} transition={SLIDE_TRANSITION}>
      <img src={scene.photo} alt={`${title} — campaign`} loading={isActive || isNext ? "eager" : "lazy"}
        className="max-w-full max-h-full object-contain select-none" />
    </motion.div>
  );
  const videoPane = (
    <motion.div key="video" className="relative flex-1 min-h-0 h-1/2 md:h-full flex items-center justify-center bg-white overflow-hidden"
      initial={{ scale: 1.02 }} animate={{ scale: isActive ? 1 : 1.02 }} transition={SLIDE_TRANSITION}>
      <video ref={ref} src={scene.video} muted={muted} autoPlay loop playsInline preload={isActive || isNext ? "auto" : "metadata"}
        className="h-full w-auto max-w-full object-contain" />
    </motion.div>
  );
  return (
    <motion.div className="absolute inset-0 flex flex-col md:flex-row max-md:pt-24 max-md:pb-16"
      initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }} transition={SLIDE_TRANSITION}>
      {photoFirst ? [photoPane, videoPane] : [videoPane, photoPane]}
    </motion.div>
  );
}

// ─── Resolver ──────────────────────────────────────────────────────────────
function WorkSectionImpl({
  scene, title, sectionIndex, isActive, isMuted, isNext, registerRef,
}: {
  scene: Scene; title: string; sectionIndex: number; isActive: boolean; isMuted: boolean; isNext: boolean;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const isLightBg = scene.layout !== "hero-video";
  return (
    <section ref={registerRef} data-section-index={sectionIndex}
      className={`relative h-screen max-md:h-[100dvh] w-full snap-start snap-always overflow-hidden ${isLightBg ? "bg-white" : "bg-black max-md:bg-white"}`}
      style={{ contain: "layout paint style" }}>
      {scene.layout === "hero-video" && <HeroVideoLayout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
      {scene.layout === "vertical-reel" && <VerticalReelLayout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
      {scene.layout === "hero-photo" && <HeroPhotoLayout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
      {scene.layout === "video-photo" && <VideoPhotoLayout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
      {scene.layout === "gallery-3" && <Gallery3Layout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
      {scene.layout === "mixed" && <MixedLayout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
      {scene.layout === "photo-split" && <PhotoSplitLayout scene={scene} title={title} isActive={isActive} isMuted={isMuted} isNext={isNext} />}
    </section>
  );
}

const WorkSection = memo(WorkSectionImpl);
export default WorkSection;
