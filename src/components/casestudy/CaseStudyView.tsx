import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import type {
  CaseStudyContent,
  CaseRef,
  CaseImage,
  CaseChapter,
  CaseBlock,
} from "@/data/caseStudyContent";
import ChapterNav from "./ChapterNav";
import EmbedFrame from "./EmbedFrame";
import styles from "./CaseStudy.module.css";

/** Stable id for a section heading so the chapter rail can anchor to it. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Shot({
  img,
  bleed = false,
  alt,
}: {
  img: CaseImage;
  bleed?: boolean;
  alt?: string;
}) {
  return (
    <Image
      src={img.src}
      alt={alt ?? img.alt ?? ""}
      width={img.w}
      height={img.h}
      quality={95}
      sizes={bleed ? "100vw" : "(max-width: 900px) 92vw, 1200px"}
      className={styles.shot}
    />
  );
}

/** Image + caption. The caption carries the description, so the <img> is
 *  marked decorative to avoid a screen reader announcing it twice. */
function Figure({ img }: { img: CaseImage }) {
  return (
    <figure className={styles.figure}>
      <Shot img={img} alt={img.alt ? "" : undefined} />
      {img.alt && <figcaption className={styles.caption}>{img.alt}</figcaption>}
    </figure>
  );
}

/**
 * Editorial case-study page built on a four-tier grid — reading (760),
 * medium (1040), wide (1280), and full-bleed. Body copy stays in the reading
 * column; images step out to wider tiers by role. Every study gets a sticky
 * chapter rail (from explicit chapters, else derived from section headings).
 */
