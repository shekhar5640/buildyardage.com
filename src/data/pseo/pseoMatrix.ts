import { 
  calculateConcreteSlab, 
  calculateConcreteColumn, 
  calculateGravel, 
  calculateDrywall, 
  calculateFraming, 
  calculateRebar 
} from '../../utils/calcEngine';

// Common Types
export interface PseoPageData {
  type: 'concrete-slab' | 'concrete-column' | 'gravel' | 'drywall' | 'framing' | 'rebar';
  slug: string;
  urlPath: string;
  h1Title: string;
  metaTitle: string;
  metaDescription: string;
  quickAnswer: string;
  inputs: Record<string, any>;
  calculatedOutputs: Record<string, any>;
  latexMath: { title: string; formula: string; explanation: string };
  comparativeTable: {
    headers: string[];
    rows: { label: string; volumeOrQty: string; bagsOrSticks: string; estCostRange: string; url?: string }[];
  };
  jobsiteTips: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  nearbyLinks: { title: string; url: string }[];
  crossToolLinks: { title: string; url: string; category: string }[];
}

// ----------------------------------------------------
// 1. CONCRETE SLAB MATRIX
// ----------------------------------------------------
const SLAB_DIMENSIONS = [
  { w: 4, l: 4 },
  { w: 10, l: 10 },
  { w: 10, l: 20 },
  { w: 12, l: 12 },
  { w: 12, l: 24 },
  { w: 20, l: 20 },
  { w: 24, l: 24 },
  { w: 30, l: 30 },
  { w: 30, l: 40 },
  { w: 40, l: 60 }
];
const SLAB_DEPTHS = [4, 6]; // inches

