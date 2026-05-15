import { elements } from './elements';
import { ELECTRON_ANOMALIES } from './electronConfigs';

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

// ─── "Gen Chem Relevance" data ────────────────────────────────────────────────
// know   = likely to appear in a first-year gen chem course
// maybe  = 25-50% chance — specialty or niche topics
// forget = rarely if ever in gen chem  (default for anything not listed)

const GEN_CHEM = {
  1:   'know',   // H  — acids, water, gases, everything
  2:   'know',   // He — noble gas, electron configuration
  3:   'know',   // Li — Group 1 example, lithium batteries
  4:   'know',   // Be — BeCl₂ (linear, exception to octet rule)
  5:   'know',   // B  — BF₃ (Lewis acid, trigonal planar)
  6:   'know',   // C  — organic intro, CO₂, carbonates
  7:   'know',   // N  — N₂, ammonia synthesis, nitrates
  8:   'know',   // O  — oxidation states, combustion, water
  9:   'know',   // F  — most electronegative, HF acid
  10:  'know',   // Ne — noble gas, periodic trends
  11:  'know',   // Na — NaOH, NaCl, sodium chemistry
  12:  'know',   // Mg — Mg²⁺, Group 2 example
  13:  'know',   // Al — amphoteric oxide, metals/alloys
  14:  'know',   // Si — SiO₂, semiconductors, silicates
  15:  'know',   // P  — phosphates, PCl₅, Lewis structures
  16:  'know',   // S  — H₂SO₄, S₈, sulfuric acid
  17:  'know',   // Cl — Cl₂, HCl, halogens, chloride ions
  18:  'know',   // Ar — noble gas, inert atmosphere
  19:  'know',   // K  — K⁺, potassium salts, Group 1
  20:  'know',   // Ca — CaCO₃, hard water, Ca²⁺
  21:  'maybe',  // Sc — first d-block element, periodic trends
  22:  'know',   // Ti — TiO₂ (white paint), transition metal
  23:  'know',   // V  — multiple oxidation states, vanadium catalyst
  24:  'know',   // Cr — chromate/dichromate redox; Cr²⁺/³⁺/⁶⁺
  25:  'know',   // Mn — KMnO₄ (lab reagent), permanganate redox
  26:  'know',   // Fe — Fe²⁺/³⁺, rust, steel, hemoglobin
  27:  'know',   // Co — Co²⁺/³⁺, crystal field theory, cobalt blue
  28:  'know',   // Ni — Ni²⁺, electroplating, Ni-Cd battery
  29:  'know',   // Cu — Cu⁺/²⁺, electrochemistry demo, copper wire
  30:  'know',   // Zn — Zn²⁺, galvanic cells, zinc battery
  31:  'know',   // Ga — semiconductor, melts at body temperature
  32:  'maybe',  // Ge — semiconductor, Mendeleev's eka-silicon prediction
  33:  'know',   // As — arsenic poisoning, metalloid
  34:  'know',   // Se — trace element, metalloid
  35:  'know',   // Br — Br₂ (liquid halogen), HBr, bromides
  36:  'know',   // Kr — noble gas, periodic trends
  37:  'know',   // Rb — Group 1 periodic trends
  38:  'know',   // Sr — flame tests (crimson), Group 2
  39:  'maybe',  // Y  — ytterite minerals, periodic trends
  40:  'maybe',  // Zr — ZrO₂ ceramics, nuclear reactor cladding
  41:  'maybe',  // Nb — superconductors, niobium alloys
  42:  'maybe',  // Mo — multiple oxidation states, MoS₂ lubricant
  43:  'maybe',  // Tc — first synthetic element; Mendeleev gap; nuclear medicine
  44:  'maybe',  // Ru — catalysts, platinum group
  45:  'maybe',  // Rh — catalytic converters, platinum group
  46:  'maybe',  // Pd — H₂ absorption, cross-coupling catalysis
  47:  'know',   // Ag — Ag⁺, AgNO₃, Ksp reactions, photography
  48:  'know',   // Cd — CdS (quantum dots, pigment), Ni-Cd battery
  49:  'maybe',  // In — indium tin oxide (ITO)
  50:  'know',   // Sn — Sn²⁺/⁴⁺, tin cans, solder, allotropes of tin
  51:  'maybe',  // Sb — flame retardants, antimony compounds
  52:  'maybe',  // Te — thermoelectrics, telluride compounds
  53:  'know',   // I  — I₂ crystals, HI, halogens, iodides
  54:  'know',   // Xe — noble gas, XeF₄ (exceptions to octet rule)
  55:  'know',   // Cs — atomic clock, Group 1 periodic trends
  56:  'know',   // Ba — Ba²⁺, BaSO₄ (insoluble salt), flame tests
  57:  'maybe',  // La — lanthanide series intro
  58:  'forget', // Ce — lanthanide
  60:  'maybe',  // Nd — Nd magnets (strongest permanent magnets)
  63:  'forget', // Eu — lanthanide
  64:  'forget', // Gd — lanthanide
  72:  'forget', // Hf — too specialized for gen chem
  73:  'forget', // Ta — too specialized for gen chem
  74:  'maybe',  // W  — tungsten filament, highest melting point of metals
  78:  'know',   // Pt — platinum electrode, catalytic converter
  79:  'know',   // Au — noble metal, electrochemistry, gold leaf
  80:  'know',   // Hg — liquid metal, barometer, thermometer (historical)
  81:  'forget', // Tl — too rare/specialized for gen chem
  82:  'know',   // Pb — Pb-acid battery, historical toxicology, alloys
  83:  'maybe',  // Bi — Pepto-Bismol, low-toxicity heavy metal
  84:  'forget', // Po — too specialized for gen chem
  86:  'maybe',  // Rn — radon gas, indoor radioactivity, lung cancer
  88:  'maybe',  // Ra — radium, Marie Curie, historical radioactivity
  90:  'maybe',  // Th — thorium, nuclear fuel, Welsbach gas mantles
  92:  'know',   // U  — nuclear fission, U-235, uranium hexafluoride
  94:  'maybe',  // Pu — plutonium, nuclear weapons, nuclear power
  95:  'forget', // Am — too specialized for gen chem
};

