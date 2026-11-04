import { ImageResponse } from "next/og";

export const alt = "GameSpec: calculadora de cuello de botella y estimador de FPS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(139, 92, 246, 0.45), transparent 42%), radial-gradient(circle at 88% 80%, rgba(34, 211, 238, 0.28), transparent 36%)",
          padding: "72px",
          color: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "999px",
              backgroundColor: "#22d3ee",
            }}
          />
          <div
            style={{
              fontSize: "28px",
              letterSpacing: "0.28em",
              color: "#67e8f9",
              fontWeight: 700,
            }}
          >
            GAMESPEC
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "980px" }}>
          <div style={{ fontSize: "68px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Calculadora de cuello de botella y estimador de FPS
          </div>
          <div style={{ marginTop: "28px", fontSize: "30px", color: "#cbd5e1" }}>
            GTA VI · Fortnite · Warzone · CPU y GPU gratis
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "24px", color: "#e2e8f0" }}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "999px",
              padding: "10px 18px",
            }}
          >
            1080p
          </div>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "999px",
              padding: "10px 18px",
            }}
          >
            1440p
          </div>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "999px",
              padding: "10px 18px",
            }}
          >
            4K
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
