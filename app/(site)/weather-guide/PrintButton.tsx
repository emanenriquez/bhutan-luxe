"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#F7F5F0",
        background: "transparent",
        border: "1px solid rgba(247,245,240,0.3)",
        cursor: "pointer",
        padding: "8px 18px",
        borderRadius: 8,
      }}
    >
      🖨 Print
    </button>
  );
}