const GEN_CHEM_COLORS = {
  know:   PALETTE.green,
  maybe:  PALETTE.yellow,
  forget: PALETTE.grey,
};

const GEN_CHEM_LABELS = {
  know:   'Know It',
  maybe:  'Maybe',
  forget: 'Forget It',
};

const GEN_CHEM_DESCRIPTIONS = {
  know:   'Likely to appear in a first-year gen chem course — study this one',
  maybe:  'May appear in nuclear, materials, or specialty sections',
  forget: 'Rarely if ever tested in a first-year chemistry course',
};

// ─── "Natural Habitat" data ───────────────────────────────────────────────────
// air   = primarily found as a component of Earth's atmosphere
// ocean = primarily dissolved in seawater or freshwater
// life  = most strongly associated with biological organisms
// rock  = found in Earth's crust, minerals, or ores  (default for natural elements)
// lab   = synthetic; must be made in a reactor or accelerator  (default for Z≥93)

const HABITAT = {
  // air ─────────────────────────────────────────────────────────────────────
  2:   'air',    // He — trace noble gas from radioactive decay in crust
  7:   'air',    // N  — 78% of the atmosphere
  8:   'air',    // O  — 21% of the atmosphere
  10:  'air',    // Ne — trace noble gas in atmosphere
  18:  'air',    // Ar — 0.9% of the atmosphere
  36:  'air',    // Kr — trace noble gas in atmosphere
  54:  'air',    // Xe — trace noble gas in atmosphere
  86:  'air',    // Rn — seeps from radioactive minerals into air and basements

  // ocean ───────────────────────────────────────────────────────────────────
  1:   'ocean',  // H  — water
  5:   'ocean',  // B  — dissolved as boric acid in seawater
  11:  'ocean',  // Na — most abundant cation in seawater
  12:  'ocean',  // Mg — second most abundant cation in seawater
  17:  'ocean',  // Cl — most abundant anion in seawater
  35:  'ocean',  // Br — extracted commercially from seawater
  38:  'ocean',  // Sr — dissolved in seawater; incorporated by marine organisms
  53:  'ocean',  // I  — concentrated in seawater and marine algae

  // life ────────────────────────────────────────────────────────────────────
  6:   'life',   // C  — the backbone of all organic molecules and living things
  15:  'life',   // P  — DNA backbone, ATP energy currency, bones and teeth
  27:  'life',   // Co — the metal at the core of vitamin B12
  30:  'life',   // Zn — essential cofactor in hundreds of enzymes
  34:  'life',   // Se — selenocysteine, selenoproteins, antioxidant enzymes
  42:  'life',   // Mo — nitrogenase enzyme (nitrogen fixation)

  // lab (synthetic — no stable isotopes) ───────────────────────────────────
  43:  'lab',    // Tc — first synthetic element; no stable isotopes
  61:  'lab',    // Pm — no stable isotopes
  // elements 93–118 default to 'lab' in getRating
};

