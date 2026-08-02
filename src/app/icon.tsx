import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "6px",
          backgroundColor: "#FFD200",
          border: "2px solid #16161A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "20px",
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
