// Build Yardage Material Calculation Engine
import { 
  DRYWALL_CONSTANTS, 
  FRAMING_CONSTANTS, 
  REBAR_CONSTANTS, 
  CONCRETE_CONSTANTS, 
  GRAVEL_CONSTANTS 
} from './constants';

export interface ConcreteSlabResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags80lb: number;
  bags60lb: number;
  bags40lb: number;
  rawVolumeNoWaste: number; // in cu ft
  estimatedCost?: number;
}

export interface ConcreteColumnResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags80lb: number;
  bags60lb: number;
  bags40lb: number;
  rawVolumeNoWaste: number; // in cu ft
  estimatedCost?: number;
}

export interface GravelResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  tons: number;
  rawVolumeNoWaste: number; // in cu ft
  estimatedCost?: number;
}

export interface DrywallResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  sheetsNeeded: number;
  tapeFeet: number;
  screwsNeeded: number;
  compoundLbs: number;
  estimatedCost?: number;
}

export interface FramingResult {
  studsCount: number;
  bottomPlates16ft: number;
  topPlates16ft: number;
  totalPlatesLinearFt: number;
  platesTotalLength?: number;
  headersLinearFt?: number;
  estimatedCost?: number;
}

export interface RebarResult {
  gridLength: number;
  gridWidth: number;
  totalLength: number;
  totalPieces: number;
  estimatedWeightLbs: number;
  estimatedWeightKgs: number;
  lapSpliceInches: number;
  lapSpliceCm: number;
  estimatedCost?: number;
}

// Unit weights and diameter for standard rebar sizes (#3 to #8)
export const REBAR_SIZES: Record<string, { name: string, diameterInches: number, weightLbsPerFt: number, weightKgsPerM: number }> = {
  '#3': { name: '#3 (3/8" or 9.5mm)', diameterInches: 0.375, weightLbsPerFt: 0.376, weightKgsPerM: 0.560 },
  '#4': { name: '#4 (1/2" or 12.7mm)', diameterInches: 0.500, weightLbsPerFt: 0.668, weightKgsPerM: 0.994 },
  '#5': { name: '#5 (5/8" or 15.9mm)', diameterInches: 0.625, weightLbsPerFt: 1.043, weightKgsPerM: 1.552 },
  '#6': { name: '#6 (3/4" or 19.1mm)', diameterInches: 0.750, weightLbsPerFt: 1.502, weightKgsPerM: 2.235 },
  '#7': { name: '#7 (7/8" or 22.2mm)', diameterInches: 0.875, weightLbsPerFt: 2.044, weightKgsPerM: 3.042 },
  '#8': { name: '#8 (1" or 25.4mm)', diameterInches: 1.000, weightLbsPerFt: 2.670, weightKgsPerM: 3.973 }
};

/**
 * Calculates concrete needed for a rectangular slab
 * @param length Length (ft or m)
 * @param width Width (ft or m)
 * @param thickness Thickness (inches or cm)
 * @param wastePercent Waste percentage (e.g. 10)
 * @param isMetric True if inputs are in meters/cm, false if feet/inches
 */
export function calculateConcreteSlab(
  length: number,
  width: number,
  thickness: number,
  wastePercent: number,
  isMetric: boolean
): ConcreteSlabResult {
  let lFt = length;
  let wFt = width;
  let tIn = thickness;

  if (isMetric) {
    lFt = length / 0.3048;
    wFt = width / 0.3048;
    tIn = thickness / 2.54;
  }

  const rawVolumeNoWaste = lFt * wFt * (tIn / 12);
  const cubicFeet = rawVolumeNoWaste * (1 + wastePercent / 100);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet * 0.028316846592;

  return {
    cubicFeet,
    cubicYards,
    cubicMeters,
    bags80lb: Math.ceil(cubicFeet / CONCRETE_CONSTANTS.BAG_YIELD_80LB_CUFT),
    bags60lb: Math.ceil(cubicFeet / CONCRETE_CONSTANTS.BAG_YIELD_60LB_CUFT),
    bags40lb: Math.ceil(cubicFeet / CONCRETE_CONSTANTS.BAG_YIELD_40LB_CUFT),
    rawVolumeNoWaste,
  };
}

/**
 * Calculates concrete needed for a cylindrical column / post hole
 * @param diameter Diameter (inches or cm)
 * @param height Height (ft or m)
 * @param wastePercent Waste percentage (e.g. 5)
 * @param isMetric True if diameter in cm and height in m
 */
