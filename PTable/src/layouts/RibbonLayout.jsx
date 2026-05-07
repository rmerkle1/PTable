import { elements } from '../data/elements';
import ElementCell from '../components/ElementCell';

// Janet Left-Step (Curled Ribbon) periodic table (Charles Janet, 1929)
// 32-column grid; each period occupies only its rightmost columns,
// creating a staircase left edge — the defining "step" character.
//   cols 1–14  : f-block (periods 6–7 only)
//   cols 15–24 : d-block (periods 4–7)
//   cols 25–30 : p-block (periods 2–7)
//   cols 31–32 : s-block (all periods)
// He is placed in col 32 (s-block, group 2) — the key distinction
// from the standard table and the reason H/He are separated.

function getCol(el) {
  const z = el.number;
  if (z === 2)  return 32; // He → s-block
  if (el.group === 1) return 31;
  if (el.group === 2) return 32;
  if (el.group >= 13 && el.group <= 18) return el.group + 12; // 25–30
  if (el.group >= 3  && el.group <= 12) return el.group + 12; // 15–24
  if (z >= 57 && z <= 70) return z - 56;   // La–Yb → cols 1–14
  if (z === 71) return 15;                  // Lu → d-block col 15
  if (z >= 89 && z <= 102) return z - 88;  // Ac–No → cols 1–14
  if (z === 103) return 15;                 // Lr → d-block col 15
  return null;
}

// First occupied column per period (the "step")
const PERIOD_START_COL = [31, 25, 25, 15, 15, 1, 1];

export default function RibbonLayout({ colorLayer, selectedElement, onSelect }) {
  const grid = {};
  for (const el of elements) {
    const col = getCol(el);
    if (col == null) continue;
    const row = el.period;
    if (!grid[row]) grid[row] = {};
    grid[row][col] = el;
  }

  return (
    <div className="select-none overflow-x-auto">
      <div className="inline-block">
        {Array.from({ length: 7 }, (_, ri) => ri + 1).map(period => {
          const startCol = PERIOD_START_COL[period - 1];
          const cols = Array.from({ length: 32 - startCol + 1 }, (_, i) => startCol + i);
          return (
            <div key={period} className="flex items-center gap-0 mb-0.5">
              {/* Left indent matching step position */}
              {startCol > 1 && (
                <div style={{ width: (startCol - 1) * 38 }} />
              )}

              {/* Period label */}
              <div className="w-6 flex items-center justify-end pr-1 shrink-0">
                <span className="text-[9px] text-white/20 font-mono">{period}</span>
              </div>

              {cols.map(col => {
                const el = grid[period]?.[col];
                return (
                  <div key={col}>
                    {el ? (
                      <ElementCell
                        element={el}
                        color={colorLayer.getColor(el)}
                        isSelected={selectedElement?.number === el.number}
                        onSelect={onSelect}
                        size="sm"
                      />
                    ) : (
                      <div className="w-9 h-9 border border-white/5 rounded" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Column block labels at bottom */}
        <div className="flex mt-2">
          <div className="w-6" />
          {[
            { label: 'f-block', cols: 14, color: 'rgba(116,138,197,0.3)' },
            { label: 'd-block', cols: 10, color: 'rgba(0,173,219,0.3)' },
            { label: 'p-block', cols: 6,  color: 'rgba(133,196,65,0.3)' },
            { label: 's-block', cols: 2,  color: 'rgba(253,183,20,0.3)' },
          ].map(b => (
            <div
              key={b.label}
              className="flex items-center justify-center text-[9px] text-white/40 font-mono h-4 rounded"
              style={{ width: b.cols * 38, backgroundColor: b.color }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
