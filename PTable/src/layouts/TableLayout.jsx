import { elements } from '../data/elements';
import ElementCell from '../components/ElementCell';

// Placeholder cells for lanthanide/actinide rows
function Placeholder({ label }) {
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded border border-dashed border-white/20 text-white/25 text-xs text-center leading-tight">
      {label}
    </div>
  );
}

export default function TableLayout({ colorLayer, selectedElement, onSelect }) {
  const getColor = el => colorLayer.getColor(el);

  // Build a lookup: [row][col] → element
  const grid = {};
  for (const el of elements) {
    if (!grid[el.tableRow]) grid[el.tableRow] = {};
    grid[el.tableRow][el.tableCol] = el;
  }

  function renderCell(row, col) {
    const el = grid[row]?.[col];
    if (!el) return <div key={`${row}-${col}`} className="w-12 h-12" />;
    return (
      <ElementCell
        key={el.number}
        element={el}
        color={getColor(el)}
        isSelected={selectedElement?.number === el.number}
        onSelect={onSelect}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5 select-none">
      {/* Rows 1–7: main table */}
      {[1, 2, 3, 4, 5, 6, 7].map(row => (
        <div key={row} className="flex gap-0.5">
          {Array.from({ length: 18 }, (_, i) => i + 1).map(col => {
            // In rows 6 & 7, col 3 is a lanthanide/actinide placeholder
            if ((row === 6 || row === 7) && col === 3) {
              return (
                <div key={`ph-${row}-${col}`} className="w-12 h-12 flex items-center justify-center">
                  <Placeholder label={row === 6 ? 'La–Lu' : 'Ac–Lr'} />
                </div>
              );
            }
            return <div key={`${row}-${col}`}>{renderCell(row, col)}</div>;
          })}
        </div>
      ))}

      {/* Gap row */}
      <div className="h-3" />

      {/* Row 8: lanthanides */}
      <div className="flex gap-0.5">
        {/* Offset to align cols 3–17 */}
        <div className="w-12 h-12" />
        <div className="w-12 h-12" />
        {Array.from({ length: 15 }, (_, i) => i + 3).map(col => (
          <div key={col}>{renderCell(8, col)}</div>
        ))}
      </div>

      {/* Row 9: actinides */}
      <div className="flex gap-0.5">
        <div className="w-12 h-12" />
        <div className="w-12 h-12" />
        {Array.from({ length: 15 }, (_, i) => i + 3).map(col => (
          <div key={col}>{renderCell(9, col)}</div>
        ))}
      </div>
    </div>
  );
}