export function getConcreteSlabPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  for (const dim of SLAB_DIMENSIONS) {
    for (const depth of SLAB_DEPTHS) {
      const slug = `${dim.w}x${dim.l}-${depth}inch`;
      const urlPath = `/calculators/concrete-slab/${slug}`;
      const res = calculateConcreteSlab(dim.l, dim.w, depth, 10, false);

      const h1Title = `How Much Concrete Do I Need for a ${dim.w}x${dim.l} Slab (${depth} Inches Deep)?`;
      const metaTitle = `${dim.w}x${dim.l} Concrete Slab Calculator (${depth}" Depth) | BuildYardage`;
      const quickAnswer = `A ${dim.w}x${dim.l} slab poured at a ${depth}" depth requires ${res.cubicYards} Cubic Yards of concrete (${res.cubicFeet} cu ft), which equals roughly ${res.bags80lb} bags (80lb) including a 10% waste buffer.`;
      const metaDescription = `Calculating a ${dim.w}x${dim.l} slab? A ${depth}" deep slab requires ${res.cubicYards} cu yds (${res.bags80lb} 80lb bags). Get exact material lists, rebar grid, and cost estimates instantly.`;

      // Comparative Table: neighbor sizes
      const neighbors = SLAB_DIMENSIONS.filter(d => Math.abs(d.w * d.l - dim.w * dim.l) < 300 || (d.w === dim.w && d.l !== dim.l));
      const compRows = neighbors.slice(0, 4).map(n => {
        const nRes = calculateConcreteSlab(n.l, n.w, depth, 10, false);
        const estMin = Math.round(nRes.cubicYards * 125);
        const estMax = Math.round(nRes.cubicYards * 160);
        return {
          label: `${n.w} x ${n.l} (${depth}" thick)`,
          volumeOrQty: `${nRes.cubicYards} cu yds`,
          bagsOrSticks: `${nRes.bags80lb} bags (80lb)`,
          estCostRange: `$${estMin} – $${estMax}`,
          url: `/calculators/concrete-slab/${n.w}x${n.l}-${depth}inch`
        };
      });

      pages.push({
        type: 'concrete-slab',
        slug,
        urlPath,
        h1Title,
        metaTitle,
        metaDescription,
        quickAnswer,
        inputs: { length: dim.l, width: dim.w, thickness: depth, waste: 10 },
        calculatedOutputs: res,
        latexMath: {
          title: 'Concrete Slab Volume Equation',
          formula: `\\text{Cubic Yards} = \\frac{\\text{Length (ft)} \\times \\text{Width (ft)} \\times (\\text{Thickness (in)} / 12)}{27} \\times 1.10`,
          explanation: `Multiply ${dim.l} ft by ${dim.w} ft by ${depth / 12} ft depth to get net cubic feet (${(dim.l * dim.w * (depth / 12)).toFixed(2)} cu ft). Divide by 27 to get net cubic yards (${(res.rawVolumeNoWaste / 27).toFixed(2)} cu yd), then multiply by 1.10 for a 10% jobsite waste factor to get ${res.cubicYards} cu yd total.`
        },
        comparativeTable: {
          headers: ['Slab Dimensions', 'Total Volume', '80lb Bag Count', 'Est. Ready-Mix Cost'],
          rows: compRows
        },
        jobsiteTips: [
          {
            title: `Form Board Bracing for ${depth}" Slabs`,
            desc: `For a ${dim.w}x${dim.l} pour, ensure form boards are staked securely every 3 feet with diagonal corner kickers to withstand side hydraulic concrete pressure.`
          },
          {
            title: 'Sub-base Gravel Base Recommendation',
            desc: `Lay down a 4" to 6" base layer of crushed gravel (#57 stone or crusher run) beneath your ${dim.w}x${dim.l} concrete slab to prevent frost heave cracking.`
          }
        ],
        faqs: [
          {
            question: `How many 80lb bags of concrete do I need for a ${dim.w}x${dim.l} slab?`,
            answer: `You will need approximately ${res.bags80lb} 80lb premix concrete bags (or ${res.bags60lb} 60lb bags) for a ${dim.w}x${dim.l} slab poured at ${depth}" depth with a 10% waste buffer.`
          },
          {
            question: `How much does concrete cost for a ${dim.w}x${dim.l} slab?`,
            answer: `Ready-mix concrete for a ${dim.w}x${dim.l} slab (${depth}" depth) costs between $${Math.round(res.cubicYards * 125)} and $${Math.round(res.cubicYards * 160)} based on average U.S. ready-mix rates ($125–$160/yd³).`
          },
          {
            question: `Should a ${dim.w}x${dim.l} slab be 4 inches or 6 inches thick?`,
            answer: `A 4-inch depth is standard for patios, walkways, shed pads, and residential floors. Use a 6-inch depth for heavy vehicle driveways, hot tubs, and RV parking pads.`
          }
        ],
        nearbyLinks: [
          { title: `${dim.w}x${dim.l} Slab (4" Deep)`, url: `/calculators/concrete-slab/${dim.w}x${dim.l}-4inch` },
          { title: `${dim.w}x${dim.l} Slab (6" Deep)`, url: `/calculators/concrete-slab/${dim.w}x${dim.l}-6inch` }
        ],
        crossToolLinks: [
          { title: `Calculate ${dim.w}x${dim.l} Rebar Grid Requirements`, url: `/calculators/rebar/${dim.w}x${dim.l}-slab-bar-num4`, category: 'Rebar Steel' },
          { title: `Estimate Gravel Sub-Base for ${dim.w}x${dim.l} Slab`, url: `/calculators/gravel/${dim.w}x${dim.l}-4inch`, category: 'Aggregate Base' }
        ]
      });
    }
  }

  return pages;
}

// ----------------------------------------------------
// 2. CONCRETE COLUMN MATRIX
// ----------------------------------------------------
const COLUMN_DIAMETERS = [6, 8, 10, 12, 18, 24]; // inches
const COLUMN_DEPTHS = [2, 3, 4, 8]; // feet

