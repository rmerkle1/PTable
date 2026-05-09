import { useRef, useState, useEffect } from 'react';
import { elements } from '../data/elements';

// Benfey Spiral — (n, k) grid system
//
// n = angular position on the Archimedean spiral (includes branch-gap slots)
// k = radial offset inward from the main ribbon:
//     k=0  main spiral (s/p block)
//     k=1,2  d-block (transition metals), rows outer→inner
//     k=3,4  f-block (lanthanides/actinides), rows outer→inner
//     k=5,6  g-block placeholder (superactinides)
//
// Every cell is a curved trapezoid. Adjacent cells share exact edge points,
// so the ribbon is seamlessly continuous including across branch junctions.
//
// Angular layout (n positions):
//   0–1:  H, He
//   2–9:  Li–Ne      10–17: Na–Ar
//   18–19: K, Ca     [gap 20–24 d₄]    25–30: Ga–Kr
//   31–32: Rb, Sr    [gap 33–37 d₅]    38–43: In–Xe
//   44–45: Cs, Ba    [gap 46–52 d₆f₆]  53–58: Tl–Rn
//   59–60: Fr, Ra    [gap 61–69 d₇f₇g] 70–75: Nh–Og

const G  = 40;
const RW = G;
const R0 = 56;
const S  = G;

// Branch bay gaps: the outer spiral (k=0) has no cells here; branch elements fill inside.
// For each gap, we draw an outer arc ("bay roof") from the last s-block cell to the first
// p-block cell — this makes the branch visually look like a bay/peninsula.
// kDepth = how many k-rows deep the branch goes (d=2, f+d=4, g+f+d=6)
const BRANCH_BAYS = [
  { nFrom: 20, nTo: 24, kDepth: 2 },  // Period 4: d-block
  { nFrom: 33, nTo: 37, kDepth: 2 },  // Period 5: d-block
  { nFrom: 46, nTo: 52, kDepth: 4 },  // Period 6: f+d
  { nFrom: 61, nTo: 69, kDepth: 6 },  // Period 7: f+d+g
];

// ── Geometry ──────────────────────────────────────────────────────────────────

function cellPath(n, k, cx, cy) {
  const step   = Math.PI / 4;
  const thetaS = -Math.PI / 2 + (n - 0.5) * step;
  const thetaE = -Math.PI / 2 + (n + 0.5) * step;
  const rS     = Math.max(1, R0 + G * (n - 0.5) / 8 - k * S);
  const rE     = Math.max(1, R0 + G * (n + 0.5) / 8 - k * S);
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
  const rOut = f(Math.max(1, rMid + half));
  const rIn  = f(Math.max(1, rMid - half));

  return `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`;
}

// Draws a filled "bay" shape for a branch gap.
// The outer boundary follows the spiral's outer edge (k=0 outer face) across the gap.
// The inner boundary follows the deepest branch row's inner edge (k=kDepth inner face).
// This creates a visible enclosed region that the branch cells sit inside —
// making the gap read as a peninsula/bay rather than empty space.
function bayFillPath(nFrom, nTo, kDepth, cx, cy) {
  const nStart = nFrom - 0.5;
  const nEnd   = nTo   + 0.5;
  const steps  = Math.ceil((nEnd - nStart) * 10);
  const f      = v => v.toFixed(2);

  // Outer arc: left→right at outer spiral edge
  const outer = [];
  for (let i = 0; i <= steps; i++) {
    const n     = nStart + (nEnd - nStart) * (i / steps);
    const theta = -Math.PI / 2 + n * (Math.PI / 4);
    const r     = R0 + G * n / 8 + RW / 2;
    outer.push(`${f(cx + r * Math.cos(theta))},${f(cy + r * Math.sin(theta))}`);
  }

  // Inner arc: right→left at deepest branch inner edge
  const inner = [];
  for (let i = 0; i <= steps; i++) {
    const n     = nEnd - (nEnd - nStart) * (i / steps);  // reversed direction
    const theta = -Math.PI / 2 + n * (Math.PI / 4);
    const r     = Math.max(1, R0 + G * n / 8 - kDepth * S - RW / 2);
    inner.push(`${f(cx + r * Math.cos(theta))},${f(cy + r * Math.sin(theta))}`);
  }

  return `M ${outer[0]} L ${outer.slice(1).join(' L ')} L ${inner[0]} L ${inner.slice(1).join(' L ')} Z`;
}

