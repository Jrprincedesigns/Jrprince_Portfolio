import styles from "./AmbasdrDiagrams.module.css";

/**
 * The profile-to-conversation transition on mobile web, the one genuinely new
 * interaction in the redesign. A full-profile introduction transforms into the
 * chat experience over ~850ms, preserving spatial continuity the way a polished
 * iOS navigation does. Timings and behavior are the spec I defined.
 */

const PHASES: { time: string; items: string[] }[] = [
  {
    time: "0–250 ms",
    items: ["Background gradient begins moving up", "Full profile image starts shrinking", "Intro identity type fades"],
  },
  {
    time: "200–500 ms",
    items: ["Image moves to its header position", "Radius morphs to the avatar", "Gradient fills the page", "Header info appears"],
  },
  {
    time: "400–700 ms",
    items: ["Chat / Highlights / Files / Links appear", "ambasdr identity fades in", "Empty-state message shows", "Suggested questions stagger in"],
  },
  {
    time: "600–850 ms",
    items: ["Composer rises to rest", "Interface settles into the chat state"],
  },
];

export default function AmbasdrMotion() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Profile → conversation transition</p>
        <ol className={styles.motion} aria-label="Profile-to-conversation motion, four phases over 850 milliseconds">
          {PHASES.map((p) => (
            <li key={p.time} className={styles.phase}>
              <span className={styles.phaseTime}>{p.time}</span>
              <ul className={styles.phaseList}>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className={styles.motionNote}>
          <b>Quiet on purpose:</b> no bounce, no zoom, no marketing spectacle, and no replay when a
          visitor returns to Chat during a visit. Elements transform, preserve spatial continuity,
          then get out of the way, and reduced-motion users land in the finished state immediately.
        </p>
      </div>
      <figcaption className={styles.caption}>
        The transition connects two mental models, <em>I am viewing a person</em> and{" "}
        <em>I can explore that person through conversation</em>, with the confidence of a native
        navigation, not a spectacle.
      </figcaption>
    </figure>
  );
}
