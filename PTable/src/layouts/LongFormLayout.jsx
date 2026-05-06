import { elements } from '../data/elements';
import ElementCell from '../components/ElementCell';

// Long-form 32-column table — f-block inline
// Column mapping:
//   group 1 → col 1, group 2 → col 2
//   f-block (lanthanides/actinides): col = (number - seriesStart) + 3  → cols 3..17
//   groups 3–18 (d/p block) → col = group + 14                        → cols 17..32

function getLongFormCol(el) {
  if (el.group === null) {
    const start = el.category === 'lanthanide' ? 57 : 89;
    return el.number - start + 3;
  }
  if (el.group <= 2) return el.group;
  return el.group + 14;
}

export default function LongFormLayout({ colorLayer, selectedElement, onSelect }) {
  const getColor = el => colorLayer.getColor(el);

  // Build grid[period][longCol] → element
  const grid = {};
  for (const el of elements) {
    const row = el.period;
    const col = getLongFormCol(el);
    if (!grid[row]) grid[row] = {};
    grid[row][col] = el;
  }

  const COLS = 32;

  return (
    <div className="flex flex-col items-start gap-0.5 select-none overflow-x-auto">
      {[1, 2, 3, 4, 5, 6, 7].map(row => (
        <div key={row} className="flex gap-0.5">
          {Array.from({ length: COLS }, (_, i) => i + 1).map(col => {
            const el = grid[row]?.[col];
            if (!el) return <div key={col} className="w-9 h-9" />;
            return (
              <ElementCell
                key={el.number}
                element={el}
                color={getColor(el)}
                isSelected={selectedElement?.number === el.number}
                onSelect={onSelect}
                size="sm"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
