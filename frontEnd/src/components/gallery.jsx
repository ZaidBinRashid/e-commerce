

import CircularGallery from "./UI/CircularGallery";

export default function Gallery() {
  return (
    <>
      <div 
        style={{
          height: "600px",
          position: "relative",
          backgroundColor: "#2B2B2B",

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