export function getConcreteColumnPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  for (const dia of COLUMN_DIAMETERS) {
    for (const depth of COLUMN_DEPTHS) {
      const slug = `${dia}inch-${depth}ft`;
      const urlPath = `/calculators/concrete-column/${slug}`;
      const res = calculateConcreteColumn(dia, depth * 12, 10, false);

      const h1Title = `How Much Concrete for a ${dia}" Diameter Sonotube Column (${depth} Feet Deep)?`;
      const metaTitle = `${dia}" Concrete Column Calculator (${depth}ft Deep) | BuildYardage`;
      const quickAnswer = `A single ${dia}" diameter Sonotube or post hole at ${depth}ft depth requires ${res.cubicYards} Cubic Yards (${res.cubicFeet} cu ft) of concrete, or roughly ${res.bags80lb} bags (80lb).`;
      const metaDescription = `Calculating a ${dia}" x ${depth}ft concrete column? Requires ${res.cubicYards} cu yds (${res.bags80lb} 80lb bags) per hole. Get exact bag counts and ready-mix estimates.`;

      pages.push({
        type: 'concrete-column',
        slug,
        urlPath,
        h1Title,
        metaTitle,
        metaDescription,
        quickAnswer,
        inputs: { diameter: dia, depth, quantity: 1, waste: 10 },
        calculatedOutputs: res,
        latexMath: {
          title: 'Concrete Cylinder Volume Formula',
          formula: `\\text{Cubic Yards} = \\frac{\\pi \\times \\left(\\frac{\\text{Diameter (in)}}{24}\\right)^2 \\times \\text{Depth (ft)}}{27} \\times 1.10`,
          explanation: `Square radius (${dia / 2} in = ${(dia / 24).toFixed(3)} ft), multiply by π (${Math.PI.toFixed(4)}) and depth (${depth} ft) to calculate net cylinder volume (${(res.cubicFeet / 1.10).toFixed(2)} cu ft). Add a 10% waste buffer to get ${res.cubicFeet} cu ft (${res.cubicYards} cu yd).`
        },
        comparativeTable: {
          headers: ['Column Size', 'Single Tube Volume', '80lb Bags per Hole', 'Bags for 10 Holes'],
          rows: COLUMN_DIAMETERS.slice(0, 4).map(d => {
            const cRes = calculateConcreteColumn(d, depth * 12, 10, false);
            return {
              label: `${d}" Diameter x ${depth}ft Depth`,
              volumeOrQty: `${cRes.cubicYards} cu yds`,
              bagsOrSticks: `${cRes.bags80lb} bags`,
              estCostRange: `${cRes.bags80lb * 10} total bags`,
              url: `/calculators/concrete-column/${d}inch-${depth}ft`
            };
          })
        },
        jobsiteTips: [
          {
            title: 'Frost Depth Compliance',
            desc: `In cold climates, ensure your ${dia}" post holes extend at least 6" below the local frost line (typically ${depth}ft) to avoid post uplift.`
          },
          {
            title: 'Sonotube Backfill Tamping',
            desc: `After lowering your ${dia}" cardboard Sonotube form into the ground, backfill soil around the outside in 6-inch lifts and tamp firm before pouring.`
          }
        ],
        faqs: [
          {
            question: `How many 80lb bags of concrete for a ${dia}" diameter ${depth}ft deep post hole?`,
            answer: `You will need ${res.bags80lb} 80lb bags of pre-mixed concrete for a single ${dia}" x ${depth}ft post hole. For 10 holes, order ${res.bags80lb * 10} bags.`
          },
          {
            question: `What size Sonotube for a deck post footing?`,
            answer: `8-inch and 10-inch diameter tubes are standard for deck support posts. 12-inch to 18-inch tubes are used for heavy elevated decks, pole barns, or structural commercial pillars.`
          }
        ],
        nearbyLinks: COLUMN_DEPTHS.map(dep => ({ title: `${dia}" Column (${dep}ft Deep)`, url: `/calculators/concrete-column/${dia}inch-${dep}ft` })),
        crossToolLinks: [
          { title: `Estimate Concrete Slab for ${dia}" Pillar Grid`, url: `/calculators/concrete-slab/12x12-4inch`, category: 'Concrete Slabs' }
        ]
      });
    }
  }

  return pages;
}

