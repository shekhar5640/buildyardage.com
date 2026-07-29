// Build Yardage Material Calculation Constants
// Single Source of Truth for engine calculations and documentation copy

export const DRYWALL_CONSTANTS = {
  SCREWS_PER_4X8_SHEET: 32, // 32 screws per 4x8 sheet (1 screw / sq ft for 16" O.C. studs & 12" screw spacing)
  TAPE_FEET_PER_4X8_SHEET: 32, // 32 linear feet of paper joint tape per 4x8 sheet (1 ft tape / sq ft)
  MUD_LBS_PER_SQFT: 0.05, // 0.05 lbs of joint compound per sq ft (1.6 lbs / 4x8 sheet, Level 4 drywall finish standard)
  FINISH_STANDARD: 'Level 4 drywall finish standard',
} as const;

export const FRAMING_CONSTANTS = {
  EXTRA_STUDS_PER_CORNER: 2, // 2 extra studs per corner or wall intersection (3-stud California corner / T-post tie-in)
  STOCK_LUMBER_LENGTH_FT: 16, // Standard 16ft plate lumber stock length
} as const;

export const REBAR_CONSTANTS = {
  LAP_SPLICE_MULTIPLIER: 40, // 40d (40x bar diameter) lap splice overlap
  STOCK_BAR_LENGTH_FT: 20, // Standard 20ft stock rebar stick length
} as const;

export const CONCRETE_CONSTANTS = {
  BAG_YIELD_80LB_CUFT: 0.60, // 0.60 cu ft yield per 80lb bag (45 bags / cu yd)
  BAG_YIELD_60LB_CUFT: 0.45, // 0.45 cu ft yield per 60lb bag (60 bags / cu yd)
  BAG_YIELD_40LB_CUFT: 0.30, // 0.30 cu ft yield per 40lb bag (90 bags / cu yd)
  DENSITY_LBS_PER_CUYD: 4050, // 150 lbs / cu ft = 4,050 lbs / cu yd
} as const;

export const GRAVEL_CONSTANTS = {
  DEFAULT_DENSITY_TONS_PER_CUYD: 1.4, // 2,800 lbs / cu yd
} as const;

export const STANDARDS_CITATIONS = {
  CONCRETE_SLAB: 'ACI 332',
  CONCRETE_COLUMN: 'ACI 332',
  GRAVEL: 'ASTM D2940',
  DRYWALL: 'ASTM C840 / GA-216',
  FRAMING: 'IRC 2021 §R602 / NDS',
  REBAR: 'ACI 318 §25.5'
} as const;
