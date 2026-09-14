import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The mark, reduced to the three pills and the dot on a blue disc. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0080c8",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 6,
          padding: "0 12px",
          position: "relative",
        }}
      >
        <div style={{ width: 26, height: 8, borderRadius: 4, background: "#fff" }} />
        <div style={{ width: 36, height: 8, borderRadius: 4, background: "#fff" }} />
        <div style={{ width: 26, height: 8, borderRadius: 4, background: "#fff" }} />
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 43,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: "#fbc400",
          }}
        />
      </div>
    ),
    size,
  );
}