// ----------------------------------------------------
// 3. GRAVEL DRIVEWAY MATRIX
// ----------------------------------------------------
const GRAVEL_DIMENSIONS = [
  { w: 10, l: 20 },
  { w: 12, l: 30 },
  { w: 10, l: 50 },
  { w: 12, l: 100 },
  { w: 20, l: 20 }
];
const GRAVEL_DEPTHS = [2, 3, 4, 6]; // inches

export function getGravelPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  for (const dim of GRAVEL_DIMENSIONS) {
    for (const depth of GRAVEL_DEPTHS) {
      const slug = `${dim.w}x${dim.l}-${depth}inch`;
      const urlPath = `/calculators/gravel/${slug}`;
      const res = calculateGravel(dim.l, dim.w, depth, 10, 1.4, false);

      const h1Title = `How Many Tons of Gravel Do I Need for a ${dim.w}x${dim.l} Driveway (${depth}" Deep)?`;
      const metaTitle = `${dim.w}x${dim.l} Gravel Driveway Calculator (${depth}" Depth) | BuildYardage`;
      const quickAnswer = `A ${dim.w}x${dim.l} gravel driveway at ${depth}" depth requires ${res.tons} US Tons (${res.cubicYards} Cubic Yards) of aggregate stone based on a standard 1.4 tons/yd³ density.`;
      const metaDescription = `Calculating gravel for a ${dim.w}x${dim.l} driveway? A ${depth}" deep layer requires ${res.tons} Tons (${res.cubicYards} cu yds). Get exact quarry tonnage and delivery estimates.`;

      pages.push({
        type: 'gravel',
        slug,
        urlPath,
        h1Title,
        metaTitle,
        metaDescription,
        quickAnswer,
        inputs: { length: dim.l, width: dim.w, depth, density: 1.4, waste: 10 },
        calculatedOutputs: res,
        latexMath: {
          title: 'Gravel Tonnage Calculation Equation',
          formula: `\\text{Tons} = \\left(\\frac{\\text{Length (ft)} \\times \\text{Width (ft)} \\times (\\text{Depth (in)} / 12)}{27}\\right) \\times 1.40 \\times 1.10`,
          explanation: `Calculate volume (${res.cubicYards} cu yd with 10% waste buffer) and multiply by aggregate density constant (1.40 tons per cu yd) to arrive at ${res.tons} US Short Tons.`
        },
        comparativeTable: {
          headers: ['Driveway Size', 'Gravel Depth', 'Cubic Yards', 'Required Tonnage'],
          rows: GRAVEL_DEPTHS.map(d => {
            const gRes = calculateGravel(dim.l, dim.w, d, 10, 1.4, false);
            return {
              label: `${dim.w} x ${dim.l} Driveway`,
              volumeOrQty: `${d} inches`,
              bagsOrSticks: `${gRes.cubicYards} cu yds`,
              estCostRange: `${gRes.tons} US Tons`,
              url: `/calculators/gravel/${dim.w}x${dim.l}-${d}inch`
            };
          })
        },
        jobsiteTips: [
          {
            title: 'Geotextile Underlayment',
            desc: `Lay heavy woven geotextile fabric over native soil before spreading your ${dim.w}x${dim.l} gravel layer to prevent stones from sinking into mud.`
          },
          {
            title: 'Compaction Factor',
            desc: `Plate compacting or heavy rolling your ${depth}" gravel layer will settle material by ~10–15%. Our 10% waste buffer covers this compaction loss.`
          }
        ],
        faqs: [
          {
            question: `How many tons of gravel for a ${dim.w}x${dim.l} driveway at ${depth} inches deep?`,
            answer: `You need ${res.tons} US Tons (${res.cubicYards} cubic yards) of crushed stone or gravel for a ${dim.w}x${dim.l} area at ${depth}" depth.`
          },
          {
            question: `How much does a truckload of gravel cost for a ${dim.w}x${dim.l} driveway?`,
            answer: `At average quarry delivery rates ($35–$65 per ton installed/delivered), ${res.tons} tons of driveway gravel costs roughly $${Math.round(res.tons * 35)} to $${Math.round(res.tons * 65)}.`
          }
        ],
        nearbyLinks: GRAVEL_DIMENSIONS.map(d => ({ title: `${d.w}x${d.l} Gravel (${depth}" Deep)`, url: `/calculators/gravel/${d.w}x${d.l}-${depth}inch` })),
        crossToolLinks: [
          { title: `Concrete Slab Alternative for ${dim.w}x${dim.l} Driveway`, url: `/calculators/concrete-slab/${dim.w}x${dim.l}-6inch`, category: 'Concrete Slabs' }
        ]
      });
    }
  }

  return pages;
}

