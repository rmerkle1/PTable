import { useRef, useState, useEffect } from 'react';
import { elements } from '../data/elements';

// Benfey Spiral — redesigned position system
//
// Every cell (spiral or branch) is a curved trapezoid at angular position n
// and radial offset k (0 = main spiral, 1–2 = d-block, 3–4 = f-block, 5–6 = g-block).
//
// Adjacent cells share exact edge points → gapless continuous ribbon.
//
// The spiral has "gap" positions at each branch:
//   Period 4/5: 5-col gap  (d only)
//   Period 6:   7-col gap  (d + f)
//   Period 7:   9-col gap  (d + f + g placeholder)
//
// At each gap position n, k=0 is an empty "spine" cell (outer ribbon wall),
// and k=1..6 are the branch elements below it. Ca and Sc share a corner at the
// boundary between n=19(k=0) and n=20(k=1) — that's what makes the path continuous.

const G  = 40;   // radial growth per full revolution (8 angular steps)
const RW = G;    // ribbon width = G → adjacent turns touch
const R0 = 56;   // starting radius at n=0
const S  = G;    // cell height = ribbon height

// ── Geometry ──────────────────────────────────────────────────────────────────

function cellPath(n, k, cx, cy) {
  const step   = Math.PI / 4;
  const thetaS = -Math.PI / 2 + (n - 0.5) * step;
  const thetaE = -Math.PI / 2 + (n + 0.5) * step;
  const rS     = R0 + G * (n - 0.5) / 8 - k * S;
  const rE     = R0 + G * (n + 0.5) / 8 - k * S;
  const half   = RW / 2;
  const f      = v => v.toFixed(2);

  const x1 = f(cx + (rS - half) * Math.cos(thetaS));
  const y1 = f(cy + (rS - half) * Math.sin(thetaS));
  const x2 = f(cx + (rS + half) * Math.cos(thetaS));
  const y2 = f(cy + (rS + half) * Math.sin(thetaS));
  const x3 = f(cx + (rE + half) * Math.cos(thetaE));
  const y3 = f(cy + (rE + half) * Math.sin(thetaE));
  const x4 = f(cx + (rE - half) * Math.cos(thetaE));
  const y4 = f(cy + (rE - half) * Math.sin(thetaE));

  const rMid = R0 + G * n / 8 - k * S;
  const rOut = f(Math.max(0.5, rMid + half));
  const rIn  = f(Math.max(0.5, rMid - half));

  return `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`;
}

