import { useRef, useState, useEffect, useCallback } from 'react';
import { elements } from '../data/elements';

// Maps element to polar coords, then to SVG x/y.
// Each period forms a ring; column position sets the angle.
// Lanthanides (tableRow 8) and actinides (tableRow 9) use
// a half-step radius so they nestle between the main-block rings.

const CELL_R = 16;         // half-size of each element square
const BASE_R = 90;         // inner radius for period 1
const RING_GAP = 52;       // radial gap between periods

function elementToXY(el, cx, cy) {
  // f-block rows 8/9 sit between periods 6/7 and 7/8 visually
  const radiusRow = el.tableRow <= 7 ? el.tableRow : el.tableRow - 0.5;
  const r = BASE_R + (radiusRow - 1) * RING_GAP;

  // Angle: column 1 = top, going clockwise, full 360° over 18 columns
  const angle = ((el.tableCol - 1) / 18) * 2 * Math.PI - Math.PI / 2;

  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

export default function SpiralLayout({ colorLayer, selectedElement, onSelect }) {
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

  // Group elements by tableRow for ring paths
  const ringRows = [1, 2, 3, 4, 5, 6, 7];

  function ringPath(row) {
    const r = BASE_R + (row - 1) * RING_GAP;
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`;
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg width={dims.w} height={dims.h} className="overflow-visible">
        {/* Ring guides */}
        {ringRows.map(row => (
          <circle
            key={row}
            cx={cx} cy={cy}
            r={BASE_R + (row - 1) * RING_GAP}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Group radial lines (18 lines) */}
        {Array.from({ length: 18 }, (_, i) => {
          const angle = (i / 18) * 2 * Math.PI - Math.PI / 2;
          const innerR = BASE_R - RING_GAP * 0.4;
          const outerR = BASE_R + 8 * RING_GAP + 10;
          return (
            <line
              key={i}
              x1={cx + innerR * Math.cos(angle)}
              y1={cy + innerR * Math.sin(angle)}
              x2={cx + outerR * Math.cos(angle)}
              y2={cy + outerR * Math.sin(angle)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          );
        })}

        {/* Group labels (1–18) around the outermost ring */}
        {Array.from({ length: 18 }, (_, i) => {
          const col = i + 1;
          const angle = (i / 18) * 2 * Math.PI - Math.PI / 2;
          const labelR = BASE_R + 8 * RING_GAP + 26;
          return (
            <text
              key={col}
              x={cx + labelR * Math.cos(angle)}
              y={cy + labelR * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="rgba(255,255,255,0.3)"
              fontFamily="monospace"
            >
              {col}
            </text>
          );
        })}

        {/* Period labels */}
        {[1, 2, 3, 4, 5, 6, 7].map(row => {
          const r = BASE_R + (row - 1) * RING_GAP;
          return (
            <text
              key={row}
              x={cx}
              y={cy - r + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fill="rgba(255,255,255,0.25)"
              fontFamily="monospace"
            >
              {row}
            </text>
          );
        })}

        {/* Elements */}
        {elements.map(el => {
          const { x, y } = elementToXY(el, cx, cy);
          const color = colorLayer.getColor(el);
          const isSelected = selectedElement?.number === el.number;
          const half = CELL_R;

          return (
            <g
              key={el.number}
              transform={`translate(${x},${y})`}
              onClick={() => onSelect(el)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={-half} y={-half}
                width={half * 2} height={half * 2}
                rx={3}
                fill={color}
                opacity={color === '#2a2a3a' ? 0.4 : 1}
                stroke={isSelected ? 'white' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isSelected ? 2 : 0.5}
              />
              <text
                x={0} y={-3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                fill="rgba(255,255,255,0.55)"
                fontFamily="monospace"
                style={{ pointerEvents: 'none' }}
              >
                {el.number}
              </text>
              <text
                x={0} y={5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight="bold"
                fill="white"
                fontFamily="sans-serif"
                style={{ pointerEvents: 'none' }}
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