// ----------------------------------------------------
// 4. DRYWALL MATRIX
// ----------------------------------------------------
const DRYWALL_ROOMS = [
  { w: 10, l: 10 },
  { w: 10, l: 12 },
  { w: 12, l: 12 },
  { w: 12, l: 15 },
  { w: 15, l: 20 },
  { w: 20, l: 20 }
];
const DRYWALL_HEIGHTS = [8, 9, 10]; // feet

export function getDrywallPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  for (const room of DRYWALL_ROOMS) {
    for (const h of DRYWALL_HEIGHTS) {
      const perimeter = (room.w + room.l) * 2;
      const slug = `${room.w}x${room.l}-room-${h}ft-ceiling`;
      const urlPath = `/calculators/drywall/${slug}`;
      const res = calculateDrywall(room.l, room.w, h, false, '4x8', 10, false);

      const h1Title = `How Many Drywall Sheets Do I Need for a ${room.w}x${room.l} Room (${h}ft Ceilings)?`;
      const metaTitle = `${room.w}x${room.l} Drywall Calculator (${h}ft Ceiling) | BuildYardage`;
      const quickAnswer = `A ${room.w}x${room.l} room with ${h}ft ceilings requires ${res.sheetsNeeded} 4x8ft drywall panels (${res.totalAreaSqFt} sq ft total), along with ${res.tapeFeet} ft of joint tape and ${(res.compoundLbs / 4.5).toFixed(1)} gallons of joint compound.`;
      const metaDescription = `Hanging drywall in a ${room.w}x${room.l} room (${h}ft high)? You need ${res.sheetsNeeded} 4x8 panels (${res.totalAreaSqFt} sq ft). Get complete panel, tape, mud, and screw counts.`;

      pages.push({
        type: 'drywall',
        slug,
        urlPath,
        h1Title,
        metaTitle,
        metaDescription,
        quickAnswer,
        inputs: { wallLength: perimeter, wallHeight: h, openingsArea: 0, panelSize: '4x8', waste: 10 },
        calculatedOutputs: res,
        latexMath: {
          title: 'Drywall Panel Coverage Formula',
          formula: `\\text{4x8 Sheets} = \\left(\\frac{\\text{Wall Perimeter (ft)} \\times \\text{Ceiling Height (ft)}}{32}\\right) \\times 1.10`,
          explanation: `Wall perimeter = 2 × (${room.w} + ${room.l}) = ${perimeter} ft. Total area = ${perimeter} × ${h} = ${perimeter * h} sq ft. Divide by 32 sq ft per 4x8 sheet and add 10% waste for window headers/cuts to get ${res.sheetsNeeded} sheets.`
        },
        comparativeTable: {
          headers: ['Room Dimensions', '4x8 Sheets', '4x12 Sheets', 'Joint Compound (Gal)'],
          rows: DRYWALL_HEIGHTS.map(ht => {
            const dRes = calculateDrywall(room.l, room.w, ht, false, '4x8', 10, false);
            const d12Res = calculateDrywall(room.l, room.w, ht, false, '4x12', 10, false);
            return {
              label: `${room.w}x${room.l} Room (${ht}ft ceiling)`,
              volumeOrQty: `${dRes.sheetsNeeded} sheets`,
              bagsOrSticks: `${d12Res.sheetsNeeded} sheets`,
              estCostRange: `${(dRes.compoundLbs / 4.5).toFixed(1)} gal mud`,
              url: `/calculators/drywall/${room.w}x${room.l}-room-${ht}ft-ceiling`
            };
          })
        },
        jobsiteTips: [
          {
            title: 'Horizontal Installation Rule',
            desc: `Hang drywall panels horizontally across wall studs in your ${room.w}x${room.l} room to reduce total joint seams by 25% compared to vertical hanging.`
          },
          {
            title: 'Fastener Spacing Code',
            desc: `Space drywall screws every 12 inches on ceilings and 16 inches on walls. A ${room.w}x${room.l} room will require approx ${res.screwsNeeded} screws.`
          }
        ],
        faqs: [
          {
            question: `How many drywall sheets for a ${room.w}x${room.l} room with ${h}ft ceilings?`,
            answer: `You need ${res.sheetsNeeded} standard 4x8ft drywall sheets for a ${room.w}x${room.l} room with ${h}ft ceilings (including 10% waste buffer).`
          },
          {
            question: `How much joint compound mud for a ${room.w}x${room.l} room?`,
            answer: `You will need roughly ${(res.compoundLbs / 4.5).toFixed(1)} gallons of joint compound (approx ${Math.ceil((res.compoundLbs / 4.5) / 4.5)} standard 4.5-gallon buckets) and ${res.tapeFeet} feet of paper joint tape.`
          }
        ],
        nearbyLinks: DRYWALL_ROOMS.map(r => ({ title: `${r.w}x${r.l} Room (${h}ft Ceiling)`, url: `/calculators/drywall/${r.w}x${r.l}-room-${h}ft-ceiling` })),
        crossToolLinks: [
          { title: `Calculate Stud Wall Framing for ${room.w}x${room.l} Room`, url: `/calculators/framing/${perimeter}ft-wall-16oc`, category: 'Wood Framing' }
        ]
      });
    }
  }

  return pages;
}

