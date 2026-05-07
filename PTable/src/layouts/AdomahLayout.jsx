import { elements } from '../data/elements';
import ElementCell from '../components/ElementCell';

// Adomah periodic table (Valery Tsimmerman, 2006)
// 32-column grid organized by orbital block:
//   cols 1–14  : f-block (lanthanides / actinides)
//   cols 15–24 : d-block (transition metals, with Lu/Lr in group-3 position)
//   cols 25–30 : p-block
//   cols 31–32 : s-block
// He is placed in col 32 (group-2 / s-block), not with noble gases.
// Rows = periods 1–7.

function getCol(el) {
  const z = el.number;

  // He → s-block group 2
  if (z === 2) return 32;

  // s-block
  if (el.group === 1) return 31;
  if (el.group === 2) return 32;

  // p-block (groups 13–18)
  if (el.group >= 13 && el.group <= 18) return el.group + 12; // 25–30

  // d-block (groups 3–12)
  if (el.group >= 3 && el.group <= 12) return el.group + 12;  // 15–24

  // f-block: lanthanides La(57)–Yb(70) → cols 1–14
  if (z >= 57 && z <= 70) return z - 56;

  // Lu(71) → group-3 d-block position (col 15)
  if (z === 71) return 15;

  // f-block: actinides Ac(89)–No(102) → cols 1–14
  if (z >= 89 && z <= 102) return z - 88;

  // Lr(103) → group-3 d-block position (col 15)
  if (z === 103) return 15;

  return null;
}

const COLS = 32;
const ROWS = 7;

export default function AdomahLayout({ colorLayer, selectedElement, onSelect }) {
  // Build grid[row][col] → element  (1-indexed)
  const grid = {};
  for (const el of elements) {
    const col = getCol(el);
    if (col == null) continue;
    const row = el.period;
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
            const isLast  = band && col === band.cols[1];
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
                  ) : (
                    <div className="w-9 h-9" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Period labels on left */}
        <div className="flex flex-col absolute left-0 top-0 hidden" />
      </div>
    </div>
  );
}