const HABITAT_COLORS = {
  air:   PALETTE.blue,
  ocean: PALETTE.teal,
  life:  PALETTE.green,
  rock:  PALETTE.grey,
  lab:   PALETTE.purple,
};

const HABITAT_LABELS = {
  air:   'Atmosphere',
  ocean: 'Ocean / Water',
  life:  'Living Things',
  rock:  'Rocks & Minerals',
  lab:   'Lab Only',
};

const HABITAT_DESCRIPTIONS = {
  air:   'Found primarily as a component of Earth\'s atmosphere',
  ocean: 'Found primarily dissolved in seawater or freshwater',
  life:  'Most strongly associated with biological organisms',
  rock:  'Found in Earth\'s crust, minerals, or ores',
  lab:   'Synthetic — must be created in a nuclear reactor or particle accelerator',
};

// ─── Bulk Earth abundance (ppm by mass) ──────────────────────────────────────
// Source: McDonough & Sun (1995) Chemical Geology 120, 223-253 (primary);
//         Allègre et al. (2001) Earth Planet. Sci. Lett. 185, 49-69 (supplementary).
// Covers entire Earth — crust, mantle, AND core. Fe, Ni, S, Co, Cr dramatically
// higher than crust-only because they concentrate in the metallic core.
// Displayed on a log₁₀ scale. Null = no stable isotopes / immeasurably trace.

const ABUNDANCE_PPM = {
  1:   260,      // H   — ocean + hydrous minerals; possible core contribution
  2:   0.008,    // He  — trace (lost to space; replenished by radioactive decay)
  3:   1.1,      // Li
  4:   0.05,     // Be
  5:   0.9,      // B
  6:   730,      // C   — significant; concentrated in core as carbide/carbon
  7:   25,       // N
  8:   297000,   // O   — dominant anion of silicate mantle
  9:   14,       // F
  10:  0.005,    // Ne  — trace noble gas
  11:  1800,     // Na
  12:  155000,   // Mg  — dominant cation of mantle (olivine, pyroxene)
  13:  15900,    // Al
  14:  166000,   // Si  — second most abundant element in Earth
  15:  2100,     // P   — concentrated in core
  16:  29000,    // S   — major light element in core
  17:  17,       // Cl
  18:  0.003,    // Ar  — trace noble gas
  19:  240,      // K
  20:  16700,    // Ca
  21:  10,       // Sc
  22:  810,      // Ti
  23:  880,      // V
  24:  4700,     // Cr  — abundant in core and mantle
  25:  1700,     // Mn
  26:  321000,   // Fe  — most abundant element in Earth (dominates metallic core)
  27:  880,      // Co  — strongly concentrated in core
  28:  18100,    // Ni  — major core element; Earth's 5th most abundant
  29:  60,       // Cu
  30:  40,       // Zn
  31:  3.0,      // Ga
  32:  7.0,      // Ge  — siderophile; concentrated in core
  33:  1.7,      // As
  34:  2.8,      // Se  — siderophile; concentrated in core
  35:  0.05,     // Br
  36:  0.0001,   // Kr  — trace noble gas
  37:  0.4,      // Rb
  38:  15.5,     // Sr
  39:  2.9,      // Y
  40:  6.3,      // Zr
  41:  0.58,     // Nb
  42:  1.7,      // Mo  — siderophile; higher than crust
  44:  1.05,     // Ru  — siderophile; mostly in core
  45:  0.186,    // Rh  — siderophile; mostly in core
  46:  0.39,     // Pd  — siderophile; mostly in core
  47:  0.008,    // Ag
  48:  0.04,     // Cd
  49:  0.013,    // In
  50:  0.42,     // Sn
  51:  0.018,    // Sb
  52:  0.30,     // Te  — siderophile; mostly in core
  53:  0.026,    // I
  54:  0.00002,  // Xe  — trace noble gas
  55:  0.021,    // Cs
  56:  5.0,      // Ba
  57:  0.80,     // La
  58:  1.68,     // Ce
  59:  0.25,     // Pr
  60:  1.25,     // Nd
  62:  0.41,     // Sm
  63:  0.15,     // Eu
  64:  0.55,     // Gd
  65:  0.10,     // Tb
  66:  0.67,     // Dy
  67:  0.15,     // Ho
  68:  0.44,     // Er
  69:  0.068,    // Tm
  70:  0.44,     // Yb
  71:  0.068,    // Lu
  72:  0.19,     // Hf
  73:  0.038,    // Ta
  74:  0.17,     // W   — siderophile; higher in core
  75:  0.000188, // Re  — highly siderophile; concentrated in core
  76:  0.0041,   // Os  — highly siderophile; mostly in core
  77:  0.0038,   // Ir  — highly siderophile; mostly in core
  78:  0.0076,   // Pt  — highly siderophile; mostly in core
  79:  0.00116,  // Au  — highly siderophile; mostly in core
  80:  0.02,     // Hg
  81:  0.0035,   // Tl
  82:  0.23,     // Pb
  83:  0.0025,   // Bi
  90:  0.080,    // Th
  92:  0.020,    // U
  // Tc(43), Pm(61), Po(84), At(85), Fr(87), Ra(88), Ac(89), Pa(91): null (no stable isotopes)
  // Rn(86): null (radioactive gas, trace)
  // Elements 93–118: null (synthetic)
};

