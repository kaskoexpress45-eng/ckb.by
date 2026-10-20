import { ImageResponse } from "next/og";
export const alt =
  "Юрий Бельчик — продажи, переговоры и развитие руководителей";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#183f35",
        color: "#f6f7f2",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "70px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 27,
        }}
      >
        <span>CKB.by</span>
        <span>Юрий Бельчик</span>
      </div>
      <div
        style={{
          fontSize: 70,
          lineHeight: 1.12,
          display: "flex",
          maxWidth: 1000,
        }}
      >
        Сильные решения начинаются с понимания
      </div>
      <div style={{ fontSize: 27, display: "flex", color: "#c9d9c7" }}>
        Продажи • Переговоры • Развитие руководителей
      </div>
    </div>,
    size,
  );
}
