// Premium academic logo representing RUET Urban & Regional Planning (URP) with a smart, glowing blue aesthetic.
// This is a vector SVG encoded as a data URL to render flawlessly on all device types and in light/dark modes.

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <!-- Rich professional blue gradients -->
    <radialGradient id="shieldBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e40af" />
      <stop offset="65%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#090d16" />
    </radialGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Outer shield circular contour with gold/blue border -->
  <circle cx="100" cy="100" r="92" stroke="url(#blueGrad)" stroke-width="3" fill="url(#shieldBg)" />
  <circle cx="100" cy="100" r="86" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="6 3" opacity="0.8" />
  <circle cx="100" cy="100" r="82" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.6" />
  
  <!-- Geographic Coordinates & GIS Latitude / Longitude lines -->
  <path d="M 100 18 A 82 82 0 0 0 100 182" stroke="#1d4ed8" stroke-width="0.75" opacity="0.4" />
  <path d="M 18 100 A 82 82 0 0 0 182 100" stroke="#1d4ed8" stroke-width="0.75" opacity="0.4" />
  <path d="M 100 18 A 82 82 0 0 1 100 182" stroke="#1d4ed8" stroke-width="0.75" opacity="0.4" />
  <path d="M 18 100 A 82 82 0 0 1 182 100" stroke="#1d4ed8" stroke-width="0.75" opacity="0.4" />
  
  <!-- Concentric mapping circles (GIS elevation/contour feel) -->
  <circle cx="100" cy="100" r="62" stroke="#1e40af" stroke-width="0.75" opacity="0.5" />
  <circle cx="100" cy="100" r="44" stroke="#1e40af" stroke-width="0.75" opacity="0.5" />
  
  <!-- Planning Nodes & Network Graph (Symbolizing Urban Infrastructure Connectivity) -->
  <g opacity="0.75">
    <line x1="56" y1="110" x2="100" y2="70" stroke="#60a5fa" stroke-width="1.2" />
    <line x1="100" y1="70" x2="144" y2="110" stroke="#60a5fa" stroke-width="1.2" />
    <line x1="144" y1="110" x2="116" y2="148" stroke="#60a5fa" stroke-width="1.2" />
    <line x1="116" y1="148" x2="84" y2="148" stroke="#60a5fa" stroke-width="1.2" />
    <line x1="84" y1="148" x2="56" y2="110" stroke="#60a5fa" stroke-width="1.2" />
    
    <!-- Central connection lines -->
    <line x1="100" y1="70" x2="100" y2="128" stroke="#38bdf8" stroke-width="1" />
    <line x1="56" y1="110" x2="100" y2="128" stroke="#38bdf8" stroke-width="1" />
    <line x1="144" y1="110" x2="100" y2="128" stroke="#38bdf8" stroke-width="1" />
    <line x1="84" y1="148" x2="100" y2="128" stroke="#38bdf8" stroke-width="1" />
    <line x1="116" y1="148" x2="100" y2="128" stroke="#38bdf8" stroke-width="1" />
  </g>
  
  <!-- Core Spatial Crest: Glowing Geometric Urban Blueprint block -->
  <g transform="translate(100, 100) scale(0.92)">
    <path d="M-24,8 L0,-16 L24,8 L0,32 Z" fill="#1e293b" fill-opacity="0.75" stroke="url(#accentGrad)" stroke-width="2.5" filter="url(#neonGlow)" />
    <!-- Light reflection facets -->
    <path d="M-24,8 L0,8 L0,32 L-24,8 Z" fill="#3b82f6" fill-opacity="0.3" />
    <path d="M24,8 L0,8 L0,32 L24,8 Z" fill="#1d4ed8" fill-opacity="0.4" />
    
    <!-- Spatial Compass points (The planning compass) -->
    <polygon points="0,-45 4,-14 -4,-14" fill="#38bdf8" />
    <polygon points="0,45 4,14 -4,14" fill="#1d4ed8" />
    <polygon points="45,0 14,4 14,-4" fill="#38bdf8" />
    <polygon points="-45,0 -14,4 -14,-4" fill="#1d4ed8" />
  </g>
  
  <!-- Glowing Spatial Nodes -->
  <circle cx="100" cy="59" r="5" fill="#38bdf8" filter="url(#neonGlow)" />
  <circle cx="56" cy="110" r="4" fill="#60a5fa" />
  <circle cx="144" cy="110" r="4" fill="#60a5fa" />
  <circle cx="84" cy="148" r="3.5" fill="#3b82f6" />
  <circle cx="116" cy="148" r="3.5" fill="#3b82f6" />
  <circle cx="100" cy="128" r="4.5" fill="#60a5fa" />
  
  <!-- Curved Typography surrounding the shield -->
  <!-- Upper text path -->
  <path id="textPathUpper" d="M 23,100 A 77,77 0 0,1 177,100" fill="none" />
  <!-- Lower text path -->
  <path id="textPathLower" d="M 177,100 A 77,77 0 0,1 23,100" fill="none" />
  
  <!-- Academic Name (Upper Hemisphere) -->
  <text font-family="'Inter', ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="800" fill="#93c5fd" letter-spacing="1.5">
    <textPath href="#textPathUpper" startOffset="50%" text-anchor="middle">
      RAJSHAHI UNIVERSITY OF ENG. &amp; TECH.
    </textPath>
  </text>
  
  <!-- Department Name (Lower Hemisphere) -->
  <text font-family="'Inter', ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" letter-spacing="2">
    <textPath href="#textPathLower" startOffset="50%" text-anchor="middle">
      • URBAN &amp; REGIONAL PLANNING •
    </textPath>
  </text>
</svg>
`;

export const ruetLogo = "data:image/svg+xml;utf8," + encodeURIComponent(svgContent);
export default ruetLogo;
