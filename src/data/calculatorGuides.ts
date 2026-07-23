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

const esCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: '¿Qué hace la Calculadora de Losa de Concreto?',
      description: 'Esta herramienta calcula el volumen exacto de concreto en yardas cúbicas y pies cúbicos para losas rectangulares, entradas de vehículos, patios y pisos de garaje. Convierte automáticamente el volumen total en sacos de concreto premezclado (80 lb, 60 lb y 40 lb) y calcula el costo total estimado.',
      highlights: [
        'Calcula volumen neto y total en yardas y pies cúbicos',
        'Desglosa sacos premezclados de 80 lb (0.6 ft³), 60 lb (0.45 ft³) y 40 lb (0.3 ft³)',
        'Aplica margen de desperdicio personalizable (10% estándar)',
        'Estimación de costos en tiempo real basada en precio por yarda o por saco'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Ingrese dimensiones de la losa',
        desc: 'Ingrese longitud y ancho en pies/pulgadas, más el espesor de la losa en pulgadas (4" para patios, 6" para entradas de vehículos).'
      },
      step2: {
        title: '2. Establezca el margen de desperdicio',
        desc: 'Incluya un margen de desperdicio del 10% para compensar irregularidades del suelo y derrames durante el colado.'
      },
      step3: {
        title: '3. Ingrese precios locales',
        desc: 'Ingrese el precio local por yarda cúbica de concreto premezclado o por saco para ver el costo total del material.'
      },
      step4: {
        title: '4. Guarde y exporte su informe',
        desc: 'Haga clic en "Agregar a lista de compras" para combinar estimaciones o exportar un PDF listo para imprimir.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Precisión Volumétrica ASTM C94',
          desc: 'Elimina errores matemáticos cumpliendo estrictamente con las fórmulas volumétricas estándar de la norma ASTM.'
        },
        {
          title: 'Salida Doble: Camión y Sacos Premezclados',
          desc: 'Vea al instante si es más rentable pedir un camión de mezcla lista o comprar sacos individuales de 80 lb.'
        },
        {
          title: 'Eficiencia para Contratistas sin Anuncios',
          desc: 'Cálculo ultrarrápido en escritorio o móvil sin anuncios molestos ni cobros.'
        },
        {
          title: 'Herramienta 100% Gratuita sin Tarifas',
          desc: 'Build Yardage es completamente gratuito para equipos de obra, contratistas y particulares sin tarifas ocultas.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula Volumétrica de Losa de Concreto',
      formulaText: 'Yardas Cúbicas = (Largo en ft × Ancho en ft × (Espesor en in / 12)) / 27',
      tips: [
        {
          title: 'Preparación de Sub-base Compactada',
          desc: 'Coloque siempre una sub-base de grava compactada de 4" a 6" debajo del concreto para garantizar drenaje y evitar grietas.'
        },
        {
          title: 'Ubicación de Juntas de Control',
          desc: 'Corte juntas de dilatación/control cada 8 a 12 pies para controlar la expansión y contracción natural del concreto.'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: '¿Qué hace la Calculadora de Columnas de Concreto?',
      description: 'Calcula el volumen cilíndrico exacto de concreto para tubos Sonotube, zapatas de terrazas, postes de cercas y pilares estructurales, convirtiendo la geometría en yardas cúbicas y sacos premezclados.',
      highlights: [
        'Calcula volumen cilíndrico para Sonotubes y cimentaciones redondas',
        'Soporta cálculo por lotes para múltiples postes y cercas',
        'Determina cantidad de sacos de 80 lb, 60 lb y 40 lb requeridos',
        'Genera estimaciones de costo en tiempo real'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Especifique el tamaño de la columna',
        desc: 'Ingrese el diámetro del tubo en pulgadas (ej. 8", 10", 12") y la altura o profundidad en pies/pulgadas.'
      },
      step2: {
        title: '2. Establezca la cantidad de columnas',
        desc: 'Ingrese el número total de pozos o tubos Sonotube idénticos necesarios para su proyecto.'
      },
      step3: {
        title: '3. Ajuste el margen de desperdicio',
        desc: 'Use entre 5% y 10% de desperdicio para cubrir irregularidades en las paredes de la excavación.'
      },
      step4: {
        title: '4. Revise sacos y tubos',
        desc: 'Vea la longitud total de Sonotubes y la cantidad de sacos de concreto necesarios.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Geometría Cilíndrica Precisa',
          desc: 'Calcula el volumen geométrico exacto (π × r² × h) evitando errores de aproximación.'
        },
        {
          title: 'Cálculo por Lotes para Múltiples Postes',
          desc: 'Calcule materiales para 1 a más de 100 postes simultáneamente con un solo clic.'
        },
        {
          title: 'Desglose Inmediato de Sacos',
          desc: 'Conozca exactamente cuántos sacos de 40 lb, 60 lb o 80 lb adquirir.'
        },
        {
          title: 'Herramienta 100% Gratuita',
          desc: 'Uso completamente libre y sin registro para contratistas y constructores.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Volumen de Cilindro de Concreto',
      formulaText: 'Yardas Cúbicas = (π × (Diámetro en pulg / 24)² × Profundidad en ft) / 27 × Cantidad',
      tips: [
        {
          title: 'Profundidad Bajo la Línea de Congelación',
          desc: 'Extienda las zapatas al menos 6 pulgadas por debajo de la línea de congelación local para prevenir desplazamientos por heladas.'
        },
        {
          title: 'Base Ensanchada (Campana)',
          desc: 'Ensanche la base del pozo en forma de campana para aumentar la superficie de apoyo y capacidad de carga.'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: '¿Qué hace la Calculadora de Grava para Entradas?',
      description: 'Estimación de volumen de agregados en yardas cúbicas y conversión directa a toneladas para entradas de grava, estacionamientos y sub-bases, soportando densidad para grava triturada, piedra #57 y granito.',
      highlights: [
        'Calcula volumen de agregados en yardas cúbicas y pies cúbicos',
        'Convierte volumen a peso en toneladas estadounidenses y métricas',
        'Ajustes de densidad para piedra triturada, grava fina y balasto',
        'Toma en cuenta la compactación del terreno (10% a 15% de margen)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Mida el área de la entrada',
        desc: 'Ingrese longitud y ancho en pies (use el ancho promedio para entradas curvas).'
      },
      step2: {
        title: '2. Establezca la profundidad',
        desc: 'Ingrese la profundidad en pulgadas (4" para mantenimiento, 6"–8" para bases nuevas).'
      },
      step3: {
        title: '3. Seleccione la densidad del agregado',
        desc: 'Elija el tipo de material o ingrese una densidad personalizada (ej. 1.4 ton/yd³).'
      },
      step4: {
        title: '4. Obtenga tonelaje y costo',
        desc: 'Vea el tonelaje exacto que debe solicitar a su cantera local con costo estimado de envío.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Conversión Real de Peso por Densidad',
          desc: 'Evite pedir material insuficiente utilizando factores de densidad reales por yarda.'
        },
        {
          title: 'Tolerancia para Perda por Compactación',
          desc: 'El margen de asentamiento integrado garantiza material suficiente tras el paso del rodillo.'
        },
        {
          title: 'Especificaciones Listas para Cantera',
          desc: 'Proporciona datos exactos en toneladas listos para entregar a su proveedor de agregados.'
        },
        {
          title: 'Herramienta Gratuita para Profesionales',
          desc: 'Totalmente gratuita y sin publicidad intrusiva.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Cálculo de Tonelaje de Grava',
      formulaText: 'Toneladas = ((Largo en ft × Ancho en ft × (Profundidad en in / 12)) / 27) × Densidad (ton/yd³)',
      tips: [
        {
          title: 'Geotextil para Sub-base',
          desc: 'Coloque malla geotextil de alta resistencia sobre el suelo antes de extender la grava para evitar que las piedras se hundan en el barro.'
        },
        {
          title: 'Bombeo y Drenaje',
          desc: 'Dé una pendiente transversal de 1/2 pulgada por pie hacia los lados para permitir el drenaje del agua de lluvia.'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: '¿Qué hace la Calculadora de Paneles de Yeso (Drywall)?',
      description: 'Calcula la cantidad total de paneles de yeso (4x8, 4x12 o 4x10 ft) requeridos para paredes y techos, calculando también cinta de junta, masilla (mud) y tornillos.',
      highlights: [
        'Calcula cantidad de paneles en formato 4x8 ft, 4x12 ft y 4x10 ft',
        'Proporciona la cobertura total en pies cuadrados',
        'Estima pies de cinta de papel (32 ft/panel) y galones de pasta',
        'Calcula cantidad aproximada de tornillos para drywall'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Ingrese dimensiones de la habitación',
        desc: 'Ingrese el perímetro de paredes y altura de techo, o los pies cuadrados totales.'
      },
      step2: {
        title: '2. Descuente aberturas',
        desc: 'Reste el área de puertas y ventanas para obtener la cobertura neta real.'
      },
      step3: {
        title: '3. Seleccione el tamaño de panel',
        desc: 'Elija 4x8 ft para manejo estándar o 4x12 ft para reducir juntas en paredes largas.'
      },
      step4: {
        title: '4. Verifique la lista de suministros',
        desc: 'Revise paneles, rollos de cinta, cubetas de pasta y cajas de tornillos necesarios.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Estimación Completa del Sistema Drywall',
          desc: 'Calcula paneles, cinta, masilla y tornillos en un solo paso.'
        },
        {
          title: 'Optimización del Tamaño de Placa',
          desc: 'Compare formatos 4x8 frente a 4x12 para reducir empalmes y trabajo de masillado.'
        },
        {
          title: 'Margen de Desperdicio Incluido',
          desc: 'Protección del 10% contra faltantes debido a cortes angulares y recortes.'
        },
        {
          title: 'Uso 100% Gratuito',
          desc: 'Sin cobros ni registros para contratistas y remodeladores.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Cálculo de Paneles de Yeso',
      formulaText: 'Placas 4x8 = (Área Neta en sq ft / 32) × 1.10 (margen de desperdicio)',
      tips: [
        {
          title: 'Instalación Horizontal',
          desc: 'Instale los paneles horizontalmente cruzando los parantes para disimular imperfecciones y facilitar el masillado.'
        },
        {
          title: 'Juntas Trabadas (Escalonadas)',
          desc: 'Escalone las juntas verticales entre filas consecutivas al menos 2 pies para evitar fisuras en la pared.'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: '¿Qué hace la Calculadora de Estructura de Madera (Framing)?',
      description: 'Calcula parantes (studs) de 2x4 o 2x6, soleras superiores simples o dobles, solera inferior y listones de madera de 16 ft para la construcción de muros con separación de 16" o 24" O.C.',
      highlights: [
        'Calcula parantes verticales (incluyendo esquinas e intersecciones)',
        'Calcula pies lineales para solera inferior y soleras superiores',
        'Soporta normas de separación estándar a 16" O.C. y 24" O.C.',
        'Convierte soleras y parantes a tiras comerciales de madera de 16 ft'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Ingrese la longitud de la pared',
        desc: 'Ingrese la longitud continua de la pared en pies.'
      },
      step2: {
        title: '2. Seleccione la separación de parantes',
        desc: 'Elija 16" O.C. (estructural de carga) o 24" O.C. (avanzado / no portante).'
      },
      step3: {
        title: '3. Seleccione la opción de solera superior',
        desc: 'Elija Solera Doble (código estructural estándar) o Solera Simple.'
      },
      step4: {
        title: '4. Obtenga la cantidad de tiras de madera',
        desc: 'Vea el total de parantes, pies lineales de soleras y piezas de 16 ft a comprar.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Desglose Estructural Completo',
          desc: 'Diferencia parantes verticales, solera inferior y solera doble superior.'
        },
        {
          title: 'Conversión a Medidas Comerciales de Depósito',
          desc: 'Traduce los pies lineales directamente a tiras de madera de 16 pies.'
        },
        {
          title: 'Factores de Esquinas e Intersecciones',
          desc: 'Agrega automáticamente los parantes adicionales necesarios para esquinas y cruces en T.'
        },
        {
          title: 'Herramienta Totalmente Gratuita',
          desc: 'Diseñada para carpinteros y constructores sin costo alguno.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Cálculo de Parantes (Studs)',
      formulaText: 'Parantes = (Largo de Pared en in / Separación en in) + 1 + Extras por Esquina (3 por esquina)',
      tips: [
        {
          title: 'Solera Inferior Tratada a Presión',
          desc: 'Utilice siempre madera tratada para la solera inferior que apoya directamente sobre el concreto para evitar pudrición.'
        },
        {
          title: 'Alineación del Canto (Comba)',
          desc: 'Oriente la curvatura natural de todos los parantes en la misma dirección antes de clavar para lograr paredes perfectamente planas.'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: '¿Qué hace la Calculadora de Malla de Varilla de Refuerzo (Rebar)?',
      description: 'Calcula los requerimientos de varilla de acero para losas de concreto, cimentaciones y muros de contención, determinando pies lineales, barras comerciales de 20 ft, peso total por calibre (#3 a #8) y traslapes de 40d.',
      highlights: [
        'Diseña retículas longitudinales y transversales',
        'Selector de calibre (#3 3/8", #4 1/2", #5 5/8", #6 3/4", #7 7/8", #8 1")',
        'Factor automático de traslape de 40 veces el diámetro (40d)',
        'Muestra pies lineales totales, barras de 20 ft y peso en libras/kg'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Ingrese dimensiones de la malla',
        desc: 'Ingrese longitud y ancho de la parrilla de refuerzo en pies.'
      },
      step2: {
        title: '2. Especifique la separación de varillas',
        desc: 'Ingrese la separación en pulgadas (ej. retícula a 12", 18" o 24").'
      },
      step3: {
        title: '3. Seleccione el calibre de varilla',
        desc: 'Elija el tamaño (#4 1/2" es estándar para losas de entrada; #5 para cimentaciones).'
      },
      step4: {
        title: '4. Consulte barras y peso de acero',
        desc: 'Revise el total de barras de 20 ft, pies lineales y peso total en libras.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Pesos Estándar ASTM por Pie Líneal',
          desc: 'Utiliza constantes exactas de peso de acero por pie para calibres #3 a #8.'
        },
        {
          title: 'Cálculo Automático de Traslape 40d',
          desc: 'Considera los empalmes continuos (40 diámetros de traslape) para evitar faltantes en obra.'
        },
        {
          title: 'Salida en Toneladas y Piezas Comerciales',
          desc: 'Genera cantidades listas para solicitar la compra al distribuidor de acero.'
        },
        {
          title: '100% Gratuito para la Construcción',
          desc: 'Sin suscripciones ni costos para profesionales de la obra.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Pies Lineales de Varilla',
      formulaText: 'Pies Lineales = ((Varillas Transversales × Largo) + (Varillas Longitudinales × Ancho)) × (1 + Factor Traslape)',
      tips: [
        {
          title: 'Elevación con Silletas (Adobes)',
          desc: 'Apoye la malla sobre silletas plásticas o dados de concreto para mantener el acero en el tercio medio o superior de la losa.'
        },
        {
          title: 'Amarre de Intersecciones',
          desc: 'Asegure los cruces con alambre recocido calibre 16; nunca solde varilla común a menos que sea grado A706 soldable.'
        }
      ]
    }
  }
};

const frCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: 'Que fait le Calculateur de Dalle en Béton ?',
      description: 'Cet outil calcule le volume exact de béton en yards cubes et pieds cubes pour les dalles rectangulaires, allées, terrasses et sols de garage. Il convertit automatiquement le volume en sacs de béton prêt à l\'emploi (80lb, 60lb, 40lb) et estime le coût total.',
      highlights: [
        'Calcule le volume net et total en yards cubes et pieds cubes',
        'Détaille le nombre de sacs de 80lb (0,6 ft³), 60lb (0,45 ft³) et 40lb (0,3 ft³)',
        'Applique une marge de perte personnalisable (10% standard)',
        'Estimation des coûts en direct selon le prix au yard cube ou par sac'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Saisissez les dimensions',
        desc: 'Entrez la longueur, la largeur en pieds/pouces et l\'épaisseur en pouces (4" pour terrasse, 6" pour allée).'
      },
      step2: {
        title: '2. Définissez la marge de perte',
        desc: 'Incluez un tampon de 10% pour compenser les irrégularités du sol et les déversements.'
      },
      step3: {
        title: '3. Indiquez les prix locaux',
        desc: 'Entrez le prix local du béton au yard cube ou par sac pour obtenir le coût total des matériaux.'
      },
      step4: {
        title: '4. Enregistrez et exportez',
        desc: 'Cliquez sur "Ajouter à la liste" pour combiner vos estimations ou exporter un rapport PDF.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Précision Volumétrique ASTM C94',
          desc: 'Élimine les erreurs de calcul en respectant strictement les formules volumétriques ASTM.'
        },
        {
          title: 'Double Sortie : Toupie & Sacs Prêts à l\'Emploi',
          desc: 'Voyez instantanément s\'il est plus rentable de commander un camion toupie ou d\'acheter des sacs de 80lb.'
        },
        {
          title: 'Efficacité Professionnelle Sans Publicité',
          desc: 'Pas de pubs intempestives ni de frais—calcul ultra-rapide sur mobile et ordinateur.'
        },
        {
          title: 'Outil 100% Gratuit Sans Aucun Frais',
          desc: 'Build Yardage est entièrement gratuit pour les équipes de chantier, artisans et bricoleurs.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formule Volumétrique pour Dalle en Béton',
      formulaText: 'Yards Cubes = (Longueur en ft × Largeur en ft × (Épaisseur en in / 12)) / 27',
      tips: [
        {
          title: 'Préparation de la Sous-couche Compactée',
          desc: 'Placez toujours une sous-couche de gravier compacté de 4" à 6" sous le béton pour assurer un bon drainage.'
        },
        {
          title: 'Placement des Joints de Fractionnement',
          desc: 'Coupez des joints de dilatation tous les 8 à 12 pieds pour contrôler le retrait naturel du béton.'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: 'Que fait le Calculateur de Poteaux en Béton ?',
      description: 'Calcule le volume cylindrique exact de béton pour tubes Sonotube, fondations de terrasses et poteaux de clôture, avec conversion en sacs prêts à l\'emploi.',
      highlights: [
        'Volume cylindrique pour Sonotubes et semelles rondes',
        'Gestion multi-trous pour clôtures et poteaux',
        'Besoins précis en sacs de 80lb, 60lb et 40lb',
        'Estimation des coûts de bétonnage'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Spécifiez le diamètre et la hauteur',
        desc: 'Indiquez le diamètre du tube en pouces (ex. 8", 10", 12") et la profondeur en pieds/pouces.'
      },
      step2: {
        title: '2. Indiquez le nombre de poteaux',
        desc: 'Entrez le nombre total de trous ou Sonotubes identiques pour votre projet.'
      },
      step3: {
        title: '3. Ajustez la marge de perte',
        desc: 'Ajoutez 5% à 10% pour couvrir les parois irrégulières du forage.'
      },
      step4: {
        title: '4. Consultez les résultats',
        desc: 'Obtenez les longueurs de Sonotube et le nombre total de sacs requis.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Calcul Géométrique Précis',
          desc: 'Calcul exact du volume cylindrique (π × r² × h) sans approximations.'
        },
        {
          title: 'Calcul en Lot Multi-Poteaux',
          desc: 'Estimez les matériaux pour 1 à plus de 100 poteaux en un seul clic.'
        },
        {
          title: 'Correspondance Immédiate des Sacs',
          desc: 'Sachez exactement combien de sacs acheter en magasin.'
        },
        {
          title: '100% Gratuit pour le BTP',
          desc: 'Outil sans abonnement ni création de compte.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formule de Volume d\'un Cylindre en Béton',
      formulaText: 'Yards Cubes = (π × (Diamètre en in / 24)² × Profondeur en ft) / 27 × Quantité',
      tips: [
        {
          title: 'Profondeur Hors Gel',
          desc: 'Ancrez toujours les fondations au moins 6 pouces sous la limite du gel local.'
        },
        {
          title: 'Base Évasée (Pied d\'Éléphant)',
          desc: 'Évasez le fond du trou pour augmenter la surface d\'appui de la fondation.'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: 'Que fait le Calculateur de Gravier pour Allée ?',
      description: 'Estime le volume d\'agrégats en yards cubes et convertit en tonnes pour allées, parkings et sous-couches.',
      highlights: [
        'Volume en yards cubes et pieds cubes',
        'Conversion en tonnes US et tonnes métriques',
        'Préréglages de densité pour gravier tracé, concassé et galets',
        'Prise en compte du tassement (buffer 10%-15%)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Mesurez l\'allée',
        desc: 'Entrez la longueur et la largeur moyenne en pieds.'
      },
      step2: {
        title: '2. Définissez l\'épaisseur',
        desc: 'Saisissez l\'épaisseur en pouces (4" rechargement, 6"-8" création complète).'
      },
      step3: {
        title: '3. Choisissez la densité',
        desc: 'Sélectionnez le type de roche ou saisissez la densité spécifique.'
      },
      step4: {
        title: '4. Obtenez le tonnage',
        desc: 'Visualisez le tonnage exact à commander auprès de la carrière.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Conversion Réelle au Poids',
          desc: 'Basé sur les densités réelles des matériaux concassés.'
        },
        {
          title: 'Inclusion du Tassement',
          desc: 'Anticipe la compression sous le rouleau compresseur.'
        },
        {
          title: 'Spécifications Prêtes pour Carrière',
          desc: 'Données prêtes à transmettre au transporteur.'
        },
        {
          title: 'Outil Gratuit et Rapide',
          desc: 'Accès instantané sans inscription.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formule du Tonnage de Gravier',
      formulaText: 'Tonnes = ((Longueur en ft × Largeur en ft × (Profondeur en in / 12)) / 27) × Densité (ton/yd³)',
      tips: [
        {
          title: 'Géotextile de Séparation',
          desc: 'Posez un feutre géotextile avant le gravier pour empêcher l\'enfoncement dans la terre.'
        },
        {
          title: 'Pente et Écoulement',
          desc: 'Créez un bombé central pour favoriser l\'évacuation des eaux de pluie.'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: 'Que fait le Calculateur de Plaques de Plâtre (BA13 / Drywall) ?',
      description: 'Calcule le nombre de plaques de plâtre (4x8, 4x12 ft) nécessaires pour cloisons et plafonds, ainsi que les bandes à joint, l\'enduit et la visserie.',
      highlights: [
        'Comptage des plaques 4x8, 4x12 et 4x10 pieds',
        'Surface totale en pieds carrés / mètres carrés',
        'Calcul des rouleaux de bande à joint et seaux d\'enduit',
        'Nombre estimé de vis à placoplâtre'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Saisissez les dimensions de la pièce',
        desc: 'Entrez le périmètre des murs et la hauteur sous plafond.'
      },
      step2: {
        title: '2. Déduisez les ouvertures',
        desc: 'Soustrayez les portes et fenêtres pour la surface nette.'
      },
      step3: {
        title: '3. Choisissez le format de plaque',
        desc: 'Sélectionnez 4x8 ft standard ou 4x12 ft pour réduire les joints.'
      },
      step4: {
        title: '4. Consultez la liste des fournitures',
        desc: 'Vérifiez plaques, bandes, enduits et boîtes de vis.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Estimation Complète du Système Plâtre',
          desc: 'Combine plaques, enduits, bandes et vis en une seule étape.'
        },
        {
          title: 'Optimisation du Format',
          desc: 'Comparez les formats pour minimiser les chutes et le jointoiement.'
        },
        {
          title: 'Marge de Perte Intégrée',
          desc: 'Tampon de 10% pour couvrir les découpes d\'angles.'
        },
        {
          title: 'Utilisation 100% Gratuite',
          desc: 'Aucun paiement ni publicité intrusive.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formule de Calcul des Plaques de Plâtre',
      formulaText: 'Plaques 4x8 = (Surface Nette en sq ft / 32) × 1.10 (marge de perte)',
      tips: [
        {
          title: 'Pose Horizontale',
          desc: 'Posez les plaques perpendiculairement aux montants pour renforcer la structure.'
        },
        {
          title: 'Joints Croisés',
          desc: 'Décallez les joints verticaux d\'au moins 60 cm pour éviter les fissures.'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: 'Que fait le Calculateur d\'Ossature Bois (Framing) ?',
      description: 'Calcule les montants verticaux (studs), lisses basses et lisses hautes pour murs en bois avec entraxe 16" ou 24" O.C.',
      highlights: [
        'Nombre de montants verticaux (angles et intersections compris)',
        'Métrage linéaire pour lisses basses et doubleries hautes',
        'Prise en compte des entraxes 16" et 24" O.C.',
        'Conversion en pièces de bois commerciales de 16 pieds'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Indiquez la longueur du mur',
        desc: 'Entrez la longueur totale du mur en pieds.'
      },
      step2: {
        title: '2. Choisissez l\'entraxe',
        desc: 'Sélectionnez 16" O.C. (porteur) ou 24" O.C. (cloison).'
      },
      step3: {
        title: '3. Option de lisse haute',
        desc: 'Choisissez lisse double (norme portante) ou lisse simple.'
      },
      step4: {
        title: '4. Obtenez le débit de bois',
        desc: 'Consultez le nombre de montants et pièces de 16ft à commander.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Détail Complet de l\'Ossature',
          desc: 'Distingue montants, lisse basse et lisse double.'
        },
        {
          title: 'Conversion pour Négoce de Matériaux',
          desc: 'Convertit les mètres linéaires en bois de charpente standard.'
        },
        {
          title: 'Calcul des Angles et Raccords',
          desc: 'Intègre automatiquement les montants d\'angle et de départ.'
        },
        {
          title: '100% Gratuit',
          desc: 'Conçu pour les charpentiers et auto-constructeurs.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formule de Calcul des Montants',
      formulaText: 'Montants = (Longueur Mur en in / Entraxe en in) + 1 + Extras Angles (3 par angle)',
      tips: [
        {
          title: 'Lisse Basse Traitée',
          desc: 'Utilisez du bois traité en autoclave pour la lisse basse en contact avec la dalle béton.'
        },
        {
          title: 'Orientation du Courbage du Bois',
          desc: 'Orientez la courbure de tous les montants dans le même sens avant clouage.'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: 'Que fait le Calculateur de Ferraillage et Armatures (Rebar) ?',
      description: 'Détermine les besoins en fers à béton pour dalles et semelles, métrage linéaire, barres de 6m (20ft), poids d\'acier par diamètre (#3 à #8) et recouvrements 40d.',
      highlights: [
        'Quadrillage armature (barres longitudinales et transversales)',
        'Choix des diamètres (#3 à #8 / 10mm à 25mm)',
        'Inclusion automatique des chevauchements de sécurité 40d',
        'Poids total d\'acier et nombre de barres'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Saisissez les dimensions du maillage',
        desc: 'Entrez la longueur et la largeur de la cage de ferraillage.'
      },
      step2: {
        title: '2. Indiquez l\'écartement des barres',
        desc: 'Saisissez l\'espacement du quadrillage (ex. 12", 18" ou 24").'
      },
      step3: {
        title: '3. Choisissez le diamètre',
        desc: 'Sélectionnez la section de fer (ex. #4 1/2" pour dalle).'
      },
      step4: {
        title: '4. Visualisez le poids et le nombre de barres',
        desc: 'Vérifiez le nombre de barres de 20ft et le poids total d\'acier.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Normalisation des Poids d\'Acier',
          desc: 'Formules officielles basées sur le poids au mètre linéaire.'
        },
        {
          title: 'Recouvrement 40d Automatique',
          desc: 'Prend en compte les longueurs d\'ancrage et de jonction.'
        },
        {
          title: 'Données Prêtes pour Armaturier',
          desc: 'Fournit la quantité exacte de barres à commander.'
        },
        {
          title: 'Accès 100% Gratuit',
          desc: 'Outil libre d\'accès pour tous vos chantiers.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formule des Mètres Linéaires d\'Armature',
      formulaText: 'Mètres Linéaires = ((Barres Transversales × Longueur) + (Barres Longitudinales × Largeur)) × (1 + Facteur Recouvrement)',
      tips: [
        {
          title: 'Cales à Béton (Plaquettes)',
          desc: 'Surélevez l\'armature avec des cales en plastique ou béton pour enrober les fers.'
        },
        {
          title: 'Ligature au Fil Recuit',
          desc: 'Attachez les croisements au fil de fer recuit 1,6 mm sans souder les aciers standards.'
        }
      ]
    }
  }
};

const deCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: 'Was macht dieser Betonplatten-Rechner?',
      description: 'Dieses Werkzeug berechnet das genaue Betonvolumen in Kubikyards und Kubikfuß für rechteckige Platten, Einfahrten, Terrassen und Garagenböden. Es rechnet das Gesamtvolumen automatisch in Trockenbetonsäcke (80lb, 60lb, 40lb) um und schätzt die Gesamtkosten.',
      highlights: [
        'Berechnet Netto- & Gesamtvolumen in Kubikyards und Kubikfuß',
        'Aufschlüsselung der Sackbarzahl für 80lb-, 60lb- und 40lb-Säcke',
        'Anpassbarer Verschnittpuffer (10% Standard)',
        'Echtzeit-Kostenschätzung nach Kubikyard- oder Sackpreis'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Abmessungen eingeben',
        desc: 'Geben Sie Länge und Breite in Fuß/Zoll sowie die Plattendicke in Zoll ein (4" für Terrassen, 6" für Einfahrten).'
      },
      step2: {
        title: '2. Verschnittfaktor festlegen',
        desc: 'Rechnen Sie 10% Verschnitt ein, um Bodenunebenheiten und Verschütten auszugleichen.'
      },
      step3: {
        title: '3. Lokale Preise eingeben',
        desc: 'Geben Sie den Preis pro Kubikyard oder Sack ein, um die Gesamtmaterialkosten zu sehen.'
      },
      step4: {
        title: '4. Speichern & Exportieren',
        desc: 'Klicken Sie auf "Zur Einkaufsliste hinzufügen" oder exportieren Sie ein druckfertiges PDF.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM C94 Volumetric Accuracy',
          desc: 'Eliminiert Rechenfehler durch strenge Einhaltung der ASTM-Volumenformeln.'
        },
        {
          title: 'Doppelte Ausgabe: Lieferbeton & Sackware',
          desc: 'Erkennen Sie sofort, ob sich ein Betonmischer oder der Kauf einzelner 80lb-Säcke mehr lohnt.'
        },
        {
          title: 'Werbefreie Effizienz für Profis',
          desc: 'Keine störende Werbung oder Bezahlschranken—blitzschnelle Berechnung auf jedem Gerät.'
        },
        {
          title: '100% Kostenloses Profi-Werkzeug',
          desc: 'Build Yardage ist für Baustellenteams, Handwerker und Heimwerker völlig kostenlos.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Volumenformel für Betonplatten',
      formulaText: 'Kubikyards = (Länge in ft × Breite in ft × (Dicke in in / 12)) / 27',
      tips: [
        {
          title: 'Verdichtete Unterbau-Vorbereitung',
          desc: 'Bringen Sie immer eine 4" bis 6" dicke verdichtete Kiesschicht unter dem Beton an, um Risse zu vermeiden.'
        },
        {
          title: 'Anordnung von Dehnungsfugen',
          desc: 'Schneiden Sie alle 8 bis 12 Fuß Dehnungsfugen ein, um natürliches Ausdehnen und Schrumpfen zu kontrollieren.'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: 'Was macht der Betonstützen-Rechner?',
      description: 'Berechnet das genaue zylindrische Betonvolumen für runde Sonotube-Schalungen, Fundamente und Zaunpfahlbohrungen inklusive Sackbedarf.',
      highlights: [
        'Zylindervolumen für Schalrohre und Punktfundamente',
        'Mehrfach-Pfahl-Berechnung für Zäune und Terrassen',
        'Bedarf an 80lb-, 60lb- und 40lb-Trockenbetonsäcken',
        'Live-Materialkostenschätzung'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Abmessungen der Stütze angeben',
        desc: 'Geben Sie Durchmesser in Zoll und Höhe/Tiefe in Fuß/Zoll ein.'
      },
      step2: {
        title: '2. Anzahl der Pfähle eingeben',
        desc: 'Tragen Sie die Gesamtzahl identischer Bohrungen ein.'
      },
      step3: {
        title: '3. Verschnitt anpassen',
        desc: 'Nutzen Sie 5% bis 10% Verschnitt für raue Erdwände.'
      },
      step4: {
        title: '4. Säcke und Rohre prüfen',
        desc: 'Sehen Sie Gesamtlängen und Sackzahlen auf einen Blick.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Exakte Zylinder-Geometrie',
          desc: 'Berechnet geometrisches Volumen (π × r² × h) ohne Näherungsfehler.'
        },
        {
          title: 'Massenberechnung für Pfähle',
          desc: 'Berechnen Sie Material für 1 bis über 100 Pfosten gleichzeitig.'
        },
        {
          title: 'Direkter Sack-Abgleich',
          desc: 'Wissen Sie exakt, wie viele Säcke im Baumarkt gekauft werden müssen.'
        },
        {
          title: '100% Kostenlos',
          desc: 'Ohne Registrierung und ohne Versteckte Kosten.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Volumenformel für Beton-Zylinder',
      formulaText: 'Kubikyards = (π × (Durchmesser in in / 24)² × Tiefe in ft) / 27 × Menge',
      tips: [
        {
          title: 'Frostfreie Gründungstiefe',
          desc: 'Gründen Sie Punktfundamente stets unterhalb der lokalen Frostgrenze.'
        },
        {
          title: 'Glockenfuß-Verbreiterung',
          desc: 'Verbreitern Sie die Sohle der Bohrung zur Erhöhung der Tragfähigkeit.'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: 'Was macht der Kiesauffahrt-Rechner?',
      description: 'Berechnet Schüttgutvolumen in Kubikyards und rechnet direkt in Tonnen für Auffahrten und Unterbau um.',
      highlights: [
        'Volumen in Kubikyards und Kubikfuß',
        'Gewichtung in US-Tonnen und metrische Tonnen',
        'Dichte-Profile für Schotter, Splitt und Granit',
        'Berücksichtigung der Verdichtung (10%-15% Puffer)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Fläche ausmessen',
        desc: 'Geben Sie Länge und durchschnittliche Breite ein.'
      },
      step2: {
        title: '2. Schichtdicke festlegen',
        desc: 'Dicke in Zoll angeben (4" Auffrischung, 6"-8" Neuaufbau).'
      },
      step3: {
        title: '3. Materialdichte wählen',
        desc: 'Schottertyp wählen oder eigene Dichte eintragen.'
      },
      step4: {
        title: '4. Tonnage ermitteln',
        desc: 'Exakte Tonnage für die Bestellung im Kieswerk ablesen.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Echte Gewichts-Umrechnung',
          desc: 'Nutzt tatsächliche Dichtewerte pro Kubikmeter/Yard.'
        },
        {
          title: 'Verdichtungs-Berücksichtigung',
          desc: 'Integrierter Puffer für das Einwalzen des Materials.'
        },
        {
          title: 'Fertige Bestelldaten',
          desc: 'Perfekt vorbereitet für das Angebot des Lieferanten.'
        },
        {
          title: 'Kostenfreier Service',
          desc: 'Schnell, werbefrei und unkompliziert.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formel zur Kies-Tonnagen-Berechnung',
      formulaText: 'Tonnen = ((Länge in ft × Breite in ft × (Tiefe in in / 12)) / 27) × Dichte (ton/yd³)',
      tips: [
        {
          title: 'Geotextil-Vlies unterlegen',
          desc: 'Legen Sie ein Trennvlies unter den Kies, um das Versinken im Boden zu verhindern.'
        },
        {
          title: 'Dachprofil für Entwässerung',
          desc: 'Formen Sie die Mitte der Zufahrt höher, damit Regenwasser seitlich abfließt.'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: 'Was macht der Trockenbauplatten-Rechner?',
      description: 'Ermittelt die benötigten Gipskartonplatten (4x8, 4x12 ft) für Wände und Decken inklusive Fugenband, Spachtelmasse und Schrauben.',
      highlights: [
        'Ermittlung von Platten im Format 4x8, 4x12 und 4x10 ft',
        'Gesamtfläche in Quadratfuß / Quadratmeter',
        'Bedarf an Fugenband und Spachtelmasse (Eimer)',
        'Anzahl benötigter Trockenbauschrauben'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Raummaße eingeben',
        desc: 'Wandumfang und Raumhöhe eintragen.'
      },
      step2: {
        title: '2. Öffnungen abziehen',
        desc: 'Türen und Fenster von der Fläche abziehen.'
      },
      step3: {
        title: '3. Plattenformat wählen',
        desc: '4x8 ft für Standard oder 4x12 ft für weniger Fugen.'
      },
      step4: {
        title: '4. Materialliste prüfen',
        desc: 'Platten, Band, Spachtel und Schrauben ablesen.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Komplettes Trockenbau-System',
          desc: 'Berechnet Platten, Zubehör und Spachtelmasse auf einmal.'
        },
        {
          title: 'Plattenformat-Optimierung',
          desc: 'Vergleicht Formate zur Reduzierung des Verschnitts.'
        },
        {
          title: 'Verschnittschutz',
          desc: 'Integrierter 10%-Puffer für schräge Schnitte.'
        },
        {
          title: 'Gänzlich Kostenfrei',
          desc: 'Kostenlose Nutzung für Handwerk und Heimwerker.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formel zur Trockenbauplatten-Berechnung',
      formulaText: 'Platten (4x8) = (Netto-Fläche in sq ft / 32) × 1.10 (Verschnitt)',
      tips: [
        {
          title: 'Waagerechte Plattenmontage',
          desc: 'Montieren Sie Platten quer zur Ständerstellung für höhere Stabilität.'
        },
        {
          title: 'Versetzte Stoßfugen',
          desc: 'Versetzen Sie Fugen aufeinanderfolgender Reihen um mindestens 60 cm.'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: 'Was macht der Holzständerwand-Rechner?',
      description: 'Berechnet vertikale Ständer (Studs), Schwellen und Rähme für Holzständerwände bei 16" oder 24" Rastermaß.',
      highlights: [
        'Vertikale Ständeranzahl (inkl. Ecken & Wandanschlüsse)',
        'Laufende Meter für Boden- und Gurtpreise',
        'Unterstützung für 16" und 24" Ständerabstände',
        'Umrechnung in handelsübliche 16ft-Kanthölzer'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Wandlänge eingeben',
        desc: 'Länge der Wand in Fuß eintragen.'
      },
      step2: {
        title: '2. Ständerabstand wählen',
        desc: '16" O.C. (tragend) oder 24" O.C. (nicht tragend) wählen.'
      },
      step3: {
        title: '3. Gurtausführung wählen',
        desc: 'Doppelter Obergurt (Standard) oder einfacher Gurt.'
      },
      step4: {
        title: '4. Holzbedarf ablesen',
        desc: 'Ständerzahl und 16ft-Balkenanzahl einsehen.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Vollständige Wand-Komponenten',
          desc: 'Unterscheidet Ständer, Schwelle und Doppelgurt.'
        },
        {
          title: 'Passend für den Holzhandel',
          desc: 'Rechnet laufende Meter direkt in Standardlängen um.'
        },
        {
          title: 'Eck- und T-Wand-Zuschläge',
          desc: 'Berücksichtigt konstruktive Zusatzhölzer automatisch.'
        },
        {
          title: 'Kostenloses Werkzeug',
          desc: 'Speziell für Zimmerer und Selbstbauer entwickelt.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formel zur Ständeranzahl-Berechnung',
      formulaText: 'Ständer = (Wandlänge in in / Abstand in in) + 1 + Eck-Zuschlag (3 pro Ecke)',
      tips: [
        {
          title: 'Kesselschdruckimprägnierte Schwelle',
          desc: 'Verwenden Sie für die Schwelle auf Beton stets imprägniertes Holz.'
        },
        {
          title: 'Krümmung ausrichten',
          desc: 'Richten Sie die Krümmung aller Ständer vor dem Nagen gleichmäßig aus.'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: 'Was macht der Bewehrungsstahl-Rechner (Rebar)?',
      description: 'Berechnet den Stahlbedarf für Betonplatten und Fundamente: Laufmeter, 20ft-Stangen, Gesamtgewicht nach Durchmesser (#3 bis #8) und 40d Überlappung.',
      highlights: [
        'Bewehrungsnetz-Layout (Längs- und Querstäbe)',
        'Durchmesser-Auswahl (#3 3/8" bis #8 1")',
        'Automatische 40d Überlappungs-Zugabe',
        'Ausgabe in Laufmetern, Stangen und Gesamtgewicht'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Netzmaße eingeben',
        desc: 'Länge und Breite der Bewehrungsfläche eingeben.'
      },
      step2: {
        title: '2. Gitterabstand festlegen',
        desc: 'Stababstand in Zoll angeben (z. B. 12" oder 18").'
      },
      step3: {
        title: '3. Stahldurchmesser wählen',
        desc: 'Durchmesser (#4 für Platten, #5 für Fundamente) wählen.'
      },
      step4: {
        title: '4. Stangen & Gewicht ablesen',
        desc: 'Stangenanzahl (20ft) und Gesamtgewicht einsehen.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM-Gewichtskonstanten',
          desc: 'Berechnung basiert auf exakten Metergewichten.'
        },
        {
          title: 'Automatische 40d-Überlappung',
          desc: 'Verhindert Materialmangel bei fortlaufenden Stößen.'
        },
        {
          title: 'Bestellfertige Mengen',
          desc: 'Exakte Angaben für das Angebot beim Händler.'
        },
        {
          title: '100% Kostenfrei',
          desc: 'Ohne Gebühren für alle Baustellen.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formel für Laufende Meter Bewehrungsstahl',
      formulaText: 'Laufende Meter = ((Querstäbe × Länge) + (Längsstäbe × Breite)) × (1 + Überlappungsfaktor)',
      tips: [
        {
          title: 'Bewehrungsabstandhalter nutzen',
          desc: 'Setzen Sie Kunststoff- oder Betonabstandhalter ein, um die Lage im Beton zu sichern.'
        },
        {
          title: 'Rödeldrahtverbindung',
          desc: 'Verbinden Sie Knotenpunkte mit Rödeldraht; Baustahl nicht unkontrolliert schweißen.'
        }
      ]
    }
  }
};

const ptCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: 'O que faz a Calculadora de Laje de Concreto?',
      description: 'Esta ferramenta calcula o volume exato de concreto em jardas cúbicas e pés cúbicos para lajes retangulares, calçadas, pátios e pisos de garagem. Converte automaticamente o volume em sacos de concreto pré-misturado (80lb, 60lb e 40lb) e estima o custo total.',
      highlights: [
        'Calcula volume líquido e total em jardas e pés cúbicos',
        'Detalhamento de sacos pré-misturados de 80lb (0,6 ft³), 60lb (0,45 ft³) e 40lb (0,3 ft³)',
        'Margem de perda personalizável (10% padrão)',
        'Estimativa de custos em tempo real baseada no preço por jarda ou saco'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Insira as dimensões',
        desc: 'Informe comprimento e largura em pés/polegadas, e a espessura da laje em polegadas (4" para pátios, 6" para garagens).'
      },
      step2: {
        title: '2. Defina a margem de perda',
        desc: 'Inclua uma margem de 10% para compensar irregularidades do solo e desperdícios no despejo.'
      },
      step3: {
        title: '3. Digite os preços locais',
        desc: 'Insira o preço local por jarda cúbica ou por saco para ver o custo total do material.'
      },
      step4: {
        title: '4. Salve e exporte',
        desc: 'Clique em "Adicionar à lista de compras" para combinar estimativas ou exportar um relatório em PDF.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Precisão Volumétrica ASTM C94',
          desc: 'Elimina erros de cálculo seguindo rigorosamente as fórmulas volumétricas padrão ASTM.'
        },
        {
          title: 'Saída Dupla: Caminhão Betoneira e Sacos',
          desc: 'Veja instantaneamente se é mais vantajoso encomendar caminhão ou comprar sacos de 80lb.'
        },
        {
          title: 'Eficiência Profissional Sem Anúncios',
          desc: 'Cálculo rápido no celular ou computador sem anúncios intrusivos ou mensalidades.'
        },
        {
          title: 'Ferramenta 100% Gratuita Sem Taxas',
          desc: 'O Build Yardage é gratuito para equipes de obra, empreiteiros e reformadores.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula Volumétrica para Laje de Concreto',
      formulaText: 'Jardas Cúbicas = (Comprimento em ft × Largura em ft × (Espessura em in / 12)) / 27',
      tips: [
        {
          title: 'Preparação da Sub-base Compactada',
          desc: 'Coloque sempre uma sub-base de brita compactada de 4" a 6" sob o concreto para garantir drenagem.'
        },
        {
          title: 'Posicionamento de Juntas de Controle',
          desc: 'Corte juntas de dilatação a cada 8 a 12 pés para controlar a expansão e contração do concreto.'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: 'O que faz a Calculadora de Colunas de Concreto?',
      description: 'Calcula o volume cilíndrico de concreto para tubos Sonotube, sapatas de decks e estacas de cercas com conversão direta em sacos.',
      highlights: [
        'Volume cilíndrico para Sonotubes e sapatas redondas',
        'Cálculo em lote para múltiplos furos de estacas',
        'Quantidade necessária de sacos de 80lb, 60lb e 40lb',
        'Estimativa de custo total'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Especifique diâmetro e profundidade',
        desc: 'Informe o diâmetro em polegadas e a altura em pés/polegadas.'
      },
      step2: {
        title: '2. Digite o número de colunas',
        desc: 'Insira a quantidade total de furos idênticos.'
      },
      step3: {
        title: '3. Ajuste a perda',
        desc: 'Use de 5% a 10% de margem para cobrir furos irregulares.'
      },
      step4: {
        title: '4. Verifique os resultados',
        desc: 'Veja o total de tubos e sacos de concreto necessários.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Cálculo Geométrico Exato',
          desc: 'Volume cilíndrico preciso (π × r² × h) sem arredondamentos grosseiros.'
        },
        {
          title: 'Cálculo para Múltiplas Estacas',
          desc: 'Calcule materiais para dezenas de estacas em segundos.'
        },
        {
          title: 'Contagem de Sacos Imediata',
          desc: 'Saiba exatamente quantos sacos comprar na loja de materiais.'
        },
        {
          title: 'Ferramenta 100% Gratuita',
          desc: 'Sem necessidade de cadastro nem pagamentos.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula do Volume de Cilindro de Concreto',
      formulaText: 'Jardas Cúbicas = (π × (Diámetro em in / 24)² × Profundidade em ft) / 27 × Quantidade',
      tips: [
        {
          title: 'Profundidade Abaixo da Linha de Congelamento',
          desc: 'Aprofunde as sapatas abaixo do nível de congelamento local.'
        },
        {
          title: 'Base Alargada (Pé de Elefante)',
          desc: 'Alargue a base da escavação para aumentar a capacidade de carga.'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: 'O que faz a Calculadora de Brita para Caminhos?',
      description: 'Estima o volume de brita em jardas cúbicas e converte em toneladas para caminhos de acesso, garagens e sub-bases.',
      highlights: [
        'Volume em jardas cúbicas e pés cúbicos',
        'Conversão para toneladas métricas e US',
        'Densidades para brita 1, pedrisco e pedreira',
        'Considera perda por compactação (10%-15%)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Meça a área',
        desc: 'Insira o comprimento e a largura média.'
      },
      step2: {
        title: '2. Informe a espessura',
        desc: 'Insira a espessura em polegadas (4" cobertura, 6"-8" base nova).'
      },
      step3: {
        title: '3. Selecione a densidade',
        desc: 'Escolha o tipo de pedra ou insira a densidade manual.'
      },
      step4: {
        title: '4. Obtenha a tonelagem',
        desc: 'Veja o total de toneladas a encomendar na pedreira.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Conversão Real por Peso',
          desc: 'Baseada na densidade real dos agregados.'
        },
        {
          title: 'Margem para Compactação',
          desc: 'Garante material suficiente após passar o rolo.'
        },
        {
          title: 'Dados Prontos para Pedreira',
          desc: 'Especificações prontas para o fornecedor.'
        },
        {
          title: 'Totalmente Gratuito',
          desc: 'Uso livre sem propagandas.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Tonelagem de Brita',
      formulaText: 'Toneladas = ((Comprimento em ft × Largura em ft × (Profundidade em in / 12)) / 27) × Densidade (ton/yd³)',
      tips: [
        {
          title: 'Manta Geotêxtil',
          desc: 'Use manta geotêxtil antes de espalhar a brita para impedir o afundamento na terra.'
        },
        {
          title: 'Caimento para Escoamento',
          desc: 'Crie uma elevação central para drenar a água das chuvas.'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: 'O que faz a Calculadora de Gesso Acartonado (Drywall)?',
      description: 'Calcula placas de drywall (4x8, 4x12 ft) para paredes e tetos, além de fita de junta, massa corrida e parafusos.',
      highlights: [
        'Contagem de chapas 4x8, 4x12 e 4x10 pés',
        'Área total em pés quadrados / metros quadrados',
        'Cálculo de metros de fita e baldes de massa',
        'Quantidade estimada de parafusos'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Insira as dimensões do cômodo',
        desc: 'Digite o perímetro das paredes e pé-direito.'
      },
      step2: {
        title: '2. Desconte aberturas',
        desc: 'Subtraia portas e janelas para a área líquida.'
      },
      step3: {
        title: '3. Escolha o tamanho da chapa',
        desc: 'Selecione 4x8 ft padrão ou 4x12 ft para menos emendas.'
      },
      step4: {
        title: '4. Confira a lista de materiais',
        desc: 'Veja chapas, fitas, massa e caixas de parafusos.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Sistema Drywall Completo',
          desc: 'Estima chapas, fita, massa e parafusos juntos.'
        },
        {
          title: 'Otimização do Tamanho de Chapa',
          desc: 'Compare tamanhos para reduzir o trabalho de acabamento.'
        },
        {
          title: 'Proteção contra Perdas',
          desc: 'Margem de 10% para cortes e recortes.'
        },
        {
          title: '100% Gratuito',
          desc: 'Sem mensalidades nem cadastros.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Cálculo de Chapas de Drywall',
      formulaText: 'Chapas 4x8 = (Área Líquida em sq ft / 32) × 1.10 (margem de perda)',
      tips: [
        {
          title: 'Instalação Horizontal',
          desc: 'Instale as chapas na horizontal cruzando os perfis para maior firmeza.'
        },
        {
          title: 'Juntas Desencontradas',
          desc: 'Desencontre as juntas verticais para evitar trincas na parede.'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: 'O que faz a Calculadora de Estrutura de Madeira (Framing)?',
      description: 'Calcula montantes verticais (studs), guias inferiores e superiores para paredes de madeira com espaçamento de 16" ou 24" O.C.',
      highlights: [
        'Quantidade de montantes verticais (com cantos e encontros)',
        'Metros lineares de guias superiores e inferiores',
        'Suporte a espaçamentos 16" e 24" O.C.',
        'Conversão para peças comerciais de madeira de 16 pés'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Digite o comprimento da parede',
        desc: 'Insira a extensão total da parede em pés.'
      },
      step2: {
        title: '2. Escolha o espaçamento',
        desc: 'Selecione 16" O.C. (estrutural) ou 24" O.C. (divisória).'
      },
      step3: {
        title: '3. Selecione a guia superior',
        desc: 'Escolha guia dupla (norma estrutural) ou simples.'
      },
      step4: {
        title: '4. Veja as peças de madeira',
        desc: 'Consulte montantes e vigas de 16ft a comprar.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Detalhamento da Estrutura',
          desc: 'Diferencia montantes, guia inferior e guia dupla superior.'
        },
        {
          title: 'Facilidade para a Madeireira',
          desc: 'Converte a metragem em vigas comerciais padronizadas.'
        },
        {
          title: 'Cálculo de Cantos e Encontros',
          desc: 'Inclui montantes extras para amarrações de paredes.'
        },
        {
          title: 'Ferramenta Gratuita',
          desc: 'Feita para carpinteiros e construtores.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Contagem de Montantes',
      formulaText: 'Montantes = (Comprimento da Parede em in / Espaçamento em in) + 1 + Extras de Canto (3 por canto)',
      tips: [
        {
          title: 'Guia Inferior Tratada',
          desc: 'Use madeira tratada para a guia assentada sobre o concreto.'
        },
        {
          title: 'Alinhamento do Empeno',
          desc: 'Alinhe a curvatura de todos os montantes no mesmo sentido.'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: 'O que faz a Calculadora de Ferragem para Concreto (Rebar)?',
      description: 'Calcula o aço para lajes e sapatas: metros lineares, barras de 20ft (6m), peso total por bitola (#3 a #8) e trespasse 40d.',
      highlights: [
        'Malha de armação (barras longitudinais e transversais)',
        'Escolha de bitolas (#3 a #8 / 10mm a 25mm)',
        'Inclusão automática de trespasse de segurança 40d',
        'Peso total de aço e número de barras de 20ft'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Digite as dimensões da malha',
        desc: 'Insira o comprimento e a largura da armação.'
      },
      step2: {
        title: '2. Espaçamento das barras',
        desc: 'Digite o quadriculado em polegadas (ex. 12" ou 18").'
      },
      step3: {
        title: '3. Selecione a bitola',
        desc: 'Escolha o diâmetro do ferro (ex. #4 1/2" para lajes).'
      },
      step4: {
        title: '4. Veja peso e barras',
        desc: 'Confira a quantidade de barras de 20ft e peso total.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Pesos Padronizados por Metro',
          desc: 'Fórmulas exatas baseadas no peso específico por bitola.'
        },
        {
          title: 'Trespasse 40d Automático',
          desc: 'Considera as emendas de continuidade para não faltar ferro.'
        },
        {
          title: 'Pronto para Orçamento de Aço',
          desc: 'Gera totais em quilos/libras e barras comerciais.'
        },
        {
          title: '100% Gratuito',
          desc: 'Disponível sem custos para suas obras.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Fórmula de Metros Lineares de Ferragem',
      formulaText: 'Metros Lineares = ((Barras Transversales × Comprimento) + (Barras Longitudinais × Largura)) × (1 + Fator Trespasse)',
      tips: [
        {
          title: 'Espaçadores Plásticos ou Concreto',
          desc: 'Eleve a malha com espaçadores para cobrir a ferragem com concreto.'
        },
        {
          title: 'Amarração com Arame Recozido',
          desc: 'Amarre os cruzamentos com arame recozido nº 18 sem soldar os ferros.'
        }
      ]
    }
  }
};

const itCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: 'Cosa fa il Calcolatore per Dalle in Calcestruzzo?',
      description: 'Questo strumento calcola il volume esatto di calcestruzzo in yard cubiche e piedi cubi per getti rettangolari, vialetti, cortili e pavimenti di garage. Converte automaticamente il volume in sacchi di calcestruzzo premiscelato (80lb, 60lb e 40lb) e stima il costo totale.',
      highlights: [
        'Calcola il volume netto e totale in yard cubiche e piedi cubi',
        'Dettaglio del numero di sacchi da 80lb (0,6 ft³), 60lb (0,45 ft³) e 40lb (0,3 ft³)',
        'Margine di sfrido personalizzabile (10% standard)',
        'Stima dei costi in tempo real al metro cubo o al sacco'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Inserisci le dimensioni',
        desc: 'Inserisci lunghezza e larghezza in piedi/pollici e lo spessore della gettata in pollici (4" per pavimentazioni, 6" per vialetti).'
      },
      step2: {
        title: '2. Imposta il fattore di sfrido',
        desc: 'Includi un margine del 10% per compensare le irregolarità del terreno e gli sversamenti.'
      },
      step3: {
        title: '3. Inserisci i prezzi locali',
        desc: 'Inserisci il prezzo locale al metro o yard cubica oppure al sacco per calcolare il costo totale.'
      },
      step4: {
        title: '4. Salva ed esporta',
        desc: 'Clicca su "Aggiungi alla lista" per combinare le stime o esportare un report PDF stampabile.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Accuratezza Volumetrica ASTM C94',
          desc: 'Elimina gli errori di calcolo rispettando rigorosamente le formule standard ASTM.'
        },
        {
          title: 'Doppia Opzione: Betoniera e Sacchi Premiscelati',
          desc: 'Scopri subito se conviene ordinare un\'autobetoniera o acquistare singoli sacchi da 80lb.'
        },
        {
          title: 'Efficienza per Professionisti Senza Pubblicità',
          desc: 'Calcolo velocissimo da smartphone o PC senza annunci invasivi o costi nascosti.'
        },
        {
          title: 'Strumento 100% Gratuito Senza Commissioni',
          desc: 'Build Yardage è completamente gratuito per imprese edilizie, artigiani e fai-da-te.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formula Volumetrica della Dalla in Calcestruzzo',
      formulaText: 'Yard Cubiche = (Lunghezza in ft × Larghezza in ft × (Spessore in in / 12)) / 27',
      tips: [
        {
          title: 'Preparazione del Sottofondo Compattato',
          desc: 'Stendi sempre uno strato di ghiaino compattato da 4" a 6" sotto il calcestruzzo per garantire il drenaggio.'
        },
        {
          title: 'Posizionamento dei Giunti di Contrazione',
          desc: 'Esegui tagli di contrazione ogni 8-12 piedi per prevenire cavillature e crepe strutturali.'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: 'Cosa fa il Calcolatore per Colonne in Calcestruzzo?',
      description: 'Calcola il volume cilindrico esatto per getti in Sonotube, plinti e pali di recinzione con calcolo dei sacchi di cemento occorrenti.',
      highlights: [
        'Volume cilindrico per Sonotube e plinti tondi',
        'Calcolo multiplo per pali e recinzioni',
        'Fabbisogno in sacchi da 80lb, 60lb e 40lb',
        'Stima costi di getto'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Inserisci diametro e profondità',
        desc: 'Specifica il diametro del tubo in pollici e la profondità in piedi/pollici.'
      },
      step2: {
        title: '2. Inserisci il numero di pali',
        desc: 'Digita il numero di scavi identici previsti.'
      },
      step3: {
        title: '3. Regola la tolleranza',
        desc: 'Aggiungi un 5%-10% per le irregolarità dello scavo.'
      },
      step4: {
        title: '4. Controlla il risultato',
        desc: 'Leggi la lunghezza totale dei tubi e i sacchi di cemento.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Geometria Cilindrica Esatta',
          desc: 'Calcola il volume preciso (π × r² × h) senza approssimazioni.'
        },
        {
          title: 'Calcolo Multi-Palo',
          desc: 'Calcola il materiale per decine di pali in contemporanea.'
        },
        {
          title: 'Conteggio Sacchi Immediato',
          desc: 'Misure pronte per l\'acquisto dei sacchi premiscelati.'
        },
        {
          title: 'Gratuito al 100%',
          desc: 'Senza iscrizione né pubblicità.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formula Volume Cilindro in Calcestruzzo',
      formulaText: 'Yard Cubiche = (π × (Diametro in in / 24)² × Profondità in ft) / 27 × Quantità',
      tips: [
        {
          title: 'Profondità di Anti-Gelività',
          desc: 'Scava sempre al di sotto del livello di congelamento del terreno.'
        },
        {
          title: 'Allargamento della Base',
          desc: 'Allarga il fondo dello scavo per aumentare la portata della fondazione.'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: 'Cosa fa il Calcolatore per Vialetti in Ghietto?',
      description: 'Stima il volume di inerti in yard cubiche e converte in tonnellate per vialetti, parcheggi e sottofondi.',
      highlights: [
        'Volume in yard cubiche e piedi cubi',
        'Conversione in tonnellate metriche e US',
        'Profili di densità per stabilizzato, pietrisco e granito',
        'Calcolo del calo da compattazione (10%-15%)'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Misura l\'area',
        desc: 'Inserisci lunghezza e larghezza media.'
      },
      step2: {
        title: '2. Imposta lo spessore',
        desc: 'Specifica lo spessore in pollici (4" manutenzione, 6"-8" nuovo fondo).'
      },
      step3: {
        title: '3. Seleziona la densità',
        desc: 'Scegli il tipo di pietrisco o imposta la densità.'
      },
      step4: {
        title: '4. Calcola le tonnellate',
        desc: 'Leggi la quantità esatta da ordinare in cava.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Conversione in Peso Reale',
          desc: 'Basata sulla densità effettiva dei vari tipi di inerte.'
        },
        {
          title: 'Margine di Compattazione',
          desc: 'Materiale sufficiente anche dopo la rullatura.'
        },
        {
          title: 'Dati Pronti per la Cava',
          desc: 'Specifiche pronte da inviare al fornitore.'
        },
        {
          title: 'Utilizzo Gratuito',
          desc: 'Veloce e senza costi nascosti.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formula Tonnellaggio Ghietto',
      formulaText: 'Tonnellate = ((Lunghezza in ft × Larghezza in ft × (Spessore in in / 12)) / 27) × Densità (ton/yd³)',
      tips: [
        {
          title: 'Tessuto Non Tessuto (Geotessile)',
          desc: 'Stendi un telo geotessile prima del ghietto per evitare che sprofondi nel fango.'
        },
        {
          title: 'Sagomatura a Schiena d\'Asino',
          desc: 'Mantieni il centro del vialetto leggermente più alto per il deflusso dell\'acqua.'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: 'Cosa fa il Calcolatore per Lastre in Cartongesso?',
      description: 'Calcola le lastre in cartongesso (4x8, 4x12 ft) per pareti e contropareti, più nastro, stuccatura e viti.',
      highlights: [
        'Conteggio lastre 4x8, 4x12 e 4x10 piedi',
        'Superficie totale in piedi/metri quadrati',
        'Metri di nastro e secchi di stucco',
        'Numero stimato di viti per cartongesso'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Inserisci le dimensioni della stanza',
        desc: 'Digita il perimetro e l\'altezza della parete.'
      },
      step2: {
        title: '2. Detrai le aperture',
        desc: 'Sottrai porte e finestre per avere la superficie netta.'
      },
      step3: {
        title: '3. Scegli il formato della lastra',
        desc: 'Seleziona 4x8 ft o 4x12 ft per ridurre i giunti.'
      },
      step4: {
        title: '4. Leggi la lista materiali',
        desc: 'Controlla lastre, nastro, stucco e scatole di viti.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Stima Completa del Sistema',
          desc: 'Calcola lastre, stucco, nastro e viti insieme.'
        },
        {
          title: 'Ottimizzazione del Formato',
          desc: 'Confronta i formati per ridurre lo sfrido.'
        },
        {
          title: 'Protezione dallo Sfrido',
          desc: 'Margine del 10% per i tagli e i sormonti.'
        },
        {
          title: 'Gratuito al 100%',
          desc: 'Senza registrazioni né pubblicità.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formula Calcolo Lastre Cartongesso',
      formulaText: 'Lastre 4x8 = (Superficie Netta in sq ft / 32) × 1.10 (sfrido)',
      tips: [
        {
          title: 'Posa Orizzontale',
          desc: 'Fissa le lastre in orizzontale perpendicolarmente ai montanti.'
        },
        {
          title: 'Giunti Sfasati',
          desc: 'Sfasa i giunti verticali di almeno 60 cm per evitare crepe.'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: 'Cosa fa il Calcolatore per Strutture in Legno (Framing)?',
      description: 'Calcola montanti verticali, traversi inferiori e correnti superiori per pareti a telaio con passo 16" o 24" O.C.',
      highlights: [
        'Numero di montanti verticali (angoli e incroci inclusi)',
        'Metri lineari di guide e correnti',
        'Supporto per passi 16" e 24" O.C.',
        'Conversione in travi di legno da 16 piedi'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Digita la lunghezza della parete',
        desc: 'Inserisci la lunghezza totale della parete.'
      },
      step2: {
        title: '2. Scegli il passo dei montanti',
        desc: 'Scegli 16" O.C. (strutturale) o 24" O.C. (tramezzo).'
      },
      step3: {
        title: '3. Seleziona la corrente superiore',
        desc: 'Scegli corrente doppia (norma) o singola.'
      },
      step4: {
        title: '4. Leggi i pezzi di legno',
        desc: 'Controlla i montanti e le travi da 16ft da ordinare.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Dettaglio Completo Telaio',
          desc: 'Distingue montanti, guida inferiore e corrente doppia.'
        },
        {
          title: 'Misura per il Magazzino Edile',
          desc: 'Converte i metri in pezzi commerciali standard.'
        },
        {
          title: 'Pezzi Extra per Angoli e Incroci',
          desc: 'Aggiunge automaticamente i montanti d\'angolo.'
        },
        {
          title: 'Strumento Gratuito',
          desc: 'Pensato per carpentieri e costruttori.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formula Conteggio Montanti',
      formulaText: 'Montanti = (Lunghezza Parete in in / Passo in in) + 1 + Extra Angoli (3 per angolo)',
      tips: [
        {
          title: 'Guida Inferiore Trattata',
          desc: 'Usa sempre legno impregnato in autoclave a contatto con il cemento.'
        },
        {
          title: 'Allineamento della Curvatura',
          desc: 'Orienta l\'imbarcamento dei montanti nello stesso verso prima di fissarli.'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: 'Cosa fa il Calcolatore per Armatura in Acciaio (Rebar)?',
      description: 'Calcola l\'acciaio per cemento armato: metri lineari, barre da 20ft (6m), peso totale per diametro (#3 a #8) e sormonti 40d.',
      highlights: [
        'Griglia di armatura (barre longitudinali e trasversali)',
        'Scelta diametri (#3 a #8 / 10mm a 25mm)',
        'Inclusione automatica sormonti 40d',
        'Peso totale e numero di barre da 20ft'
      ]
    },
    howToUse: {
      step1: {
        title: '1. Inserisci le dimensioni della griglia',
        desc: 'Specifica lunghezza e larghezza della rete.'
      },
      step2: {
        title: '2. Passo delle barre',
        desc: 'Imposta la maglia della griglia in pollici (es. 12" o 18").'
      },
      step3: {
        title: '3. Seleziona il diametro',
        desc: 'Scegli il diametro dell\'asta (es. #4 per solette).'
      },
      step4: {
        title: '4. Leggi barre e peso',
        desc: 'Verifica il numero di barre da 20ft e il peso in kg/lbs.'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'Pesi Specifici Standard',
          desc: 'Basato sui pesi metrici per metro lineare.'
        },
        {
          title: 'Sormonto 40d Automatico',
          desc: 'Calcola le giunzioni per evitare carenze d\'acciaio.'
        },
        {
          title: 'Dati per il Fornitore d\'Acciaio',
          desc: 'Fornisce il peso complessivo da ordinare.'
        },
        {
          title: '100% Gratuito',
          desc: 'Senza costi né abbonamenti.'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'Formula Metri Lineari Armatura',
      formulaText: 'Metri Lineari = ((Barre Trasversali × Lunghezza) + (Barre Longitudinali × Larghezza)) × (1 + Fattore Sormonto)',
      tips: [
        {
          title: 'Distanziatori per Armatura',
          desc: 'Solleva la griglia con distanziatori per garantire il copriferro.'
        },
        {
          title: 'Legatura con Filo Cotto',
          desc: 'Legai gli incroci con filo di ferro senza saldare l\'acciaio ordinario.'
        }
      ]
    }
  }
};

const jaCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: 'コンクリートスラブ計算ツールの機能',
      description: '土間コンクリート、駐車場、テラスなどの立方ヤードおよび立方フィート単位の正確なコンクリート量を計算します。バッグ入り生コン（80lb、60lb、40lb）の必要袋数を自動算出し、概算費用を計算します。',
      highlights: [
        '正味および合計のコンクリート容積を計算',
        '80lb、60lb、40lbの袋数を自動換算',
        'ロス率バッファ設定（標準10%）',
        'リアルタイムの費用見積もり'
      ]
    },
    howToUse: {
      step1: {
        title: '1. スラブの寸法を入力',
        desc: '長さ・幅および厚さ（歩道は4インチ、駐車場は6インチ標準）を入力します。'
      },
      step2: {
        title: '2. ロス率を設定',
        desc: '地盤の凹凸やこぼれを考慮し、10%のロス率を含めます。'
      },
      step3: {
        title: '3. 単価を入力',
        desc: '生コンの立方ヤード単価または袋単価を入力して、合計資材費を確認します。'
      },
      step4: {
        title: '4. 保存およびPDF出力',
        desc: '「資材リストに追加」をクリックして組み合わせるか、印刷用PDFを出力します。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM C94適合の容積精度',
          desc: 'ASTM標準の容積計算式に基づき、手計算のミスを完全に排除します。'
        },
        {
          title: 'アジテータ車と袋詰めの同時比較',
          desc: '生コン車の手配とホームセンターでの袋購入のどちらが得かを即座に判定。'
        },
        {
          title: '広告なしの高速ツール',
          desc: '邪魔な広告や有料化なしで、現場のスマホから爆速で計算可能。'
        },
        {
          title: '完全無料の施工管理ツール',
          desc: '現場監督、職人、DIYユーザー向けに完全無料で提供されています。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'コンクリートスラブ容積計算式',
      formulaText: '立方ヤード = (長さft × 幅ft × (厚さin / 12)) / 27',
      tips: [
        {
          title: '砕石路盤の転圧',
          desc: '水抜きとひび割れ防止のため、スラブ下には必ず4〜6インチの砕石を敷き詰め転圧してください。'
        },
        {
          title: '目地（目地切り）の配置',
          desc: 'コンクリートの伸縮クラックを防ぐため、8〜12フィート間隔で伸縮目地を設置してください。'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: 'コンクリート柱・基礎計算ツールの機能',
      description: '丸型ソノチューブボイド缶、ウッドデッキ束石、フェンス柱穴の正確な円柱コンクリート容積と必要袋数を計算します。',
      highlights: [
        'ボイド缶・束石の円柱容積計算',
        'フェンス・デッキ等の多穴括弧計算',
        '80lb、60lb、40lb袋数の算出',
        '施工コストの見積もり'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 径と深さを指定',
        desc: 'ボイド缶直径（インチ）と高さ・深さを入力します。'
      },
      step2: {
        title: '2. 穴の総数を入力',
        desc: '必要な柱穴の合計個数を入力します。'
      },
      step3: {
        title: '3. ロス率を調整',
        desc: '掘削面のアラを考慮し5〜10%の余裕を見込みます。'
      },
      step4: {
        title: '4. 必要量を確認',
        desc: 'ソノチューブ総延長と生コン袋数を確認します。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '正確な円柱幾何計算',
          desc: '公式（π × r² × h）に基づく精密計算。'
        },
        {
          title: '多本数の一括試算',
          desc: '1本から100本以上の柱穴を一括で計算。'
        },
        {
          title: 'ホームセンター買い出しに対応',
          desc: '必要袋数が一目で分かります。'
        },
        {
          title: '完全無料',
          desc: '登録不要で誰でも利用可能。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '円柱コンクリート容積計算式',
      formulaText: '立方ヤード = (π × (直径in / 24)² × 深さft) / 27 × 数量',
      tips: [
        {
          title: '凍結深度の確保',
          desc: '冬場の凍上を防ぐため、地域の凍結深度より深く埋設してください。'
        },
        {
          title: '底部の拡幅',
          desc: '穴の底部をアサガオ状に広げることで支持力を向上させます。'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: '砂利・砕石アプローチ計算ツールの機能',
      description: '駐車場やアプローチに必要な砕石・砂利の体積（立方ヤード）および重量（トン）を比重別に算出します。',
      highlights: [
        '容積（立方ヤード・立方フィート）算出',
        'USショートトンおよびメトリックトンへの換算',
        '砕石・玉砂利・花崗岩等の比重プリセット',
        '転圧沈下ロス（10〜15%）の考慮'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 敷地面積の入力',
        desc: '長さと平均幅を入力します。'
      },
      step2: {
        title: '2. 敷き厚さの指定',
        desc: '厚さをインチで指定（補修4"、新設6〜8"）。'
      },
      step3: {
        title: '3. 骨材比重の選択',
        desc: '砕石の種類または比重を入力します。'
      },
      step4: {
        title: '4. 重量とコストの確認',
        desc: '建材店に発注する重量（トン）を確認。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '比重換算による高い精度',
          desc: '実際の骨材密度に基づく重量計算。'
        },
        {
          title: '転圧による減りを考慮',
          desc: 'プレート転圧後の目減り分を考慮。'
        },
        {
          title: '建材店への発注に直結',
          desc: 'ダンプ手配に必要なトン数を表示。'
        },
        {
          title: '即座に使える完全無料ツール',
          desc: '面倒な登録は不要です。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '砂利重量計算式',
      formulaText: 'トン = ((長さft × 幅ft × (厚さin / 12)) / 27) × 骨材比重 (ton/yd³)',
      tips: [
        {
          title: '防草・防砂シートの併用',
          desc: '砕石が土に埋没するのを防ぐため、下地に高耐久防草シートを敷設してください。'
        },
        {
          title: '排水水勾配の確保',
          desc: '水たまりを防ぐため、中央を高く水勾配をとってください。'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: '石膏ボード（プラスターボード）計算ツールの機能',
      description: '壁・天井に必要な石膏ボード枚数（4x8、4x12版）、目地テープ、ジョイントパテ、ビス本数を計算します。',
      highlights: [
        'サブロク（4x8）、シロク（4x12）等の枚数計算',
        '壁・天井の施工面積算出',
        '目地テープ長さとパテ必要量の見積もり',
        'ボードビスの推定必要本数'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 部屋の寸法を入力',
        desc: '壁の周長と天井高を入力します。'
      },
      step2: {
        title: '2. 開口部の控除',
        desc: 'ドアや窓の面積を差し引きます。'
      },
      step3: {
        title: '3. ボード規格の選択',
        desc: '4x8または4x12サイズを選択。'
      },
      step4: {
        title: '4. 資材リストの確認',
        desc: '枚数、テープ、パテ、ビス箱数を確認。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '内装下地のトータル試算',
          desc: 'ボードだけでなくパテやビスも一括計算。'
        },
        {
          title: '規格サイズの最適化',
          desc: '継ぎ目を減らす最適なサイズを検討。'
        },
        {
          title: '切り回しロスの見込み',
          desc: '10%のカットロスを標準見込み。'
        },
        {
          title: '商用利用も完全無料',
          desc: '手軽に積算にご利用いただけます。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '石膏ボード枚数計算式',
      formulaText: '4x8枚数 = (施工面積sq ft / 32) × 1.10 (ロス率分)',
      tips: [
        {
          title: 'ボードの横張り',
          desc: 'スタッドに対して直角に横張りすることで下地追従性を向上させます。'
        },
        {
          title: '目地の千鳥配置',
          desc: '縦目地が一直線にならないよう千鳥状に配置してクラックを防ぎます。'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: '木造壁下地（スタッド・枠組）計算ツールの機能',
      description: 'ツーバイフォー（2x4/2x6）等の縦スタッド本数、土台・頭つなぎの総延長、定尺木材の本数を計算します。',
      highlights: [
        '縦スタッド本数（出隅・入隅・受木含む）',
        '土台・まぐさ・頭つなぎのランニングフィート',
        '16インチ / 24インチピッチ（間柱間隔）対応',
        '16ft定尺材への換算本数'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 壁の長さを入力',
        desc: '連続する壁の全長を入力します。'
      },
      step2: {
        title: '2. ピッチを選択',
        desc: '16インチピッチまたは24インチピッチを選択。'
      },
      step3: {
        title: '3. 頭つなぎ仕様',
        desc: '二重頭つなぎ（標準構造）または単一を選択。'
      },
      step4: {
        title: '4. 木材本数を取得',
        desc: 'スタッド本数と16ft定尺材の発注本数を確認。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '構造部材ごとの内訳表示',
          desc: '縦スタッドと上下のランナー部材を区別。'
        },
        {
          title: 'プレカット・木材店発注に対応',
          desc: '定尺材の本数に直接換算。'
        },
        {
          title: 'コーナースタッド自動加算',
          desc: 'コーナーや壁開口の補強材を含めて計算。'
        },
        {
          title: '無料の工務店ツール',
          desc: '見積書作成や施工計画に最適。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: 'スタッド本数計算式',
      formulaText: 'スタッド数 = (壁長in / ピッチin) + 1 + コーナー補強数 (各角3本)',
      tips: [
        {
          title: '土台の防腐処理材使用',
          desc: 'コンクリートに接する土台には必ず防腐注入材を使用してください。'
        },
        {
          title: '木材の曲がり（背・腹）の揃え',
          desc: '壁の平滑性を保つため、スタッドの曲がりの向きを揃えて施工します。'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: '鉄筋配筋・重量計算ツールの機能',
      description: 'スラブや基礎の鉄筋グリッド配筋に必要な総延長、20ft定尺本数、呼び径別（#3〜#8）の総重量、定着重ね継手長さを計算します。',
      highlights: [
        '縦横配筋のグリッド本数計算',
        '異形棒鋼D10〜D25（#3〜#8）対応',
        '40d（鉄筋径の40倍）重ね継手自動加算',
        '総延長・20ft本数・鉄筋重量（kg/lbs）出力'
      ]
    },
    howToUse: {
      step1: {
        title: '1. グリッド寸法の入力',
        desc: '配筋範囲の縦横寸法を入力します。'
      },
      step2: {
        title: '2. 配筋ピッチの指定',
        desc: '鉄筋間隔（例：200mm、300mm等）を入力。'
      },
      step3: {
        title: '3. 鉄筋サイズの選択',
        desc: '使用する鉄筋径（D13 / #4等）を選択。'
      },
      step4: {
        title: '4. 重量と本数を確認',
        desc: '定尺本数と総鉄筋重量を確認します。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'JIS / ASTM規格単位重量',
          desc: '径ごとの正確な単位重量で重量換算。'
        },
        {
          title: '継手重ね代（40d）の自動考慮',
          desc: '現場で材料が不足するのを防ぎます。'
        },
        {
          title: '鋼材店への発注仕様',
          desc: '重量（トン）と本数が即座に分かります。'
        },
        {
          title: '完全無料で利用可能',
          desc: '現場の拾い出し作業を効率化。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '鉄筋総延長計算式',
      formulaText: '総延長 = ((横筋本数 × 長さ) + (縦筋本数 × 幅)) × (1 + 継手係数)',
      tips: [
        {
          title: 'スペーサー（ドーナツ・サイコロ）',
          desc: 'かぶり厚さを確保するため、適切なスペーサーを配置してください。'
        },
        {
          title: '結束線の使用',
          desc: '鉄筋の交差部は16番線（焼きナマシ線）でしっかりと結束してください。'
        }
      ]
    }
  }
};

const zhCalculatorGuides: Record<string, ToolGuide> = {
  'concrete-slab-calculator': {
    slug: 'concrete-slab-calculator',
    whatItDoes: {
      title: '混凝土平板计算器的主要功能',
      description: '本工具精准计算矩形平板、车道、庭院及车库地坪所需的混凝土体积（立方码与立方英尺）。自动换算袋装预拌混凝土（80磅、60磅、40磅）的数量，并实时估算材料成本。',
      highlights: [
        '计算净体积与含损耗总体积（立方码/立方英尺）',
        '自动拆算 80磅、60磅及40磅袋装混凝土用量',
        '支持自定义损耗缓冲（标准 10%）',
        '按立方码单价或按袋单价实时估算成本'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 输入平板尺寸',
        desc: '输入长度和宽度（英尺/英寸）以及平板厚度（人行道通常为 4 英寸，车道为 6 英寸）。'
      },
      step2: {
        title: '2. 设置损耗系数',
        desc: '预留 10% 的损耗缓冲，以应对地基不平整及浇筑浇洒。'
      },
      step3: {
        title: '3. 输入本地单价',
        desc: '输入每立方码商品混凝土或每袋混凝土的本地价格，以查看总成本。'
      },
      step4: {
        title: '4. 保存并导出报告',
        desc: '点击“添加到材料清单”以合并估算，或导出可打印的 PDF 报告。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM C94 标准容积精度',
          desc: '严格遵循 ASTM 标准容积公式，消除人工计算误差与猜测。'
        },
        {
          title: '商混车与袋装双重输出',
          desc: '即时对比呼叫商混搅拌车与购买单袋 80 磅混凝土的性价比。'
        },
        {
          title: '无广告施工极速体验',
          desc: '无侵入性广告或付费墙，在手机和电脑端均可秒级响应。'
        },
        {
          title: '100% 免费承包商工具',
          desc: 'Build Yardage 对施工团队、承包商及 DIY 爱好者完全免费。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '混凝土平板容积公式',
      formulaText: '立方码 = (长度ft × 宽度ft × (厚度in / 12)) / 27',
      tips: [
        {
          title: '压实碎石垫层准备',
          desc: '在混凝土下方铺设 4 至 6 英寸的压实碎石垫层，以确保排水并防止平板开裂。'
        },
        {
          title: '控制缝（伸缩缝）设置',
          desc: '每隔 8 至 12 英尺切割伸缩缝，以控制混凝土自然的热胀冷缩。'
        }
      ]
    }
  },
  'concrete-column-calculator': {
    slug: 'concrete-column-calculator',
    whatItDoes: {
      title: '混凝土圆柱/基础计算器的主要功能',
      description: '计算圆柱形 Sonotube 纸模、木平台基础、围栏柱孔及建筑立柱的准确混凝土体积，并自动换算袋装混凝土数量。',
      highlights: [
        '计算 Sonotube 和圆形基础的圆柱体体积',
        '支持围栏及多立柱批量计算',
        '计算 80磅、60磅和40磅预拌混凝土袋数',
        '生成实时材料造价估算'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 指定立柱尺寸',
        desc: '输入纸模/孔洞直径（英寸）及深度/高度。'
      },
      step2: {
        title: '2. 设置立柱总数',
        desc: '输入项目所需的相同柱孔总数量。'
      },
      step3: {
        title: '3. 调整损耗缓冲',
        desc: '预留 5% 至 10% 的损耗以覆盖泥土开挖的不规则边缘。'
      },
      step4: {
        title: '4. 查看袋数与纸模长度',
        desc: '查看所需纸模总长度及袋装混凝土用量。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '精准圆柱几何计算',
          desc: '精准几何体积（π × r² × h），无粗略估计误差。'
        },
        {
          title: '多柱孔批量处理',
          desc: '一键同时计算数十至上百个柱孔材料。'
        },
        {
          title: '快速匹配袋装水泥',
          desc: '精确得知采购袋装混凝土的数量。'
        },
        {
          title: '100% 免费工具',
          desc: '无隐形费用，无须注册账号。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '混凝土圆柱体积公式',
      formulaText: '立方码 = (π × (直径in / 24)² × 深度ft) / 27 × 数量',
      tips: [
        {
          title: '冻土层深度规范',
          desc: '柱基础应延伸至当地冻土线以下至少 6 英寸，防止冬季冻胀。'
        },
        {
          title: '扩底基础（喇叭口）',
          desc: '将柱孔底部适当扩容成喇叭状，以增加地基承载面积。'
        }
      ]
    }
  },
  'gravel-driveway-calculator': {
    slug: 'gravel-driveway-calculator',
    whatItDoes: {
      title: '碎石车道计算器的主要功能',
      description: '估算碎石车道、停车垫及垫层所需的骨料体积（立方码），并直接换算为吨数（及公吨）。支持多种石材密度设定。',
      highlights: [
        '计算骨料体积（立方码及立方英尺）',
        '换算为美吨及公吨重量',
        '预设级配碎石、细石、花岗岩等密度系数',
        '自动计入压实沉降损耗（10%-15% 缓冲）'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 测量车道面积',
        desc: '输入长度和平均宽度（英尺）。'
      },
      step2: {
        title: '2. 设置垫层深度',
        desc: '输入深度（表层维护 4 英寸，新建车道 6-8 英寸）。'
      },
      step3: {
        title: '3. 选择骨料密度',
        desc: '选择碎石种类或输入自定义密度（如 1.4 吨/立方码）。'
      },
      step4: {
        title: '4. 获取吨数与成本',
        desc: '查看向采石场订购的准确吨数及运费估算。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '真实密度重量换算',
          desc: '基于材料真实密度计算，防止少订。'
        },
        {
          title: '压实损耗预留',
          desc: '内置沉降缓冲，确保压路机压实后材料充足。'
        },
        {
          title: '采石场采购规格',
          desc: '直接提供可提交给供货商的吨数规格。'
        },
        {
          title: '完全免费无广告',
          desc: '极速响应，无需付费。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '碎石吨数计算公式',
      formulaText: '吨数 = ((长度ft × 宽度ft × (深度in / 12)) / 27) × 骨料密度 (吨/yd³)',
      tips: [
        {
          title: '铺设土工布垫层',
          desc: '在铺石前于土基上铺设无纺土工布，防止碎石陷入泥土。'
        },
        {
          title: '车道拱度与排水',
          desc: '车道中央应高于两侧，便于雨水向两旁顺利排出。'
        }
      ]
    }
  },
  'drywall-calculator': {
    slug: 'drywall-calculator',
    whatItDoes: {
      title: '石膏板（干壁板）计算器的主要功能',
      description: '计算房间墙面和天花板所需的石膏板张数（4x8、4x12 规格），并自动计算接缝纸带、嵌缝膏及干壁螺钉用量。',
      highlights: [
        '计算 4x8 英尺及 4x12 英尺石膏板张数',
        '计算墙面与天花板总覆盖面积（平方英尺）',
        '估算接缝纸带长度及嵌缝膏桶数',
        '计算石膏板专用螺钉估算数量'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 输入房间/墙面尺寸',
        desc: '输入墙体周长和层高，或总净面积。'
      },
      step2: {
        title: '2. 扣除门窗洞口',
        desc: '减去门窗面积以获得准确净覆盖面积。'
      },
      step3: {
        title: '3. 选择石膏板规格',
        desc: '选择 4x8 英尺标准板或 4x12 英尺长板。'
      },
      step4: {
        title: '4. 查看材料清单',
        desc: '核对所需板材张数、胶带、嵌缝膏及螺钉盒数。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '干壁系统整体估算',
          desc: '一键同时估算板材、胶带、腻子及螺钉。'
        },
        {
          title: '规格排布优化',
          desc: '对比不同板材规格以减少接缝与打磨工时。'
        },
        {
          title: '裁切损耗保护',
          desc: '内置 10% 损耗缓冲，防止边角裁切导致材料不足。'
        },
        {
          title: '100% 免费使用',
          desc: '承包商及装修业主均可免费使用。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '石膏板张数计算公式',
      formulaText: '4x8板张数 = (净表面积sq ft / 32) × 1.10 (损耗缓冲)',
      tips: [
        {
          title: '横向挂板安装',
          desc: '将石膏板横向跨龙骨安装，可增加整体刚度并便于接缝处理。'
        },
        {
          title: '错缝拼装规范',
          desc: '相邻两排板材的短边接缝应错开至少 2 英尺，防止开裂。'
        }
      ]
    }
  },
  'framing-calculator': {
    slug: 'framing-calculator',
    whatItDoes: {
      title: '木龙骨墙体骨架计算器的主要功能',
      description: '计算木结构墙体所需的 2x4 或 2x6 立柱（Studs）、单/双顶龙骨、底龙骨及 16 英尺定尺木料数量。支持 16" 和 24" 中心距。',
      highlights: [
        '计算垂直立柱数量（含墙角及交叉连接处）',
        '计算顶龙骨与底龙骨的总延长英尺',
        '支持标准 16 英寸及 24 英寸中心距',
        '自动拆算为建材市场 16 英尺商用木料根数'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 输入墙体长度',
        desc: '输入连续墙体的总长度（英尺）。'
      },
      step2: {
        title: '2. 选择立柱间距',
        desc: '选择 16" O.C.（承重墙标准）或 24" O.C.（非承重隔墙）。'
      },
      step3: {
        title: '3. 选择顶压条方案',
        desc: '选择双顶龙骨（标准建筑规范）或单顶龙骨。'
      },
      step4: {
        title: '4. 获取木料采购根数',
        desc: '查看立柱总数、龙骨延长英尺及 16ft 木条采购量。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: '墙体结构构件细分',
          desc: '区分垂直立柱、底龙骨及双顶龙骨。'
        },
        {
          title: '匹配建材市场标准木料',
          desc: '将线性长度直接换算为可采购的 16ft 标准木条。'
        },
        {
          title: '转角与交叉口加固',
          desc: '自动包含墙角及 T 字交叉口所需的额外立柱。'
        },
        {
          title: '承包商免费工具',
          desc: '专为木工及木结构建造者打造。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '立柱数量计算公式',
      formulaText: '立柱数 = (墙长in / 间距in) + 1 + 墙角额外立柱 (每角3根)',
      tips: [
        {
          title: '防腐处理底龙骨',
          desc: '直接接触混凝土地面时，底龙骨必须使用防腐加压处理木材。'
        },
        {
          title: '立柱弯曲度方向统一',
          desc: '钉合前检查每根立柱的弓背方向，统一朝向以保证墙面平整。'
        }
      ]
    }
  },
  'rebar-calculator': {
    slug: 'rebar-calculator',
    whatItDoes: {
      title: '钢筋网片/用量计算器的主要功能',
      description: '计算混凝土平板、基础及挡土墙所需的钢筋用量：包含总延长英尺、20ft 标准钢筋根数、网格数量、各型号（#3 至 #8）总重量及 40d 搭接长度。',
      highlights: [
        '计算纵向与横向钢筋网片排布',
        '规格选择器（#3 3/8" 至 #8 1" / D10至D25）',
        '自动计入 40 倍直径 (40d) 搭接搭头',
        '输出总延长英尺、20ft 钢筋根数及重量（磅/千克）'
      ]
    },
    howToUse: {
      step1: {
        title: '1. 输入网片尺寸',
        desc: '输入配筋区域的长度和宽度（英尺）。'
      },
      step2: {
        title: '2. 指定钢筋间距',
        desc: '输入网格间距（如 12"、18" 或 24" 间距）。'
      },
      step3: {
        title: '3. 选择钢筋型号',
        desc: '选择钢筋规格（#4 1/2" 为车道平板常用规格）。'
      },
      step4: {
        title: '4. 查看根数与钢材重量',
        desc: '核对 20ft 钢筋根数、总延长英尺及总重量。'
      }
    },
    whyBuildYardage: {
      reasons: [
        {
          title: 'ASTM 标准单位重量换算',
          desc: '基于规范每英尺/米标准重量常数进行换算。'
        },
        {
          title: '自动计算 40d 搭接',
          desc: '包含连续钢筋搭接长度，防止施工现场缺料。'
        },
        {
          title: '钢材供应商采购规格',
          desc: '提供准确的钢筋根数及吨数/磅数。'
        },
        {
          title: '100% 免费工程工具',
          desc: '助力工地现场预算与排料。'
        }
      ]
    },
    technicalGuide: {
      formulaTitle: '钢筋总延长英尺公式',
      formulaText: '总延长英尺 = ((横向钢筋根数 × 长度) + (纵向钢筋根数 × 宽度)) × (1 + 搭接系数)',
      tips: [
        {
          title: '使用钢筋垫块（马凳）',
          desc: '使用塑料垫块或混凝土垫块支撑钢筋网，确保钢筋处于板厚中上部。'
        },
        {
          title: '交叉点绑扎规范',
          desc: '使用 16 号退火铁丝绑扎交叉点；切勿焊接普通钢筋。'
        }
      ]
    }
  }
};

const localizedGuides: Record<string, Record<string, ToolGuide>> = {
  en: calculatorGuides,
  es: esCalculatorGuides,
  fr: frCalculatorGuides,
  de: deCalculatorGuides,
  pt: ptCalculatorGuides,
  it: itCalculatorGuides,
  ja: jaCalculatorGuides,
  zh: zhCalculatorGuides
};

/**
 * Retrieves the tool guide for a specific calculator slug and locale.
 * Falls back to English if the localized guide or slug is not found.
 */
export function getCalculatorGuide(slug: string, locale: string = 'en'): ToolGuide | undefined {
  const localeMap = localizedGuides[locale] || localizedGuides['en'];
  return localeMap[slug] || calculatorGuides[slug];
}