export function calculateConcreteColumn(
  diameter: number,
  height: number,
  wastePercent: number,
  isMetric: boolean
): ConcreteColumnResult {
  let rFt = 0;
  let hFt = 0;

  if (isMetric) {
    const dIn = diameter / 2.54;
    rFt = (dIn / 2) / 12;
    hFt = height / 0.3048;
  } else {
    rFt = diameter / 24; // D / 2 / 12
    hFt = height;
  }

  const rawVolumeNoWaste = Math.PI * Math.pow(rFt, 2) * hFt;
  const cubicFeet = rawVolumeNoWaste * (1 + wastePercent / 100);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet * 0.028316846592;

  return {
    cubicFeet,
    cubicYards,
    cubicMeters,
    bags80lb: Math.ceil(cubicFeet / CONCRETE_CONSTANTS.BAG_YIELD_80LB_CUFT),
    bags60lb: Math.ceil(cubicFeet / CONCRETE_CONSTANTS.BAG_YIELD_60LB_CUFT),
    bags40lb: Math.ceil(cubicFeet / CONCRETE_CONSTANTS.BAG_YIELD_40LB_CUFT),
    rawVolumeNoWaste,
  };
}

/**
 * Calculates gravel base tonnage and volume
 * @param length Length (ft or m)
 * @param width Width (ft or m)
 * @param depth Depth/Thickness (inches or cm)
 * @param wastePercent Waste percentage (e.g. 10)
 * @param densityTonsPerYd Density multiplier (standard is 1.4 tons/yd)
 * @param isMetric True if inputs are in meters/cm, false if feet/inches
 */
export function calculateGravel(
  length: number,
  width: number,
  depth: number,
  wastePercent: number,
  densityTonsPerYd: number = GRAVEL_CONSTANTS.DEFAULT_DENSITY_TONS_PER_CUYD,
  isMetric: boolean = false
): GravelResult {
  let lFt = length;
  let wFt = width;
  let dIn = depth;

  if (isMetric) {
    lFt = length / 0.3048;
    wFt = width / 0.3048;
    dIn = depth / 2.54;
  }

  const rawVolumeNoWaste = lFt * wFt * (dIn / 12);
  const cubicFeet = rawVolumeNoWaste * (1 + wastePercent / 100);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet * 0.028316846592;
  const tons = cubicYards * densityTonsPerYd;

  return {
    cubicFeet,
    cubicYards,
    cubicMeters,
    tons,
    rawVolumeNoWaste,
  };
}

/**
 * Calculates drywall sheets and supplies needed for a room/wall
 * @param length Room/Wall Length (ft or m)
 * @param width Room Width (ft or m, optional - 0 if single wall)
 * @param height Wall Height (ft or m)
 * @param includeCeiling True to include ceiling in calculations
 * @param sheetSize Size of drywall sheets ('4x8' or '4x12')
 * @param wastePercent Waste percentage (e.g. 10)
 * @param isMetric True if inputs are in meters, false if feet
 */
export function calculateDrywall(
  length: number,
  width: number,
  height: number,
  includeCeiling: boolean,
  sheetSize: '4x8' | '4x12',
  wastePercent: number,
  isMetric: boolean
): DrywallResult {
  let lFt = length;
  let wFt = width;
  let hFt = height;

  if (isMetric) {
    lFt = length / 0.3048;
    wFt = width / 0.3048;
    hFt = height / 0.3048;
  }

  // Calculate wall area
  let wallAreaSqFt = 0;
  if (wFt > 0) {
    wallAreaSqFt = 2 * (lFt + wFt) * hFt;
  } else {
    wallAreaSqFt = lFt * hFt;
  }

  // Calculate ceiling area
  const ceilingAreaSqFt = (includeCeiling && wFt > 0) ? (lFt * wFt) : 0;
  const totalAreaSqFt = wallAreaSqFt + ceilingAreaSqFt;
  const totalAreaSqM = totalAreaSqFt * 0.09290304;

  // Drywall sheets calculation
  const sheetAreaSqFt = sheetSize === '4x8' ? 32 : 48;
  const rawSheets = totalAreaSqFt / sheetAreaSqFt;
  const sheetsNeeded = Math.ceil(rawSheets * (1 + wastePercent / 100));

  // Screws, Tape, Mud calculations using single source of truth constants
  // 32 ft of tape per 4x8 sheet (1 ft tape / sq ft)
  const tapeFeet = Math.ceil(sheetsNeeded * DRYWALL_CONSTANTS.TAPE_FEET_PER_4X8_SHEET);
  // 32 screws per 4x8 sheet (1 screw / sq ft for 16" O.C. studs)
  const screwsNeeded = Math.ceil(sheetsNeeded * DRYWALL_CONSTANTS.SCREWS_PER_4X8_SHEET);
  // 0.05 lbs of joint compound per sq ft (Level 4 drywall finish standard)
  const compoundLbs = parseFloat((totalAreaSqFt * DRYWALL_CONSTANTS.MUD_LBS_PER_SQFT).toFixed(1));

  return {
    totalAreaSqFt,
    totalAreaSqM,
    sheetsNeeded,
    tapeFeet,
    screwsNeeded,
    compoundLbs,
  };
}

