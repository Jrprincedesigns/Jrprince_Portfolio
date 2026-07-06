import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>© Copyright {new Date().getFullYear()}</span>
    </footer>
  );
}