function cellCenter(n, k, cx, cy) {
  const theta = -Math.PI / 2 + n * (Math.PI / 4);
  const r     = Math.max(1, R0 + G * n / 8 - k * S);
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

// ── Element position map: atomic number → { n, k } ───────────────────────────

const POSITIONS = (() => {
  const m = {};
  const put = (z, n, k) => { m[z] = { n, k }; };

  // Period 1
  put(1, 0, 0); put(2, 1, 0);

  // Period 2
  for (let i = 0; i < 8; i++) put(3 + i, 2 + i, 0);

  // Period 3
  for (let i = 0; i < 8; i++) put(11 + i, 10 + i, 0);

  // Period 4: s | d-gap | p
  put(19, 18, 0); put(20, 19, 0);  // K, Ca
  const d4 = [21,22,23,24,25,26,27,28,29,30];  // Sc–Zn
  for (let c = 0; c < 5; c++) { put(d4[c], 20+c, 1); put(d4[c+5], 20+c, 2); }
  for (let i = 0; i < 6; i++) put(31+i, 25+i, 0);  // Ga–Kr

  // Period 5: s | d-gap | p
  put(37, 31, 0); put(38, 32, 0);  // Rb, Sr
  const d5 = [39,40,41,42,43,44,45,46,47,48];  // Y–Cd
  for (let c = 0; c < 5; c++) { put(d5[c], 33+c, 1); put(d5[c+5], 33+c, 2); }
  for (let i = 0; i < 6; i++) put(49+i, 38+i, 0);  // In–Xe

  // Period 6: s | d+f-gap | p
  put(55, 44, 0); put(56, 45, 0);  // Cs, Ba
  const f6 = [57,58,59,60,61,62,63,64,65,66,67,68,69,70];  // La–Yb
  for (let c = 0; c < 7; c++) { put(f6[c], 46+c, 3); put(f6[c+7], 46+c, 4); }
  const d6 = [71,72,73,74,75,76,77,78,79,80];  // Lu–Hg (centered: cols 47–51)
  for (let c = 0; c < 5; c++) { put(d6[c], 47+c, 1); put(d6[c+5], 47+c, 2); }
  for (let i = 0; i < 6; i++) put(81+i, 53+i, 0);  // Tl–Rn

  // Period 7: s | d+f+g-gap | p
  put(87, 59, 0); put(88, 60, 0);  // Fr, Ra
  const f7 = [89,90,91,92,93,94,95,96,97,98,99,100,101,102];  // Ac–No (cols 62–68)
  for (let c = 0; c < 7; c++) { put(f7[c], 62+c, 3); put(f7[c+7], 62+c, 4); }
  const d7 = [103,104,105,106,107,108,109,110,111,112];  // Lr–Cn (cols 63–67)
  for (let c = 0; c < 5; c++) { put(d7[c], 63+c, 1); put(d7[c+5], 63+c, 2); }
  for (let i = 0; i < 6; i++) put(113+i, 70+i, 0);  // Nh–Og

  return m;
})();

// G-block predicted superactinides (121–138) at the period-7 branch, k=5,6
const G_CELLS = Array.from({ length: 18 }, (_, i) => ({
  n:     61 + (i % 9),
  k:     5  + Math.floor(i / 9),
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
  const allCenters = [
    ...Object.values(POSITIONS).map(({ n, k }) => cellCenter(n, k, cx, cy)),
    ...G_CELLS.map(({ n, k }) => cellCenter(n, k, cx, cy)),
  ];
  const xs   = allCenters.map(p => p.x);
  const ys   = allCenters.map(p => p.y);
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
        {/* Branch bays: filled region behind each gap, making the branch peninsula visible */}
        {BRANCH_BAYS.map(({ nFrom, nTo, kDepth }) => (
          <path
            key={`bay-${nFrom}`}
            d={bayFillPath(nFrom, nTo, kDepth, cx, cy)}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={0.75}
          />
        ))}

        {/* G-block placeholder cells (drawn first, appear behind everything) */}
        {G_CELLS.map(({ n, k, label }) => {
          const { x, y } = cellCenter(n, k, cx, cy);
          return (
            <g key={`g-${n}-${k}`}>
              <path
                d={cellPath(n, k, cx, cy)}
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={0.5}
                strokeDasharray="3 2"
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fill="rgba(255,255,255,0.22)"
                fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                {label}
              </text>
            </g>
          );
        })}

        {/* All real elements — spiral (k=0) and branch (k=1–4) */}
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
