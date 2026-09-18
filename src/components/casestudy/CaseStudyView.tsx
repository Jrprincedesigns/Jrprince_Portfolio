import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import type {
  CaseStudyContent,
  CaseRef,
  CaseImage,
  CaseBlock,
  CaseChapter,
} from "@/data/caseStudyContent";
import ChapterNav from "./ChapterNav";
import EmbedFrame from "./EmbedFrame";
import HeroShowcase from "./HeroShowcase";
import AmbasdrHero from "./reveals/AmbasdrHero";
import AmbasdrScrollVideo from "./reveals/AmbasdrScrollVideo";
import DoorvestPanels from "./reveals/DoorvestPanels";
import LiveResearchStickies from "./reveals/LiveResearchStickies";
import Reveal from "@/components/motion/Reveal";
import styles from "./CaseStudy.module.css";

/**
 * A block renders at the width its kind has always used, unless it asks for
 * another. Keeping the per-kind value as the fallback means adding `width` to
 * one block changes that block and nothing else.
 */
function widthOf(block: CaseBlock, fallback: string): string {
  return block.width ? (styles[block.width] ?? fallback) : fallback;
}

/** Stable id for a section/group heading so the chapter rail can anchor to it. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Loose equality so a group's child heading is hidden when it just repeats the
 *  group's own label. */
