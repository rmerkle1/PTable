import { useState } from 'react';
import { colorLayers } from './data/colorLayers';
import TableLayout from './layouts/TableLayout';
import LongFormLayout from './layouts/LongFormLayout';
import BenfeyLayout from './layouts/BenfeyLayout';
import AdomahLayout from './layouts/AdomahLayout';
import ZigguratLayout from './layouts/ZigguratLayout';
import ElementPanel from './components/ElementPanel';
import './App.css';

const MODES = [
  { id: 'standard',  label: 'Standard' },
  { id: 'longform',  label: 'Long Form' },
  { id: 'benfey',    label: 'Benfey Spiral' },
  { id: 'adomah',    label: 'Left-Step' },
  { id: 'ziggurat',  label: 'Ziggurat' },
];

function GradientLegend({ layer }) {
  const stops = 12;
  return (
    <div className="flex flex-col gap-1 min-w-[180px]">
      <div className="flex h-3 rounded overflow-hidden">
        {Array.from({ length: stops }, (_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: layer.getLegendColor(i / (stops - 1)) }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-white/40 font-mono">
        <span>{layer.min?.toFixed(1)}</span>
        <span className="text-white/25">{layer.unit}</span>
        <span>{layer.max?.toFixed(1)}</span>
      </div>
    </div>
  );
}

function CategoryLegend({ items }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {items.map(({ key, label, color }) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-white/50">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [mode, setMode]              = useState('standard');
  const [layerId, setLayerId]        = useState('category');
  const [selectedElement, setSelected] = useState(null);

  const layer = colorLayers.find(l => l.id === layerId) ?? colorLayers[0];

  function handleSelect(el) {
    setSelected(prev => prev?.number === el.number ? null : el);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 py-2.5 border-b border-white/10 bg-gray-900/80 backdrop-blur flex-wrap shrink-0">
        <h1 className="text-base font-bold tracking-widest text-white/80 uppercase">PTable</h1>

        {/* Mode selector */}
        <div className="flex gap-0.5 bg-white/5 rounded p-0.5">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer
                ${mode === m.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/40 hover:text-white/70'}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Layer selector */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-white/30">Color by</span>
          <select
            value={layerId}
            onChange={e => setLayerId(e.target.value)}
            className="bg-gray-800 border border-white/10 text-white text-xs rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-white/30"
          >
            {colorLayers.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Legend bar */}
      <div className="px-5 py-2 border-b border-white/5 bg-gray-900/30 flex items-center gap-4 flex-wrap shrink-0">
        <span className="text-[11px] text-white/25 whitespace-nowrap">{layer.description}</span>
        <div className="flex-1 min-w-0">
          {layer.type === 'gradient'
            ? <GradientLegend layer={layer} />
            : <CategoryLegend items={layer.legendItems} />}
        </div>
        {selectedElement && (
          <div className="text-xs text-white/60">
            <span className="font-bold text-white">{selectedElement.symbol}</span>
            {' — '}{selectedElement.name}
          </div>
        )}
      </div>

      {/* Main content */}
      <main
        className="flex-1 flex items-center justify-center p-4 overflow-auto transition-[padding] duration-300"
        style={selectedElement ? { paddingRight: '300px' } : {}}
      >
        {mode === 'benfey' ? (
          <div className="w-full" style={{ height: 'calc(100vh - 112px)' }}>
            <BenfeyLayout
              colorLayer={layer}
              selectedElement={selectedElement}
              onSelect={handleSelect}
            />
          </div>
        ) : mode === 'longform' ? (
          <div className="overflow-x-auto w-full flex justify-center">
            <LongFormLayout
              colorLayer={layer}
              selectedElement={selectedElement}
              onSelect={handleSelect}
            />
          </div>
        ) : mode === 'adomah' ? (
          <div className="overflow-x-auto w-full flex justify-center">
            <AdomahLayout
              colorLayer={layer}
              selectedElement={selectedElement}
              onSelect={handleSelect}
            />
          </div>
        ) : mode === 'ziggurat' ? (
          <ZigguratLayout
            colorLayer={layer}
            selectedElement={selectedElement}
            onSelect={handleSelect}
          />
        ) : (
          <TableLayout
            colorLayer={layer}
            selectedElement={selectedElement}
            onSelect={handleSelect}
          />
        )}
      </main>

      {/* Element detail panel */}
      <ElementPanel element={selectedElement} onClose={() => setSelected(null)} />
    </div>
  );
}
