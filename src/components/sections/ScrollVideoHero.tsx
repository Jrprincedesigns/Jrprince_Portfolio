import ScrollVideo from "@/components/scrollvideo/ScrollVideo";
import { scrollVideo, heroHeadline } from "@/data/home";
import styles from "./ScrollVideoHero.module.css";

/**
 * The landing hero: a pinned, scroll-scrubbed frame sequence with the headline
 * overlaid. The headline fades out as the scrub begins (handled in ScrollVideo).
 */
export default function ScrollVideoHero() {
  return (
    <ScrollVideo
      basePath={scrollVideo.basePath}
      frameCount={scrollVideo.frameCount}
      ext={scrollVideo.ext}
      pad={scrollVideo.pad}
      scrollHeight={scrollVideo.scrollHeight}
    >
      <div className={styles.inner}>
        <h1 className={styles.headline}>{heroHeadline}</h1>
        <span className={styles.hint}>Scroll to play ↓</span>
      </div>
    </ScrollVideo>
  );
}
