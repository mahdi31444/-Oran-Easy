import { Route, Stop, LineType } from './types';

// Center of Oran, Algeria
export const ORAN_CENTER = { lat: 35.6971, lng: -0.6308 };

// Expanded Color Palette for many lines
export const COLORS = {
  RED: '#ef4444',
  BLUE: '#3b82f6',
  GREEN: '#10b981',
  PURPLE: '#8b5cf6',
  ORANGE: '#f97316',
  YELLOW: '#eab308',
  TEAL: '#14b8a6',
  INDIGO: '#6366f1',
  PINK: '#ec4899',
  CYAN: '#06b6d4',
  LIME: '#84cc16',
  AMBER: '#d97706',
  SLATE: '#64748b',
  ROSE: '#be123c',
  VIOLET: '#7c3aed'
};

// Helper Coordinates for Oran Landmarks (Approximate for simulation)
const LOCS = {
  MEDINA_JEDIDA: { lat: 35.6918, lng: -0.6416 },
  BAHIA_STATION: { lat: 35.6820, lng: -0.6150 },
  EL_HASSI: { lat: 35.6800, lng: -0.6800 },
  MISSERGHIN: { lat: 35.6200, lng: -0.7300 },
  BELGAID_UNIV: { lat: 35.7280, lng: -0.5520 },
  BELGAID_RES: { lat: 35.7350, lng: -0.5400 }, // 4400/2000 housing
  BIR_EL_DJIR: { lat: 35.7100, lng: -0.5800 },
  HAI_SABAH: { lat: 35.7050, lng: -0.5750 },
  USTO: { lat: 35.6850, lng: -0.6000 },
  ES_SENIA: { lat: 35.6480, lng: -0.6260 },
  HAMRI: { lat: 35.6900, lng: -0.6350 },
  PLACE_1_NOV: { lat: 35.7020, lng: -0.6480 },
  AIN_EL_TURK: { lat: 35.7420, lng: -0.7530 },
  HAI_NEDJMA: { lat: 35.6550, lng: -0.5900 }, // Chteibo
  MARAVAL: { lat: 35.6880, lng: -0.6200 },
  GAMBETTA: { lat: 35.7080, lng: -0.6250 },
  AIN_BEIDA: { lat: 35.6600, lng: -0.6600 },
  EL_KERMA: { lat: 35.6300, lng: -0.6000 },
  SIDI_MAAROUF: { lat: 35.6800, lng: -0.5600 },
};