const ABUNDANCE_LOG_MIN = -7;   // floor for very rare elements by atom count
const ABUNDANCE_LOG_MAX = 4.7;  // Fe: 321000 ppm / 55.85 u ≈ 5,748 → log10 ≈ 3.76; O drives scale

// ─── Human body abundance (ppm by mass) ──────────────────────────────────────
// Average adult human body elemental composition.
// Sources: Emsley "The Elements" (2011); WHO/IUPAC trace element references;
//          Frieden (1972) "The Chemical Elements of Life"; various biochemistry refs.
// Major elements as % converted to ppm. Trace values from literature ranges.
// Elements absent or below detection limit omitted (shown as no-data).

const HUMAN_ABUNDANCE_PPM = {
  1:  100000,  // H  — 10.0%  (water + all organic molecules)
  3:    0.031, // Li — ultra-trace (present in tissues; not essential)
  5:    0.7,   // B  — trace (may support bone health)
  6:  180000,  // C  — 18.0%  (backbone of all biomolecules)
  7:   30000,  // N  — 3.0%   (proteins, nucleic acids, neurotransmitters)
  8:  650000,  // O  — 65.0%  (water, biomolecules, hydroxyapatite)
  9:     37,   // F  — 37 ppm (tooth enamel, bone mineral)
  11:   1500,  // Na — 0.15%  (extracellular electrolyte, nerve signaling)
  12:    500,  // Mg — 0.05%  (ATP cofactor, bone)
  13:    0.9,  // Al — trace  (environmental accumulation; not essential)
  14:     20,  // Si — 20 ppm (connective tissue, collagen crosslinks)
  15:  10000,  // P  — 1.0%   (ATP, DNA/RNA backbone, bones, phospholipids)
  16:   2500,  // S  — 0.25%  (cysteine, methionine, disulfide bonds, CoA)
  17:   1500,  // Cl — 0.15%  (stomach acid HCl, electrolyte balance)
  19:   3500,  // K  — 0.35%  (primary intracellular cation)
  20:  15000,  // Ca — 1.5%   (bones, teeth, muscle contraction, signaling)
  23:    0.1,  // V  — ultra-trace (possibly essential; insulin-mimetic)
  24:   0.03,  // Cr — ultra-trace (glucose metabolism)
  25:    0.2,  // Mn — ultra-trace (enzyme cofactor: arginase, SOD)
  26:     60,  // Fe — 60 ppm (hemoglobin, myoglobin, cytochromes)
  27:   0.021, // Co — ultra-trace (cobalt in vitamin B12 center)
  28:    0.1,  // Ni — ultra-trace (possibly essential at very low levels)
  29:      1,  // Cu — 1 ppm  (cytochrome c oxidase, superoxide dismutase)
  30:     33,  // Zn — 33 ppm (cofactor in >300 enzymes; immune function)
  33:   0.013, // As — ultra-trace (toxic at higher doses; trace found in tissues)
  34:   0.05,  // Se — ultra-trace (selenoproteins, glutathione peroxidase)
  35:    2.9,  // Br — 2.9 ppm (ubiquitous in tissues; possibly essential for ECM)
  37:    4.6,  // Rb — 4.6 ppm (not essential; substitutes K in muscle)
  38:    3.6,  // Sr — 3.6 ppm (not essential; substitutes Ca in bone)
  42:    0.1,  // Mo — ultra-trace (xanthine oxidase, sulfite oxidase)
  53:    0.2,  // I  — ultra-trace (thyroid hormones T3 and T4)
  56:   0.31,  // Ba — ultra-trace (present in bone; not essential)
};

