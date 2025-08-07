import CircularGallery from "./UI/CircularGallery";

export default function Gallery() {
  return (
    <>
      <div
        style={{
          height: "600px",
          position: "relative",
          backgroundColor: "#692475",
          borderRadius: "16px",
          margin: "8px",
        }}
      >
        <CircularGallery
          bend={0}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>
    </>
  );
}
