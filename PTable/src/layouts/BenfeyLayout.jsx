import { useRef, useState, useEffect } from 'react';
import { elements } from '../data/elements';

// Benfey Spiral periodic table (Theodor Benfey, 1960)
//
// Key geometry: adjacent spiral turns touch when RW = G.
// Each cell is a curved trapezoid with arc edges (not a square),
// so the ribbon is continuous and cells share exact edges.

const G    = 40;   // radial growth per full revolution (8 positions)
const RW   = G;    // ribbon width = G  →  adjacent turns just touch
const R0   = 56;   // starting radius at n=0 (must be > G/2)
const S    = G;    // branch element spacing, matches ribbon height
const CELL = S - 2; // branch cell size (1px visual gap each side)

// Center of element at spiral index n
function spiralPt(n, cx, cy) {
  const theta = -Math.PI / 2 + n * (Math.PI / 4);
  const r = R0 + G * n / 8;
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

// Curved-trapezoid path for spiral element at position n.
// Sides are straight radial lines; inner/outer edges are circular arcs.
// Adjacent cells share their side endpoints exactly → gapless ribbon.
function cellPath(n, cx, cy) {
  const step   = Math.PI / 4;
  const thetaS = -Math.PI / 2 + (n - 0.5) * step;
  const thetaE = -Math.PI / 2 + (n + 0.5) * step;
  const rS     = R0 + G * (n - 0.5) / 8;  // spiral radius at start edge
  const rE     = R0 + G * (n + 0.5) / 8;  // spiral radius at end edge
  const half   = RW / 2;

  const f = v => v.toFixed(2);

  // Four corners
  const x1 = f(cx + (rS - half) * Math.cos(thetaS));
  const y1 = f(cy + (rS - half) * Math.sin(thetaS));
  const x2 = f(cx + (rS + half) * Math.cos(thetaS));
  const y2 = f(cy + (rS + half) * Math.sin(thetaS));
  const x3 = f(cx + (rE + half) * Math.cos(thetaE));
  const y3 = f(cy + (rE + half) * Math.sin(thetaE));
  const x4 = f(cx + (rE - half) * Math.cos(thetaE));
  const y4 = f(cy + (rE - half) * Math.sin(thetaE));

  // Arc radii at mid-angle of this cell
  const rOut = f(R0 + G * n / 8 + half);
  const rIn  = f(R0 + G * n / 8 - half);

  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${rOut} ${rOut} 0 0 1 ${x3} ${y3}`,  // outer arc — clockwise
    `L ${x4} ${y4}`,
    `A ${rIn} ${rIn} 0 0 0 ${x1} ${y1}`,    // inner arc — counter-clockwise
    'Z',
  ].join(' ');
}

function vecs(n_mid) {
  const theta = -Math.PI / 2 + n_mid * (Math.PI / 4);
  return {
    inX: -Math.cos(theta), inY: -Math.sin(theta),
    tanX: Math.sin(theta),  tanY: -Math.cos(theta),
  };
}

function dBranchPositions(elNums, n_mid, cx, cy) {
  const { x: bx, y: by } = spiralPt(n_mid, cx, cy);
  const { inX, inY, tanX, tanY } = vecs(n_mid);
  return elNums.map((z, i) => {
    const row = Math.floor(i / 5), col = i % 5, c = col - 2;
    return { z, x: bx + (row + 1) * S * inX + c * S * tanX,
                  y: by + (row + 1) * S * inY + c * S * tanY };
  });
}

function fBranchPositions(elNums, n_mid, cx, cy) {
  const { x: bx, y: by } = spiralPt(n_mid, cx, cy);
  const { inX, inY, tanX, tanY } = vecs(n_mid);
  return elNums.map((z, i) => {
    const row = Math.floor(i / 7), col = i % 7, c = col - 3;
    return { z, x: bx + (row + 3) * S * inX + c * S * tanX,
                  y: by + (row + 3) * S * inY + c * S * tanY };
  });
}

// s+p block elements → spiral index n (0-indexed)
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

function buildBranchPositions(cx, cy) {
  const pos = {};
  for (const { z, x, y } of dBranchPositions([21,22,23,24,25,26,27,28,29,30], 19.5, cx, cy))
    pos[z] = { x, y };
  for (const { z, x, y } of dBranchPositions([39,40,41,42,43,44,45,46,47,48], 27.5, cx, cy))
    pos[z] = { x, y };
  for (const { z, x, y } of dBranchPositions([71,72,73,74,75,76,77,78,79,80], 35.5, cx, cy))
    pos[z] = { x, y };
  for (const { z, x, y } of dBranchPositions([103,104,105,106,107,108,109,110,111,112], 43.5, cx, cy))
    pos[z] = { x, y };
  for (const { z, x, y } of fBranchPositions([57,58,59,60,61,62,63,64,65,66,67,68,69,70], 35.5, cx, cy))
    pos[z] = { x, y };
  for (const { z, x, y } of fBranchPositions([89,90,91,92,93,94,95,96,97,98,99,100,101,102], 43.5, cx, cy))
    pos[z] = { x, y };
  return pos;
}

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
  const branchPos = buildBranchPositions(cx, cy);

  // Bounding box
  const centers = elements.flatMap(el => {
    const n = SPIRAL_N[el.number];
    if (n !== undefined) { const p = spiralPt(n, cx, cy); return [[p.x, p.y]]; }
    const p = branchPos[el.number];
    return p ? [[p.x, p.y]] : [];
  });
  const xs  = centers.map(p => p[0]);
  const ys  = centers.map(p => p[1]);
  const pad = RW * 2;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  const vbW  = maxX - minX;
  const vbH  = maxY - minY;
  const half = CELL / 2;

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto flex items-center justify-center">
      <svg
        width={Math.max(vbW, dims.w)}
        height={Math.max(vbH, dims.h)}
        viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {elements.map(el => {
          const color = colorLayer.getColor(el);
          const isSel = selectedElement?.number === el.number;
          const n     = SPIRAL_N[el.number];

          if (n !== undefined) {
            // Main spiral — curved trapezoid
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

          // Branch element — square cell
          const p = branchPos[el.number];
          if (!p) return null;
          return (
            <g key={el.number}
              transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}
              onClick={() => onSelect(el)} style={{ cursor: 'pointer' }}>
              <rect x={-half} y={-half} width={CELL} height={CELL} rx={2}
                fill={color}
                stroke={isSel ? 'white' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isSel ? 1.5 : 0.5} />
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
