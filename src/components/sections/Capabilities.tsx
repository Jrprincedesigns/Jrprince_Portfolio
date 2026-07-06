import Section from "@/components/Section/Section";
import { capabilities } from "@/data/home";
import styles from "./Capabilities.module.css";

export default function Capabilities() {
  return (
    <Section label="Capabilities" id="capabilities">
      <ul className={styles.pills}>
        {capabilities.map((c) => (
          <li key={c} className={styles.pill}>
            {c}
          </li>
        ))}
      </ul>
    </Section>
  );
}
