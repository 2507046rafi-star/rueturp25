// Masterfully designed academic logo representing RUET Urban & Regional Planning (URP) with a high-end GIS/Planning aesthetic.
// This is a premium vector SVG encoded as a data URL to render flawlessly on all device screens and in light/dark modes.

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <!-- Deep premium space-slate with glowing purple-indigo depths -->
    <radialGradient id="shieldBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    
    <!-- Vibrant cyber electric teal/blue -->
    <linearGradient id="cyberBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    
    <!-- Bright neon coral/rose gradient for high-contrast secondary accents -->
    <linearGradient id="coralRose" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fb923c" />
    </linearGradient>
    
    <!-- Prestigious gold gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <!-- Glowing effect filter -->
    <filter id="neonGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Outer Shield Circular Contour with Glowing Gradients -->
  <circle cx="100" cy="100" r="94" stroke="url(#cyberBlue)" stroke-width="2.5" fill="url(#shieldBg)" />
  <circle cx="100" cy="100" r="88" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="8 4" opacity="0.8" />
  <circle cx="100" cy="100" r="84" stroke="#334155" stroke-width="0.75" />
  
  <!-- GIS Mapping / Geo-Spatial Elevation Contour Lines -->
  <g opacity="0.25">
    <!-- Concentric contour mapping circles -->
    <circle cx="100" cy="100" r="68" stroke="#38bdf8" stroke-width="0.75" />
    <circle cx="100" cy="100" r="50" stroke="#38bdf8" stroke-width="0.75" />
    <circle cx="100" cy="100" r="32" stroke="#38bdf8" stroke-width="0.75" />
    
    <!-- GIS Latitude & Longitude Geodetic lines -->
    <path d="M 100 16 A 84 84 0 0 0 100 184" stroke="#0ea5e9" stroke-width="0.75" />
    <path d="M 16 100 A 84 84 0 0 0 184 100" stroke="#0ea5e9" stroke-width="0.75" />
    <path d="M 100 16 A 84 84 0 0 1 100 184" stroke="#0ea5e9" stroke-width="0.75" />
    <path d="M 16 100 A 84 84 0 0 1 184 100" stroke="#0ea5e9" stroke-width="0.75" />
  </g>
  
  <!-- Urban Infrastructure Connectivity / Graph Nodes Network -->
  <g opacity="0.65">
    <!-- Structural Node connection vectors -->
    <line x1="58" y1="110" x2="100" y2="68" stroke="#38bdf8" stroke-width="1.2" />
    <line x1="100" y1="68" x2="142" y2="110" stroke="#38bdf8" stroke-width="1.2" />
    <line x1="142" y1="110" x2="118" y2="148" stroke="#38bdf8" stroke-width="1.2" />
    <line x1="118" y1="148" x2="82" y2="148" stroke="#38bdf8" stroke-width="1.2" />
    <line x1="82" y1="148" x2="58" y2="110" stroke="#38bdf8" stroke-width="1.2" />
    
    <!-- Central node spoke connectors -->
    <line x1="100" y1="68" x2="100" y2="128" stroke="url(#coralRose)" stroke-width="1" />
    <line x1="58" y1="110" x2="100" y2="128" stroke="url(#coralRose)" stroke-width="1" />
    <line x1="142" y1="110" x2="100" y2="128" stroke="url(#coralRose)" stroke-width="1" />
    <line x1="82" y1="148" x2="100" y2="128" stroke="url(#coralRose)" stroke-width="1" />
    <line x1="118" y1="148" x2="100" y2="128" stroke="url(#coralRose)" stroke-width="1" />
  </g>
  
  <!-- Central Architectural Planning Crest (Beautiful Geometric Blueprint facets) -->
  <g transform="translate(100, 100) scale(0.95)">
    <!-- Main blueprint quad shield -->
    <path d="M-26,8 L0,-18 L26,8 L0,34 Z" fill="#020617" fill-opacity="0.9" stroke="url(#coralRose)" stroke-width="2.5" filter="url(#neonGlow)" />
    
    <!-- Prismatic reflection facets representing spatial dimensions -->
    <path d="M-26,8 L0,8 L0,34 L-26,8 Z" fill="url(#cyberBlue)" fill-opacity="0.45" />
    <path d="M26,8 L0,8 L0,34 L26,8 Z" fill="url(#coralRose)" fill-opacity="0.35" />
    
    <!-- Spatial Compass points (N, S, E, W vectors of Regional Planning) -->
    <polygon points="0,-48 4,-16 -4,-16" fill="url(#cyberBlue)" />
    <polygon points="0,48 4,16 -4,16" fill="url(#cyberBlue)" />
    <polygon points="48,0 16,4 16,-4" fill="url(#cyberBlue)" />
    <polygon points="-48,0 -16,4 -16,-4" fill="url(#cyberBlue)" />
    
    <!-- Batch '25' golden typography in core facet -->
    <text x="0" y="16" font-family="'Space Grotesk', 'Inter', sans-serif" font-size="19" font-weight="900" fill="#fbbf24" text-anchor="middle" filter="url(#neonGlow)" letter-spacing="-0.5">25</text>
  </g>
  
  <!-- Cybernetic Spatial Glowing Active Nodes -->
  <circle cx="100" cy="68" r="4.5" fill="#38bdf8" filter="url(#neonGlow)" />
  <circle cx="58" cy="110" r="4" fill="#60a5fa" />
  <circle cx="142" cy="110" r="4" fill="#60a5fa" />
  <circle cx="82" cy="148" r="3.5" fill="url(#coralRose)" filter="url(#neonGlow)" />
  <circle cx="118" cy="148" r="3.5" fill="url(#coralRose)" filter="url(#neonGlow)" />
  <circle cx="100" cy="128" r="5" fill="#f59e0b" filter="url(#neonGlow)" />
  
  <!-- Curved Typography surrounding the shield -->
  <!-- Upper text path -->
  <path id="textPathUpper" d="M 22,100 A 78,78 0 0,1 178,100" fill="none" />
  <!-- Lower text path -->
  <path id="textPathLower" d="M 178,100 A 78,78 0 0,1 22,100" fill="none" />
  
  <!-- Academic Name (Upper Hemisphere) -->
  <text font-family="'Space Grotesk', 'Inter', sans-serif" font-size="10.5" font-weight="900" fill="#93c5fd" letter-spacing="1.6" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))">
    <textPath href="#textPathUpper" startOffset="50%" text-anchor="middle">
      RAJSHAHI UNIVERSITY OF ENG. &amp; TECH.
    </textPath>
  </text>
  
  <!-- Department Name (Lower Hemisphere) -->
  <text font-family="'Space Grotesk', 'Inter', sans-serif" font-size="10.5" font-weight="900" fill="#ffffff" letter-spacing="2.2" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))">
    <textPath href="#textPathLower" startOffset="50%" text-anchor="middle">
      • DEPT. OF URP • 25 BATCH •
    </textPath>
  </text>
</svg>
`;

export const ruetLogo = "data:image/svg+xml;utf8," + encodeURIComponent(svgContent);
export default ruetLogo;
