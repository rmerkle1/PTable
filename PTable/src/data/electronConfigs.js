// Electron configurations for all 118 elements.
// Uses noble-gas shorthand notation with Unicode superscripts.
// Anomalous configurations (deviating from Aufbau/Madelung order) are noted.

export const ELECTRON_CONFIGS = {
  1:   '1s\u00B9',
  2:   '1s\u00B2',
  3:   '[He] 2s\u00B9',
  4:   '[He] 2s\u00B2',
  5:   '[He] 2s\u00B2 2p\u00B9',
  6:   '[He] 2s\u00B2 2p\u00B2',
  7:   '[He] 2s\u00B2 2p\u00B3',
  8:   '[He] 2s\u00B2 2p\u2074',
  9:   '[He] 2s\u00B2 2p\u2075',
  10:  '[He] 2s\u00B2 2p\u2076',
  11:  '[Ne] 3s\u00B9',
  12:  '[Ne] 3s\u00B2',
  13:  '[Ne] 3s\u00B2 3p\u00B9',
  14:  '[Ne] 3s\u00B2 3p\u00B2',
  15:  '[Ne] 3s\u00B2 3p\u00B3',
  16:  '[Ne] 3s\u00B2 3p\u2074',
  17:  '[Ne] 3s\u00B2 3p\u2075',
  18:  '[Ne] 3s\u00B2 3p\u2076',
  19:  '[Ar] 4s\u00B9',
  20:  '[Ar] 4s\u00B2',
  21:  '[Ar] 3d\u00B9 4s\u00B2',
  22:  '[Ar] 3d\u00B2 4s\u00B2',
  23:  '[Ar] 3d\u00B3 4s\u00B2',
  24:  '[Ar] 3d\u2075 4s\u00B9',   // anomalous: d\u2074\u2192d\u2075 half-fill
  25:  '[Ar] 3d\u2075 4s\u00B2',
  26:  '[Ar] 3d\u2076 4s\u00B2',
  27:  '[Ar] 3d\u2077 4s\u00B2',
  28:  '[Ar] 3d\u2078 4s\u00B2',
  29:  '[Ar] 3d\u00B9\u2070 4s\u00B9',  // anomalous: d\u2079\u2192d\u00B9\u2070 full-fill
  30:  '[Ar] 3d\u00B9\u2070 4s\u00B2',
  31:  '[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u00B9',
  32:  '[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u00B2',
  33:  '[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u00B3',
  34:  '[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u2074',
  35:  '[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u2075',
  36:  '[Ar] 3d\u00B9\u2070 4s\u00B2 4p\u2076',
  37:  '[Kr] 5s\u00B9',
  38:  '[Kr] 5s\u00B2',
  39:  '[Kr] 4d\u00B9 5s\u00B2',
  40:  '[Kr] 4d\u00B2 5s\u00B2',
  41:  '[Kr] 4d\u2074 5s\u00B9',   // anomalous: d\u00B3\u2192d\u2074
  42:  '[Kr] 4d\u2075 5s\u00B9',   // anomalous: d\u2074\u2192d\u2075 half-fill
  43:  '[Kr] 4d\u2075 5s\u00B2',
  44:  '[Kr] 4d\u2077 5s\u00B9',   // anomalous: d\u2076\u2192d\u2077
  45:  '[Kr] 4d\u2078 5s\u00B9',   // anomalous: d\u2077\u2192d\u2078
  46:  '[Kr] 4d\u00B9\u2070',       // anomalous: no s electrons at all
  47:  '[Kr] 4d\u00B9\u2070 5s\u00B9',  // anomalous: d\u2079\u2192d\u00B9\u2070 full-fill
  48:  '[Kr] 4d\u00B9\u2070 5s\u00B2',
  49:  '[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u00B9',
  50:  '[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u00B2',
  51:  '[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u00B3',
  52:  '[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u2074',
  53:  '[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u2075',
  54:  '[Kr] 4d\u00B9\u2070 5s\u00B2 5p\u2076',
  55:  '[Xe] 6s\u00B9',
  56:  '[Xe] 6s\u00B2',
  57:  '[Xe] 5d\u00B9 6s\u00B2',       // anomalous: 4f\u00B9\u2192 5d\u00B9
  58:  '[Xe] 4f\u00B9 5d\u00B9 6s\u00B2',  // anomalous: 4f\u00B2\u2192 4f\u00B9 5d\u00B9
  59:  '[Xe] 4f\u00B3 6s\u00B2',
  60:  '[Xe] 4f\u2074 6s\u00B2',
  61:  '[Xe] 4f\u2075 6s\u00B2',
  62:  '[Xe] 4f\u2076 6s\u00B2',
  63:  '[Xe] 4f\u2077 6s\u00B2',
  64:  '[Xe] 4f\u2077 5d\u00B9 6s\u00B2',  // anomalous: 4f\u2078\u2192 4f\u2077 5d\u00B9 half-fill
  65:  '[Xe] 4f\u2079 6s\u00B2',
  66:  '[Xe] 4f\u00B9\u2070 6s\u00B2',
  67:  '[Xe] 4f\u00B9\u00B9 6s\u00B2',
  68:  '[Xe] 4f\u00B9\u00B2 6s\u00B2',
  69:  '[Xe] 4f\u00B9\u00B3 6s\u00B2',
  70:  '[Xe] 4f\u00B9\u2074 6s\u00B2',
  71:  '[Xe] 4f\u00B9\u2074 5d\u00B9 6s\u00B2',
  72:  '[Xe] 4f\u00B9\u2074 5d\u00B2 6s\u00B2',
  73:  '[Xe] 4f\u00B9\u2074 5d\u00B3 6s\u00B2',
  74:  '[Xe] 4f\u00B9\u2074 5d\u2074 6s\u00B2',
  75:  '[Xe] 4f\u00B9\u2074 5d\u2075 6s\u00B2',
  76:  '[Xe] 4f\u00B9\u2074 5d\u2076 6s\u00B2',
  77:  '[Xe] 4f\u00B9\u2074 5d\u2077 6s\u00B2',
  78:  '[Xe] 4f\u00B9\u2074 5d\u2079 6s\u00B9',  // anomalous: 5d\u2078\u2192 5d\u2079
  79:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B9',  // anomalous: d\u2079\u2192d\u00B9\u2070 full-fill
  80:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2',
  81:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u00B9',
  82:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u00B2',
  83:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u00B3',
  84:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u2074',
  85:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u2075',
  86:  '[Xe] 4f\u00B9\u2074 5d\u00B9\u2070 6s\u00B2 6p\u2076',
  87:  '[Rn] 7s\u00B9',
  88:  '[Rn] 7s\u00B2',
  89:  '[Rn] 6d\u00B9 7s\u00B2',       // anomalous: 5f\u00B9\u2192 6d\u00B9
  90:  '[Rn] 6d\u00B2 7s\u00B2',       // anomalous: 5f\u00B2\u2192 6d\u00B2
  91:  '[Rn] 5f\u00B2 6d\u00B9 7s\u00B2',  // anomalous: 5f\u00B3\u2192 5f\u00B2 6d\u00B9
  92:  '[Rn] 5f\u00B3 6d\u00B9 7s\u00B2',  // anomalous: 5f\u2074\u2192 5f\u00B3 6d\u00B9
  93:  '[Rn] 5f\u2074 6d\u00B9 7s\u00B2',  // anomalous: 5f\u2075\u2192 5f\u2074 6d\u00B9
  94:  '[Rn] 5f\u2076 7s\u00B2',
  95:  '[Rn] 5f\u2077 7s\u00B2',
  96:  '[Rn] 5f\u2077 6d\u00B9 7s\u00B2',  // anomalous: 5f\u2078\u2192 5f\u2077 6d\u00B9 half-fill
  97:  '[Rn] 5f\u2079 7s\u00B2',
  98:  '[Rn] 5f\u00B9\u2070 7s\u00B2',
  99:  '[Rn] 5f\u00B9\u00B9 7s\u00B2',
  100: '[Rn] 5f\u00B9\u00B2 7s\u00B2',
  101: '[Rn] 5f\u00B9\u00B3 7s\u00B2',
  102: '[Rn] 5f\u00B9\u2074 7s\u00B2',
  103: '[Rn] 5f\u00B9\u2074 7s\u00B2 7p\u00B9',  // anomalous: 7p\u00B9 instead of 6d\u00B9
  104: '[Rn] 5f\u00B9\u2074 6d\u00B2 7s\u00B2',
  105: '[Rn] 5f\u00B9\u2074 6d\u00B3 7s\u00B2',
  106: '[Rn] 5f\u00B9\u2074 6d\u2074 7s\u00B2',
  107: '[Rn] 5f\u00B9\u2074 6d\u2075 7s\u00B2',
  108: '[Rn] 5f\u00B9\u2074 6d\u2076 7s\u00B2',
  109: '[Rn] 5f\u00B9\u2074 6d\u2077 7s\u00B2',
  110: '[Rn] 5f\u00B9\u2074 6d\u2078 7s\u00B2',
  111: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B9',  // predicted anomalous (like Au)
  112: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2',
  113: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2 7p\u00B9',
  114: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2 7p\u00B2',
  115: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2 7p\u00B3',
  116: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2 7p\u2074',
  117: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2 7p\u2075',
  118: '[Rn] 5f\u00B9\u2074 6d\u00B9\u2070 7s\u00B2 7p\u2076',
};

