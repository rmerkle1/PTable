import { elements } from '../data/elements';
import ElementCell from '../components/ElementCell';

// Left-Step (Janet) periodic table
// 32-column grid organized by orbital block:
//   cols 1–14  : f-block (lanthanides / actinides)
//   cols 15–24 : d-block (transition metals, with Lu/Lr in group-3 position)
//   cols 25–30 : p-block
//   cols 31–32 : s-block
// He is placed in col 32 (s-block), not with noble gases.
//
// Key distinction from standard layout: the s-block is raised one row relative
// to all other blocks. Row = el.period for s-block; row = el.period + 1 for p/d/f.
// This produces 8 rows total, with rows 1–2 being s-block only (H/He, then Li/Be),
// and a placeholder row 8 for predicted elements 119 and 120 below Fr and Ra.

function getCol(el) {
  const z = el.number;

  if (z === 2) return 32;                              // He → s-block col 2

  if (el.group === 1) return 31;
  if (el.group === 2) return 32;

  if (el.group >= 13 && el.group <= 18) return el.group + 12; // 25–30

  if (el.group >= 3  && el.group <= 12) return el.group + 12; // 15–24

  if (z >= 57 && z <= 70) return z - 56;   // La–Yb → f-block cols 1–14
  if (z === 71)            return 15;       // Lu → d-block col 15

  if (z >= 89 && z <= 102) return z - 88;  // Ac–No → f-block cols 1–14
  if (z === 103)            return 15;      // Lr → d-block col 15

  return null;
}

function getRow(el) {
  // s-block elements sit in their own period row; all other blocks shift down 1.
  // This creates two s-only rows at the top (H/He in row 1, Li/Be in row 2).
  const isS = el.group === 1 || el.group === 2 || el.number === 2;
  return isS ? el.period : el.period + 1;
}

const COLS = 32;
const ROWS = 8;

// Placeholder cells for predicted elements 119 (Uue) and 120 (Ubn)
const PLACEHOLDERS = [
  { col: 31, row: 8, label: '119' },
  { col: 32, row: 8, label: '120' },
];

export default function AdomahLayout({ colorLayer, selectedElement, onSelect }) {
  // Build grid[row][col] → element  (1-indexed)
  const grid = {};
  for (const el of elements) {
    const col = getCol(el);
    if (col == null) continue;
    const row = getRow(el);
    if (!grid[row]) grid[row] = {};
    grid[row][col] = el;
  }

  // Block label bands (column ranges, 1-indexed)
  const bands = [
    { cols: [1, 14],  label: 'f', color: 'rgba(116,138,197,0.15)' },
    { cols: [15, 24], label: 'd', color: 'rgba(0,173,219,0.12)' },
    { cols: [25, 30], label: 'p', color: 'rgba(133,196,65,0.12)' },
    { cols: [31, 32], label: 's', color: 'rgba(253,183,20,0.15)' },
  ];

  return (
    <div className="select-none overflow-x-auto">
      <div className="inline-block">
        {/* Block labels */}
        <div className="flex mb-1">
          {Array.from({ length: COLS }, (_, i) => i + 1).map(col => {
            const band = bands.find(b => col >= b.cols[0] && col <= b.cols[1]);
            const isFirst = band && col === band.cols[0];
            return (
              <div
                key={col}
                className="w-9 h-4 flex items-center justify-center text-[9px] text-white/30 font-mono"
                style={{ backgroundColor: band?.color }}
              >
                {isFirst ? band.label : ''}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        {Array.from({ length: ROWS }, (_, ri) => ri + 1).map(row => (
          <div key={row} className="flex gap-0 mb-0.5">
            {Array.from({ length: COLS }, (_, ci) => ci + 1).map(col => {
              const el = grid[row]?.[col];
              const band = bands.find(b => col >= b.cols[0] && col <= b.cols[1]);
              const placeholder = PLACEHOLDERS.find(p => p.row === row && p.col === col);
              return (
                <div key={col} style={{ backgroundColor: el ? 'transparent' : band?.color }}>
                  {el ? (
                    <ElementCell
                      element={el}
                      color={colorLayer.getColor(el)}
                      isSelected={selectedElement?.number === el.number}
                      onSelect={onSelect}
                      size="sm"
                    />
                  ) : placeholder ? (
                    <div className="w-9 h-9 flex flex-col items-center justify-center border border-white/10 rounded"
                         style={{ backgroundColor: band?.color }}>
                      <span className="text-[8px] text-white/30 font-mono leading-none">{placeholder.label}</span>
                    </div>
                  ) : (
                    <div className="w-9 h-9" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
