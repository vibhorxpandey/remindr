import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const runtime = "edge";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamically generated Open Graph image — branded indigo + gold. */
export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "radial-gradient(120% 90% at 50% 0%, #fbeed4 0%, #fcf6ea 45%, #ffffff 100%)",
        color: "#241a33",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 110, color: "#9a6a0a", display: "flex" }}>
        {site.nameDevanagari}
      </div>
      <div style={{ fontSize: 64, marginTop: 8, display: "flex" }}>{site.shortName}</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#6a6175", display: "flex" }}>
        Music · Dance · Fine Arts — Karvi, Chitrakoot
      </div>
      <div style={{ fontSize: 28, marginTop: 40, color: "#4a1020", display: "flex" }}>
        {site.tagline}
      </div>
    </div>,
    { ...size }
  );
}
