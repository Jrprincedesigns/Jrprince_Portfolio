import styles from "./AmbasdrDiagrams.module.css";

/**
 * Onboarding as teaching, not form-filling. Eight steps carry someone from
 * intent to a published, priced Ambasdr, with "Teach Your Ambasdr" as the
 * pivotal step where the AI learns what each resource means. Steps and the
 * web-only pricing note come straight from the case study.
 */

type Step = { title: string; body: string; key?: boolean };

const STEPS: Step[] = [
  { title: "Purpose", body: "What you want to be known for." },
  { title: "Profile", body: "Who you are, across every side of your work." },
  { title: "Resources", body: "Files, links, and projects that back it up." },
  { title: "Context", body: "Why each resource matters: intent, not just content." },
  { title: "Teach Your Ambasdr", body: "Topics to understand, tone to strike, and what to avoid saying.", key: true },
  { title: "Preview", body: "See the profile as a visitor would experience it." },
  { title: "Publish", body: "Go live across web, iOS, and Android." },
  { title: "Pricing", body: "Free, Pro, and Premium, kept on the web." },
];

export default function AmbasdrOnboarding() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Onboarding flow: teaching, not uploading</p>
        <ol className={styles.flow} aria-label="Ambasdr onboarding, from purpose to pricing">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`${styles.step} ${s.key ? styles.stepKey : ""}`}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span className={styles.stepTitle}>{s.title}</span>
              <span className={styles.stepBody}>{s.body}</span>
              {s.key && <span className={styles.stepTag}>Where the AI learns</span>}
            </li>
          ))}
        </ol>
        <p className={styles.flowNote}>
          Refined across roughly <b>15 versions</b>, tested with a community of 50–100 people.
          Plan management stayed on the web to sidestep App Store and Play Store payment cuts,
          a pricing call that also shaped where parts of the product could live.
        </p>
      </div>
      <figcaption className={styles.caption}>
        Onboarding wasn’t collecting information; it was learning how to represent someone.
        That’s why <em>Teach Your Ambasdr</em> became one of the most important parts of the
        product.
      </figcaption>
    </figure>
  );
}
