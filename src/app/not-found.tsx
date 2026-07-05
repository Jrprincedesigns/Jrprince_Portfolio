import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: "var(--step-3)", margin: "0.5rem 0 1rem" }}>
          This page wandered off.
        </h1>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 550 }}>
          ← Back home
        </Link>
      </div>
    </div>
  );
}
