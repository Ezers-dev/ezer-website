import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — creative agency`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#0080c8",
          color: "#f6f5f2",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em" }}>
            Ezers &amp; Strategies
          </div>
          <div style={{ fontSize: 40, opacity: 0.85, marginTop: 8 }}>
            {site.tagline}
          </div>
          <div style={{ fontSize: 26, opacity: 0.7, marginTop: 32 }}>
            Branding · Digital · Creative Strategy · Content
          </div>
        </div>
      </div>
    ),
    size,
  );
}
