import { elements } from './elements';

// ─── Brand palette ───────────────────────────────────────────────────────────
export const PALETTE = {
  teal:   '#17b29e',  // 23, 178, 158
  purple: '#748ac5',  // 116, 138, 197
  blue:   '#00addb',  // 0, 173, 219
  yellow: '#fdb714',  // 253, 183, 20
  green:  '#85c441',  // 133, 196, 65
  pink:   '#e9177a',  // 233, 23, 122
  grey:   '#4f5b6f',  // 79, 91, 111
};

// ─── Color interpolation ─────────────────────────────────────────────────────
function interpolateColor(stops, t) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, r0, g0, b0] = stops[i];
    const [t1, r1, g1, b1] = stops[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const u = (clamped - t0) / (t1 - t0);
      return `rgb(${Math.round(r0 + u*(r1-r0))},${Math.round(g0 + u*(g1-g0))},${Math.round(b0 + u*(b1-b0))})`;
    }
  }
  const last = stops[stops.length - 1];
  return `rgb(${last[1]},${last[2]},${last[3]})`;
}

// grey → blue → teal → yellow (mass, radius)
const SCALE_COOL_WARM = [
  [0.00,  79,  91, 111],
  [0.33,   0, 173, 219],
  [0.66,  23, 178, 158],
  [1.00, 253, 183,  20],
];

// grey → purple → pink → yellow (electronegativity, ionization)
const SCALE_VIVID = [
  [0.00,  79,  91, 111],
  [0.33, 116, 138, 197],
  [0.66, 233,  23, 122],
  [1.00, 253, 183,  20],
];

// blue → teal → yellow → pink (heat: melting/boiling)
const SCALE_HEAT = [
  [0.00,   0, 173, 219],
  [0.50,  23, 178, 158],
  [0.75, 253, 183,  20],
  [1.00, 233,  23, 122],
];

// grey → purple → blue (cool: density)
const SCALE_DENSITY = [
  [0.00,  79,  91, 111],
  [0.50, 116, 138, 197],
  [1.00,   0, 173, 219],
];

