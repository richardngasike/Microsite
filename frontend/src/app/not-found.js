import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>
        The page you are looking for may have moved, Under development or no longer exists.
      </p>
      <Link href="/" className={styles.btn}>Back to home</Link>
    </div>
  );
}
