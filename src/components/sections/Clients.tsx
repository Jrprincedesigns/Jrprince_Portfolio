import Section from "@/components/Section/Section";
import { clients } from "@/data/home";
import styles from "./Clients.module.css";

/**
 * Client logo row. Text placeholders for now — replace each <span> with an
 * inline SVG or next/image logo, and they'll sit in the same muted row.
 */
export default function Clients() {
  return (
    <Section
      label="Clients"
      id="clients"
      action={{ label: "View all", href: "#" }}
    >
      <ul className={styles.row}>
        {clients.map((c) => (
          <li key={c} className={styles.logo}>
            {c}
          </li>
        ))}
      </ul>
    </Section>
  );
}