// ----------------------------------------------------
// 5. FRAMING MATRIX
// ----------------------------------------------------
const FRAMING_LENGTHS = [8, 10, 12, 16, 20, 24, 30, 50, 100]; // feet
const FRAMING_SPACINGS = [16, 24]; // inches O.C.

export function getFramingPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  for (const len of FRAMING_LENGTHS) {
    for (const oc of FRAMING_SPACINGS) {
      const slug = `${len}ft-wall-${oc}oc`;
      const urlPath = `/calculators/framing/${slug}`;
      const res = calculateFraming(len, oc, 2, 2, 1, 10, false);

      const h1Title = `How Many 2x4 Studs Do I Need for a ${len} Foot Wall (${oc}" O.C. Spacing)?`;
      const metaTitle = `${len}ft Wall Framing Calculator (${oc}" O.C.) | BuildYardage`;
      const quickAnswer = `A ${len}ft wall framed at ${oc}" on-center with double top plates requires ${res.studsCount} vertical studs, plus ${res.topPlates16ft + res.bottomPlates16ft} commercial 16ft lumber sticks for top and sole plates.`;
      const metaDescription = `Framing a ${len}ft wall at ${oc}" O.C.? Requires ${res.studsCount} 2x4 studs and ${res.topPlates16ft + res.bottomPlates16ft} 16ft plate sticks. Get exact lumberyard ordering lists.`;

      pages.push({
        type: 'framing',
        slug,
        urlPath,
        h1Title,
        metaTitle,
        metaDescription,
        quickAnswer,
        inputs: { wallLength: len, studSpacing: oc, topPlatesOption: 'double', corners: 1, waste: 10 },
        calculatedOutputs: res,
        latexMath: {
          title: 'Stud Wall Framing Math Equation',
          formula: `\\text{Studs} = \\left(\\frac{\\text{Wall Length (in)}}{\\text{Spacing (in)}} + 1\\right) + \\text{Corners (3 per corner)} \\times 1.10`,
          explanation: `${len} ft = ${len * 12} in. Dividing by ${oc}" O.C. gives ${Math.ceil((len * 12) / oc)} layout spaces + 1 end stud + 3 extra corner studs. Adding 10% waste buffer yields ${res.studsCount} studs total.`
        },
        comparativeTable: {
          headers: ['Wall Length', '16" O.C. Studs', '24" O.C. Studs', '16ft Plate Sticks'],
          rows: FRAMING_LENGTHS.slice(0, 5).map(l => {
            const f16 = calculateFraming(l, 16, 2, 2, 1, 10, false);
            const f24 = calculateFraming(l, 24, 2, 2, 1, 10, false);
            return {
              label: `${l} Foot Wall`,
              volumeOrQty: `${f16.studsCount} studs`,
              bagsOrSticks: `${f24.studsCount} studs`,
              estCostRange: `${f16.topPlates16ft + f16.bottomPlates16ft} 16ft sticks`,
              url: `/calculators/framing/${l}ft-wall-${oc}oc`
            };
          })
        },
        jobsiteTips: [
          {
            title: 'Pressure Treated Bottom Plate',
            desc: `Always specify pressure-treated (PT) lumber for the bottom sole plate on a ${len}ft wall if framing directly over concrete.`
          },
          {
            title: 'Double Top Plate Overlap',
            desc: `Building code requires doubling top plates on structural walls. Stagger top plate joints by at least 4ft along your ${len}ft wall run.`
          }
        ],
        faqs: [
          {
            question: `How many studs for a ${len} foot wall framed at ${oc} inches on center?`,
            answer: `You will need ${res.studsCount} vertical 2x4 studs for a ${len}ft wall framed at ${oc}" O.C. (includes end studs, corner tie-ins, and 10% waste margin).`
          },
          {
            question: `Should I frame walls at 16" O.C. or 24" O.C.?`,
            answer: `16-inch O.C. is standard building code for load-bearing structural walls and heavy drywall support. 24-inch O.C. is used for non-load bearing interior partition walls or advanced energy framing.`
          }
        ],
        nearbyLinks: FRAMING_SPACINGS.map(s => ({ title: `${len}ft Wall (${s}" O.C.)`, url: `/calculators/framing/${len}ft-wall-${s}oc` })),
        crossToolLinks: [
          { title: `Drywall Sheet Calculator for ${len}ft Wall`, url: `/calculators/drywall/10x12-room-8ft-ceiling`, category: 'Drywall Sheets' }
        ]
      });
    }
  }

  return pages;
}

