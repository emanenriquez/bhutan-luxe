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
        color: "#3B3A36",
        background: "transparent",
        border: "1px solid rgba(59,58,54,0.3)",
        cursor: "pointer",
        padding: "8px 18px",
        borderRadius: 8,
      }}
    >
      🖨 Print Itinerary
    </button>
  );
}