/**
 * Calculates wood studs and plate count for a framed wall
 * @param length Wall length (ft or m)
 * @param studSpacing Spacing on center (16 inches or 24 inches)
 * @param cornersCount Number of corners or wall intersections (standard: 2 for simple wall)
 * @param topPlatesCount Number of top plates (typically 2 for double plate)
 * @param bottomPlatesCount Number of bottom plates (typically 1)
 * @param wastePercent Waste percentage (e.g. 10)
 * @param isMetric True if wall length is in meters
 */
export function calculateFraming(
  length: number,
  studSpacing: number,
  cornersCount: number = 2,
  topPlatesCount: number = 2,
  bottomPlatesCount: number = 1,
  wastePercent: number = 10,
  isMetric: boolean = false,
  cornerType: '3-stud' | '2-stud' = '3-stud',
  doorCount: number = 0,
  doorWidthInches: number = 36,
  windowCount: number = 0,
  windowWidthInches: number = 48
): FramingResult {
  let lFt = length;

  if (isMetric) {
    lFt = length / 0.3048;
  }

  // Stud spacing in feet
  const spacingFt = studSpacing / 12;

  // Basic studs = (Length / spacing) + 1 stud at end
  const basicStuds = Math.ceil(lFt / spacingFt) + 1;

  // Add studs for corners
  const studsPerCorner = cornerType === '3-stud' ? 3 : 2;
  const cornerStuds = cornersCount * studsPerCorner;

  // Calculate openings (Kings, Jacks, and interrupted field studs)
  let openingKingAndJackStuds = 0;
  let interruptedFieldStuds = 0;
  let headersLinearFt = 0;

  if (doorCount > 0) {
    openingKingAndJackStuds += doorCount * 4; // 2 kings, 2 jacks per door
    interruptedFieldStuds += doorCount * Math.floor(doorWidthInches / studSpacing);
    headersLinearFt += doorCount * ((doorWidthInches + 3) / 12); // Header spans opening + jack thickness (approx 3")
  }

  if (windowCount > 0) {
    openingKingAndJackStuds += windowCount * 4; // 2 kings, 2 jacks per window
    interruptedFieldStuds += windowCount * Math.floor(windowWidthInches / studSpacing);
    headersLinearFt += windowCount * ((windowWidthInches + 3) / 12);
  }

  // Subtotal studs: basic + corners + kings/jacks - interrupted
  const subtotalStuds = Math.max(basicStuds + cornerStuds + openingKingAndJackStuds - interruptedFieldStuds, 2);

  // Total studs with waste factor
  const studsCount = Math.ceil(subtotalStuds * (1 + wastePercent / 100));

  // Plates calculations
  const bottomPlatesLinear = lFt * bottomPlatesCount;
  const topPlatesLinear = lFt * topPlatesCount;
  const totalPlatesLinearFt = bottomPlatesLinear + topPlatesLinear;

  // Standard plate lumber length is 16 ft
  const bottomPlates16ft = Math.ceil(bottomPlatesLinear / FRAMING_CONSTANTS.STOCK_LUMBER_LENGTH_FT);
  const topPlates16ft = Math.ceil(topPlatesLinear / FRAMING_CONSTANTS.STOCK_LUMBER_LENGTH_FT);

  return {
    studsCount,
    bottomPlates16ft,
    topPlates16ft,
    totalPlatesLinearFt,
    platesTotalLength: totalPlatesLinearFt,
    headersLinearFt: parseFloat(headersLinearFt.toFixed(1)),
  };
}

