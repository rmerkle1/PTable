import { useRef, useState, useEffect } from 'react';
import { elements } from '../data/elements';

// Benfey Spiral periodic table (Theodor Benfey, 1960) — extended
//
// Main spiral: s+p block as a continuous arc-edged ribbon (RW = G → turns touch).
// Each branch type extends radially inward from the spiral, rotated to follow
// the branch angle, as a gapless rectangular grid:
//   d-block (transition metals): rows 1–2, 5 cols, 10 elements/period
//   f-block (lanthanides/actinides): rows 3–4, 7 cols, 14 elements/period
//   g-block (superactinides, predicted): rows 5–6, 9 cols — shown as placeholders

const G    = 40;   // radial growth per full revolution
const RW   = G;    // ribbon width = G → adjacent spiral turns touch exactly
const R0   = 56;   // starting radius at n=0 (must be > G/2 = 20)
const S    = G;    // branch cell step = ribbon height for visual consistency

// ── Spiral geometry ──────────────────────────────────────────────────────────

function spiralPt(n, cx, cy) {
  const theta = -Math.PI / 2 + n * (Math.PI / 4);
  const r = R0 + G * n / 8;
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

// Curved-trapezoid cell path for spiral element at position n.
// Sides: straight radial lines. Edges: SVG circular arcs.
// Adjacent cells share side endpoints exactly → gapless spiral ribbon.
function cellPath(n, cx, cy) {
  const step   = Math.PI / 4;
  const thetaS = -Math.PI / 2 + (n - 0.5) * step;
  const thetaE = -Math.PI / 2 + (n + 0.5) * step;
  const rS     = R0 + G * (n - 0.5) / 8;
  const rE     = R0 + G * (n + 0.5) / 8;
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

  const rOut = f(R0 + G * n / 8 + half);
  const rIn  = f(Math.max(1, R0 + G * n / 8 - half));

  return `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`;
}

// Radial inward + tangential unit vectors at spiral angle for index n_mid
function vecs(n_mid) {
  const theta = -Math.PI / 2 + n_mid * (Math.PI / 4);
  return {
    theta,
    inX:  -Math.cos(theta), inY:  -Math.sin(theta),
    tanX:  Math.sin(theta), tanY: -Math.cos(theta),
  };
}

// Rotation angle (degrees) so a rect's local-y axis aligns with the inward direction.
// Derivation: after SVG rotate(α), local y = (-sinα, cosα).
// Set equal to (inX, inY) = (-cosθ, -sinθ) → α = π/2 + θ.
function branchRotDeg(theta) {
  return (Math.PI / 2 + theta) * (180 / Math.PI);
}

// ── Branch position builders ──────────────────────────────────────────────────

// rowOffset: which "tier" the branch occupies (d=1, f=3, g=5 for the first row)
function buildBranchGrid(elNums, cols, rowOffset, n_mid, cx, cy) {
  const { x: bx, y: by, theta, inX, inY, tanX, tanY } = { ...vecs(n_mid), ...spiralPt(n_mid, cx, cy) };
  const rotDeg = branchRotDeg(theta);
  return elNums.map((z, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const c   = col - (cols - 1) / 2;  // center the columns on the branch axis
    const x   = bx + (row + rowOffset) * S * inX + c * S * tanX;
    const y   = by + (row + rowOffset) * S * inY + c * S * tanY;
    return { z, x, y, rotDeg };
  });
}

// ── Element data ──────────────────────────────────────────────────────────────

// s+p block: atomic number → spiral index n
const SPIRAL_N = {
  1: 0,  2: 1,
  3: 2,  4: 3,  5: 4,  6: 5,  7: 6,  8: 7,  9: 8,  10: 9,
  11:10, 12:11, 13:12, 14:13, 15:14, 16:15, 17:16, 18:17,
  19:18, 20:19,
  31:20, 32:21, 33:22, 34:23, 35:24, 36:25,
  37:26, 38:27,
  49:28, 50:29, 51:30, 52:31, 53:32, 54:33,
  55:34, 56:35,
  81:36, 82:37, 83:38, 84:39, 85:40, 86:41,
  87:42, 88:43,
  113:44, 114:45, 115:46, 116:47, 117:48, 118:49,
};

// Branch definitions — real elements
const D_BRANCHES = [
  { els: [21,22,23,24,25,26,27,28,29,30],          n_mid: 19.5 }, // Period 4
  { els: [39,40,41,42,43,44,45,46,47,48],          n_mid: 27.5 }, // Period 5
  { els: [71,72,73,74,75,76,77,78,79,80],          n_mid: 35.5 }, // Period 6
  { els: [103,104,105,106,107,108,109,110,111,112], n_mid: 43.5 }, // Period 7
];
const F_BRANCHES = [
  { els: [57,58,59,60,61,62,63,64,65,66,67,68,69,70],          n_mid: 35.5 }, // Period 6
  { els: [89,90,91,92,93,94,95,96,97,98,99,100,101,102],        n_mid: 43.5 }, // Period 7
];

// G-block placeholder: 18 predicted superactinide positions at period 7 branch.
// Shown as empty outline cells (chemically these belong to period 8,
// but placed here to illustrate the three-tier branching structure).
// Elements 121–138 are the predicted superactinides.
const G_BRANCH_N_MID = 43.5;
const G_PLACEHOLDER_COUNT = 18; // 2 rows × 9 cols

function buildAllBranchPositions(cx, cy) {
  const pos = {}; // z → { x, y, rotDeg }

  for (const b of D_BRANCHES)
    for (const p of buildBranchGrid(b.els, 5, 1, b.n_mid, cx, cy))
      pos[p.z] = p;

  for (const b of F_BRANCHES)
    for (const p of buildBranchGrid(b.els, 7, 3, b.n_mid, cx, cy))
      pos[p.z] = p;

  return pos;
}

// G-branch placeholder cells (no real element, just position + rotDeg)
function buildGPlaceholders(cx, cy) {
  const fakeNums = Array.from({ length: G_PLACEHOLDER_COUNT }, (_, i) => 121 + i);
  return buildBranchGrid(fakeNums, 9, 5, G_BRANCH_N_MID, cx, cy);
}

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
  const branchPos    = buildAllBranchPositions(cx, cy);
  const gPlaceholders = buildGPlaceholders(cx, cy);

  // Bounding box from all centers (spiral + branches + g-placeholders)
  const spiralCenters = Object.values(SPIRAL_N).map(n => spiralPt(n, cx, cy));
  const branchCenters = Object.values(branchPos);
  const gCenters      = gPlaceholders;
  const allPts = [...spiralCenters, ...branchCenters, ...gCenters];
  const xs  = allPts.map(p => p.x);
  const ys  = allPts.map(p => p.y);
  const pad = S * 3;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  const vbW  = maxX - minX;
  const vbH  = maxY - minY;

  const half = S / 2;

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto flex items-center justify-center">
      <svg
        width={Math.max(vbW, dims.w)}
        height={Math.max(vbH, dims.h)}
        viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── G-block placeholders (behind everything) ── */}
        {gPlaceholders.map(({ z, x, y, rotDeg }, i) => (
          <g key={`g-${i}`} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${rotDeg.toFixed(2)})`}>
            <rect
              x={-half} y={-half} width={S} height={S}
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={0.5}
              strokeDasharray="3 2"
            />
            <text x={0} y={0}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={8} fill="rgba(255,255,255,0.2)"
              fontFamily="monospace" style={{ pointerEvents: 'none' }}>
              {z}
            </text>
          </g>
        ))}

        {/* ── Real elements ── */}
        {elements.map(el => {
          const color = colorLayer.getColor(el);
          const isSel = selectedElement?.number === el.number;
          const n     = SPIRAL_N[el.number];

          // ── Main spiral cell (curved trapezoid) ──
          if (n !== undefined) {
            const { x, y } = spiralPt(n, cx, cy);
            return (
              <g key={el.number} onClick={() => onSelect(el)} style={{ cursor: 'pointer' }}>
                <path
                  d={cellPath(n, cx, cy)}
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
          }

          // ── Branch cell (rotated square, connected grid) ──
          const p = branchPos[el.number];
          if (!p) return null;
          return (
            <g key={el.number}
              transform={`translate(${p.x.toFixed(2)},${p.y.toFixed(2)}) rotate(${p.rotDeg.toFixed(2)})`}
              onClick={() => onSelect(el)} style={{ cursor: 'pointer' }}>
              <rect
                x={-half} y={-half} width={S} height={S}
                fill={color}
                stroke={isSel ? 'white' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isSel ? 1.5 : 0.5}
              />
              <text x={0} y={-7}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill="rgba(255,255,255,0.6)"
                fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                {el.number}
              </text>
              <text x={0} y={7}
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
