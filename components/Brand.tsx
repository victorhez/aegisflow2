import Link from "next/link";

export function Brand() {
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(135deg, #6d5dfc 0%, #3b82f6 50%, #22c55e 100%)",
          boxShadow: "0 8px 30px rgba(99, 102, 241, 0.35)",
          fontSize: "20px",
        }}
        suppressHydrationWarning
      >
        🛡️
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}
        suppressHydrationWarning
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          Aegis<span style={{ color: "#8b5cf6" }}>Flow</span>
        </span>

        <span
          style={{
            fontSize: "9px",
            opacity: 0.6,
            marginTop: "5px",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          AI Incident Response
        </span>
      </div>
    </Link>
  );
}