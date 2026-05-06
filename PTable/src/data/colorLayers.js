import { elements } from './elements';

// Interpolate between color stops at t in [0,1]
function interpolateColor(stops, t) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, r0, g0, b0] = stops[i];
    const [t1, r1, g1, b1] = stops[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const u = (clamped - t0) / (t1 - t0);
      const r = Math.round(r0 + u * (r1 - r0));
      const g = Math.round(g0 + u * (g1 - g0));
      const b = Math.round(b0 + u * (b1 - b0));
      return `rgb(${r},${g},${b})`;
    }
  }
  const last = stops[stops.length - 1];
  return `rgb(${last[1]},${last[2]},${last[3]})`;
}

// Viridis-like
const VIRIDIS = [
  [0.00,  68,   1, 84],
  [0.25,  59,  82, 139],
  [0.50,  33, 145, 140],
  [0.75,  94, 201,  98],
  [1.00, 253, 231,  37],
];

// Plasma-like
const PLASMA = [
  [0.00,  13,   8, 135],
  [0.25, 126,   3, 168],
  [0.50, 204,  71, 120],
  [0.75, 248, 149,  64],
  [1.00, 240, 249,  33],
];

// Heat map (blue → cyan → yellow → red)
const HEAT = [
  [0.00,   0,   0, 180],
  [0.33,   0, 210, 210],
  [0.66, 220, 220,   0],
  [1.00, 220,   0,   0],
];

// Cool (dark → blue → white)
const COOL = [
  [0.00,   5,   5,  30],
  [0.50,  30,  80, 200],
  [1.00, 200, 230, 255],
];

function makeGradientLayer({ id, label, property, unit, scale, description, format }) {
  const values = elements.map(e => e[property]).filter(v => v !== null && v !== undefined && isFinite(v));
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    id,
    label,
    description,
    type: 'gradient',
    property,
    unit,
    min,
    max,
    format: format || (v => v?.toFixed(2) ?? '—'),
    getColor(element) {
      const val = element[property];
      if (val === null || val === undefined || !isFinite(val)) return '#2a2a3a';
      return interpolateColor(scale, (val - min) / (max - min));
    },
    getLegendColor(t) {
      return interpolateColor(scale, t);
    },
  };
}

export const CATEGORY_COLORS = {
  'alkali-metal':          '#e85d4a',
  'alkaline-earth':        '#f4a340',
  'transition-metal':      '#4a90d9',
  'post-transition-metal': '#5bbfb5',
  'metalloid':             '#7ec880',
  'reactive-nonmetal':     '#b5d96e',
  'halogen':               '#e8d44d',
  'noble-gas':             '#a97de8',
  'lanthanide':            '#e87db5',
  'actinide':              '#e87090',
  'unknown':               '#606070',
};

export const CATEGORY_LABELS = {
  'alkali-metal':          'Alkali Metal',
  'alkaline-earth':        'Alkaline Earth',
  'transition-metal':      'Transition Metal',
  'post-transition-metal': 'Post-Transition Metal',
  'metalloid':             'Metalloid',
  'reactive-nonmetal':     'Reactive Nonmetal',
  'halogen':               'Halogen',
  'noble-gas':             'Noble Gas',
  'lanthanide':            'Lanthanide',
  'actinide':              'Actinide',
  'unknown':               'Unknown',
};

const categoryLayer = {
  id: 'category',
  label: 'Category',
  description: 'Element type / block',
  type: 'category',
  getColor(element) {
    return CATEGORY_COLORS[element.category] ?? '#606070';
  },
};

export const colorLayers = [
  categoryLayer,
  makeGradientLayer({
    id: 'electronegativity',
    label: 'Electronegativity',
    description: 'Pauling scale',
    property: 'electronegativity',
    unit: '',
    scale: PLASMA,
    format: v => v?.toFixed(2) ?? '—',
  }),
  makeGradientLayer({
    id: 'atomicMass',
    label: 'Atomic Mass',
    description: 'Standard atomic weight (u)',
    property: 'atomicMass',
    unit: 'u',
    scale: VIRIDIS,
    format: v => v?.toFixed(3) ?? '—',
  }),
  makeGradientLayer({
    id: 'meltingPoint',
    label: 'Melting Point',
    description: 'Melting point in Kelvin',
    property: 'meltingPoint',
    unit: 'K',
    scale: HEAT,
    format: v => v != null ? `${v.toFixed(0)} K` : '—',
  }),
  makeGradientLayer({
    id: 'boilingPoint',
    label: 'Boiling Point',
    description: 'Boiling point in Kelvin',
    property: 'boilingPoint',
    unit: 'K',
    scale: HEAT,
    format: v => v != null ? `${v.toFixed(0)} K` : '—',
  }),
  makeGradientLayer({
    id: 'density',
    label: 'Density',
    description: 'Density at STP (g/cm³)',
    property: 'density',
    unit: 'g/cm³',
    scale: COOL,
    format: v => v != null ? `${v.toFixed(4)} g/cm³` : '—',
  }),
  makeGradientLayer({
    id: 'ionizationEnergy',
    label: 'Ionization Energy',
    description: 'First ionization energy (eV)',
    property: 'ionizationEnergy',
    unit: 'eV',
    scale: PLASMA,
    format: v => v != null ? `${v.toFixed(3)} eV` : '—',
  }),
  makeGradientLayer({
    id: 'atomicRadius',
    label: 'Atomic Radius',
    description: 'Atomic radius (pm)',
    property: 'atomicRadius',
    unit: 'pm',
    scale: VIRIDIS,
    format: v => v != null ? `${v} pm` : '—',
  }),
  makeGradientLayer({
    id: 'electronAffinity',
    label: 'Electron Affinity',
    description: 'Electron affinity (eV)',
    property: 'electronAffinity',
    unit: 'eV',
    scale: PLASMA,
    format: v => v != null ? `${v.toFixed(3)} eV` : '—',
  }),
];

export const colorLayerById = Object.fromEntries(colorLayers.map(l => [l.id, l]));
