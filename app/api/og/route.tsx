import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title    = searchParams.get("title")    ?? "Imóvel em Portugal";
  const price    = searchParams.get("price")    ?? "";
  const location = searchParams.get("location") ?? "Portugal";
  const type     = searchParams.get("type")     ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1B3A5C",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "auto" }}>
          <div style={{
            width: 48, height: 48, background: "#E8651A", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: 24 }}>⌂</span>
          </div>
          <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>Sua</span>
          <span style={{ color: "#E8651A", fontSize: 28 }}>Morada</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {type && (
            <span style={{
              background: "rgba(232,101,26,0.2)", color: "#E8651A",
              fontSize: 14, fontWeight: 600, padding: "6px 16px",
              borderRadius: 20, width: "fit-content", letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              {type}
            </span>
          )}

          <h1 style={{
            color: "white", fontSize: 48, fontWeight: 700,
            lineHeight: 1.2, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, overflow: "hidden",
          }}>
            {title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {price && (
              <span style={{ color: "#E8651A", fontSize: 36, fontWeight: 700 }}>
                {price}
              </span>
            )}
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 20 }}>
              📍 {location}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40, paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)", fontSize: 14,
        }}>
          suamorada.pt — Portal Imobiliário Portugal
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
