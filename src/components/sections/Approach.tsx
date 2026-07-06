import Section from "@/components/Section/Section";
import { approach } from "@/data/home";
import styles from "./Approach.module.css";

export default function Approach() {
  return (
    <Section label="Approach" id="approach">
      <div className={styles.grid}>
        {approach.map((item) => (
          <div key={item.n} className={styles.item}>
            <span className={styles.n}>{item.n}</span>
            <p className={styles.text}>
              <span className={styles.itemTitle}>{item.title}</span>{" "}
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
