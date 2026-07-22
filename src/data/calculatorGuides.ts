export interface ToolGuide {
  slug: string;
  whatItDoes: {
    title: string;
    description: string;
    highlights: string[];
  };
  howToUse: {
    step1: { title: string; desc: string };
    step2: { title: string; desc: string };
    step3: { title: string; desc: string };
    step4: { title: string; desc: string };
  };
  whyBuildYardage: {
    reasons: { title: string; desc: string }[];
  };
  technicalGuide: {
    formulaTitle: string;
    formulaText: string;
    tips: { title: string; desc: string }[];
  };
}

export const calculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: 'What Does the Concrete Slab Calculator Do?',
      description: 'This tool computes exact concrete volume in cubic yards and cubic feet for rectangular slabs, driveways, patios, and garage floors. It automatically converts total volume into pre-mixed concrete bag counts (80lb, 60lb, and 40lb bags) and calculates total project cost based on your local ready-mix or bag pricing.',
      highlights: [
        'Calculates Net & Total Volume in Cubic Yards and Cubic Feet',
        'Breaks down pre-mix bag counts for 80lb (0.6 cu ft), 60lb (0.45 cu ft), and 40lb (0.3 cu ft) bags',
        'Applies customizable waste margin buffers (10% standard to prevent mid-pour shortages)',
        'Computes live cost estimates based on price per cubic yard or price per bag'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Enter Slab Dimensions',
        desc: 'Input length and width in feet/inches, plus slab thickness in inches (4" standard for patios/walkways, 6" for vehicle driveways).'
      },
      step2: {
        title: '2. Set Waste Factor',
        desc: 'Include a 10% waste buffer to account for sub-grade soil irregularities, form deflection, and pouring spillage.'
      },
      step3: {
        title: '3. Input Local Pricing',
        desc: 'Enter your local ready-mix price per cubic yard ($125–$160 avg) or bag price to see total material cost.'
      },
      step4: {
        title: '4. Save & Export Report',
        desc: 'Click "Add to Jobsite Shopping List" to combine with other material estimates or export a print-ready PDF.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM C94 Volumetric Accuracy',
          desc: 'Eliminates math errors and guesswork by adhering strictly to ASTM standard volumetric formulas.'
        },
        {
          title: 'Commercial Ready-Mix & Pre-Mix Bag Dual Output',
          desc: 'Instantly view whether ordering a ready-mix truck or buying individual 80lb bags is more cost-effective.'
        },
        {
          title: 'Ad-Free Contractor Efficiency',
          desc: 'No intrusive ads, bloated scripts, or paywalls—just lightning-fast calculation on desktop or mobile.'
        },
        {
          title: '100% Free Contractor Tool with Zero Fees',
          desc: 'Build Yardage is completely free to use for jobsite crews, contractors, and DIYers with no hidden fees or accounts required.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Concrete Slab Volumetric Formula',
      formulaText: 'Cubic Yards = (Length in feet × Width in feet × (Thickness in inches / 12)) / 27',
      tips: [
        {
          title: 'Compaction Sub-base Preparation',
          desc: 'Always place a 4" to 6" compacted gravel sub-base (crusher run or #57 stone) below concrete to ensure uniform drainage and prevent slab cracking.'
        },
        {
          title: 'Control Joint Placement',
          desc: 'Cut expansion/control joints every 8 to 12 feet (24x to 30x slab thickness) to control natural concrete expansion and contraction.'
        }
      ]
    }
  },

  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: 'What Does the Concrete Column Calculator Do?',
      description: 'This tool computes exact cylindrical concrete volume for round Sonotubes, deck footings, fence post holes, and structural pillars. It converts cylinder geometry into cubic yards, cubic feet, and pre-mixed bag counts while factoring in soil auger waste.',
      highlights: [
        'Computes cylinder volume for Sonotubes and round post footings',
        'Supports multi-hole batch calculation for fences, decks, and pole barns',
        'Calculates 80lb, 60lb, and 40lb pre-mix bag requirements per hole and in total',
        'Generates live material cost estimates for ready-mix or bag purchases'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Specify Column Size',
        desc: 'Enter the tube/hole diameter in inches (e.g. 8", 10", 12" Sonotube) and height/depth in feet or inches.'
      },
      step2: {
        title: '2. Set Total Column Count',
        desc: 'Enter the number of identical post holes or structural Sonotubes needed for your deck or fence project.'
      },
      step3: {
        title: '3. Adjust Waste Buffer',
        desc: 'Use 5% to 10% waste buffer to cover uneven post hole auger sides and bottom soil displacement.'
      },
      step4: {
        title: '4. Review Bags & Sonotubes',
        desc: 'View total Sonotube form lengths and premix bags required, then add to your compiled jobsite list.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Precision Cylinder Geometry Math',
          desc: 'Calculates exact geometric volume (π × r² × h) without rough approximation errors.'
        },
        {
          title: 'Multi-Post Hole Batching',
          desc: 'Calculate materials for 1 to 100+ fence posts or pier footings simultaneously in a single click.'
        },
        {
          title: 'Instant Sonotube & Bag Matching',
          desc: 'Know exactly how many 40lb, 60lb, or 80lb bags to pick up at the lumberyard.'
        },
        {
          title: '100% Free Contractor Tool with Zero Fees',
          desc: 'Build Yardage is completely free to use for jobsite crews, contractors, and DIYers with no hidden fees or accounts required.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Concrete Cylinder Volume Formula',
      formulaText: 'Cubic Yards = (π × (Diameter in inches / 24)² × Depth in feet) / 27 × Quantity',
      tips: [
        {
          title: 'Frost Line Depth Compliance',
          desc: 'Always extend post hole footings at least 6 inches below your local frost line to prevent winter soil heaving.'
        },
        {
          title: 'Bell-Bottom Footing Base',
          desc: 'Flare out the bottom of post holes (bell shape) to increase footing surface area and load-bearing capacity.'
        }
      ]
    }
  },

  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: 'What Does the Gravel Driveway Calculator Do?',
      description: 'This tool estimates aggregate volume in cubic yards and converts it directly into tons (and metric tonnes) for gravel driveways, parking pads, and sub-bases. It supports density customization for crusher run, pea gravel, #57 stone, and crushed granite.',
      highlights: [
        'Computes aggregate volume in Cubic Yards and Cubic Feet',
        'Converts volume to Weight in US Short Tons (default 1.4 tons/yd³) and Metric Tonnes',
        'Adjustable density presets for Crusher Run, Pea Gravel, #57 Stone, and Riprap',
        'Accounts for compaction settlement loss (10% to 15% standard buffer)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Measure Driveway Area',
        desc: 'Input length and width in feet (use average width for winding or curved driveways).'
      },
      step2: {
        title: '2. Set Base Layer Depth',
        desc: 'Enter depth in inches (4" for top dressing maintenance, 6"–8" for new gravel driveway sub-bases).'
      },
      step3: {
        title: '3. Select Aggregate Density',
        desc: 'Choose your aggregate type or enter custom density (e.g. 1.4 tons/yd³ for crushed stone).'
      },
      step4: {
        title: '4. Get Tonnage & Cost',
        desc: 'View exact tonnage to order from your local quarry, including estimated delivery cost.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'True Aggregate Density Weight Conversions',
          desc: 'Avoid under-ordering by using actual weight-per-yard density factors instead of rough averages.'
        },
        {
          title: 'Compaction Loss Allowance',
          desc: 'Built-in settlement buffer ensures you order enough material for roller or plate compaction.'
        },
        {
          title: 'Quarry-Ready Order Specs',
          desc: 'Provides exact tonnage specs ready to hand to your local aggregate supplier or gravel hauler.'
        },
        {
          title: '100% Free Contractor Tool with Zero Fees',
          desc: 'Build Yardage is completely free to use for jobsite crews, contractors, and DIYers with no hidden fees or accounts required.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Gravel Tonnage Calculation Formula',
      formulaText: 'Tons = ((Length in feet × Width in feet × (Depth in inches / 12)) / 27) × Material Density (tons/yd³)',
      tips: [
        {
          title: 'Sub-grade Geotextile Fabric',
          desc: 'Lay heavy-duty woven geotextile fabric over subsoil before spreading gravel to prevent stones from sinking into mud.'
        },
        {
          title: 'Driveway Crown & Drainage',
          desc: 'Grade the center of the driveway 1/2" per foot higher than shoulders so rainwater drains off sides effectively.'
        }
      ]
    }
  },

  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: 'What Does the Drywall Sheet Calculator Do?',
      description: 'This tool calculates the total number of drywall panels (4x8, 4x12, or 4x10 sheets) needed for room walls and ceilings. It automatically computes essential finishing supplies, including joint compound mud buckets, paper tape linear feet, and drywall screws.',
      highlights: [
        'Calculates 4x8 ft, 4x12 ft, and 4x10 ft drywall sheet counts',
        'Provides total wall and ceiling surface coverage in Square Feet',
        'Estimates Joint Tape feet (32 ft per sheet) & Mud gallons (0.05 gal/sq ft)',
        'Computes Drywall Screws count (approx 35 screws per 4x8 sheet)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Enter Room / Wall Dimensions',
        desc: 'Input wall perimeter length and ceiling height, or net total wall/ceiling square footage.'
      },
      step2: {
        title: '2. Deduct Openings',
        desc: 'Subtract doors and window surface area to get precise net drywall coverage.'
      },
      step3: {
        title: '3. Select Panel Size',
        desc: 'Choose 4x8 ft for standard handling or 4x12 ft to reduce joint seams on long walls.'
      },
      step4: {
        title: '4. Check Supply List',
        desc: 'Review required sheet counts, tape rolls, mud buckets, and screw box quantities.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Complete Drywall System Estimating',
          desc: 'Goes beyond sheet counts to estimate tape, joint compound, and drywall screws in one click.'
        },
        {
          title: 'Panel Size Optimization',
          desc: 'Compare 4x8 vs 4x12 sheet counts to minimize vertical seams and taping labor.'
        },
        {
          title: 'Cut & Waste Buffer Protection',
          desc: 'Built-in 10% waste buffer prevents running short due to angled cuts and window header waste.'
        },
        {
          title: '100% Free Contractor Tool with Zero Fees',
          desc: 'Build Yardage is completely free to use for jobsite crews, contractors, and DIYers with no hidden fees or accounts required.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Drywall Sheet Calculation Formula',
      formulaText: '4x8 Sheets = (Net Surface Area in sq ft / 32) × 1.10 (waste buffer)',
      tips: [
        {
          title: 'Horizontal Panel Hanging',
          desc: 'Hang drywall sheets horizontally across studs to bridge framing irregularities and create lower, easier-to-tape seams.'
        },
        {
          title: 'Staggered Joint Layout',
          desc: 'Stagger end joints between consecutive rows by at least 2 feet to prevent structural wall cracking.'
        }
      ]
    }
  },

  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: 'What Does the Wood Stud Wall Framing Calculator Do?',
      description: 'This tool computes exact 2x4 or 2x6 framing studs, single or double top plates, bottom sole plates, and 16ft lumber stick counts for stud wall construction. It supports standard 16" and 24" on-center (O.C.) spacing configurations.',
      highlights: [
        'Calculates Vertical Stud Count (including corners & wall tie-ins)',
        'Computes Linear Feet for Single/Double Top Plates and Bottom Sole Plate',
        'Supports standard 16" O.C. and 24" O.C. stud spacing rules',
        'Converts plates and studs into standard 16ft commercial lumber stick counts'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Enter Wall Length',
        desc: 'Input continuous wall length in feet.'
      },
      step2: {
        title: '2. Select Stud Spacing',
        desc: 'Choose 16" O.C. (standard structural load-bearing) or 24" O.C. (advanced framing / non-load bearing).'
      },
      step3: {
        title: '3. Select Top Plate Option',
        desc: 'Select Double Top Plate (standard structural building code) or Single Top Plate.'
      },
      step4: {
        title: '4. Get Lumber Stick Counts',
        desc: 'View total stud count, plate linear feet, and 16ft lumber sticks to order from the lumberyard.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Structural Wall Component Breakdown',
          desc: 'Distinguishes between vertical studs, bottom sole plates, and double top plates.'
        },
        {
          title: 'Lumberyard Commercial Stick Matching',
          desc: 'Translates linear footage directly into orderable 16ft dimensional lumber sticks.'
        },
        {
          title: 'Corner & Intersection Stud Factors',
          desc: 'Automatically includes extra studs required for structural corners and partition wall T-intersections.'
        },
        {
          title: '100% Free Contractor Tool with Zero Fees',
          desc: 'Build Yardage is completely free to use for jobsite crews, contractors, and DIYers with no hidden fees or accounts required.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Stud Count Calculation Formula',
      formulaText: 'Studs = (Wall Length in inches / Spacing in inches) + 1 + Corner Extra Studs (3 per corner)',
      tips: [
        {
          title: 'Pressure-Treated Sole Plate',
          desc: 'Always use pressure-treated lumber for bottom sole plates placed directly over concrete slabs to prevent rot.'
        },
        {
          title: 'Stud Crown Alignment',
          desc: 'Check the crown (curvature) of every stud before nailing—align all crowns facing the same direction for flat drywall walls.'
        }
      ]
    }
  },

  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: 'What Does the Rebar Grid Calculator Do?',
      description: 'This tool calculates steel rebar requirements for concrete slabs, footings, driveways, and retaining walls. It determines total rebar linear feet, 20ft stock rebar sticks, bar spacing grid counts, total steel weight by bar size (#3 to #8), and 40d lap splice overlaps.',
      highlights: [
        'Computes Grid Mesh Layout (Lengthwise & Widthwise bar counts)',
        'Bar Size Selector (#3 3/8", #4 1/2", #5 5/8", #6 3/4", #7 7/8", #8 1")',
        'Automatic 40x Diameter Lap Splice Overlap Allowance',
        'Outputs Total Rebar Linear Feet, 20ft Stock Sticks, and Steel Weight in lbs'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Enter Grid Dimensions',
        desc: 'Input rebar grid length and width in feet.'
      },
      step2: {
        title: '2. Specify Bar Grid Spacing',
        desc: 'Enter grid spacing in inches (e.g. 12", 18", or 24" grid centers).'
      },
      step3: {
        title: '3. Select Rebar Bar Size',
        desc: 'Pick your rebar size (#4 1/2" is standard for driveway slabs; #5 for heavy footings).'
      },
      step4: {
        title: '4. View Sticks & Steel Weight',
        desc: 'Review total 20ft rebar sticks, linear footage, and total steel weight in pounds.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM Standard Rebar Weight per Foot Math',
          desc: 'Uses exact steel weight constants per foot for #3 through #8 rebar sizes.'
        },
        {
          title: 'Automatic 40d Lap Splice Calculation',
          desc: 'Accounts for continuous bar lap splices (40x bar diameter overlap) so you never run short.'
        },
        {
          title: 'Commercial Steel Weight & Stick Output',
          desc: 'Provides exact stick counts and total tonnage/poundage required for steel supplier orders.'
        },
        {
          title: '100% Free Contractor Tool with Zero Fees',
          desc: 'Build Yardage is completely free to use for jobsite crews, contractors, and DIYers with no hidden fees or accounts required.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Rebar Grid Linear Feet Formula',
      formulaText: 'Linear Feet = ((Widthwise Bars × Length) + (Lengthwise Bars × Width)) × (1 + Lap Splice Factor)',
      tips: [
        {
          title: 'Rebar Chair Elevation',
          desc: 'Support rebar grids on plastic chairs or concrete dobies to keep steel elevated in the middle to upper 1/3 of the slab.'
        },
        {
          title: 'Intersection Tie Wire Rule',
          desc: 'Tie rebar intersections with 16-gauge wire; never weld standard rebar unless using weldable A706 grade steel.'
        }
      ]
    }
  }
};