// Comprehensive Routes List
export const MOCK_ROUTES: Route[] = [
  // --- Urban & Historical Lines ---
  {
    id: 'r_11',
    code: '11',
    name: { ar: 'المدينة الجديدة - حي الصباح', fr: 'Medina Jedida - Hai Sabah', en: 'Medina Jedida - Hai Sabah' },
    color: COLORS.RED,
    type: LineType.URBAN,
    path: [LOCS.PLACE_1_NOV, LOCS.GAMBETTA, LOCS.USTO, LOCS.HAI_SABAH]
  },
  {
    id: 'r_8',
    code: '8',
    name: { ar: 'المدينة الجديدة - الحاسي (عدل)', fr: 'Medina Jedida - El Hassi', en: 'Medina Jedida - El Hassi' },
    color: COLORS.BLUE,
    type: LineType.URBAN,
    path: [LOCS.MEDINA_JEDIDA, LOCS.BAHIA_STATION, LOCS.EL_HASSI]
  },
  {
    id: 'r_38',
    code: '38',
    name: { ar: 'محطة الباهية - مسرغين', fr: 'Gare Bahia - Misserghin', en: 'Bahia Station - Misserghin' },
    color: COLORS.GREEN,
    type: LineType.SUBURBAN,
    path: [LOCS.BAHIA_STATION, { lat: 35.65, lng: -0.68 }, LOCS.MISSERGHIN]
  },
  {
    id: 'r_103',
    code: '103',
    name: { ar: 'محطة الباهية - جامعة بلقايد', fr: 'Gare Bahia - Univ Belgaid', en: 'Bahia Station - Belgaid Univ' },
    color: COLORS.PURPLE,
    type: LineType.SUBURBAN,
    path: [LOCS.BAHIA_STATION, { lat: 35.69, lng: -0.61 }, LOCS.BIR_EL_DJIR, LOCS.BELGAID_UNIV]
  },
  {
    id: 'r_G52',
    code: 'G52',
    name: { ar: 'المدينة الجديدة - محطة الصباح', fr: 'Medina Jedida - Gare Sabah', en: 'Medina Jedida - Sabah Station' },
    color: COLORS.ORANGE,
    type: LineType.URBAN,
    path: [LOCS.MEDINA_JEDIDA, LOCS.BAHIA_STATION, LOCS.USTO, LOCS.HAI_SABAH]
  },
  {
    id: 'r_14',
    code: '14',
    name: { ar: 'دار الحياة - مرسى الكبير', fr: 'Dar El Hayat - Mers El Kebir', en: 'Dar El Hayat - Mers El Kebir' },
    color: COLORS.CYAN,
    type: LineType.SUBURBAN,
    path: [LOCS.PLACE_1_NOV, LOCS.HAMRI, { lat: 35.72, lng: -0.68 }]
  },
  {
    id: 'r_39',
    code: '39',
    name: { ar: 'المدينة الجديدة - حي النجمة', fr: 'Medina Jedida - Chteibo', en: 'Medina Jedida - Nedjma' },
    color: COLORS.YELLOW,
    type: LineType.SUBURBAN,
    path: [LOCS.MEDINA_JEDIDA, { lat: 35.67, lng: -0.61 }, LOCS.HAI_NEDJMA]
  },
  {
    id: 'r_S',
    code: 'S',
    name: { ar: 'دار الحياة - جامعة بلقايد', fr: 'Dar El Hayat - Univ Belgaid', en: 'Dar El Hayat - Belgaid Univ' },
    color: COLORS.TEAL,
    type: LineType.SPECIAL,
    path: [LOCS.PLACE_1_NOV, LOCS.HAMRI, LOCS.BAHIA_STATION, LOCS.BELGAID_UNIV]
  },
  {
    id: 'r_B',
    code: 'B',
    name: { ar: 'حي اللوز - الصديقية', fr: 'Hai Ellouz - Seddikia', en: 'Hai Ellouz - Seddikia' },
    color: COLORS.INDIGO,
    type: LineType.URBAN,
    path: [{ lat: 35.67, lng: -0.64 }, LOCS.MARAVAL, LOCS.PLACE_1_NOV, { lat: 35.71, lng: -0.61 }]
  },
  {
    id: 'r_U',
    code: 'U',
    name: { ar: 'السانية - دار الحياة', fr: 'Es Senia - Dar El Hayat', en: 'Es Senia - Dar El Hayat' },
    color: COLORS.PINK,
    type: LineType.URBAN,
    path: [LOCS.ES_SENIA, LOCS.MARAVAL, LOCS.PLACE_1_NOV]
  },
  
  // --- ETO & New Poles ---
  {
    id: 'r_53',
    code: '53',
    name: { ar: 'بلقايد - المدينة الجديدة', fr: 'Belgaid - Medina Jedida', en: 'Belgaid - Medina Jedida' },
    color: COLORS.LIME,
    type: LineType.SUBURBAN,
    path: [LOCS.BELGAID_RES, LOCS.BIR_EL_DJIR, LOCS.GAMBETTA, LOCS.MEDINA_JEDIDA]
  },
  {
    id: 'r_54',
    code: '54',
    name: { ar: 'بلقايد (2000) - الحمري', fr: 'Belgaid (2000) - Hamri', en: 'Belgaid (2000) - Hamri' },
    color: COLORS.AMBER,
    type: LineType.SUBURBAN,
    path: [LOCS.BELGAID_RES, { lat: 35.71, lng: -0.59 }, LOCS.HAMRI]
  },
  {
    id: 'r_P',
    code: 'P',
    name: { ar: 'ثانوية لطفي - جامعة بلقايد', fr: 'Lycée Lotfi - Univ Belgaid', en: 'Lotfi HS - Belgaid Univ' },
    color: COLORS.VIOLET,
    type: LineType.URBAN,
    path: [{ lat: 35.71, lng: -0.63 }, LOCS.GAMBETTA, LOCS.BELGAID_UNIV]
  },
  {
    id: 'r_102',
    code: '102',
    name: { ar: 'دار الحياة - حي النور', fr: 'Dar El Hayat - Hai Nour', en: 'Dar El Hayat - Hai Nour' },
    color: COLORS.ROSE,
    type: LineType.URBAN,
    path: [LOCS.PLACE_1_NOV, LOCS.HAMRI, LOCS.USTO, LOCS.HAI_SABAH]
  },
  {
    id: 'r_23',
    code: '23 ETO',
    name: { ar: 'ساحة أول نوفمبر - الباهية', fr: 'Place 1 Nov - Bahia', en: 'Place 1 Nov - Bahia' },
    color: COLORS.SLATE,
    type: LineType.URBAN,
    path: [LOCS.PLACE_1_NOV, LOCS.MEDINA_JEDIDA, LOCS.HAMRI, LOCS.BAHIA_STATION]
  },
  {
    id: 'r_10',
    code: '10',
    name: { ar: 'الحمري - الأندلسيات', fr: 'Hamri - Andalouses', en: 'Hamri - Andalouses' },
    color: COLORS.CYAN,
    type: LineType.SPECIAL,
    path: [LOCS.HAMRI, LOCS.PLACE_1_NOV, LOCS.AIN_EL_TURK]
  },
  
  // --- Suburban & Connecting ---
  {
    id: 'r_16',
    code: '16',
    name: { ar: 'عين البيضاء - محطة القطار', fr: 'Ain Beida - Gare Train', en: 'Ain Beida - Train Station' },
    color: COLORS.AMBER,
    type: LineType.SUBURBAN,
    path: [LOCS.AIN_BEIDA, { lat: 35.68, lng: -0.63 }, LOCS.PLACE_1_NOV]
  },
  {
    id: 'r_50_52',
    code: '50/52',
    name: { ar: 'حياة ريجنسي - المدينة الجديدة', fr: 'Hyatt Regency - M. Jedida', en: 'Hyatt Regency - M. Jedida' },
    color: COLORS.TEAL,
    type: LineType.SPECIAL,
    path: [{ lat: 35.62, lng: -0.58 }, LOCS.MEDINA_JEDIDA]
  },
  {
    id: 'r_69',
    code: '69',
    name: { ar: 'البرية - الحمري', fr: 'El Braya - Hamri', en: 'El Braya - Hamri' },
    color: COLORS.GREEN,
    type: LineType.SUBURBAN,
    path: [{ lat: 35.60, lng: -0.55 }, LOCS.HAI_NEDJMA, LOCS.HAMRI]
  },
  {
    id: 'r_34',
    code: '34',
    name: { ar: 'بلقايد - وسط المدينة', fr: 'Belgaid - Centre Ville', en: 'Belgaid - City Center' },
    color: COLORS.RED,
    type: LineType.SUBURBAN,
    path: [LOCS.BELGAID_UNIV, LOCS.BIR_EL_DJIR, LOCS.PLACE_1_NOV]
  },
  {
    id: 'r_79',
    code: '79',
    name: { ar: 'واد تليلات - المدينة الجديدة', fr: 'Oued Tlelat - M. Jedida', en: 'Oued Tlelat - M. Jedida' },
    color: COLORS.BLUE,
    type: LineType.SUBURBAN,
    path: [{ lat: 35.55, lng: -0.45 }, LOCS.EL_KERMA, LOCS.BAHIA_STATION, LOCS.MEDINA_JEDIDA]
  },
  
  // --- Special & Private Lines ---
  {
    id: 'r_G1',
    code: 'G1',
    name: { ar: 'بلقايد - محطة الباهية', fr: 'Belgaid - Gare Bahia', en: 'Belgaid - Bahia Station' },
    color: COLORS.PURPLE,
    type: LineType.SPECIAL,
    path: [LOCS.BELGAID_RES, LOCS.HAI_SABAH, LOCS.BAHIA_STATION]
  },
  {
    id: 'r_H',
    code: 'H',
    name: { ar: 'الروشي - كناستال', fr: 'Rocher - Canastel', en: 'Rocher - Canastel' },
    color: COLORS.ORANGE,
    type: LineType.URBAN,
    path: [{ lat: 35.69, lng: -0.65 }, LOCS.MARAVAL, LOCS.BAHIA_STATION, { lat: 35.73, lng: -0.59 }]
  },
  {
    id: 'r_4G',
    code: '4G',
    name: { ar: 'يغمراسن - إيسطو', fr: 'Yaghmoracen - USTO', en: 'Yaghmoracen - USTO' },
    color: COLORS.LIME,
    type: LineType.URBAN,
    path: [{ lat: 35.67, lng: -0.66 }, LOCS.MEDINA_JEDIDA, LOCS.USTO]
  },
  {
    id: 'r_90',
    code: '90',
    name: { ar: 'حي الصباح - بوفاطيس', fr: 'Hai Sabah - Boufatis', en: 'Hai Sabah - Boufatis' },
    color: COLORS.VIOLET,
    type: LineType.SUBURBAN,
    path: [LOCS.HAI_SABAH, LOCS.SIDI_MAAROUF, { lat: 35.68, lng: -0.50 }] // Approx Boufatis direction
  },
  {
    id: 'r_03',
    code: '03',
    name: { ar: 'بلاطو - كارة (السانية)', fr: 'Plateau - Kara (Es Senia)', en: 'Plateau - Kara (Es Senia)' },
    color: COLORS.SLATE,
    type: LineType.URBAN,
    path: [{ lat: 35.69, lng: -0.63 }, LOCS.HAMRI, LOCS.ES_SENIA]
  }
];

