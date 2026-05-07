import { elements } from '../data/elements';
import ElementCell from '../components/ElementCell';

// Ziggurat (step-pyramid) layout: each period is a centered row.
// Periods 1-3 are narrow (2,8,8 elements), periods 4-5 wider (18),
// periods 6-7 widest (32). This naturally creates a pyramid shape.

export default function ZigguratLayout({ colorLayer, selectedElement, onSelect }) {
  // Group elements by period, sorted by atomic number
  const byPeriod = Array.from({ length: 7 }, () => []);
  for (const el of elements) {
    byPeriod[el.period - 1].push(el);
  }
  byPeriod.forEach(arr => arr.sort((a, b) => a.number - b.number));

  const labels = ['Period 1', 'Period 2', 'Period 3', 'Period 4',
                  'Period 5', 'Period 6', 'Period 7'];

  return (
    <div className="flex flex-col items-center gap-0.5 select-none">
      {byPeriod.map((periodEls, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <span className="w-12 text-right text-[9px] text-white/20 font-mono pr-1 shrink-0">
            {labels[i]}
          </span>
          <div className="flex gap-0.5">
            {periodEls.map(el => (
              <ElementCell
                key={el.number}
                element={el}
                color={colorLayer.getColor(el)}
                isSelected={selectedElement?.number === el.number}
                onSelect={onSelect}
                size="sm"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