const HUMAN_LOG_MIN = -2;   // 0.01 ppm lower display floor
const HUMAN_LOG_MAX = 5.81; // log10(650000) — oxygen dominates

// ─── Ionic radius (Shannon 1976, crystal radii, pm) ──────────────────────────
// Most common oxidation state; CN=6 (octahedral) where available.
// Non-metals listed as their most common anion (e.g. O²⁻, F⁻, P³⁻, As³⁻, Cl⁻).
// Noble gases and most synthetic elements (Z > 98) omitted — no stable ions.

const IONIC_RADIUS = {
  1:    1,      // H+  (bare proton; crystal radius)
  3:   76,      // Li+
  4:   45,      // Be2+
  5:   27,      // B3+
  7:  146,      // N3-
  8:  140,      // O2-
  9:  133,      // F-
  11: 102,      // Na+
  12:  72,      // Mg2+
  13:  53.5,    // Al3+
  14:  40,      // Si4+
  15: 212,      // P3-
  16: 184,      // S2-
  17: 181,      // Cl-
  19: 138,      // K+
  20: 100,      // Ca2+
  21:  74.5,    // Sc3+
  22:  60.5,    // Ti4+
  23:  64,      // V3+
  24:  61.5,    // Cr3+
  25:  83,      // Mn2+
  26:  55,      // Fe3+
  27:  74.5,    // Co2+
  28:  69,      // Ni2+
  29:  73,      // Cu2+
  30:  74,      // Zn2+
  31:  62,      // Ga3+
  32:  53,      // Ge4+
  33: 222,      // As3-
  34: 198,      // Se2-
  35: 196,      // Br-
  37: 152,      // Rb+
  38: 118,      // Sr2+
  39:  90,      // Y3+
  40:  72,      // Zr4+
  41:  64,      // Nb5+
  42:  65,      // Mo4+
  43:  64.5,    // Tc4+
  44:  62,      // Ru4+
  45:  66.5,    // Rh3+
  46:  86,      // Pd2+ (CN=4 sq. planar)
  47: 115,      // Ag+
  48:  95,      // Cd2+
  49:  80,      // In3+
  50:  69,      // Sn4+
  51:  76,      // Sb3+
  52: 221,      // Te2-
  53: 220,      // I-
  55: 167,      // Cs+
  56: 135,      // Ba2+
  57: 103.2,    // La3+
  58: 101,      // Ce3+
  59:  99,      // Pr3+
  60:  98.3,    // Nd3+
  61:  97,      // Pm3+
  62:  95.8,    // Sm3+
  63:  94.7,    // Eu3+
  64:  93.8,    // Gd3+
  65:  92.3,    // Tb3+
  66:  91.2,    // Dy3+
  67:  90.1,    // Ho3+
  68:  89,      // Er3+
  69:  88,      // Tm3+
  70:  86.8,    // Yb3+
  71:  86.1,    // Lu3+
  72:  71,      // Hf4+
  73:  64,      // Ta5+
  74:  60,      // W6+
  75:  63,      // Re4+
  76:  63,      // Os4+
  77:  68,      // Ir3+
  78:  62.5,    // Pt4+
  79: 137,      // Au+
  80: 102,      // Hg2+
  81: 150,      // Tl+
  82: 119,      // Pb2+
  83: 103,      // Bi3+
  84:  97,      // Po4+
  87: 180,      // Fr+ (estimated)
  88: 148,      // Ra2+
  89: 112,      // Ac3+
  90:  94,      // Th4+
  91:  90,      // Pa4+
  92:  89,      // U4+
  93:  87,      // Np4+
  94:  86,      // Pu4+
  95:  97.5,    // Am3+
  96:  97,      // Cm3+
  97:  96,      // Bk3+
  98:  95,      // Cf3+
};

