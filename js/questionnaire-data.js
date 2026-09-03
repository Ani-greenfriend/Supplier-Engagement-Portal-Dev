/*
 * Master questionnaire data — extracted directly from
 * assets/The_Corporate_Supplier_Questionnaire_2026.xlsx (build time).
 *
 * This is the single source of truth for the Guided Form and Upload &
 * Review overlays. If the source workbook changes, re-extract this file
 * from it — do not hand-edit question text here without checking the
 * workbook first.
 *
 * S1's EcoVadis-bypass question and its conditional link field (workbook
 * rows 8-9) are intentionally excluded: a visitor only reaches these flows
 * because they have no EcoVadis scorecard (spec Section 8).
 */

const QUESTIONNAIRE_SECTIONS = [
  {
    id: 'general-info',
    title: 'General Information',
    esrsRef: 'S1',
    fields: [
      {
        id: 's1-q1', section: 'S1', esrsRef: '—', type: 'Required',
        question: 'Legal name and registered country of the responding entity.'
      },
      {
        id: 's1-q2', section: 'S1', esrsRef: '—', type: 'Required',
        question: 'Primary contact name, title, and email address for this assessment.'
      }
    ]
  },
  {
    id: 'climate',
    title: 'Climate & Decarbonisation',
    esrsRef: 'S2 / ESRS E1',
    fields: [
      {
        id: 's2-q1', section: 'S2', esrsRef: 'E1-4', type: 'Quantitative', unit: 'metric tonnes CO₂e',
        question: 'Total Scope 1 emissions for last fiscal year (metric tonnes CO₂e). Include verification method.'
      },
      {
        id: 's2-q2', section: 'S2', esrsRef: 'E1-4', type: 'Quantitative', unit: 'metric tonnes CO₂e',
        question: 'Total Scope 2 emissions for last fiscal year — market-based (metric tonnes CO₂e).'
      },
      {
        id: 's2-q3', section: 'S2', esrsRef: 'E1-4', type: 'Quantitative', unit: 'metric tonnes CO₂e',
        question: 'Total Scope 3 emissions for last fiscal year (metric tonnes CO₂e). Specify categories included.'
      },
      {
        id: 's2-q4', section: 'S2', esrsRef: 'E1-3', type: 'Dropdown',
        options: ['Yes', 'No', 'Partial / In Progress'],
        question: 'Does your organisation have a Science-Based Target (SBTi) validated decarbonisation target?'
      },
      {
        id: 's2-q5', section: 'S2', esrsRef: 'E1-2', type: 'Open-Ended',
        question: 'Describe your top three decarbonisation projects currently in progress or planned for the next 24 months. Include estimated tCO₂e reduction and the specific technology being utilised (e.g., electrification of heat, on-site renewables).'
      },
      {
        id: 's2-q6', section: 'S2', esrsRef: 'E1-2', type: 'Open-Ended',
        question: 'What are the primary technical or financial barriers preventing you from reaching a 50% reduction in Scope 1 and 2 emissions by 2030?'
      }
    ]
  },
  {
    id: 'pollution',
    title: 'Pollution & PFAS',
    esrsRef: 'S3 / ESRS E2',
    fields: [
      {
        id: 's3-q1', section: 'S3', esrsRef: 'E2-3', type: 'Quantitative', unit: 'kg',
        question: 'Total weight of substances of concern (REACH, SVHC list) used in production last fiscal year (kg).'
      },
      {
        id: 's3-q2', section: 'S3', esrsRef: 'E2-3', type: 'Dropdown',
        options: ['Yes', 'No'],
        staticNote: '⚠ AUTO-FLAG: "Yes" triggers PFAS Risk review',
        question: 'Do any of your products or production processes contain or utilise PFAS compounds ("Forever Chemicals")?'
      },
      {
        id: 's3-q3', section: 'S3', esrsRef: 'E2-3', type: 'Open-Ended',
        question: 'If your products contain PFAS, detail your substitution roadmap. Have you identified viable non-PFAS alternatives? Provide your target date for a complete phase-out.'
      },
      {
        id: 's3-q4', section: 'S3', esrsRef: 'E2-2', type: 'Open-Ended',
        question: 'Describe your industrial wastewater treatment process. What specific measures are in place to ensure zero leakage of hazardous chemicals into local water systems?'
      }
    ]
  },
  {
    id: 'water',
    title: 'Water & Marine Resources',
    esrsRef: 'S4 / ESRS E3',
    fields: [
      {
        id: 's4-q1', section: 'S4', esrsRef: 'E3-1', type: 'Quantitative', unit: 'm³',
        question: 'Total water withdrawal last fiscal year (m³). Specify source (municipal, groundwater, surface).'
      },
      {
        id: 's4-q2', section: 'S4', esrsRef: 'E3-1', type: 'Dropdown',
        options: ['Yes', 'No'],
        question: 'Is your primary production facility located in a high-water-stress region (WRI Aqueduct score ≥3)?'
      },
      {
        id: 's4-q3', section: 'S4', esrsRef: 'E3-2', type: 'Open-Ended',
        question: 'Provide details on any water-saving or closed-loop recycling projects implemented at your facility. How has your total water intensity (litres per unit produced) changed over the last three years?'
      },
      {
        id: 's4-q4', section: 'S4', esrsRef: 'E3-2', type: 'Open-Ended',
        question: 'If your facility is in a high-water-stress region, what is your operational contingency plan for severe drought conditions to ensure supply continuity to The Corporate?'
      }
    ]
  },
  {
    id: 'circular',
    title: 'Circular Economy & Waste',
    esrsRef: 'S5 / ESRS E5',
    fields: [
      {
        id: 's5-q1', section: 'S5', esrsRef: 'E5-2', type: 'Quantitative', unit: 'tonnes',
        question: 'Total waste generated last fiscal year (tonnes). Breakdown: landfill / recycled / energy recovery / hazardous.'
      },
      {
        id: 's5-q2', section: 'S5', esrsRef: 'E5-4', type: 'Quantitative', unit: '%',
        question: 'Percentage of post-consumer recycled (PCR) content in the components supplied to The Corporate (%).'
      },
      {
        id: 's5-q3', section: 'S5', esrsRef: 'E5-3', type: 'Open-Ended',
        question: 'How are you incorporating circularity into the specific components you supply to The Corporate? Examples: design for disassembly, modularity, or increasing PCR content.'
      },
      {
        id: 's5-q4', section: 'S5', esrsRef: 'E5-2', type: 'Open-Ended',
        question: 'Detail your strategy for achieving Zero Waste to Landfill. What are your primary waste streams, and what innovative recycling or upcycling initiatives have you launched recently?'
      }
    ]
  },
  {
    id: 'biodiversity',
    title: 'Biodiversity & Ecosystems',
    esrsRef: 'S6 / ESRS E4',
    fields: [
      {
        id: 's6-q1', section: 'S6', esrsRef: 'E4-2', type: 'Dropdown',
        options: ['Yes', 'No'],
        question: 'Are any of your production sites located within or adjacent to (within 1 km) a protected area or biodiversity hotspot?'
      },
      {
        id: 's6-q2', section: 'S6', esrsRef: 'E4-3', type: 'Open-Ended',
        question: 'Describe any initiatives taken to minimise the impact of your operations on local biodiversity. Include land-use management, native planting schemes, or light/noise pollution reduction.'
      },
      {
        id: 's6-q3', section: 'S6', esrsRef: 'E4-5', type: 'Open-Ended',
        question: 'Have you undertaken a biodiversity impact assessment (TNFD or equivalent) for your primary production sites? If yes, share key findings. If no, provide your target assessment date.'
      }
    ]
  },
  {
    id: 'social',
    title: 'Social, Labour & Governance',
    esrsRef: 'S7 / ESRS S2 · G1',
    fields: [
      {
        id: 's7-q1', section: 'S7', esrsRef: 'S2-1', type: 'Dropdown',
        options: ['Yes', 'No', 'Partial / In Progress'],
        question: 'Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights?'
      },
      {
        id: 's7-q2', section: 'S7', esrsRef: 'S2-2', type: 'Dropdown',
        options: ['Yes', 'No'],
        question: 'Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months?'
      },
      {
        id: 's7-q3', section: 'S7', esrsRef: 'S2-4', type: 'Open-Ended',
        question: 'Describe the grievance mechanism available to workers in your supply chain. How many grievances were filed and resolved in the last 12 months?'
      },
      {
        id: 's7-q4', section: 'S7', esrsRef: 'G1-1', type: 'Dropdown',
        options: ['Yes', 'No', 'Partial / In Progress'],
        question: 'Does your organisation have a verified conflict minerals policy (3TG — tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance?'
      },
      {
        id: 's7-q5', section: 'S7', esrsRef: 'G1-2', type: 'Open-Ended',
        question: 'Describe your supplier code of conduct and how compliance is monitored across your own supply chain. Include details of any third-party audits conducted in the last 24 months.'
      }
    ]
  }
];

