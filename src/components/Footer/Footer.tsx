import Link from "next/link";
import { site } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cta}>
          <p className={styles.eyebrow}>Have a project in mind?</p>
          <Link href={`mailto:${site.email}`} className={styles.email}>
            {site.email}
          </Link>
        </div>

        <ul className={styles.socials}>
          {site.socials.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className={styles.social}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.meta}>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>{site.location}</span>
      </div>
    </footer>
  );
}
