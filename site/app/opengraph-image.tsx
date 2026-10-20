import { ImageResponse } from "next/og";
export const alt =
  "Юрий Бельчик — продажи, переговоры и развитие руководителей";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#242326",
        color: "#f4f6fa",
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
        Сложные сделки требуют сильных переговоров
      </div>
      <div style={{ fontSize: 27, display: "flex", color: "#d0b6bd" }}>
        Продажи • Переговоры • Развитие руководителей
      </div>
    </div>,
    size,
  );
}