function sameText(a: string, b: string) {
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return n(a) === n(b);
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

/** The inner blocks of a group (section / cards / quote / decisionLog), rendered
 *  compact: no width container or reveal of their own — the group provides both,
 *  and its right column is already the reading measure. */
function GroupChild({
  block,
  groupLabel,
}: {
  block: CaseBlock;
  groupLabel: string;
}) {
  if (block.kind === "section") {
    const showHeading = !sameText(block.title, groupLabel);
    return (
      <div className={styles.groupSection}>
        {showHeading && <h3 className={styles.groupHeading}>{block.title}</h3>}
        {block.kicker && <p className={styles.sectionLead}>{block.kicker}</p>}
        <div className={styles.sectionCopy}>
          {block.body.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </div>
      </div>
    );
  }
  if (block.kind === "quote") {
    return <blockquote className={styles.quote}>{block.text}</blockquote>;
  }
  if (block.kind === "cards") {
    return (
      <div className={styles.groupSection}>
        {block.label && <h3 className={styles.groupHeading}>{block.label}</h3>}
        <div className={styles.cardGrid}>
          {block.items.map((c) => (
            <div key={c.title} className={styles.card}>
              <h4 className={styles.cardTitle}>{c.title}</h4>
              <p className={styles.cardBody}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (block.kind === "decisionLog") {
    return (
      <div className={styles.decisionInner} id={block.id}>
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
    );
  }
  return null;
}

/**
 * Editorial case-study page. Flagship studies (Doorvest) organise their content
 * into titled `group` blocks — a category label (and optional pinned visual) in
 * a left column, content in a wider right column — matching the Figma. Full-
 * bleed media and embeds sit between the groups. Simpler studies use a flat
 * block list; each `section` then renders as its own two-column split.
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
  const showcase = study.heroShowcase;

  const sectionId = (b: Extract<CaseBlock, { kind: "section" }>) =>
    b.id ?? slugify(b.title);
  const groupId = (b: Extract<CaseBlock, { kind: "group" }>) =>
    b.id ?? slugify(b.label);

  // The chapter rail follows the groups when a study has them (their labels are
  // the Figma's left-column categories); otherwise it derives from sections.
  const groups = study.blocks.filter(
    (b): b is Extract<CaseBlock, { kind: "group" }> => b.kind === "group"
  );
  const chapters: CaseChapter[] =
    study.chapters ??
    (groups.length > 0
      ? groups.map((g) => ({ id: groupId(g), label: g.label }))
      : study.blocks
          .filter(
            (b): b is Extract<CaseBlock, { kind: "section" }> =>
              b.kind === "section"
          )
          .map((b) => ({ id: sectionId(b), label: b.title })));

  const dark = study.theme === "dark";

  return (
    <article
      className={`${styles.page} ${
        dark ? styles.pageDark : showcase ? styles.pageLight : ""
      }`}
      data-cs-dark={dark ? "" : undefined}
      style={
        study.accent
          ? ({ ["--cs-accent"]: study.accent } as CSSProperties)
          : undefined
      }
    >
      {chapters.length > 1 && <ChapterNav chapters={chapters} />}

      {showcase && (
        <HeroShowcase
          image={showcase.image}
          wordmark={showcase.wordmark ?? study.project}
          band={showcase.band}
        />
      )}

      <section className={`${styles.hero} ${showcase ? styles.wide : styles.medium} ${showcase ? styles.heroTight : ""}`}>
        {/* Utility row: back out of the study, or go see the shipped thing. */}
        <div className={styles.heroUtility}>
          <Link href="/#case-studies" className={styles.backLink}>
            <span aria-hidden="true">←</span> Back to case studies
          </Link>
          {study.liveUrl && (
            <a
              className={styles.liveLink}
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {study.liveLabel ?? "View site"} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {/* With a showcase hero, the project name is the H1 and sits on one row
            with the meta; the descriptive title drops into the overview row. */}
        {showcase ? (
          <div className={styles.identityRow}>
            <h1 className={styles.identityName}>{study.project}</h1>
            <div className={styles.metaInline}>
              {study.meta.map((m) => (
                <div key={m.label} className={styles.metaInlineItem}>
                  <div className={styles.metaLabel}>{m.label}</div>
                  <div className={styles.metaValue}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className={styles.eyebrow}>{study.eyebrow ?? study.project}</p>
            <h1 className={styles.title}>{study.title}</h1>
            <div className={styles.metaGrid}>
              {study.meta.map((m) => (
                <div key={m.label} className={styles.metaItem}>
                  <div className={styles.metaLabel}>{m.label}</div>
                  <div className={styles.metaValue}>{m.value}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {study.lead && (
          <div className={styles.overviewRow}>
            <h2 className={styles.overviewLabel}>Project overview</h2>
            <div className={styles.overviewBody}>
              {showcase && <p className={styles.overviewTitle}>{study.title}</p>}
              <p className={styles.lead}>{study.lead}</p>
            </div>
          </div>
        )}

        {study.outcomes && study.outcomes.length > 0 && (
          <div className={styles.metricsRow}>
            <h2 className={styles.overviewLabel}>Key metrics</h2>
            <dl className={styles.metricsGrid}>
              {study.outcomes.map((o, i) => (
                <Reveal
                  as="div"
                  key={o.label}
                  className={styles.metricCard}
                  delay={i * 0.08}
                >
                  <dt className={styles.metricValue}>{o.value}</dt>
                  <dd className={styles.metricLabel}>{o.label}</dd>
                  <div className={styles.metricFoot}>
                    <span className={styles.metricIndex}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.metricTag}>Impact metrics</span>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        )}
      </section>

      {showHeroMedia && (
        <div
          className={`${styles.block} ${styles.heroBleed} ${
            study.heroFramed ? styles.heroFramed : ""
          }`}
          style={
            study.heroFramed && study.heroImage
              ? { aspectRatio: `${study.heroImage.w} / ${study.heroImage.h}` }
              : undefined
          }
        >
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
        if (block.kind === "group") {
          return (
            <Reveal
              as="section"
              className={`${styles.block} ${styles.wide} ${styles.groupBlock}`}
              key={i}
              id={groupId(block)}
              amount={0.1}
            >
              <div className={styles.groupLabelCol}>
                <h2 className={styles.groupLabel}>{block.label}</h2>
                {block.media && (
                  <div className={styles.groupMedia}>
                    <Image
                      src={block.media.src}
                      alt={block.media.alt ?? ""}
                      width={block.media.w}
                      height={block.media.h}
                      quality={95}
                      sizes="(max-width: 900px) 60vw, 340px"
                      className={styles.groupMediaImg}
                    />
                  </div>
                )}
              </div>
              <div className={styles.groupContent}>
                {block.blocks.map((b, j) => (
                  <GroupChild key={j} block={b} groupLabel={block.label} />
                ))}
              </div>
            </Reveal>
          );
        }
        if (block.kind === "section") {
          return (
            <Reveal
              as="section"
              className={`${styles.block} ${widthOf(block, styles.medium)} ${styles.sectionSplit}`}
              key={i}
              id={sectionId(block)}
              amount={0.15}
            >
              <h2 className={styles.sectionLabel}>{block.title}</h2>
              <div className={styles.sectionBody}>
                {block.kicker && (
                  <p className={styles.sectionLead}>{block.kicker}</p>
                )}
                <div className={styles.sectionCopy}>
                  {block.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        }
        if (block.kind === "quote") {
          return (
            <Reveal as="div" className={`${styles.block} ${widthOf(block, styles.reading)}`} key={i}>
              <blockquote className={styles.quote}>{block.text}</blockquote>
            </Reveal>
          );
        }
        if (block.kind === "embed") {
          return (
            <Reveal as="div" className={`${styles.block} ${widthOf(block, styles.wide)}`} key={i}>
              <EmbedFrame embed={block.embed} title={block.caption ?? "Interactive diagram"} />
              {block.caption && <p className={styles.caption}>{block.caption}</p>}
            </Reveal>
          );
        }
        if (block.kind === "reveal") {
          return (
            <div className={`${styles.block} ${widthOf(block, styles.wide)}`} key={i}>
              {block.name === "ambasdr-hero" && (
                <AmbasdrHero caption={block.caption} />
              )}
              {block.name === "ambasdr-scroll-video" && (
                <AmbasdrScrollVideo caption={block.caption} />
              )}
              {block.name === "doorvest-panels" && (
                <DoorvestPanels caption={block.caption} />
              )}
              {block.name === "live-research-stickies" && (
                <LiveResearchStickies caption={block.caption} />
              )}
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
            <section className={`${styles.block} ${widthOf(block, styles.reading)} ${styles.stats}`} key={i}>
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
            <Reveal as="section" className={`${styles.block} ${widthOf(block, styles.medium)}`} key={i} amount={0.15}>
              {block.label && <h2 className={styles.cardsLabel}>{block.label}</h2>}
              <div className={styles.cardGrid}>
                {block.items.map((c) => (
                  <div key={c.title} className={styles.card}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <p className={styles.cardBody}>{c.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          );
        }
        if (block.kind === "timeline") {
          return (
            <section className={`${styles.block} ${widthOf(block, styles.wide)}`} key={i}>
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
            <Reveal as="section" className={`${styles.block} ${widthOf(block, styles.reading)}`} key={i} id={block.id} amount={0.15}>
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
            </Reveal>
          );
        }
        if (block.kind === "evolution") {
          return (
            <Reveal as="section" className={`${styles.block} ${widthOf(block, styles.medium)}`} key={i} amount={0.15}>
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
            </Reveal>
          );
        }
        if (block.kind === "questions") {
          return (
            <section className={`${styles.block} ${widthOf(block, styles.reading)}`} key={i} id={block.id}>
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
              <Reveal as="div" className={`${styles.block} ${widthOf(block, styles.wide)}`} key={i} amount={0.15}>
                <div className={styles.imageGrid}>
                  {block.images.map((im, j) => (
                    <Figure img={im} key={j} />
                  ))}
                </div>
              </Reveal>
            );
          }
          if (block.variant === "tall") {
            return (
              <Reveal as="div" className={`${styles.block} ${widthOf(block, styles.reading)}`} key={i} amount={0.15}>
                <div className={styles.tallWrap}>
                  <Figure img={block.images[0]} />
                </div>
              </Reveal>
            );
          }
          return (
            <Reveal as="div" className={`${styles.block} ${widthOf(block, width)}`} key={i} amount={0.15}>
              <Figure img={block.images[0]} />
            </Reveal>
          );
        }

        // ---- placeholder media ----
        if (block.variant === "grid") {
          return (
            <Reveal as="div" className={`${styles.block} ${widthOf(block, styles.wide)}`} key={i} amount={0.15}>
              <div className={styles.imageGrid}>
                {(block.labels ?? []).map((label, j) => (
                  <div className={styles.mock} key={j}>
                    <span className={styles.mockLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          );
        }
        return (
          <Reveal as="div" className={`${styles.block} ${widthOf(block, styles.medium)}`} key={i} amount={0.15}>
            <div className={styles.wideInner}>
              <span className={styles.mockLabel}>{block.labels?.[0]}</span>
            </div>
          </Reveal>
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
