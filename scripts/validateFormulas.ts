import fs from 'node:fs';
import path from 'node:path';
import { 
  calculateRebar, 
  calculateDrywall, 
  calculateFraming, 
  calculateConcreteSlab,
  calculateConcreteColumn,
  calculateGravel,
  REBAR_SIZES 
} from '../src/utils/calcEngine.ts';
import { 
  DRYWALL_CONSTANTS, 
  FRAMING_CONSTANTS, 
  REBAR_CONSTANTS, 
  CONCRETE_CONSTANTS, 
  GRAVEL_CONSTANTS 
} from '../src/utils/constants.ts';

console.log('====================================================');
console.log('BUILD YARDAGE FORMULA & COPY AUDIT TEST SUITE');
console.log('====================================================\n');

let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✓ [PASS] ${testName}`);
  } else {
    console.error(`✗ [FAIL] ${testName}`);
    failedTests++;
  }
}

// ----------------------------------------------------
// TEST SUITE 1: Rebar 40d Lap Splice Overlap Verification
// ----------------------------------------------------
console.log('--- TEST SUITE 1: Rebar 40d Lap Splice Overlap ---');

const rebarCases = [
  { size: '#3', expectedDiam: 0.375, expected40dInches: 15.0 },
  { size: '#4', expectedDiam: 0.500, expected40dInches: 20.0 },
  { size: '#5', expectedDiam: 0.625, expected40dInches: 25.0 },
  { size: '#6', expectedDiam: 0.750, expected40dInches: 30.0 },
  { size: '#7', expectedDiam: 0.875, expected40dInches: 35.0 },
  { size: '#8', expectedDiam: 1.000, expected40dInches: 40.0 },
];

for (const c of rebarCases) {
  const barInfo = REBAR_SIZES[c.size];
  assert(
    barInfo !== undefined && barInfo.diameterInches === c.expectedDiam,
    `REBAR_SIZES[${c.size}] diameterInches equals ${c.expectedDiam}"`
  );

  const result = calculateRebar(30, 20, 3, 12, 20, 0, 10, c.size, false);
  const expectedSplice = c.expectedDiam * REBAR_CONSTANTS.LAP_SPLICE_MULTIPLIER;
  
  assert(
    result.lapSpliceInches === c.expected40dInches,
    `calculateRebar for ${c.size} yields exact 40d lap splice of ${c.expected40dInches}" (got ${result.lapSpliceInches}")`
  );
  assert(
    expectedSplice === c.expected40dInches,
    `40d lap splice formula (40 * ${c.expectedDiam}) = ${c.expected40dInches}"`
  );
}

// ----------------------------------------------------
// TEST SUITE 2: Drywall Canonical Rates Verification
// ----------------------------------------------------
console.log('\n--- TEST SUITE 2: Drywall Canonical Rates ---');

assert(
  DRYWALL_CONSTANTS.SCREWS_PER_4X8_SHEET === 32,
  `DRYWALL_CONSTANTS.SCREWS_PER_4X8_SHEET is 32 screws per sheet`
);
assert(
  DRYWALL_CONSTANTS.TAPE_FEET_PER_4X8_SHEET === 32,
  `DRYWALL_CONSTANTS.TAPE_FEET_PER_4X8_SHEET is 32 ft tape per sheet`
);
assert(
  DRYWALL_CONSTANTS.MUD_LBS_PER_SQFT === 0.05,
  `DRYWALL_CONSTANTS.MUD_LBS_PER_SQFT is 0.05 lbs / sq ft`
);

// Run test case: 10ft x 8ft wall (80 sq ft) -> 80 / 32 = 2.5 sheets -> Math.ceil = 3 sheets
const drywallRes = calculateDrywall(10, 0, 8, false, '4x8', 0, false);

assert(
  drywallRes.totalAreaSqFt === 80,
  `Drywall totalAreaSqFt = 80 sq ft`
);
assert(
  drywallRes.sheetsNeeded === 3,
  `Drywall sheetsNeeded for 80 sq ft = 3 sheets`
);
assert(
  drywallRes.screwsNeeded === 3 * 32,
  `Drywall screwsNeeded (3 sheets * 32) = 96 screws (got ${drywallRes.screwsNeeded})`
);
assert(
  drywallRes.tapeFeet === 3 * 32,
  `Drywall tapeFeet (3 sheets * 32) = 96 ft (got ${drywallRes.tapeFeet})`
);
assert(
  drywallRes.compoundLbs === 4.0,
  `Drywall compoundLbs (80 sq ft * 0.05) = 4.0 lbs (got ${drywallRes.compoundLbs})`
);

// ----------------------------------------------------
// TEST SUITE 3: Wood Framing Corner Studs Verification
// ----------------------------------------------------
console.log('\n--- TEST SUITE 3: Wood Framing Corner Studs ---');

assert(
  FRAMING_CONSTANTS.EXTRA_STUDS_PER_CORNER === 2,
  `FRAMING_CONSTANTS.EXTRA_STUDS_PER_CORNER is 2 extra studs`
);

// 20ft wall, 16" O.C., 2 corners, 0 waste:
// (20 / 1.3333) = 15 spaces -> 16 studs + 4 corner studs = 20 studs
const framingRes = calculateFraming(20, 16, 2, 2, 1, 0, false, '2-stud');

assert(
  framingRes.studsCount === 20,
  `calculateFraming(20ft wall, 16" O.C., 2 corners, '2-stud') yields 20 studs (got ${framingRes.studsCount})`
);

console.log('\n--- TEST SUITE 3.1: Wood Framing Openings & Corners ---');

