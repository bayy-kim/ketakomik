import { ImageResponse } from "next/og";

export const alt = "Tekakomik — Game Tebak Kata Harian Komik Modern";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF7F0",
          border: "12px solid #16161A",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Comic Halftone Pattern simulation */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
            backgroundImage: "radial-gradient(#16161A 2px, transparent 2px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Title Burst Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFD200",
            border: "6px solid #16161A",
            borderRadius: "16px",
            padding: "16px 40px",
            boxShadow: "8px 8px 0px #16161A",
            transform: "rotate(-3deg)",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#16161A",
              letterSpacing: "4px",
            }}
          >
            TEKAKOMIK
          </span>
        </div>

        {/* Subtitle / Tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#16161A",
            marginBottom: "40px",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          GAME TEBAK KATA HARIAN BERGAYA KOMIK MODERN
        </div>

        {/* Character VS Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#2B6CFF",
              color: "#ffffff",
              border: "5px solid #16161A",
              borderRadius: "12px",
              padding: "12px 24px",
              boxShadow: "6px 6px 0px #16161A",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            <span>🦸‍♂️ KAPTEN KLU</span>
            <span style={{ fontSize: "18px", opacity: 0.9 }}>(Clue Jujur)</span>
          </div>

          <span
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#16161A",
            }}
          >
            VS
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#FF3D81",
              color: "#ffffff",
              border: "5px solid #16161A",
              borderRadius: "12px",
              padding: "12px 24px",
              boxShadow: "6px 6px 0px #16161A",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            <span>🦹‍♀️ BAYANGAN</span>
            <span style={{ fontSize: "18px", opacity: 0.9 }}>(Clue Trik)</span>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#64748B",
          }}
        >
          tekakomik.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