/*
 * Row template for the generated completed XLSX — mirrors the source
 * workbook's row layout (columns and section order) exactly, skipping
 * only the excluded S1 EcoVadis-bypass rows. Used by exportWorkbook() in
 * app.js.
 */
const EXPORT_ROW_TEMPLATE = [
  { kind: 'static', cells: ['THE CORPORATE — GLOBAL SUPPLIER SUSTAINABILITY ASSESSMENT 2026'] },
  { kind: 'static', cells: ['ESRS / CSRD Compliant · Confidential · EcoVadis-First Programme · Procurement & EHS Working Group'] },
  { kind: 'static', cells: ['SECTION', 'ESRS REF', 'TYPE', 'QUESTION / METRIC', 'SUPPLIER RESPONSE', 'NOTES / EVIDENCE', 'STATUS'] },
  { kind: 'static', cells: ['INSTRUCTIONS: Complete all sections marked REQUIRED. Suppliers with a valid EcoVadis Scorecard (S1, Q1 = YES) must submit scorecard link and proceed directly to STATUS column. All others complete Sections S2–S7.'] },
  { kind: 'section', section: 'S1', title: 'General Information & EcoVadis Bypass', status: 'All ESRS' },
  { kind: 'field', fieldId: 's1-q1' },
  { kind: 'field', fieldId: 's1-q2' },
  { kind: 'section', section: 'S2', title: 'Climate & Decarbonisation', status: 'ESRS E1' },
  { kind: 'field', fieldId: 's2-q1' },
  { kind: 'field', fieldId: 's2-q2' },
  { kind: 'field', fieldId: 's2-q3' },
  { kind: 'field', fieldId: 's2-q4' },
  { kind: 'field', fieldId: 's2-q5' },
  { kind: 'field', fieldId: 's2-q6' },
  { kind: 'section', section: 'S3', title: 'Pollution & PFAS', status: 'ESRS E2' },
  { kind: 'field', fieldId: 's3-q1' },
  { kind: 'field', fieldId: 's3-q2' },
  { kind: 'field', fieldId: 's3-q3' },
  { kind: 'field', fieldId: 's3-q4' },
  { kind: 'section', section: 'S4', title: 'Water & Marine Resources', status: 'ESRS E3' },
  { kind: 'field', fieldId: 's4-q1' },
  { kind: 'field', fieldId: 's4-q2' },
  { kind: 'field', fieldId: 's4-q3' },
  { kind: 'field', fieldId: 's4-q4' },
  { kind: 'section', section: 'S5', title: 'Circular Economy & Waste', status: 'ESRS E5' },
  { kind: 'field', fieldId: 's5-q1' },
  { kind: 'field', fieldId: 's5-q2' },
  { kind: 'field', fieldId: 's5-q3' },
  { kind: 'field', fieldId: 's5-q4' },
  { kind: 'section', section: 'S6', title: 'Biodiversity & Ecosystems', status: 'ESRS E4' },
  { kind: 'field', fieldId: 's6-q1' },
  { kind: 'field', fieldId: 's6-q2' },
  { kind: 'field', fieldId: 's6-q3' },
  { kind: 'section', section: 'S7', title: 'Social, Labour & Governance', status: 'ESRS S2 · G1' },
  { kind: 'field', fieldId: 's7-q1' },
  { kind: 'field', fieldId: 's7-q2' },
  { kind: 'field', fieldId: 's7-q3' },
  { kind: 'field', fieldId: 's7-q4' },
  { kind: 'field', fieldId: 's7-q5' },
  { kind: 'static', cells: [] },
  { kind: 'declaration' }
];
