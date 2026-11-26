// Hand-drawn animated SVG motifs, one per project. No images, all motion in CSS.
const scenes = {
  studio: `
    <svg viewBox="0 0 400 360" class="scene scene--studio" aria-hidden="true">
      <defs>
        <linearGradient id="gStudio" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d92626" stop-opacity=".85"/>
          <stop offset="1" stop-color="#c9b99b" stop-opacity=".2"/>
        </linearGradient>
      </defs>
      <g class="sc-frames">
        <rect x="58" y="52" width="196" height="148" rx="10" fill="none" stroke="url(#gStudio)" stroke-width="1.4"/>
        <rect x="96" y="94" width="212" height="162" rx="12" fill="#111115" fill-opacity=".6" stroke="#d92626" stroke-opacity=".5" stroke-width="1.4"/>
        <rect x="132" y="140" width="212" height="162" rx="12" fill="#0a0a0c" fill-opacity=".88" stroke="#d92626" stroke-opacity=".8" stroke-width="1.4"/>
      </g>
      <g class="sc-grid">
        ${Array.from({ length: 24 }, (_, i) => {
          const c = i % 6;
          const r = Math.floor(i / 6);
          return `<circle cx="${158 + c * 32}" cy="${168 + r * 32}" r="2.1" fill="#d92626" fill-opacity="${0.18 + ((i * 7) % 10) * 0.05}"/>`;
        }).join('')}
      </g>
      <circle class="sc-lens" cx="268" cy="208" r="34" fill="none" stroke="#c9b99b" stroke-width="1.2" stroke-dasharray="4 6"/>
      <line class="sc-lens" x1="294" y1="234" x2="326" y2="266" stroke="#c9b99b" stroke-width="1.2"/>
    </svg>`,

  voice: `
    <svg viewBox="0 0 400 360" class="scene scene--voice" aria-hidden="true">
      <g class="sc-wave">
        ${Array.from({ length: 26 }, (_, i) => {
          const h = 18 + ((i * 37) % 11) * 13;
          return `<rect x="${44 + i * 12}" y="${196 - h / 2}" width="5" height="${h}" rx="2.5" fill="#d92626" fill-opacity="${0.35 + (i % 4) * 0.16}"/>`;
        }).join('')}
      </g>
      <g class="sc-bubbles">
        <rect x="54" y="60" width="180" height="58" rx="18" fill="#111115" stroke="#d92626" stroke-opacity=".45"/>
        <path d="M84 118l-6 26 30-26z" fill="#111115" stroke="#d92626" stroke-opacity=".45"/>
        <text x="76" y="96" class="sc-text">Telugu</text>
        <rect x="168" y="150" width="182" height="58" rx="18" fill="#c9b99b" fill-opacity=".12" stroke="#c9b99b" stroke-opacity=".6"/>
        <path d="M318 208l8 26-32-26z" fill="#c9b99b" fill-opacity=".12" stroke="#c9b99b" stroke-opacity=".6"/>
        <text x="190" y="186" class="sc-text sc-text--alt">English</text>
      </g>
    </svg>`,

  globe: `
    <svg viewBox="0 0 400 360" class="scene scene--globe" aria-hidden="true">
      <g class="sc-globe">
        <circle cx="200" cy="184" r="96" fill="none" stroke="#d92626" stroke-opacity=".5" stroke-width="1.3"/>
        <ellipse cx="200" cy="184" rx="96" ry="34" fill="none" stroke="#d92626" stroke-opacity=".28"/>
        <ellipse cx="200" cy="184" rx="34" ry="96" fill="none" stroke="#d92626" stroke-opacity=".28"/>
        <ellipse cx="200" cy="184" rx="68" ry="96" fill="none" stroke="#d92626" stroke-opacity=".18"/>
      </g>
      <g class="sc-pins">
        <circle cx="238" cy="146" r="4.5" fill="#c9b99b"/>
        <circle cx="176" cy="214" r="3.5" fill="#d92626"/>
        <circle cx="226" cy="228" r="3" fill="#d92626"/>
      </g>
      <path class="sc-arc" d="M150 120 Q200 60 258 132" fill="none" stroke="#c9b99b" stroke-width="1.3" stroke-dasharray="3 5"/>
      <path class="sc-arc sc-arc--2" d="M168 236 Q214 292 262 240" fill="none" stroke="#d92626" stroke-width="1.3" stroke-dasharray="3 5"/>
    </svg>`,

  pipeline: `
    <svg viewBox="0 0 400 360" class="scene scene--pipeline" aria-hidden="true">
      <g class="sc-nodes">
        <rect x="44" y="58" width="96" height="40" rx="8" fill="none" stroke="#d92626" stroke-opacity=".55"/>
        <rect x="152" y="160" width="96" height="40" rx="8" fill="none" stroke="#d92626" stroke-opacity=".8"/>
        <rect x="262" y="58" width="96" height="40" rx="8" fill="none" stroke="#d92626" stroke-opacity=".55"/>
        <rect x="262" y="250" width="96" height="40" rx="8" fill="none" stroke="#c9b99b" stroke-opacity=".7"/>
        <rect x="44" y="250" width="96" height="40" rx="8" fill="none" stroke="#d92626" stroke-opacity=".55"/>
      </g>
      <g class="sc-links" fill="none" stroke="#d92626" stroke-opacity=".3" stroke-width="1.2">
        <path d="M92 98 L92 180 L152 180"/>
        <path d="M248 180 L300 180 L300 98"/>
        <path d="M248 180 L300 180 L300 250"/>
        <path d="M92 180 L92 270 L152 270"/>
      </g>
      <circle class="sc-pkt sc-pkt--1" r="4" fill="#d92626"/>
      <circle class="sc-pkt sc-pkt--2" r="3.4" fill="#c9b99b"/>
    </svg>`,

  grid: `
    <svg viewBox="0 0 400 360" class="scene scene--grid" aria-hidden="true">
      <g class="sc-dots">
        ${Array.from({ length: 49 }, (_, i) => {
          const c = i % 7;
          const r = Math.floor(i / 7);
          return `<circle class="sc-dot" style="--i:${i}" cx="${72 + c * 43}" cy="${62 + r * 43}" r="4.5"/>`;
        }).join('')}
      </g>
      <circle class="sc-ping" cx="72" cy="62" r="10" fill="none" stroke="#d92626" stroke-width="1.2"/>
    </svg>`,

  orbit: `
    <svg viewBox="0 0 400 360" class="scene scene--orbit" aria-hidden="true">
      <g class="sc-orbits">
        <ellipse cx="200" cy="180" rx="142" ry="58" fill="none" stroke="#d92626" stroke-opacity=".35"/>
        <ellipse cx="200" cy="180" rx="142" ry="58" fill="none" stroke="#d92626" stroke-opacity=".35" transform="rotate(60 200 180)"/>
        <ellipse cx="200" cy="180" rx="142" ry="58" fill="none" stroke="#d92626" stroke-opacity=".35" transform="rotate(120 200 180)"/>
        <ellipse cx="200" cy="180" rx="98" ry="98" fill="none" stroke="#c9b99b" stroke-opacity=".22"/>
      </g>
      <circle cx="200" cy="180" r="30" fill="#d92626" fill-opacity=".18" stroke="#d92626" stroke-opacity=".7"/>
      <circle class="sc-sat sc-sat--1" r="6" fill="#c9b99b"/>
      <circle class="sc-sat sc-sat--2" r="4" fill="#d92626"/>
      <circle class="sc-sat sc-sat--3" r="5" fill="#d92626"/>
    </svg>`,
};

export function scene(key) {
  return scenes[key] || scenes.orbit;
}