// ─── Category colors ─────────────────────────────────────────────────────────
// 7 colors, 11 categories — sharing only between groups never adjacent in the table
export const CATEGORY_COLORS = {
  'alkali-metal':          PALETTE.pink,
  'alkaline-earth':        PALETTE.yellow,
  'transition-metal':      PALETTE.blue,
  'post-transition-metal': PALETTE.teal,
  'metalloid':             PALETTE.purple,
  'reactive-nonmetal':     PALETTE.green,
  'halogen':               PALETTE.yellow,  // not adjacent to alkaline earths
  'noble-gas':             PALETTE.pink,    // not adjacent to alkali metals
  'lanthanide':            PALETTE.teal,    // separate row from post-transition
  'actinide':              PALETTE.grey,
  'unknown':               PALETTE.grey,
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

// ─── "Can I lick it?" data ───────────────────────────────────────────────────
// sure = safe for a brief lick of a pure sample
// meh  = questionable — not immediately deadly but not recommended
// nah  = don't do it — toxic, reactive, radioactive, or corrosive
// unknown = genuinely insufficient data

const LICK = {
  1:   'unknown', // H  — gas; harmless but unlickable
  2:   'sure',    // He — inert noble gas
  3:   'nah',     // Li — explodes in contact with mouth moisture
  4:   'nah',     // Be — toxic & carcinogenic
  5:   'meh',     // B  — low but nonzero toxicity
  6:   'sure',    // C  — charcoal/graphite; even used medicinally
  7:   'unknown', // N  — gas; non-toxic but unlickable
  8:   'unknown', // O  — gas; unlickable
  9:   'nah',     // F  — will literally dissolve your tongue
  10:  'sure',    // Ne — inert noble gas
  11:  'nah',     // Na — explosive with saliva
  12:  'meh',     // Mg — essential element; reacts slowly with moisture
  13:  'sure',    // Al — used in cookware, antacids; very low toxicity
  14:  'sure',    // Si — basically sand; biologically inert
  15:  'nah',     // P  — white phosphorus ignites; red P still toxic
  16:  'meh',     // S  — mild irritant; relatively low toxicity
  17:  'nah',     // Cl — toxic gas
  18:  'sure',    // Ar — inert noble gas
  19:  'nah',     // K  — more explosive with water than Na
  20:  'meh',     // Ca — essential element; reacts with saliva but slowly
  21:  'unknown', // Sc — limited human toxicology data
  22:  'sure',    // Ti — used in dental and surgical implants
  23:  'nah',     // V  — toxic; disrupts enzyme systems
  24:  'meh',     // Cr — Cr(III) is an essential trace nutrient; pure metal is less toxic than Cr(VI) compounds
  25:  'meh',     // Mn — essential trace element; neurotoxic in excess
  26:  'sure',    // Fe — essential; iron filings in cereal
  27:  'meh',     // Co — essential (vitamin B12) but toxic in excess
  28:  'nah',     // Ni — known carcinogen and common allergen
  29:  'meh',     // Cu — essential trace element; toxic in large amounts
  30:  'meh',     // Zn — essential; too much causes nausea
  31:  'meh',     // Ga — low toxicity; melts in your hand (and mouth)
  32:  'meh',     // Ge — low toxicity as pure metal
  33:  'nah',     // As — the classic poison
  34:  'nah',     // Se — essential trace element but toxic window is tiny
  35:  'nah',     // Br — corrosive liquid; toxic fumes
  36:  'sure',    // Kr — inert noble gas
  37:  'nah',     // Rb — reacts violently with water
  38:  'nah',     // Sr — reactive; soluble Sr compounds are toxic
  39:  'unknown', // Y  — limited human data
  40:  'sure',    // Zr — biocompatible; used in dental crowns
  41:  'meh',     // Nb — low toxicity; used in medical-grade alloys
  42:  'meh',     // Mo — essential trace element; low acute toxicity
  43:  'nah',     // Tc — all isotopes are radioactive
  44:  'meh',     // Ru — low toxicity as bulk metal
  45:  'meh',     // Rh — low toxicity
  46:  'meh',     // Pd — moderate toxicity; some compounds irritating
  47:  'meh',     // Ag — low acute toxicity; repeated exposure causes argyria
  48:  'nah',     // Cd — highly toxic; causes itai-itai disease
  49:  'nah',     // In — moderately toxic; affects kidneys
  50:  'meh',     // Sn — inorganic tin has low toxicity
  51:  'nah',     // Sb — toxic heavy metal
  52:  'nah',     // Te — toxic; causes months-long garlic breath
  53:  'nah',     // I  — pure I₂ crystals are corrosive to mucous membranes; causes chemical burns
  54:  'sure',    // Xe — inert; used as an anesthetic
  55:  'nah',     // Cs — more reactive than K; also mildly radioactive (natural Cs-137)
  56:  'nah',     // Ba — soluble Ba compounds are highly toxic
  57:  'unknown', // La — lanthanide; limited data
  58:  'unknown', // Ce — lanthanide; limited data
  59:  'unknown', // Pr — lanthanide; limited data
  60:  'unknown', // Nd — lanthanide; limited data
  61:  'nah',     // Pm — radioactive; no stable isotopes
  62:  'unknown', // Sm — lanthanide; limited data
  63:  'unknown', // Eu — lanthanide; limited data
  64:  'unknown', // Gd — lanthanide; Gd contrast agents have toxicity concerns
  65:  'unknown', // Tb — lanthanide; limited data
  66:  'unknown', // Dy — lanthanide; limited data
  67:  'unknown', // Ho — lanthanide; limited data
  68:  'unknown', // Er — lanthanide; limited data
  69:  'unknown', // Tm — lanthanide; limited data
  70:  'unknown', // Yb — lanthanide; limited data
  71:  'unknown', // Lu — lanthanide; limited data
  72:  'unknown', // Hf — limited human toxicology; low acute toxicity suspected
  73:  'sure',    // Ta — biocompatible; used in surgical implants and sutures
  74:  'meh',     // W  — low systemic toxicity; tungsten carbide is more concerning
  75:  'unknown', // Re — very limited data
  76:  'nah',     // Os — oxidizes to OsO₄ on surface, which is extremely toxic
  77:  'meh',     // Ir — low toxicity as bulk metal
  78:  'sure',    // Pt — generally inert as pure metal; Pt compounds are another story
  79:  'sure',    // Au — completely inert; edible gold leaf is a thing
  80:  'nah',     // Hg — neurotoxin; liquid at room temp makes it extra dangerous
  81:  'nah',     // Tl — extremely toxic; was used as rat poison
  82:  'nah',     // Pb — neurotoxin; children especially vulnerable
  83:  'meh',     // Bi — active ingredient in Pepto-Bismol; relatively low toxicity
  84:  'nah',     // Po — one of the most toxic substances known; radioactive
  85:  'nah',     // At — radioactive and highly reactive halogen
  86:  'nah',     // Rn — radioactive gas; leading cause of lung cancer after smoking
  87:  'nah',     // Fr — extremely radioactive AND reactive with water
  88:  'nah',     // Ra — famously radioactive; killed Marie Curie
  89:  'nah',     // Ac — radioactive
  90:  'nah',     // Th — radioactive + toxic heavy metal
  91:  'nah',     // Pa — radioactive + highly toxic
  92:  'nah',     // U  — radioactive + toxic heavy metal
  93:  'nah',     // Np — radioactive
  94:  'nah',     // Pu — radioactive; microgram doses are lethal
  95:  'nah',     // Am — radioactive
  96:  'nah',     // Cm — radioactive; very high specific activity
  97:  'nah',     // Bk — radioactive
  98:  'nah',     // Cf — radioactive; one of the most expensive substances on Earth
  99:  'nah',     // Es — radioactive
  100: 'nah',     // Fm — radioactive
  101: 'nah',     // Md — radioactive
  102: 'nah',     // No — radioactive
  103: 'nah',     // Lr — radioactive
  104: 'unknown', // Rf — superheavy; can only be made atom by atom
  105: 'unknown', // Db — superheavy
  106: 'unknown', // Sg — superheavy
  107: 'unknown', // Bh — superheavy
  108: 'unknown', // Hs — superheavy
  109: 'unknown', // Mt — superheavy
  110: 'unknown', // Ds — superheavy
  111: 'unknown', // Rg — superheavy
  112: 'unknown', // Cn — superheavy
  113: 'unknown', // Nh — superheavy
  114: 'unknown', // Fl — superheavy
  115: 'unknown', // Mc — superheavy
  116: 'unknown', // Lv — superheavy
  117: 'unknown', // Ts — superheavy
  118: 'unknown', // Og — superheavy
};

const LICK_COLORS = {
  sure:    PALETTE.green,
  meh:     PALETTE.yellow,
  nah:     PALETTE.pink,
  unknown: PALETTE.grey,
};

const LICK_LABELS = {
  sure:    'Sure',
  meh:     'Meh',
  nah:     'Nah',
  unknown: 'Unknown',
};

const LICK_DESCRIPTIONS = {
  sure:    'Go for it — brief exposure to a pure sample is considered safe',
  meh:     'Questionable — probably fine once, but why would you?',
  nah:     'Hard no — toxic, radioactive, corrosive, or explosively reactive',
  unknown: 'Insufficient data — we literally cannot test most of these',
};

// ─── Layer factories ──────────────────────────────────────────────────────────
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
      if (val === null || val === undefined || !isFinite(val)) return '#1e2535';
      return interpolateColor(scale, (val - min) / (max - min));
    },
    getLegendColor(t) {
      return interpolateColor(scale, t);
    },
  };
}

