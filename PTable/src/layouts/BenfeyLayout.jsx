import { useRef, useState, useEffect } from 'react';
import { elements } from '../data/elements';

// Benfey Spiral periodic table (Theodor Benfey, 1960)
// Main spiral: s+p elements form a continuous Archimedean spiral band.
// Each element is a trapezoid (quadrilateral) that follows the spiral curvature,
// so adjacent cells share exact edges — the ribbon is continuous.
// d-block branches inward as rectangular grids; f-block further inward.

const S    = 15;   // center-to-center step between elements
const R0   = 50;   // spiral radius at n=0 (H)
const G    = 8 * S; // radial growth per full revolution (8 positions per turn)
const RW   = S;    // ribbon width (radial depth of each cell)
const CELL = 13;   // size of branch (d/f) cell squares

// Position on main spiral at index n (centers)
function spiralPt(n, cx, cy) {
  const theta = -Math.PI / 2 + n * (Math.PI / 4);
  const r = R0 + G * n / 8;
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

// Quadrilateral path for spiral element at position n.
// Each cell is bounded by two radial lines (at angular edges ±π/8 from center)
// and two straight chords approximating the inner/outer spiral edges.
// Adjacent cells share their radial-line corners exactly → perfect tiling.
function cellPath(n, cx, cy) {
  const step = Math.PI / 4;
  const thetaS = -Math.PI / 2 + (n - 0.5) * step;
  const thetaE = -Math.PI / 2 + (n + 0.5) * step;
  // Radius of spiral at each angular edge
  const rS   = R0 + G * (n - 0.5) / 8;
  const rE   = R0 + G * (n + 0.5) / 8;
  const half = RW / 2;

  const x1 = (cx + (rS - half) * Math.cos(thetaS)).toFixed(2);
  const y1 = (cy + (rS - half) * Math.sin(thetaS)).toFixed(2);
  const x2 = (cx + (rS + half) * Math.cos(thetaS)).toFixed(2);
  const y2 = (cy + (rS + half) * Math.sin(thetaS)).toFixed(2);
  const x3 = (cx + (rE + half) * Math.cos(thetaE)).toFixed(2);
  const y3 = (cy + (rE + half) * Math.sin(thetaE)).toFixed(2);
  const x4 = (cx + (rE - half) * Math.cos(thetaE)).toFixed(2);
  const y4 = (cy + (rE - half) * Math.sin(thetaE)).toFixed(2);

  return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;
}

// Radial inward + tangential unit vectors at angle n_mid
function vecs(n_mid) {
  const theta = -Math.PI / 2 + n_mid * (Math.PI / 4);
  return {
    inX: -Math.cos(theta), inY: -Math.sin(theta),
    tanX: Math.sin(theta),  tanY: -Math.cos(theta),
  };
}

// d-branch: 2 rows × 5 cols, extending radially inward from branch midpoint
function dBranchPositions(elNums, n_mid, cx, cy) {
  const { x: bx, y: by } = spiralPt(n_mid, cx, cy);
  const { inX, inY, tanX, tanY } = vecs(n_mid);
  return elNums.map((z, i) => {
    const row = Math.floor(i / 5), col = i % 5, c = col - 2;
    return { z, x: bx + (row + 1) * S * inX + c * S * tanX,
                  y: by + (row + 1) * S * inY + c * S * tanY };
  });
}

// f-branch: 2 rows × 7 cols, extending further inward (behind d-branch)
function fBranchPositions(elNums, n_mid, cx, cy) {
  const { x: bx, y: by } = spiralPt(n_mid, cx, cy);
  const { inX, inY, tanX, tanY } = vecs(n_mid);
  return elNums.map((z, i) => {
    const row = Math.floor(i / 7), col = i % 7, c = col - 3;
    return { z, x: bx + (row + 3) * S * inX + c * S * tanX,
                  y: by + (row + 3) * S * inY + c * S * tanY };
  });
}

// Atomic number → spiral index n (s+p block elements only)
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

// Build spiral guide path
function spiralPath(cx, cy) {
  const pts = Array.from({ length: 400 }, (_, i) => spiralPt(i / 8, cx, cy));
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
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

  // Bounding box: collect all element centers
  const centers = elements.flatMap(el => {
    const n = SPIRAL_N[el.number];
    if (n !== undefined) {
      const p = spiralPt(n, cx, cy);
      return [[p.x, p.y]];
    }
    const p = branchPos[el.number];
    return p ? [[p.x, p.y]] : [];
  });
  const xs = centers.map(p => p[0]);
  const ys = centers.map(p => p[1]);
  const pad = S * 4;
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
        {/* Spiral guide */}
        <path
          d={spiralPath(cx, cy)}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />

        {elements.map(el => {
          const color  = colorLayer.getColor(el);
          const isSel  = selectedElement?.number === el.number;
          const n      = SPIRAL_N[el.number];

          if (n !== undefined) {
            // Main spiral: trapezoid cell
            const { x, y } = spiralPt(n, cx, cy);
            return (
              <g key={el.number} onClick={() => onSelect(el)} style={{ cursor: 'pointer' }}>
                <path
                  d={cellPath(n, cx, cy)}
                  fill={color}
                  stroke={isSel ? 'white' : 'rgba(255,255,255,0.18)'}
                  strokeWidth={isSel ? 1.2 : 0.5}
                />
                <text
                  x={x} y={y - 2}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={4} fill="rgba(255,255,255,0.55)"
                  fontFamily="monospace" style={{ pointerEvents: 'none' }}
                >
                  {el.number}
                </text>
                <text
                  x={x} y={y + 3}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={6} fontWeight="bold" fill="white"
                  fontFamily="sans-serif" style={{ pointerEvents: 'none' }}
                >
                  {el.symbol}
                </text>
              </g>
            );
          }

          // Branch element: square cell
          const p = branchPos[el.number];
          if (!p) return null;
          return (
            <g
              key={el.number}
              transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}
              onClick={() => onSelect(el)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={-half} y={-half}
                width={CELL} height={CELL}
                rx={1}
                fill={color}
                stroke={isSel ? 'white' : 'rgba(255,255,255,0.18)'}
                strokeWidth={isSel ? 1.2 : 0.5}
              />
              <text
                x={0} y={-2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={4} fill="rgba(255,255,255,0.55)"
                fontFamily="monospace" style={{ pointerEvents: 'none' }}
              >
                {el.number}
              </text>
              <text
                x={0} y={3}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={6} fontWeight="bold" fill="white"
                fontFamily="sans-serif" style={{ pointerEvents: 'none' }}
              >
                {el.symbol}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