// ----------------------------------------------------
// 6. REBAR GRID MATRIX
// ----------------------------------------------------
const REBAR_SLABS = [
  { w: 10, l: 10 },
  { w: 12, l: 12 },
  { w: 20, l: 20 },
  { w: 24, l: 24 },
  { w: 30, l: 30 }
];
const REBAR_SIZES = ['num3', 'num4', 'num5']; // #3, #4, #5
const REBAR_SPACINGS = [12, 18]; // inches

export function getRebarPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  for (const slab of REBAR_SLABS) {
    for (const size of REBAR_SIZES) {
      for (const sp of REBAR_SPACINGS) {
        const barNumStr = size.replace('num', '#');
        const slug = `${slab.w}x${slab.l}-slab-bar-${size}`;
        const urlPath = `/calculators/rebar/${slug}`;
        const res = calculateRebar(slab.l, slab.w, 3, sp, 20, 18, 10, barNumStr, false);

        const h1Title = `How Much Rebar Do I Need for a ${slab.w}x${slab.l} Concrete Slab (${barNumStr} Bar)?`;
        const metaTitle = `${slab.w}x${slab.l} Rebar Grid Calculator (${barNumStr} Bar @ ${sp}" Spacing) | BuildYardage`;
        const quickAnswer = `A ${slab.w}x${slab.l} slab rebar grid using ${barNumStr} steel at ${sp}" grid spacing requires ${res.totalPieces} 20ft stock rebar sticks (${res.totalLength} total linear feet) weighing approx ${res.estimatedWeightLbs} lbs.`;
        const metaDescription = `Calculating rebar for a ${slab.w}x${slab.l} slab? Requires ${res.totalPieces} 20ft sticks of ${barNumStr} rebar (${res.estimatedWeightLbs} lbs). Includes 40d lap splices and grid spacing.`;

        pages.push({
          type: 'rebar',
          slug,
          urlPath,
          h1Title,
          metaTitle,
          metaDescription,
          quickAnswer,
          inputs: { length: slab.l, width: slab.w, spacing: sp, rebarSize: barNumStr, waste: 10 },
          calculatedOutputs: res,
          latexMath: {
            title: 'Rebar Grid Linear Feet Formula',
            formula: `\\text{Linear Feet} = \\left[(\\text{Lengthwise Bars} \\times W) + (\\text{Widthwise Bars} \\times L)\\right] \\times 1.10`,
            explanation: `Grid spacing is set to ${sp}" centers. Total net linear footage = ${res.totalLength} ft (including 40x bar diameter lap splices). Converted to ${res.totalPieces} commercial 20ft stock rebar sticks weighing ${res.estimatedWeightLbs} lbs.`
          },
          comparativeTable: {
            headers: ['Rebar Size', 'Grid Spacing', '20ft Rebar Sticks', 'Steel Weight (lbs)'],
            rows: REBAR_SIZES.map(s => {
              const bStr = s.replace('num', '#');
              const rRes = calculateRebar(slab.l, slab.w, 3, sp, 20, 18, 10, bStr, false);
              return {
                label: `${bStr} Steel Rebar`,
                volumeOrQty: `${sp}" Grid Center`,
                bagsOrSticks: `${rRes.totalPieces} sticks (20ft)`,
                estCostRange: `${rRes.estimatedWeightLbs} lbs`,
                url: `/calculators/rebar/${slab.w}x${slab.l}-slab-bar-${s}`
              };
            })
          },
          jobsiteTips: [
            {
              title: 'Rebar Chair Elevation',
              desc: `Support your ${slab.w}x${slab.l} rebar grid on 2" plastic or concrete chairs so steel sits in the structural upper 1/3 of the slab.`
            },
            {
              title: 'Lap Splice Rule',
              desc: `Building code requires a 40x bar diameter lap splice overlap when connecting 20ft rebar sticks. Our calculator automatically factors this overlap.`
            }
          ],
          faqs: [
            {
              question: `How many 20ft sticks of rebar for a ${slab.w}x${slab.l} slab?`,
              answer: `You need ${res.totalPieces} 20ft stock rebar sticks (${res.totalLength} linear feet) for a ${slab.w}x${slab.l} slab using ${barNumStr} rebar at ${sp}" grid spacing.`
            },
            {
              question: `What size rebar is best for a ${slab.w}x${slab.l} concrete slab?`,
              answer: `#4 (1/2" diameter) rebar is standard for residential driveway and patio slabs. #3 (3/8") is used for light sidewalk mesh; #5 (5/8") is used for heavy commercial footings.`
            }
          ],
          nearbyLinks: REBAR_SPACINGS.map(s => ({ title: `${slab.w}x${slab.l} Grid (${s}" Spacing)`, url: `/calculators/rebar/${slab.w}x${slab.l}-slab-bar-${size}` })),
          crossToolLinks: [
            { title: `Concrete Slab Calculator for ${slab.w}x${slab.l} Pour`, url: `/calculators/concrete-slab/${slab.w}x${slab.l}-4inch`, category: 'Concrete Slabs' },
            { title: `Gravel Base Tonnage for ${slab.w}x${slab.l} Grid`, url: `/calculators/gravel/${slab.w}x${slab.l}-4inch`, category: 'Aggregate Base' }
          ]
        });
      }
    }
  }

  return pages;
}

// Master Aggregator Map
export function getAllPseoPages(): PseoPageData[] {
  return [
    ...getConcreteSlabPseoPages(),
    ...getConcreteColumnPseoPages(),
    ...getGravelPseoPages(),
    ...getDrywallPseoPages(),
    ...getFramingPseoPages(),
    ...getRebarPseoPages()
  ];
}
