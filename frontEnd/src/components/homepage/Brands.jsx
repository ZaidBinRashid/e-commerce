import LogoLoop from '../UI/LogoLoop';

// Alternative with image sources
const imageLogos = [
{ src: "./brands/seiko.png", alt: "seiko"},
{ src: "./brands/hmt.png", alt: "hmt"},
{ src: "./brands/casio.png", alt: "casio"},
{ src: "./brands/omega.png", alt: "omega"},
{ src: "./brands/citizen.png", alt: "citizen"},
];
export default function Brands(){


  return (
    <div style={{ height: '140px', position: 'relative', overflow: 'hidden'}}>
      <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="left"
        logoHeight={28}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
      <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="right"
        logoHeight={48}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
      <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="left"
        logoHeight={28}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );

}