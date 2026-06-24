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
          "radial-gradient(120% 90% at 50% 0%, #251a45 0%, #140f2c 45%, #0d0a1f 100%)",
        color: "#F7F1E3",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 110, color: "#E0A030", display: "flex" }}>
        {site.nameDevanagari}
      </div>
      <div style={{ fontSize: 64, marginTop: 8, display: "flex" }}>{site.shortName}</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#C9BFA8", display: "flex" }}>
        Music · Dance · Fine Arts — Karvi, Chitrakoot
      </div>
      <div style={{ fontSize: 28, marginTop: 40, color: "#F5C451", display: "flex" }}>
        {site.tagline}
      </div>
    </div>,
    { ...size }
  );
}
