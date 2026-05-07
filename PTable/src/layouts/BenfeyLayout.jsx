import { useRef, useState, useEffect } from 'react';
import { elements } from '../data/elements';

// Benfey Spiral periodic table (Theodor Benfey, 1960)
// The s+p blocks form a continuous Archimedean spiral.
// d-block elements branch radially inward between periods.
// f-block elements branch further inward behind the d-block.

const CELL = 13;
const PAD  = 2;
const S    = CELL + PAD;   // step between element centers
const R0   = 50;           // starting radius (for H)
const G    = 8 * S;        // radius growth per full revolution (8 elements = 1 turn)

// Each position index n on the main spiral:
//   theta(n) = -PI/2 + n * PI/4   (8 positions per revolution)
//   r(n)     = R0 + G * n / 8
function spiralPt(n, cx, cy) {
  const theta = -Math.PI / 2 + n * (Math.PI / 4);
  const r = R0 + G * n / 8;
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

// Unit vectors at angle n_mid on the spiral
function vecs(n_mid) {
  const theta = -Math.PI / 2 + n_mid * (Math.PI / 4);
  return {
    inX:  -Math.cos(theta),  inY:  -Math.sin(theta),  // radially inward
    tanX:  Math.sin(theta),  tanY: -Math.cos(theta),   // tangential (ccw)
  };
}

// Main spiral: atomic number → position index n (s+p block elements only)
const SPIRAL_N = {
  1:0, 2:1,                                              // Period 1
  3:2, 4:3, 5:4, 6:5, 7:6, 8:7, 9:8, 10:9,             // Period 2
  11:10, 12:11, 13:12, 14:13, 15:14, 16:15, 17:16, 18:17, // Period 3
  19:18, 20:19,                                          // Period 4 s-block
  31:20, 32:21, 33:22, 34:23, 35:24, 36:25,             // Period 4 p-block
  37:26, 38:27,                                          // Period 5 s-block
  49:28, 50:29, 51:30, 52:31, 53:32, 54:33,             // Period 5 p-block
  55:34, 56:35,                                          // Period 6 s-block
  81:36, 82:37, 83:38, 84:39, 85:40, 86:41,             // Period 6 p-block
  87:42, 88:43,                                          // Period 7 s-block
  113:44, 114:45, 115:46, 116:47, 117:48, 118:49,       // Period 7 p-block
};

// d-branch: 2 rows × 5 cols, extending inward from branch midpoint
// Row 0 = outermost (closest to spiral), cols go tangentially
function dBranch(elNums, n_mid, cx, cy) {
  const { x: bx, y: by } = spiralPt(n_mid, cx, cy);
  const { inX, inY, tanX, tanY } = vecs(n_mid);
  return elNums.map((z, i) => {
    const row = Math.floor(i / 5), col = i % 5, c = col - 2;
    return { z, x: bx + (row+1)*S*inX + c*S*tanX, y: by + (row+1)*S*inY + c*S*tanY };
  });
}

// f-branch: 2 rows × 7 cols, extending further inward (behind d-branch)
function fBranch(elNums, n_mid, cx, cy) {
  const { x: bx, y: by } = spiralPt(n_mid, cx, cy);
  const { inX, inY, tanX, tanY } = vecs(n_mid);
  return elNums.map((z, i) => {
    const row = Math.floor(i / 7), col = i % 7, c = col - 3;
    return { z, x: bx + (row+3)*S*inX + c*S*tanX, y: by + (row+3)*S*inY + c*S*tanY };
  });
}

function buildPositions(cx, cy) {
  const pos = {};

  // Main spiral
  for (const [z, n] of Object.entries(SPIRAL_N)) {
    const { x, y } = spiralPt(+n, cx, cy);
    pos[+z] = { x, y };
  }

  // Period 4 d-branch: Sc(21)–Zn(30), between Ca(n=19) and Ga(n=20)
  for (const { z, x, y } of dBranch([21,22,23,24,25,26,27,28,29,30], 19.5, cx, cy))
    pos[z] = { x, y };

  // Period 5 d-branch: Y(39)–Cd(48), between Sr(n=27) and In(n=28)
  for (const { z, x, y } of dBranch([39,40,41,42,43,44,45,46,47,48], 27.5, cx, cy))
    pos[z] = { x, y };

  // Period 6: branch between Ba(n=35) and Tl(n=36)
  // d-branch (Lu–Hg): rows 1–2
  for (const { z, x, y } of dBranch([71,72,73,74,75,76,77,78,79,80], 35.5, cx, cy))
    pos[z] = { x, y };
  // f-branch (La–Yb): rows 3–4
  for (const { z, x, y } of fBranch([57,58,59,60,61,62,63,64,65,66,67,68,69,70], 35.5, cx, cy))
    pos[z] = { x, y };

  // Period 7: branch between Ra(n=43) and Nh(n=44)
  // d-branch (Lr–Cn): rows 1–2
  for (const { z, x, y } of dBranch([103,104,105,106,107,108,109,110,111,112], 43.5, cx, cy))
    pos[z] = { x, y };
  // f-branch (Ac–No): rows 3–4
  for (const { z, x, y } of fBranch([89,90,91,92,93,94,95,96,97,98,99,100,101,102], 43.5, cx, cy))
    pos[z] = { x, y };

  return pos;
}

// Build the spiral guide path through main-spiral positions
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
  const pos = buildPositions(cx, cy);

  // Compute bounding box to set viewBox
  const xs = Object.values(pos).map(p => p.x);
  const ys = Object.values(pos).map(p => p.y);
  const minX = Math.min(...xs) - S;
  const minY = Math.min(...ys) - S;
  const maxX = Math.max(...xs) + S;
  const maxY = Math.max(...ys) + S;
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
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />

        {/* Elements */}
        {elements.map(el => {
          const p = pos[el.number];
          if (!p) return null;
          const color = colorLayer.getColor(el);
          const isSel = selectedElement?.number === el.number;
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
                rx={2}
                fill={color}
                stroke={isSel ? 'white' : 'rgba(255,255,255,0.12)'}
                strokeWidth={isSel ? 1.5 : 0.5}
              />
              <text
                x={0} y={-1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={5} fill="rgba(255,255,255,0.5)"
                fontFamily="monospace" style={{ pointerEvents: 'none' }}
              >
                {el.number}
              </text>
              <text
                x={0} y={4}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={7} fontWeight="bold" fill="white"
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
