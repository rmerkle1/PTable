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
};

// ─── "Can I lick it?" data ───────────────────────────────────────────────────
// sure = safe for a brief lick of a pure sample
// meh  = questionable — not immediately deadly but not recommended
// nah  = don't do it — toxic, reactive, radioactive, or corrosive
// unknown = genuinely insufficient data

const LICK = {
  1:   'sure',    // H  — H₂ gas is completely harmless; inert at physiological conditions
  2:   'sure',    // He — inert noble gas
  3:   'nah',     // Li — explodes in contact with mouth moisture
  4:   'nah',     // Be — toxic & carcinogenic
  5:   'meh',     // B  — low but nonzero toxicity
  6:   'sure',    // C  — charcoal/graphite; even used medicinally
  7:   'sure',    // N  — N₂ makes up 78% of air; completely non-toxic
  8:   'sure',    // O  — O₂ is required for life; breathing it is fine
  9:   'nah',     // F  — will literally dissolve your tongue
  10:  'sure',    // Ne — inert noble gas
  11:  'nah',     // Na — explosive with saliva
  12:  'meh',     // Mg — essential element; reacts slowly with moisture
  13:  'sure',    // Al — used in cookware, antacids; very low toxicity
  14:  'sure',    // Si — basically sand; biologically inert
  15:  'nah',     // P  — white phosphorus ignites; red P still toxic
  16:  'sure',    // S  — elemental sulfur is used in supplements and fungicides; very low acute toxicity
  17:  'nah',     // Cl — toxic gas
  18:  'sure',    // Ar — inert noble gas
  19:  'nah',     // K  — more explosive with water than Na
  20:  'meh',     // Ca — essential element; reacts with saliva but slowly
  21:  'sure',    // Sc — low acute toxicity; no established adverse effects from brief contact
  22:  'sure',    // Ti — used in dental and surgical implants
  23:  'meh',     // V  — pure metal has lower acute toxicity than vanadium compounds; chronic exposure is the main concern
  24:  'meh',     // Cr — Cr(III) is an essential trace nutrient; pure metal is less toxic than Cr(VI) compounds
  25:  'meh',     // Mn — essential trace element; neurotoxic in excess
  26:  'sure',    // Fe — essential; iron filings in cereal
  27:  'meh',     // Co — essential (vitamin B12) but toxic in excess
  28:  'meh',     // Ni — pure metal brief contact is low acute risk; allergen for ~15% of people, carcinogen risk is from chronic inhalation of dust
  29:  'meh',     // Cu — essential trace element; toxic in large amounts
  30:  'meh',     // Zn — essential; too much causes nausea
  31:  'meh',     // Ga — low toxicity; melts in your hand (and mouth)
  32:  'meh',     // Ge — low toxicity as pure metal
  33:  'nah',     // As — the classic poison
  34:  'nah',     // Se — essential trace element but toxic window is tiny
  35:  'nah',     // Br — corrosive liquid; toxic fumes
  36:  'sure',    // Kr — inert noble gas
  37:  'nah',     // Rb — reacts violently with water
  38:  'meh',     // Sr — less reactive than K/Rb; strontium ranelate used as an osteoporosis drug; soluble salts are more concerning than the metal
  39:  'sure',    // Y  — low acute toxicity; similar profile to Sc; no established hazard from brief contact
  40:  'sure',    // Zr — biocompatible; used in dental crowns
  41:  'meh',     // Nb — low toxicity; used in medical-grade alloys
  42:  'meh',     // Mo — essential trace element; low acute toxicity
  43:  'nah',     // Tc — all isotopes are radioactive
  44:  'sure',    // Ru — bulk metal has very low toxicity; Ru compounds are different
  45:  'sure',    // Rh — very low toxicity as bulk metal
  46:  'meh',     // Pd — moderate toxicity; some Pd salts are sensitizers
  47:  'sure',    // Ag — used in wound dressings and edible applications; very low acute toxicity as pure metal
  48:  'nah',     // Cd — highly toxic; causes itai-itai disease
  49:  'meh',     // In — moderate acute toxicity; brief contact with solid indium is low risk
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
  72:  'meh',     // Hf — low acute toxicity; used in some biomedical contexts; limited systemic data
  73:  'sure',    // Ta — biocompatible; used in surgical implants and sutures
  74:  'sure',    // W  — very low systemic toxicity as pure metal; one of the least toxic heavy metals
  75:  'meh',     // Re — limited data; expected low acute toxicity based on its chemical inertness
  76:  'nah',     // Os — oxidizes to OsO₄ on surface, which is extremely toxic
  77:  'sure',    // Ir — very low toxicity as bulk metal; used in medical electrodes
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

// ─── "How to Make it Explode" data ───────────────────────────────────────────
// water      = reacts violently/explosively with water
// air        = pyrophoric — ignites spontaneously in air
// fire       = flammable — burns explosively when ignited
// oxidizer   = powerful oxidizer — causes other things to combust violently
// radioactive = nuclear decay or criticality risk (on its own)
// stable     = not particularly explosive under normal conditions

const BOOM = {
  1:   'fire',        // H  — hydrogen gas explodes with O₂
  2:   'stable',      // He — noble gas
  3:   'water',       // Li — reacts vigorously with water
  4:   'fire',        // Be — burns brilliantly when ignited
  5:   'stable',      // B  — stable under normal conditions
  6:   'stable',      // C  — stable under normal conditions
  7:   'stable',      // N  — N₂ is chemically inert
  8:   'oxidizer',    // O  — pure O₂ causes violent combustion
  9:   'oxidizer',    // F  — most powerful oxidizer known; ignites almost everything
  10:  'stable',      // Ne — noble gas
  11:  'water',       // Na — classic water explosion (the YouTube video)
  12:  'fire',        // Mg — burns brilliantly; used in incendiary devices
  13:  'fire',        // Al — thermite (Al + Fe₂O₃); powder dust explosions
  14:  'stable',      // Si — inert
  15:  'air',         // P  — white phosphorus ignites spontaneously in air
  16:  'fire',        // S  — burns; historically used in gunpowder
  17:  'oxidizer',    // Cl — powerful oxidizer; forms explosive compounds with fuels
  18:  'stable',      // Ar — noble gas
  19:  'water',       // K  — more violent water reaction than Na
  20:  'water',       // Ca — reacts with water, producing flammable H₂
  21:  'stable',      // Sc — stable metal
  22:  'fire',        // Ti — titanium powder/dust fires; burns even in N₂
  23:  'stable',      // V  — stable metal
  24:  'stable',      // Cr — stable metal
  25:  'stable',      // Mn — stable metal
  26:  'fire',        // Fe — steel wool ignites easily; key fuel in thermite
  27:  'stable',      // Co — stable metal
  28:  'stable',      // Ni — stable metal
  29:  'stable',      // Cu — stable metal
  30:  'fire',        // Zn — zinc dust fires; used in smoke and incendiary devices
  31:  'stable',      // Ga — stable metal
  32:  'stable',      // Ge — stable metalloid
  33:  'fire',        // As — burns with a blue flame; used in early explosives
  34:  'fire',        // Se — burns when ignited
  35:  'oxidizer',    // Br — liquid bromine is a strong oxidizer
  36:  'stable',      // Kr — noble gas
  37:  'water',       // Rb — more violent than K with water
  38:  'water',       // Sr — reacts with water, producing H₂
  39:  'stable',      // Y  — stable metal
  40:  'air',         // Zr — pyrophoric as fine powder; used in early flash photography
  41:  'stable',      // Nb — stable metal
  42:  'stable',      // Mo — stable metal
  43:  'radioactive', // Tc — all isotopes are radioactive; no stable form
  44:  'stable',      // Ru — stable metal
  45:  'stable',      // Rh — stable metal
  46:  'stable',      // Pd — stable metal
  47:  'stable',      // Ag — stable metal
  48:  'stable',      // Cd — stable metal
  49:  'stable',      // In — stable metal
  50:  'stable',      // Sn — stable metal
  51:  'fire',        // Sb — fine powder is flammable; historically used in incendiaries
  52:  'stable',      // Te — stable metalloid
  53:  'stable',      // I  — elemental I₂ is not explosive
  54:  'stable',      // Xe — noble gas
  55:  'water',       // Cs — most dramatic alkali metal water reaction; nearly instantaneous
  56:  'water',       // Ba — reacts with water; barium is more reactive than strontium
  57:  'air',         // La — pyrophoric; fine turnings ignite in air
  58:  'air',         // Ce — pyrophoric; the active ingredient in ferrocerium fire starters
  59:  'air',         // Pr — pyrophoric metal
  60:  'air',         // Nd — pyrophoric; used in magnets but dangerous as fine powder
  61:  'radioactive', // Pm — radioactive; no stable isotopes exist
  62:  'fire',        // Sm — flammable as fine powder
  63:  'water',       // Eu — reacts with water like the alkaline earth metals
  64:  'fire',        // Gd — flammable as fine powder
  65:  'fire',        // Tb — flammable as fine powder
  66:  'fire',        // Dy — flammable as fine powder
  67:  'fire',        // Ho — flammable as fine powder
  68:  'fire',        // Er — flammable as fine powder
  69:  'fire',        // Tm — flammable as fine powder
  70:  'fire',        // Yb — flammable as fine powder
  71:  'stable',      // Lu — stable metal
  72:  'air',         // Hf — pyrophoric powder; used in flash photography and armor-piercing rounds
  73:  'stable',      // Ta — extremely stable; used in chemical plant linings
  74:  'stable',      // W  — most refractory metal; stable to extreme temps
  75:  'stable',      // Re — stable metal
  76:  'stable',      // Os — stable metal (though OsO₄ fumes are hazardous)
  77:  'stable',      // Ir — stable metal
  78:  'stable',      // Pt — stable metal
  79:  'stable',      // Au — completely inert
  80:  'stable',      // Hg — not flammable; toxic but not explosive as element
  81:  'stable',      // Tl — stable metal
  82:  'stable',      // Pb — stable metal
  83:  'stable',      // Bi — stable metal
  84:  'radioactive', // Po — highly radioactive; used to assassinate Alexander Litvinenko
  85:  'radioactive', // At — radioactive halogen; extremely rare
  86:  'radioactive', // Rn — radioactive gas; seeps from ground into buildings
  87:  'radioactive', // Fr — half-life of 22 minutes; too radioactive to accumulate
  88:  'radioactive', // Ra — famously radioactive; 1,600-year half-life
  89:  'radioactive', // Ac — radioactive actinide
  90:  'radioactive', // Th — radioactive heavy metal; potential nuclear fuel
  91:  'radioactive', // Pa — radioactive; rare and highly toxic
  92:  'radioactive', // U  — fissile material; used in nuclear weapons and reactors
  93:  'radioactive', // Np — radioactive; first transuranic element discovered
  94:  'radioactive', // Pu — fissile; nuclear weapons; also pyrophoric
  95:  'radioactive', // Am — radioactive; found in smoke detectors
  96:  'radioactive', // Cm — radioactive; very high specific activity
  97:  'radioactive', // Bk — radioactive
  98:  'radioactive', // Cf — radioactive; used as a neutron source
  99:  'radioactive', // Es — radioactive; named after Einstein
  100: 'radioactive', // Fm — radioactive; named after Fermi
  101: 'radioactive', // Md — radioactive
  102: 'radioactive', // No — radioactive
  103: 'radioactive', // Lr — radioactive
  104: 'radioactive', // Rf — radioactive superheavy
  105: 'radioactive', // Db — radioactive superheavy
  106: 'radioactive', // Sg — radioactive superheavy
  107: 'radioactive', // Bh — radioactive superheavy
  108: 'radioactive', // Hs — radioactive superheavy
  109: 'radioactive', // Mt — radioactive superheavy
  110: 'radioactive', // Ds — radioactive superheavy
  111: 'radioactive', // Rg — radioactive superheavy
  112: 'radioactive', // Cn — radioactive superheavy
  113: 'radioactive', // Nh — radioactive superheavy
  114: 'radioactive', // Fl — radioactive superheavy
  115: 'radioactive', // Mc — radioactive superheavy
  116: 'radioactive', // Lv — radioactive superheavy
  117: 'radioactive', // Ts — radioactive superheavy
  118: 'radioactive', // Og — radioactive superheavy
};

const BOOM_COLORS = {
  water:       PALETTE.blue,
  air:         PALETTE.yellow,
  fire:        PALETTE.pink,
  oxidizer:    PALETTE.teal,
  radioactive: PALETTE.purple,
  stable:      PALETTE.grey,
};

const BOOM_LABELS = {
  water:       'Water',
  air:         'Air',
  fire:        'Fire',
  oxidizer:    'Explodes Others',
  radioactive: 'On Its Own',
  stable:      'Not Explosive',
};

const BOOM_DESCRIPTIONS = {
  water:       'Reacts violently or explosively on contact with water',
  air:         'Pyrophoric — ignites spontaneously when exposed to air',
  fire:        'Flammable — burns explosively when ignited by a spark or flame',
  oxidizer:    'Powerful oxidizer — causes other materials to combust or explode violently',
  radioactive: 'Radioactive decay or nuclear criticality — it explodes on its own terms',
  stable:      'Not particularly explosive under normal conditions',
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
  {
    id: 'boom',
    label: 'How to Make it Explode',
    description: 'How to get this element to go boom — educational purposes only',
    type: 'category',
    legendItems: Object.entries(BOOM_LABELS).map(([key, label]) => ({
      key, label, color: BOOM_COLORS[key], description: BOOM_DESCRIPTIONS[key],
    })),
    getColor(element) {
      const rating = BOOM[element.number] ?? 'stable';
      return BOOM_COLORS[rating];
    },
    getRating(element) {
      return BOOM[element.number] ?? 'stable';
    },
    getRatingLabel(element) {
      return BOOM_LABELS[BOOM[element.number] ?? 'stable'];
    },
    getRatingDescription(element) {
      return BOOM_DESCRIPTIONS[BOOM[element.number] ?? 'stable'];
    },
    getNote(element) {
      return null; // per-element notes stored in BOOM comments
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