// ─── All layers ───────────────────────────────────────────────────────────────
export const colorLayers = [
  {
    id: 'category',
    label: 'Category',
    description: 'Element type / block',
    type: 'category',
    legendItems: Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      key, label, color: CATEGORY_COLORS[key],
    })),
    getColor(element) {
      return CATEGORY_COLORS[element.category] ?? PALETTE.grey;
    },
  },
  {
    id: 'lick',
    label: 'Can I Lick It?',
    description: 'Brief contact with pure element — based on ATSDR/NIOSH acute toxicology data. Assumes bulk solid/liquid at STP. Not medical advice.',
    type: 'category',
    legendItems: Object.entries(LICK_LABELS).map(([key, label]) => ({
      key, label, color: LICK_COLORS[key], description: LICK_DESCRIPTIONS[key],
    })),
    getColor(element) {
      const rating = LICK[element.number] ?? 'unknown';
      return LICK_COLORS[rating];
    },
    getRating(element) {
      return LICK[element.number] ?? 'unknown';
    },
    getRatingLabel(element) {
      return LICK_LABELS[LICK[element.number] ?? 'unknown'];
    },
    getRatingDescription(element) {
      return LICK_DESCRIPTIONS[LICK[element.number] ?? 'unknown'];
    },
  },
  makeGradientLayer({
    id: 'electronegativity',
    label: 'Electronegativity',
    description: 'Pauling scale',
    property: 'electronegativity',
    unit: '',
    scale: SCALE_VIVID,
    format: v => v?.toFixed(2) ?? '—',
  }),
  makeGradientLayer({
    id: 'atomicMass',
    label: 'Atomic Mass',
    description: 'Standard atomic weight (u)',
    property: 'atomicMass',
    unit: 'u',
    scale: SCALE_COOL_WARM,
    format: v => v?.toFixed(3) ?? '—',
  }),
  makeGradientLayer({
    id: 'meltingPoint',
    label: 'Melting Point',
    description: 'Melting point in Kelvin',
    property: 'meltingPoint',
    unit: 'K',
    scale: SCALE_HEAT,
    format: v => v != null ? `${v.toFixed(0)} K` : '—',
  }),
  makeGradientLayer({
    id: 'boilingPoint',
    label: 'Boiling Point',
    description: 'Boiling point in Kelvin',
    property: 'boilingPoint',
    unit: 'K',
    scale: SCALE_HEAT,
    format: v => v != null ? `${v.toFixed(0)} K` : '—',
  }),
  makeGradientLayer({
    id: 'density',
    label: 'Density',
    description: 'Density at STP (g/cm³)',
    property: 'density',
    unit: 'g/cm³',
    scale: SCALE_DENSITY,
    format: v => v != null ? `${v.toFixed(4)} g/cm³` : '—',
  }),
  makeGradientLayer({
    id: 'ionizationEnergy',
    label: 'Ionization Energy',
    description: 'First ionization energy (eV)',
    property: 'ionizationEnergy',
    unit: 'eV',
    scale: SCALE_VIVID,
    format: v => v != null ? `${v.toFixed(3)} eV` : '—',
  }),
  makeGradientLayer({
    id: 'atomicRadius',
    label: 'Atomic Radius',
    description: 'Van der Waals radius (pm) — Alvarez (2013) Dalton Trans. 42, 8617',
    property: 'atomicRadius',
    unit: 'pm',
    scale: SCALE_COOL_WARM,
    format: v => v != null ? `${v} pm` : '—',
  }),
  makeGradientLayer({
    id: 'electronAffinity',
    label: 'Electron Affinity',
    description: 'Electron affinity (eV)',
    property: 'electronAffinity',
    unit: 'eV',
    scale: SCALE_VIVID,
    format: v => v != null ? `${v.toFixed(3)} eV` : '—',
  }),
];

export const colorLayerById = Object.fromEntries(colorLayers.map(l => [l.id, l]));