export default function CaseStudyView({
  study,
  prev,
  next,
}: {
  study: CaseStudyContent;
  prev: CaseRef | null;
  next: CaseRef | null;
}) {
  const showHeroMedia = study.heroImage || study.draft;

  // Anchor id for a section block: explicit id, else a slug of its title.
  const sectionId = (b: Extract<CaseBlock, { kind: "section" }>) =>
    b.id ?? slugify(b.title);

  const chapters: CaseChapter[] =
    study.chapters ??
    study.blocks
      .filter((b): b is Extract<CaseBlock, { kind: "section" }> => b.kind === "section")
      .map((b) => ({ id: sectionId(b), label: b.title }));

  return (
    <article className={styles.page}>
      {chapters.length > 1 && <ChapterNav chapters={chapters} />}

      <section className={`${styles.hero} ${styles.medium}`}>
        <p className={styles.eyebrow}>{study.eyebrow ?? study.project}</p>
        <h1 className={styles.title}>{study.title}</h1>
        {study.lead && <p className={styles.lead}>{study.lead}</p>}

        <div className={styles.metaGrid}>
          {study.meta.map((m) => (
            <div key={m.label} className={styles.metaItem}>
              <div className={styles.metaLabel}>{m.label}</div>
              <div className={styles.metaValue}>{m.value}</div>
            </div>
          ))}
        </div>
      </section>

      {showHeroMedia && (
        <div className={`${styles.block} ${styles.heroBleed}`}>
          {study.heroImage ? (
            <Shot img={study.heroImage} bleed />
          ) : (
            <div className={styles.wideInner}>
              <span className={styles.mockLabel}>
                {study.heroLabel ?? study.project}
              </span>
            </div>
          )}
        </div>
      )}

      {study.focusAreas && study.focusAreas.length > 0 && (
        <section className={`${styles.block} ${styles.medium}`}>
          <h2 className={styles.sectionTitle}>Focus areas</h2>
          <ul className={styles.focusList}>
            {study.focusAreas.map((f) => (
              <li key={f} className={styles.focusItem}>
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {study.blocks.map((block, i) => {
        if (block.kind === "section") {
          return (
            <section
              className={`${styles.block} ${styles.reading}`}
              key={i}
              id={sectionId(block)}
            >
              <h2 className={styles.sectionTitle}>{block.title}</h2>
              <div className={styles.sectionCopy}>
                {block.kicker && <p className={styles.kicker}>{block.kicker}</p>}
                {block.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          );
        }
        if (block.kind === "quote") {
          return (
            <div className={`${styles.block} ${styles.reading}`} key={i}>
              <blockquote className={styles.quote}>{block.text}</blockquote>
            </div>
          );
        }
        if (block.kind === "embed") {
          return (
            <div className={`${styles.block} ${styles.medium}`} key={i}>
              <EmbedFrame embed={block.embed} title={block.caption ?? "Interactive diagram"} />
              {block.caption && <p className={styles.caption}>{block.caption}</p>}
            </div>
          );
        }
        if (block.kind === "banner") {
          return (
            <section
              className={`${styles.divider} ${styles.bleed} ${styles.banner}`}
              key={i}
              id={block.id}
              data-cs-dark
            >
              <div className={styles.bannerInner}>
                {block.eyebrow && (
                  <span className={styles.bannerEyebrow}>{block.eyebrow}</span>
                )}
                <p className={styles.bannerText}>{block.text}</p>
              </div>
            </section>
          );
        }
        if (block.kind === "stats") {
          return (
            <section className={`${styles.block} ${styles.reading} ${styles.stats}`} key={i}>
              {block.items.map((s) => (
                <div key={s.label}>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </section>
          );
        }
        if (block.kind === "cards") {
          return (
            <section className={`${styles.block} ${styles.medium}`} key={i}>
              {block.label && <h2 className={styles.cardsLabel}>{block.label}</h2>}
              <div className={styles.cardGrid}>
                {block.items.map((c) => (
                  <div key={c.title} className={styles.card}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <p className={styles.cardBody}>{c.body}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (block.kind === "timeline") {
          return (
            <section className={`${styles.block} ${styles.wide}`} key={i}>
              {block.label && <h2 className={styles.cardsLabel}>{block.label}</h2>}
              <ol className={styles.timelineRow}>
                {block.items.map((t, j) => (
                  <li key={t.label} className={styles.tstep}>
                    <span className={styles.tnum}>
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.tlabel}>{t.label}</span>
                    {t.sub && <span className={styles.tsub}>{t.sub}</span>}
                  </li>
                ))}
              </ol>
            </section>
          );
        }
        if (block.kind === "decisionLog") {
          return (
            <section className={`${styles.block} ${styles.reading}`} key={i} id={block.id}>
              <div className={styles.decisionInner}>
                <span className={styles.decisionTag}>Decision log</span>
                <h3 className={styles.decisionTitle}>{block.title}</h3>
                <dl className={styles.decisionRows}>
                  {block.rows.map((r) => (
                    <div key={r.label} className={styles.decisionRow}>
                      <dt className={styles.decisionLabel}>{r.label}</dt>
                      <dd className={styles.decisionText}>{r.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          );
        }
        if (block.kind === "evolution") {
          return (
            <section className={`${styles.block} ${styles.medium}`} key={i}>
              {block.label && <h2 className={styles.cardsLabel}>{block.label}</h2>}
              <div className={styles.evoTable}>
                <div className={styles.evoHead}>
                  <span>{block.beforeLabel ?? "Before"}</span>
                  <span aria-hidden="true" />
                  <span>{block.afterLabel ?? "After"}</span>
                </div>
                {block.rows.map((r, j) => (
                  <div key={j} className={styles.evoRow}>
                    <span className={styles.evoBefore}>{r.before}</span>
                    <span className={styles.evoArrow} aria-hidden="true">
                      →
                    </span>
                    <span className={styles.evoAfter}>{r.after}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (block.kind === "questions") {
          return (
            <section className={`${styles.block} ${styles.reading}`} key={i} id={block.id}>
              {block.label && <h2 className={styles.cardsLabel}>{block.label}</h2>}
              <ul className={styles.questionList}>
                {block.items.map((q) => (
                  <li key={q} className={styles.question}>
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        // ---- media ----
        const width =
          block.variant === "panel" || block.variant === "tall"
            ? styles.medium
            : styles.wide;

        if (block.images && block.images.length > 0) {
          if (block.variant === "grid") {
            return (
              <div className={`${styles.block} ${styles.wide}`} key={i}>
                <div className={styles.imageGrid}>
                  {block.images.map((im, j) => (
                    <Figure img={im} key={j} />
                  ))}
                </div>
              </div>
            );
          }
          if (block.variant === "tall") {
            return (
              <div className={`${styles.block} ${styles.reading}`} key={i}>
                <div className={styles.tallWrap}>
                  <Figure img={block.images[0]} />
                </div>
              </div>
            );
          }
          return (
            <div className={`${styles.block} ${width}`} key={i}>
              <Figure img={block.images[0]} />
            </div>
          );
        }

        // ---- placeholder media ----
        if (block.variant === "grid") {
          return (
            <div className={`${styles.block} ${styles.wide}`} key={i}>
              <div className={styles.imageGrid}>
                {(block.labels ?? []).map((label, j) => (
                  <div className={styles.mock} key={j}>
                    <span className={styles.mockLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div className={`${styles.block} ${styles.medium}`} key={i}>
            <div className={styles.wideInner}>
              <span className={styles.mockLabel}>{block.labels?.[0]}</span>
            </div>
          </div>
        );
      })}

      {study.draft && (
        <section className={`${styles.block} ${styles.reading}`}>
          <h2 className={styles.sectionTitle}>Coming soon</h2>
          <div className={styles.sectionCopy}>
            <p>The full write-up for this project is in progress.</p>
          </div>
        </section>
      )}

      <nav className={`${styles.divider} ${styles.wide} ${styles.pager}`} aria-label="More case studies">
        {prev ? (
          <Link className={`${styles.pagerLink} ${styles.pagerPrev}`} href={`/work/${prev.slug}`}>
            <span className={styles.pagerKicker}>← Previous</span>
            <span className={styles.pagerName}>{prev.project}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link className={`${styles.pagerLink} ${styles.pagerNext}`} href={`/work/${next.slug}`}>
            <span className={styles.pagerKicker}>Next project →</span>
            <span className={styles.pagerName}>{next.project}</span>
          </Link>
        )}
      </nav>

      <footer className={`${styles.bleed} ${styles.footer}`} data-cs-dark>
        <div className={styles.footerInner}>
          <Link href="/#contact" className={styles.footerCta}>
            Let&rsquo;s work together
          </Link>
          <div className={styles.footerBottom}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>
              Designed by {site.name} · {site.location}
            </span>
          </div>
        </div>
      </footer>
    </article>
  );
}
