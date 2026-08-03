import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "96px",
          backgroundColor: "#FFD200",
          border: "20px solid #16161A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "300px",
          color: "#16161A",
          fontFamily: "sans-serif",
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