function cellCenter(n, k, cx, cy) {
  const theta = -Math.PI / 2 + n * (Math.PI / 4);
  const r     = R0 + G * n / 8 - k * S;
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

// ── Position map: z → { n, k } ────────────────────────────────────────────────
//
// Angular layout (n values):
//   0–1   : H, He
//   2–9   : Li–Ne
//   10–17 : Na–Ar
//   18–19 : K, Ca      gap 20–24 (d4)   25–30 : Ga–Kr
//   31–32 : Rb, Sr     gap 33–37 (d5)   38–43 : In–Xe
//   44–45 : Cs, Ba     gap 46–52 (d6+f6)  53–58 : Tl–Rn
//   59–60 : Fr, Ra     gap 61–69 (d7+f7+g)  70–75 : Nh–Og

const POSITIONS = (() => {
  const m = {};
  const s = (z, n, k) => { m[z] = { n, k }; };

  // Period 1
  s(1, 0, 0); s(2, 1, 0);

  // Period 2
  for (let i = 0; i < 8; i++) s(3 + i, 2 + i, 0);

  // Period 3
  for (let i = 0; i < 8; i++) s(11 + i, 10 + i, 0);

  // Period 4
  s(19, 18, 0); s(20, 19, 0);                          // K, Ca
  const d4 = [21,22,23,24,25, 26,27,28,29,30];
  for (let c = 0; c < 5; c++) { s(d4[c], 20+c, 1); s(d4[c+5], 20+c, 2); }
  for (let i = 0; i < 6; i++) s(31+i, 25+i, 0);       // Ga–Kr

  // Period 5
  s(37, 31, 0); s(38, 32, 0);                          // Rb, Sr
  const d5 = [39,40,41,42,43, 44,45,46,47,48];
  for (let c = 0; c < 5; c++) { s(d5[c], 33+c, 1); s(d5[c+5], 33+c, 2); }
  for (let i = 0; i < 6; i++) s(49+i, 38+i, 0);       // In–Xe

  // Period 6
  s(55, 44, 0); s(56, 45, 0);                          // Cs, Ba
  // f-block La–Yb (14 el, 7 cols): positions 46–52
  const f6 = [57,58,59,60,61,62,63, 64,65,66,67,68,69,70];
  for (let c = 0; c < 7; c++) { s(f6[c], 46+c, 3); s(f6[c+7], 46+c, 4); }
  // d-block Lu–Hg (10 el, 5 cols): centered in gap → positions 47–51
  const d6 = [71,72,73,74,75, 76,77,78,79,80];
  for (let c = 0; c < 5; c++) { s(d6[c], 47+c, 1); s(d6[c+5], 47+c, 2); }
  for (let i = 0; i < 6; i++) s(81+i, 53+i, 0);       // Tl–Rn

  // Period 7
  s(87, 59, 0); s(88, 60, 0);                          // Fr, Ra
  // f-block Ac–No (14 el, 7 cols): positions 62–68 (centered in 9-col gap)
  const f7 = [89,90,91,92,93,94,95, 96,97,98,99,100,101,102];
  for (let c = 0; c < 7; c++) { s(f7[c], 62+c, 3); s(f7[c+7], 62+c, 4); }
  // d-block Lr–Cn (10 el, 5 cols): centered → positions 63–67
  const d7 = [103,104,105,106,107, 108,109,110,111,112];
  for (let c = 0; c < 5; c++) { s(d7[c], 63+c, 1); s(d7[c+5], 63+c, 2); }
  for (let i = 0; i < 6; i++) s(113+i, 70+i, 0);      // Nh–Og

  return m;
})();

// Gap positions (no s/p element; outer spine needed to bridge the ribbon)
const GAP_NS = [
  ...Array.from({length: 5}, (_, i) => 20+i),   // Period 4 d-gap
  ...Array.from({length: 5}, (_, i) => 33+i),   // Period 5 d-gap
  ...Array.from({length: 7}, (_, i) => 46+i),   // Period 6 d+f-gap
  ...Array.from({length: 9}, (_, i) => 61+i),   // Period 7 d+f+g-gap
];

// G-block placeholders: predicted superactinides (elements 121–138)
// Shown at the 9-col Period-7 branch (k=5,6), illustrating three-tier structure.
// Chemically these belong to period 8, but placed here to show the branching concept.
const G_CELLS = Array.from({length: 18}, (_, i) => ({
  n: 61 + (i % 9),
  k: 5 + Math.floor(i / 9),
  label: 121 + i,
}));

// ── Component ─────────────────────────────────────────────────────────────────

export default function BenfeyLayout({ colorLayer, selectedElement, onSelect }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 900 });

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;

  // Bounding box
  const allPts = [
    ...Object.values(POSITIONS).map(({ n, k }) => cellCenter(n, k, cx, cy)),
    ...GAP_NS.map(n => cellCenter(n, 0, cx, cy)),
    ...G_CELLS.map(({ n, k }) => cellCenter(n, k, cx, cy)),
  ];
  const xs   = allPts.map(p => p.x);
  const ys   = allPts.map(p => p.y);
  const pad  = S * 2;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  const vbW  = maxX - minX;
  const vbH  = maxY - minY;

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto flex items-center justify-center">
      <svg
        width={Math.max(vbW, dims.w)}
        height={Math.max(vbH, dims.h)}
        viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 1. G-block placeholders (deepest, drawn first) */}
        {G_CELLS.map(({ n, k, label }) => {
          const { x, y } = cellCenter(n, k, cx, cy);
          return (
            <g key={`g-${n}-${k}`}>
              <path
                d={cellPath(n, k, cx, cy)}
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={0.5}
                strokeDasharray="3 2"
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fill="rgba(255,255,255,0.25)"
                fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                {label}
              </text>
            </g>
          );
        })}

        {/* 2. Outer spine cells over gaps (bridge the ribbon between spiral segments) */}
        {GAP_NS.map(n => (
          <path
            key={`spine-${n}`}
            d={cellPath(n, 0, cx, cy)}
            fill="rgb(10,14,20)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={0.5}
          />
        ))}

        {/* 3. Real elements */}
        {elements.map(el => {
          const pos = POSITIONS[el.number];
          if (!pos) return null;
          const { n, k } = pos;
          const color    = colorLayer.getColor(el);
          const isSel    = selectedElement?.number === el.number;
          const { x, y } = cellCenter(n, k, cx, cy);
          return (
            <g key={el.number} onClick={() => onSelect(el)} style={{ cursor: 'pointer' }}>
              <path
                d={cellPath(n, k, cx, cy)}
                fill={color}
                stroke={isSel ? 'white' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isSel ? 1.5 : 0.5}
              />
              <text x={x} y={y - 7}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill="rgba(255,255,255,0.6)"
                fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                {el.number}
              </text>
              <text x={x} y={y + 7}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontWeight="bold" fill="white"
                fontFamily="sans-serif" style={{ pointerEvents: 'none' }}>
                {el.symbol}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