// Major Hubs as Stops
export const MOCK_STOPS: Stop[] = [
  { 
    id: 's_bahia', 
    name: { ar: 'المحطة البرية الباهية', fr: 'Gare Routière Bahia', en: 'Bahia Bus Station' },
    location: LOCS.BAHIA_STATION, 
    routeIds: ['r_8', 'r_38', 'r_103', 'r_G52', 'r_S', 'r_23', 'r_G1', 'r_H', 'r_79'] 
  },
  { 
    id: 's_medina', 
    name: { ar: 'المدينة الجديدة', fr: 'Medina Jedida', en: 'Medina Jedida' },
    location: LOCS.MEDINA_JEDIDA, 
    routeIds: ['r_11', 'r_8', 'r_G52', 'r_39', 'r_23', 'r_53', 'r_50_52', 'r_79', 'r_4G'] 
  },
  { 
    id: 's_belgaid_u', 
    name: { ar: 'جامعة بلقايد', fr: 'Université Belgaid', en: 'Belgaid University' },
    location: LOCS.BELGAID_UNIV, 
    routeIds: ['r_103', 'r_S', 'r_P', 'r_34'] 
  },
  { 
    id: 's_belgaid_r', 
    name: { ar: 'بلقايد (4400/2000)', fr: 'Belgaid Résidence', en: 'Belgaid Residence' },
    location: LOCS.BELGAID_RES, 
    routeIds: ['r_53', 'r_54', 'r_G1'] 
  },
  { 
    id: 's_usto', 
    name: { ar: 'جامعة إيسطو', fr: 'Université USTO', en: 'USTO University' },
    location: LOCS.USTO, 
    routeIds: ['r_11', 'r_G52', 'r_102', 'r_4G'] 
  },
  { 
    id: 's_sabah', 
    name: { ar: 'محطة حي الصباح', fr: 'Station Hai Sabah', en: 'Hai Sabah Station' },
    location: LOCS.HAI_SABAH, 
    routeIds: ['r_11', 'r_G52', 'r_102', 'r_G1', 'r_90'] 
  },
  { 
    id: 's_hamri', 
    name: { ar: 'الحمري', fr: 'El Hamri', en: 'El Hamri' },
    location: LOCS.HAMRI, 
    routeIds: ['r_14', 'r_S', 'r_54', 'r_102', 'r_23', 'r_10', 'r_69', 'r_03'] 
  },
  { 
    id: 's_es_senia', 
    name: { ar: 'السانية', fr: 'Es Senia', en: 'Es Senia' },
    location: LOCS.ES_SENIA, 
    routeIds: ['r_U', 'r_03'] 
  },
  { 
    id: 's_place_1', 
    name: { ar: 'ساحة 1 نوفمبر', fr: 'Place 1er Novembre', en: 'Place 1st November' },
    location: LOCS.PLACE_1_NOV, 
    routeIds: ['r_11', 'r_14', 'r_S', 'r_B', 'r_U', 'r_23', 'r_10', 'r_34'] 
  },
];