// Anomaly type for elements with non-Aufbau configurations.
// Used by the abnormal electron configuration color layer.
// 'd4-to-d5': s electron promotes to achieve half-filled d shell
// 'd9-to-d10': s electron promotes to achieve fully-filled d shell
// 'd-other': other d-block irregularities
// 'f-anomaly': unexpected f/d mixing in lanthanide/actinide series
export const ELECTRON_ANOMALIES = {
  24:  'd4-to-d5',  // Cr: expected 3d\u2074 4s\u00B2, actual 3d\u2075 4s\u00B9
  29:  'd9-to-d10', // Cu: expected 3d\u2079 4s\u00B2, actual 3d\u00B9\u2070 4s\u00B9
  41:  'd-other',   // Nb: expected 4d\u00B3 5s\u00B2, actual 4d\u2074 5s\u00B9
  42:  'd4-to-d5',  // Mo: expected 4d\u2074 5s\u00B2, actual 4d\u2075 5s\u00B9
  44:  'd-other',   // Ru: expected 4d\u2076 5s\u00B2, actual 4d\u2077 5s\u00B9
  45:  'd-other',   // Rh: expected 4d\u2077 5s\u00B2, actual 4d\u2078 5s\u00B9
  46:  'd-other',   // Pd: expected 4d\u2078 5s\u00B2, actual 4d\u00B9\u2070 (no s electrons!)
  47:  'd9-to-d10', // Ag: expected 4d\u2079 5s\u00B2, actual 4d\u00B9\u2070 5s\u00B9
  57:  'f-anomaly', // La: expected 4f\u00B9 6s\u00B2, actual 5d\u00B9 6s\u00B2
  58:  'f-anomaly', // Ce: expected 4f\u00B2 6s\u00B2, actual 4f\u00B9 5d\u00B9 6s\u00B2
  64:  'f-anomaly', // Gd: expected 4f\u2078 6s\u00B2, actual 4f\u2077 5d\u00B9 6s\u00B2 (half-filled f)
  78:  'd-other',   // Pt: expected 5d\u2078 6s\u00B2, actual 5d\u2079 6s\u00B9
  79:  'd9-to-d10', // Au: expected 5d\u2079 6s\u00B2, actual 5d\u00B9\u2070 6s\u00B9
  89:  'f-anomaly', // Ac: expected 5f\u00B9 7s\u00B2, actual 6d\u00B9 7s\u00B2
  90:  'f-anomaly', // Th: expected 5f\u00B2 7s\u00B2, actual 6d\u00B2 7s\u00B2
  91:  'f-anomaly', // Pa: expected 5f\u00B3 7s\u00B2, actual 5f\u00B2 6d\u00B9 7s\u00B2
  92:  'f-anomaly', // U:  expected 5f\u2074 7s\u00B2, actual 5f\u00B3 6d\u00B9 7s\u00B2
  93:  'f-anomaly', // Np: expected 5f\u2075 7s\u00B2, actual 5f\u2074 6d\u00B9 7s\u00B2
  96:  'f-anomaly', // Cm: expected 5f\u2078 7s\u00B2, actual 5f\u2077 6d\u00B9 7s\u00B2 (half-filled f)
  103: 'f-anomaly', // Lr: expected 6d\u00B9 7s\u00B2, actual 7p\u00B9 7s\u00B2
};