const IONIC_RADIUS_MIN = 1;
const IONIC_RADIUS_MAX = 222; // As3-

// ─── Layer factories ──────────────────────────────────────────────────────────
function makeGradientLayer({ id, label, property, unit, scale, description, format }) {
  const values = elements.map(e => e[property]).filter(v => v !== null && v !== undefined && isFinite(v));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const fmt = format || (v => v?.toFixed(2) ?? '—');

  return {
    id,
    label,
    description,
    type: 'gradient',
    property,
    unit,
    min,
    max,
    format: fmt,
    getColor(element) {
      const val = element[property];
      if (val === null || val === undefined || !isFinite(val)) return '#1e2535';
      return interpolateColor(scale, (val - min) / (max - min));
    },
    getLegendColor(t) {
      return interpolateColor(scale, t);
    },
    getDisplayValue(element) {
      const val = element[property];
      if (val === null || val === undefined || !isFinite(val)) return null;
      return fmt(val);
    },
  };
}

// ─── All layers ───────────────────────────────────────────────────────────────
// Properties: alphabetical, with Category first (default).
// Fun: alphabetical.
export const colorLayers = [
  // ── Properties ──────────────────────────────────────────────────────────────
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
    getDisplayValue(element) {
      return CATEGORY_LABELS[element.category] ?? element.category;
    },
  },
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
    id: 'atomicRadius',
    label: 'Atomic Radius',
    description: 'Van der Waals radius (pm) — Alvarez (2013) Dalton Trans. 42, 8617',
    property: 'atomicRadius',
    unit: 'pm',
    scale: SCALE_COOL_WARM,
    format: v => v != null ? `${v} pm` : '—',
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
    id: 'electronAffinity',
    label: 'Electron Affinity',
    description: 'Electron affinity (eV)',
    property: 'electronAffinity',
    unit: 'eV',
    scale: SCALE_VIVID,
    format: v => v != null ? `${v.toFixed(3)} eV` : '—',
  }),
  {
    id: 'abnormalConfig',
    label: 'Electron Config Anomaly',
    description: 'Elements whose ground-state configuration deviates from Aufbau/Madelung order — grouped by anomaly type',
    type: 'category',
    legendItems: [
      { key: 'd4-to-d5',  label: 'd\u2074\u2192d\u2075 (half-filled d)',  color: PALETTE.yellow  },
      { key: 'd9-to-d10', label: 'd\u2079\u2192d\u00B9\u2070 (full d)',     color: PALETTE.teal    },
      { key: 'd-other',   label: 'Other d anomaly',            color: PALETTE.blue    },
      { key: 'f-anomaly', label: 'f-block anomaly',            color: PALETTE.purple  },
      { key: 'normal',    label: 'Normal (Aufbau)',             color: PALETTE.grey    },
    ],
    getColor(element) {
      const type = ELECTRON_ANOMALIES[element.number] ?? 'normal';
      const colors = {
        'd4-to-d5':  PALETTE.yellow,
        'd9-to-d10': PALETTE.teal,
        'd-other':   PALETTE.blue,
        'f-anomaly': PALETTE.purple,
        'normal':    PALETTE.grey,
      };
      return colors[type];
    },
    getRating(element) {
      return ELECTRON_ANOMALIES[element.number] ?? 'normal';
    },
    getRatingLabel(element) {
      const labels = {
        'd4-to-d5':  'd\u2074\u2192d\u2075 Half-fill',
        'd9-to-d10': 'd\u2079\u2192d\u00B9\u2070 Full-fill',
        'd-other':   'Other d Anomaly',
        'f-anomaly': 'f-block Anomaly',
        'normal':    'Normal (Aufbau)',
      };
      return labels[ELECTRON_ANOMALIES[element.number] ?? 'normal'];
    },
    getRatingDescription(element) {
      const descriptions = {
        'd4-to-d5':  'One s electron promotes to d to achieve the extra stability of a half-filled d\u2075 shell',
        'd9-to-d10': 'One s electron promotes to d to achieve the extra stability of a fully-filled d\u00B9\u2070 shell',
        'd-other':   'Irregular d-orbital occupancy not explained by simple half-fill or full-fill rules',
        'f-anomaly': 'Unexpected mixing of f and d occupancy — common in early lanthanides and actinides due to near-degenerate f/d levels',
        'normal':    'Follows the standard Aufbau / Madelung filling order',
      };
      return descriptions[ELECTRON_ANOMALIES[element.number] ?? 'normal'];
    },
    getDisplayValue(element) {
      const labels = {
        'd4-to-d5':  'd\u2074\u2192d\u2075 Half-fill',
        'd9-to-d10': 'd\u2079\u2192d\u00B9\u2070 Full-fill',
        'd-other':   'Other d Anomaly',
        'f-anomaly': 'f-block Anomaly',
        'normal':    'Normal',
      };
      return labels[ELECTRON_ANOMALIES[element.number] ?? 'normal'];
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
  {
    id: 'ionicRadius',
    label: 'Ionic Radius',
    description: 'Crystal ionic radius (pm) — Shannon (1976). Most common ion; CN=6 where available. Anion radii for non-metals (e.g. O\u00B2\u207B, F\u207B, P\u00B3\u207B, S\u00B2\u207B, Cl\u207B, As\u00B3\u207B, I\u207B).',
    type: 'gradient',
    unit: 'pm',
    min: IONIC_RADIUS_MIN,
    max: IONIC_RADIUS_MAX,
    getColor(element) {
      const v = IONIC_RADIUS[element.number];
      if (v == null) return '#1e2535';
      const t = (v - IONIC_RADIUS_MIN) / (IONIC_RADIUS_MAX - IONIC_RADIUS_MIN);
      return interpolateColor(SCALE_COOL_WARM, Math.max(0, Math.min(1, t)));
    },
    getLegendColor(t) {
      return interpolateColor(SCALE_COOL_WARM, t);
    },
    getDisplayValue(element) {
      const v = IONIC_RADIUS[element.number];
      return v != null ? `${v} pm` : null;
    },
  },
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
    id: 'meltingPoint',
    label: 'Melting Point',
    description: 'Melting point in Kelvin',
    property: 'meltingPoint',
    unit: 'K',
    scale: SCALE_HEAT,
    format: v => v != null ? `${v.toFixed(0)} K` : '—',
  }),

  // ── Fun ─────────────────────────────────────────────────────────────────────
  {
    id: 'lick',
    fun: true,
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
    getDisplayValue(element) {
      return LICK_LABELS[LICK[element.number] ?? 'unknown'];
    },
  },
  {
    id: 'abundance',
    fun: true,
    label: 'Earth Abundance',
    description: 'Atoms per million atoms in bulk Earth — crust, mantle, and core (log scale) — McDonough & Sun (1995)',
    type: 'gradient',
    unit: 'rel. atom count',
    min: 1e-7,
    max: 30000,
    getColor(element) {
      const massPpm = ABUNDANCE_PPM[element.number];
      if (massPpm == null || !element.atomicMass) return '#1e2535';
      const v = massPpm / element.atomicMass;
      const t = (Math.log10(v) - ABUNDANCE_LOG_MIN) / (4.7 - ABUNDANCE_LOG_MIN);
      return interpolateColor(SCALE_COOL_WARM, Math.max(0, Math.min(1, t)));
    },
    getLegendColor(t) {
      return interpolateColor(SCALE_COOL_WARM, t);
    },
    getDisplayValue(element) {
      const massPpm = ABUNDANCE_PPM[element.number];
      if (massPpm == null) return null;
      return massPpm >= 1000
        ? `${(massPpm / 1000).toFixed(1)}k ppm`
        : `${massPpm} ppm`;
    },
  },
  {
    id: 'genchem',
    fun: true,
    label: 'Gen Chem Relevance',
    description: 'How likely is this element to appear in a first-year general chemistry course?',
    type: 'category',
    legendItems: Object.entries(GEN_CHEM_LABELS).map(([key, label]) => ({
      key, label, color: GEN_CHEM_COLORS[key], description: GEN_CHEM_DESCRIPTIONS[key],
    })),
    getColor(element) {
      return GEN_CHEM_COLORS[GEN_CHEM[element.number] ?? 'forget'];
    },
    getRating(element) {
      return GEN_CHEM[element.number] ?? 'forget';
    },
    getRatingLabel(element) {
      return GEN_CHEM_LABELS[GEN_CHEM[element.number] ?? 'forget'];
    },
    getRatingDescription(element) {
      return GEN_CHEM_DESCRIPTIONS[GEN_CHEM[element.number] ?? 'forget'];
    },
    getDisplayValue(element) {
      return GEN_CHEM_LABELS[GEN_CHEM[element.number] ?? 'forget'];
    },
  },
  {
    id: 'boom',
    fun: true,
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
    getDisplayValue(element) {
      return BOOM_LABELS[BOOM[element.number] ?? 'stable'];
    },
  },
  {
    id: 'humanAbundance',
    fun: true,
    label: 'Human Abundance',
    description: 'Average elemental abundance in the adult human body (ppm by mass, log scale). Essential macroelements to ultra-trace — Emsley (2011) & WHO refs.',
    type: 'gradient',
    unit: 'ppm (body mass)',
    min: 0.01,
    max: 650000,
    getColor(element) {
      const ppm = HUMAN_ABUNDANCE_PPM[element.number];
      if (ppm == null) return '#1e2535';
      const t = (Math.log10(ppm) - HUMAN_LOG_MIN) / (HUMAN_LOG_MAX - HUMAN_LOG_MIN);
      return interpolateColor(SCALE_COOL_WARM, Math.max(0, Math.min(1, t)));
    },
    getLegendColor(t) {
      return interpolateColor(SCALE_COOL_WARM, t);
    },
    getDisplayValue(element) {
      const ppm = HUMAN_ABUNDANCE_PPM[element.number];
      if (ppm == null) return null;
      if (ppm >= 10000) return `${(ppm / 10000).toFixed(2)}% body mass`;
      if (ppm >= 1)     return `${ppm} ppm`;
      return `${ppm} ppm (ultra-trace)`;
    },
  },
  {
    id: 'habitat',
    fun: true,
    label: 'Natural Habitat',
    description: 'Where in nature is this element most likely to be found?',
    type: 'category',
    legendItems: Object.entries(HABITAT_LABELS).map(([key, label]) => ({
      key, label, color: HABITAT_COLORS[key], description: HABITAT_DESCRIPTIONS[key],
    })),
    getColor(element) {
      const r = element.number >= 93 ? 'lab' : (HABITAT[element.number] ?? 'rock');
      return HABITAT_COLORS[r];
    },
    getRating(element) {
      return element.number >= 93 ? 'lab' : (HABITAT[element.number] ?? 'rock');
    },
    getRatingLabel(element) {
      const r = element.number >= 93 ? 'lab' : (HABITAT[element.number] ?? 'rock');
      return HABITAT_LABELS[r];
    },
    getRatingDescription(element) {
      const r = element.number >= 93 ? 'lab' : (HABITAT[element.number] ?? 'rock');
      return HABITAT_DESCRIPTIONS[r];
    },
    getDisplayValue(element) {
      const r = element.number >= 93 ? 'lab' : (HABITAT[element.number] ?? 'rock');
      return HABITAT_LABELS[r];
    },
  },
];

export const colorLayerById = Object.fromEntries(colorLayers.map(l => [l.id, l]));