/**
 * Calculates rebar grid dimensions, total length, pieces, and weight
 * @param length Slab length (ft or m)
 * @param width Slab width (ft or m)
 * @param edgeClearance Edge clearance (inches or cm)
 * @param spacing Rebar grid spacing (inches or cm)
 * @param stickLength Rebar stick length (ft or m, e.g. 20ft or 6m)
 * @param overlap Overlap / lap splice length (inches or cm)
 * @param wastePercent Waste percentage buffer (e.g. 10)
 * @param rebarSize Selected rebar size (e.g. '#4')
 * @param isMetric True if inputs are in metric, false if imperial
 */
export function calculateRebar(
  length: number,
  width: number,
  edgeClearance: number,
  spacing: number,
  stickLength: number = REBAR_CONSTANTS.STOCK_BAR_LENGTH_FT,
  overlap: number = 0,
  wastePercent: number = 10,
  rebarSize: string = '#4',
  isMetric: boolean = false
): RebarResult {
  const barWeightInfo = REBAR_SIZES[rebarSize] || REBAR_SIZES['#4'];

  // Calculate 40d lap splice overlap dynamically based on bar diameter (40 * bar diameter)
  const lapSpliceInches = barWeightInfo.diameterInches * REBAR_CONSTANTS.LAP_SPLICE_MULTIPLIER;
  const lapSpliceCm = parseFloat((lapSpliceInches * 2.54).toFixed(1));

  // Determine effective lap splice overlap
  const effectiveOverlapVal = (overlap > 0 && overlap !== 18) ? overlap : (isMetric ? lapSpliceCm : lapSpliceInches);

  const divFactor = isMetric ? 100 : 12;
  const cNative = edgeClearance / divFactor;
  const sNative = spacing / divFactor;
  const oNative = effectiveOverlapVal / divFactor;

  // 1. Grid Dimensions
  const gridLength = Math.max(0, length - 2 * cNative);
  const gridWidth = Math.max(0, width - 2 * cNative);

  // 2. Number of bars in each direction
  let lengthwiseBars = 0;
  if (gridWidth > 0 && sNative > 0) {
    lengthwiseBars = Math.ceil(gridWidth / sNative) + 1;
  }

  let widthwiseBars = 0;
  if (gridLength > 0 && sNative > 0) {
    widthwiseBars = Math.ceil(gridLength / sNative) + 1;
  }

  // 3. Overlaps calculation per bar run
  let overlapsPerL = 0;
  if (gridLength > stickLength && (stickLength - oNative) > 0) {
    overlapsPerL = Math.ceil((gridLength - stickLength) / (stickLength - oNative));
  }
  const lengthPerLRun = gridLength + overlapsPerL * oNative;
  const totalLengthwiseRebar = lengthwiseBars * lengthPerLRun;

  let overlapsPerW = 0;
  if (gridWidth > stickLength && (stickLength - oNative) > 0) {
    overlapsPerW = Math.ceil((gridWidth - stickLength) / (stickLength - oNative));
  }
  const lengthPerWRun = gridWidth + overlapsPerW * oNative;
  const totalWidthwiseRebar = widthwiseBars * lengthPerWRun;

  // 4. Totals
  const totalLengthNoWaste = totalLengthwiseRebar + totalWidthwiseRebar;
  const totalLength = totalLengthNoWaste * (1 + wastePercent / 100);

  let totalPieces = 0;
  if (stickLength > 0) {
    totalPieces = Math.ceil(totalLength / stickLength);
  }

  // 5. Weight Estimation
  let estimatedWeightLbs = 0;
  let estimatedWeightKgs = 0;

  if (isMetric) {
    estimatedWeightKgs = totalLength * barWeightInfo.weightKgsPerM;
    estimatedWeightLbs = estimatedWeightKgs / 0.45359237;
  } else {
    estimatedWeightLbs = totalLength * barWeightInfo.weightLbsPerFt;
    estimatedWeightKgs = estimatedWeightLbs * 0.45359237;
  }

  return {
    gridLength,
    gridWidth,
    totalLength,
    totalPieces: Math.ceil(totalPieces),
    estimatedWeightLbs,
    estimatedWeightKgs,
    lapSpliceInches,
    lapSpliceCm,
  };
}
