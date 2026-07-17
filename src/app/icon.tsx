import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/db/repo";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const settings = await getSettings();
  const letter = (settings.name || "R").charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c8562d",
          borderRadius: "50%",
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        {letter}
      </div>
    ),
    { ...size }
  );
}
