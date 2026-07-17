// Build Yardage Material Calculation Engine

export interface ConcreteSlabResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags80lb: number;
  bags60lb: number;
  bags40lb: number;
  rawVolumeNoWaste: number; // in cu ft
}

export interface ConcreteColumnResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags80lb: number;
  bags60lb: number;
  bags40lb: number;
  rawVolumeNoWaste: number; // in cu ft
}

export interface GravelResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  tons: number;
  rawVolumeNoWaste: number; // in cu ft
}

export interface DrywallResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  sheetsNeeded: number;
  tapeFeet: number;
  screwsNeeded: number;
  compoundLbs: number;
}

export interface FramingResult {
  studsCount: number;
  bottomPlates16ft: number;
  topPlates16ft: number;
  totalPlatesLinearFt: number;
}

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
    lFt = length * 3.28084;
    wFt = width * 3.28084;
    tIn = thickness / 2.54;
  }

  const rawVolumeNoWaste = lFt * wFt * (tIn / 12);
  const cubicFeet = rawVolumeNoWaste * (1 + wastePercent / 100);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet / 35.3147;

  return {
    cubicFeet: parseFloat(cubicFeet.toFixed(2)),
    cubicYards: parseFloat(cubicYards.toFixed(2)),
    cubicMeters: parseFloat(cubicMeters.toFixed(2)),
    bags80lb: Math.ceil(cubicFeet / 0.60),
    bags60lb: Math.ceil(cubicFeet / 0.45),
    bags40lb: Math.ceil(cubicFeet / 0.30),
    rawVolumeNoWaste: parseFloat(rawVolumeNoWaste.toFixed(2)),
  };
}

/**
 * Calculates concrete needed for a cylindrical column / post hole
 * @param diameter Diameter (inches or cm)
 * @param height Height (inches or cm)
 * @param wastePercent Waste percentage (e.g. 5)
 * @param isMetric True if inputs are in cm, false if inches
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
    // diameter and height in cm
    const dM = diameter / 100;
    const hM = height / 100;
    rFt = (dM / 2) * 3.28084;
    hFt = hM * 3.28084;
  } else {
    // diameter and height in inches
    rFt = diameter / 24; // D / 2 / 12
    hFt = height / 12;
  }

  const rawVolumeNoWaste = Math.PI * Math.pow(rFt, 2) * hFt;
  const cubicFeet = rawVolumeNoWaste * (1 + wastePercent / 100);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet / 35.3147;

  return {
    cubicFeet: parseFloat(cubicFeet.toFixed(2)),
    cubicYards: parseFloat(cubicYards.toFixed(2)),
    cubicMeters: parseFloat(cubicMeters.toFixed(2)),
    bags80lb: Math.ceil(cubicFeet / 0.60),
    bags60lb: Math.ceil(cubicFeet / 0.45),
    bags40lb: Math.ceil(cubicFeet / 0.30),
    rawVolumeNoWaste: parseFloat(rawVolumeNoWaste.toFixed(2)),
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
  densityTonsPerYd: number = 1.4,
  isMetric: boolean
): GravelResult {
  let lFt = length;
  let wFt = width;
  let dIn = depth;

  if (isMetric) {
    lFt = length * 3.28084;
    wFt = width * 3.28084;
    dIn = depth / 2.54;
  }

  const rawVolumeNoWaste = lFt * wFt * (dIn / 12);
  const cubicFeet = rawVolumeNoWaste * (1 + wastePercent / 100);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet / 35.3147;
  const tons = cubicYards * densityTonsPerYd;

  return {
    cubicFeet: parseFloat(cubicFeet.toFixed(2)),
    cubicYards: parseFloat(cubicYards.toFixed(2)),
    cubicMeters: parseFloat(cubicMeters.toFixed(2)),
    tons: parseFloat(tons.toFixed(2)),
    rawVolumeNoWaste: parseFloat(rawVolumeNoWaste.toFixed(2)),
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
    lFt = length * 3.28084;
    wFt = width * 3.28084;
    hFt = height * 3.28084;
  }

  // Calculate wall area
  let wallAreaSqFt = 0;
  if (wFt > 0) {
    // 4 walls of the room
    wallAreaSqFt = 2 * (lFt + wFt) * hFt;
  } else {
    // Single wall
    wallAreaSqFt = lFt * hFt;
  }

  // Calculate ceiling area
  const ceilingAreaSqFt = (includeCeiling && wFt > 0) ? (lFt * wFt) : 0;
  const totalAreaSqFt = wallAreaSqFt + ceilingAreaSqFt;
  const totalAreaSqM = totalAreaSqFt / 10.7639;

  // Drywall sheets calculation
  const sheetAreaSqFt = sheetSize === '4x8' ? 32 : 48;
  const rawSheets = totalAreaSqFt / sheetAreaSqFt;
  const sheetsNeeded = Math.ceil(rawSheets * (1 + wastePercent / 100));

  // Screws, Tape, Mud estimate rules of thumb
  // Approx 32 ft of tape per sheet
  const tapeFeet = Math.ceil(sheetsNeeded * 32);
  // Approx 35-40 screws per sheet
  const screwsNeeded = Math.ceil(sheetsNeeded * 38);
  // Approx 0.05 lbs of joint compound per sq ft of wall
  const compoundLbs = parseFloat((totalAreaSqFt * 0.05).toFixed(1));

  return {
    totalAreaSqFt: parseFloat(totalAreaSqFt.toFixed(2)),
    totalAreaSqM: parseFloat(totalAreaSqM.toFixed(2)),
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
  studSpacing: 16 | 24,
  cornersCount: number = 2,
  topPlatesCount: number = 2,
  bottomPlatesCount: number = 1,
  wastePercent: number,
  isMetric: boolean
): FramingResult {
  let lFt = length;

  if (isMetric) {
    lFt = length * 3.28084;
  }

  // Stud spacing in feet
  const spacingFt = studSpacing / 12;

  // Basic studs = (Length / spacing) + 1 stud at end
  const basicStuds = Math.ceil(lFt / spacingFt) + 1;

  // Add studs for corners (standard 2 extra studs per corner/intersection)
  const cornerStuds = cornersCount * 2;

  // Subtotal studs
  const subtotalStuds = basicStuds + cornerStuds;

  // Total studs with waste factor
  const studsCount = Math.ceil(subtotalStuds * (1 + wastePercent / 100));

  // Plates calculations (Plates run along top and bottom of wall)
  // Plates linear feet
  const bottomPlatesLinear = lFt * bottomPlatesCount;
  const topPlatesLinear = lFt * topPlatesCount;
  const totalPlatesLinearFt = bottomPlatesLinear + topPlatesLinear;

  // Standard plate lumber length is 16 ft
  const bottomPlates16ft = Math.ceil(bottomPlatesLinear / 16);
  const topPlates16ft = Math.ceil(topPlatesLinear / 16);

  return {
    studsCount,
    bottomPlates16ft,
    topPlates16ft,
    totalPlatesLinearFt: parseFloat(totalPlatesLinearFt.toFixed(2)),
  };
}
