import { CATEGORY_COLORS, CATEGORY_LABELS } from '../data/colorLayers';

const PROPS = [
  { key: 'atomicMass',        label: 'Atomic Mass',        fmt: v => `${v} u` },
  { key: 'electronegativity', label: 'Electronegativity',  fmt: v => `${v} (Pauling)` },
  { key: 'meltingPoint',      label: 'Melting Point',      fmt: v => `${v} K` },
  { key: 'boilingPoint',      label: 'Boiling Point',      fmt: v => `${v} K` },
  { key: 'density',           label: 'Density',            fmt: v => `${v} g/cm³` },
  { key: 'ionizationEnergy',  label: 'Ionization Energy',  fmt: v => `${v} eV` },
  { key: 'atomicRadius',      label: 'Atomic Radius',      fmt: v => `${v} pm` },
  { key: 'electronAffinity',  label: 'Electron Affinity',  fmt: v => `${v} eV` },
];

export default function ElementPanel({ element, onClose }) {
  if (!element) return null;

  const catColor = CATEGORY_COLORS[element.category] ?? '#606070';
  const catLabel = CATEGORY_LABELS[element.category] ?? element.category;

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-gray-900 border-l border-white/10 shadow-2xl flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="p-5 flex items-start justify-between" style={{ borderBottom: `3px solid ${catColor}` }}>
        <div>
          <div className="text-white/50 text-xs font-mono mb-1">#{element.number}</div>
          <div className="text-5xl font-bold text-white leading-none mb-1">{element.symbol}</div>
          <div className="text-white text-lg font-medium">{element.name}</div>
          <div className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium text-black/80"
               style={{ backgroundColor: catColor }}>
            {catLabel}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white text-xl leading-none mt-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Properties */}
      <div className="p-4 flex flex-col gap-2">
        {PROPS.map(({ key, label, fmt }) => {
          const val = element[key];
          return (
            <div key={key} className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="text-white/50 text-xs">{label}</span>
              <span className="text-white text-sm font-mono">
                {val !== null && val !== undefined ? fmt(val) : '—'}
              </span>
            </div>
          );
        })}

        {element.group && (
          <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
            <span className="text-white/50 text-xs">Group / Period</span>
            <span className="text-white text-sm font-mono">{element.group} / {element.period}</span>
          </div>
        )}
        {!element.group && (
          <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
            <span className="text-white/50 text-xs">Period</span>
            <span className="text-white text-sm font-mono">{element.period}</span>
          </div>
        )}
      </div>
    </div>
  );
}