// Plain wall with 0 corners and 0 openings (10ft wall, 16" OC, 0 waste)
// 10ft = 120", 120/16 = 7.5 -> 8 spaces -> 9 basic studs + 0 corner studs = 9 studs
const plainWallRes = calculateFraming(10, 16, 0, 2, 1, 0, false, '3-stud', 0, 36, 0, 48);
assert(plainWallRes.studsCount === 9, `Plain 10ft wall with 0 corners/openings yields 9 studs (got ${plainWallRes.studsCount})`);

// Wall with 2 corners (3-stud vs 2-stud) and 0 openings
const wall2Corners3Stud = calculateFraming(10, 16, 2, 2, 1, 0, false, '3-stud', 0, 36, 0, 48);
assert(wall2Corners3Stud.studsCount === 9 + (2 * 3), `10ft wall with 2 3-stud corners yields 15 studs (got ${wall2Corners3Stud.studsCount})`);

const wall2Corners2Stud = calculateFraming(10, 16, 2, 2, 1, 0, false, '2-stud', 0, 36, 0, 48);
assert(wall2Corners2Stud.studsCount === 9 + (2 * 2), `10ft wall with 2 2-stud corners yields 13 studs (got ${wall2Corners2Stud.studsCount})`);

// Wall with 1 door and 1 window
// 10ft wall, 0 corners, 1 door (36"), 1 window (48")
// Basic studs = 9
// Door: adds 4 (kings/jacks), subtracts floor(36/16) = 2. Net = +2
// Window: adds 4, subtracts floor(48/16) = 3. Net = +1
// Expected studs = 9 + 2 + 1 = 12
// Headers: Door = (36+3)/12 = 3.25ft, Window = (48+3)/12 = 4.25ft, Total = 7.5ft
const wallWithOpenings = calculateFraming(10, 16, 0, 2, 1, 0, false, '3-stud', 1, 36, 1, 48);
assert(wallWithOpenings.studsCount === 12, `10ft wall with 1 door and 1 window yields 12 studs (got ${wallWithOpenings.studsCount})`);
assert(wallWithOpenings.headersLinearFt === 7.5, `10ft wall with 1 door (36") and 1 window (48") yields 7.5ft of header plates (got ${wallWithOpenings.headersLinearFt})`);

// ----------------------------------------------------
// TEST SUITE 4: Concrete & Gravel Yield Constants ---
// ----------------------------------------------------
console.log('\n--- TEST SUITE 4: Concrete & Gravel Yield Constants ---');

assert(CONCRETE_CONSTANTS.BAG_YIELD_80LB_CUFT === 0.60, '80lb bag yield = 0.60 cu ft');
assert(CONCRETE_CONSTANTS.BAG_YIELD_60LB_CUFT === 0.45, '60lb bag yield = 0.45 cu ft');
assert(CONCRETE_CONSTANTS.BAG_YIELD_40LB_CUFT === 0.30, '40lb bag yield = 0.30 cu ft');
assert(GRAVEL_CONSTANTS.DEFAULT_DENSITY_TONS_PER_CUYD === 1.4, 'Gravel default density = 1.4 tons/yd³');

const slabRes = calculateConcreteSlab(10, 10, 4, 0, false); // 10x10x4" = 33.33 cu ft
assert(slabRes.bags80lb === 56, `Concrete slab 10x10x4" (33.33 cu ft) requires 56 80lb bags (got ${slabRes.bags80lb})`);

// ----------------------------------------------------
// TEST SUITE 5: Copy-Formula Divergence Audit (CI Lint)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 5: Copy & Formula Divergence Audit ---');

const srcDir = path.join(process.cwd(), 'src');
const distDir = path.join(process.cwd(), 'dist');

const forbiddenPatterns = [
  { pattern: /38\s+drywall\s+screws/i, reason: 'Stale 38 screws copy found' },
  { pattern: /approx\.\s+30\s+screws/i, reason: 'Stale 30 screws copy found in Reference widget' },
  { pattern: /approx\s+35\s+screws/i, reason: 'Stale 35 screws copy found in guides' },
  { pattern: /75\s+ft\s+of\s+joint\s+tape\s+per\s+100\s+sq/i, reason: 'Stale 75 ft / 100 sq ft tape copy found' },
  { pattern: /0\.05\s+gal\/sq\s+ft/i, reason: 'Stale 0.05 gal mud copy found' },
  { pattern: /Extra\s+Studs\s+\(3\s+per\s+corner\)/i, reason: 'Stale 3 per corner stud copy found' },
  { pattern: /lap\s+splices,\s+where\s+bars\s+overlap\s+by\s+12\s+to\s+18\s+inches/i, reason: 'Stale 12 to 18 inch lap splice copy found' }
];

function checkFileForForbiddenPatterns(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const p of forbiddenPatterns) {
    if (p.pattern.test(content)) {
      const rel = path.relative(process.cwd(), filePath);
      console.error(`✗ [FAIL] Divergence detected in ${rel}: ${p.reason}`);
      failedTests++;
    }
  }
}

function scanFiles(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFiles(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.astro') || entry.name.endsWith('.json') || entry.name.endsWith('.html'))) {
      checkFileForForbiddenPatterns(fullPath);
    }
  }
}

scanFiles(srcDir);

// ----------------------------------------------------
// FINAL VERDICT
// ----------------------------------------------------
console.log('\n====================================================');
if (failedTests === 0) {
  console.log('SUCCESS: All formula tests & copy divergence audits PASSED cleanly!');
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`FAILURE: ${failedTests} test(s) failed!`);
  console.log('====================================================\n');
  process.exit(1);
}
