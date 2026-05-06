import { CATEGORY_COLORS, CATEGORY_LABELS, colorLayerById } from '../data/colorLayers';

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

const lickLayer = colorLayerById['lick'];

export default function ElementPanel({ element, onClose }) {
  if (!element) return null;

  const catColor = CATEGORY_COLORS[element.category] ?? '#4f5b6f';
  const catLabel = CATEGORY_LABELS[element.category] ?? element.category;

  const lickRating      = lickLayer.getRating(element);
  const lickLabel       = lickLayer.getRatingLabel(element);
  const lickDescription = lickLayer.getRatingDescription(element);
  const lickColor       = lickLayer.getColor(element);

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-gray-900 border-l border-white/10 shadow-2xl flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="p-5 flex items-start justify-between" style={{ borderBottom: `3px solid ${catColor}` }}>
        <div>
          <div className="text-white/40 text-xs font-mono mb-1">#{element.number}</div>
          <div className="text-5xl font-bold text-white leading-none mb-1">{element.symbol}</div>
          <div className="text-white text-lg font-medium">{element.name}</div>
          <div className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium"
               style={{ backgroundColor: catColor, color: 'rgba(0,0,0,0.75)' }}>
            {catLabel}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white text-xl leading-none mt-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Can I lick it? */}
      <div className="mx-4 mt-4 rounded-lg p-3 border"
           style={{ borderColor: `${lickColor}55`, backgroundColor: `${lickColor}18` }}>
        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Can I lick it?</div>
        <div className="text-base font-bold" style={{ color: lickColor }}>{lickLabel}</div>
        <div className="text-xs text-white/50 mt-1 leading-snug">{lickDescription}</div>
      </div>

      {/* Properties */}
      <div className="p-4 flex flex-col gap-2">
        {PROPS.map(({ key, label, fmt }) => {
          const val = element[key];
          return (
            <div key={key} className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="text-white/40 text-xs">{label}</span>
              <span className="text-white/90 text-sm font-mono">
                {val !== null && val !== undefined ? fmt(val) : '—'}
              </span>
            </div>
          );
        })}

        <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
          <span className="text-white/40 text-xs">Group / Period</span>
          <span className="text-white/90 text-sm font-mono">
            {element.group ?? '—'} / {element.period}
          </span>
        </div>
      </div>
    </div>
  );
}
