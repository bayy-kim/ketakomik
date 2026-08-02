import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "36px",
          backgroundColor: "#FFD200",
          border: "8px solid #16161A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "110px",
          color: "#16161A",
          fontFamily: "sans-serif",
          boxShadow: "0 8px 0 #16161A",
        }}
      >
        T
      </div>
    ),
    {
      ...size,
    }
  );
}
