/**
 * Medical Reference Database (RAG Knowledge Base)
 * 
 * Local array of common lab tests with WHO/standard age-and-sex-adjusted
 * reference ranges. Used as the retrieval source for the RAG pipeline in
 * AI report interpretation.
 */

export interface ReferenceRange {
  sex: 'male' | 'female' | 'any';
  minAge: number;
  maxAge: number;
  min: number;
  max: number;
  unit: string;
}

export interface MedicalTest {
  name: string;
  aliases: string[];
  ranges: ReferenceRange[];
  criticalLow: number;
  criticalHigh: number;
  description: string;
}

const medicalReferenceDB: MedicalTest[] = [
  // ─── COMPLETE BLOOD COUNT (CBC) ────────────────────────────
  {
    name: 'Hemoglobin',
    aliases: ['HGB', 'Hb', 'Haemoglobin', 'HB'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 13.5, max: 17.5, unit: 'g/dL' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 12.0, max: 15.5, unit: 'g/dL' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 11.0, max: 16.0, unit: 'g/dL' },
    ],
    criticalLow: 7.0,
    criticalHigh: 20.0,
    description: 'Oxygen-carrying protein in red blood cells',
  },
  {
    name: 'WBC',
    aliases: ['TLC', 'Total Leucocyte Count', 'White Blood Cells', 'White Blood Cell Count', 'Leukocytes', 'WBC Count'],
    ranges: [
      { sex: 'any', minAge: 18, maxAge: 120, min: 4.0,  max: 11.0,  unit: '×10³/µL' },
      { sex: 'any', minAge: 0,  maxAge: 17,  min: 5.0,  max: 13.0,  unit: '×10³/µL' },
    ],
    criticalLow: 2.0,
    criticalHigh: 30.0,
    description: 'White blood cells that fight infections',
  },
  {
    name: 'RBC',
    aliases: ['Red Blood Cells', 'Red Blood Cell Count', 'Erythrocytes', 'RBC Count'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 4.5, max: 5.5, unit: '×10⁶/µL' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 4.0, max: 5.0, unit: '×10⁶/µL' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 4.0, max: 5.5, unit: '×10⁶/µL' },
    ],
    criticalLow: 2.0,
    criticalHigh: 8.0,
    description: 'Red blood cells that carry oxygen throughout your body',
  },
  {
    name: 'Platelets',
    aliases: ['PLT', 'Platelet Count', 'Thrombocytes'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 150, max: 400, unit: '×10³/µL' },
    ],
    criticalLow: 50,
    criticalHigh: 1000,
    description: 'Blood cells that help with clotting',
  },
  {
    name: 'MCV',
    aliases: ['Mean Corpuscular Volume'],
    ranges: [
      { sex: 'any', minAge: 18, maxAge: 120, min: 80, max: 100, unit: 'fL' },
      { sex: 'any', minAge: 0,  maxAge: 17,  min: 75, max: 95,  unit: 'fL' },
    ],
    criticalLow: 60,
    criticalHigh: 120,
    description: 'Average size of your red blood cells',
  },
  {
    name: 'MCH',
    aliases: ['Mean Corpuscular Hemoglobin'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 27, max: 33, unit: 'pg' },
    ],
    criticalLow: 20,
    criticalHigh: 40,
    description: 'Average amount of hemoglobin per red blood cell',
  },
  {
    name: 'MCHC',
    aliases: ['Mean Corpuscular Hemoglobin Concentration'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 32, max: 36, unit: 'g/dL' },
    ],
    criticalLow: 28,
    criticalHigh: 40,
    description: 'Average concentration of hemoglobin in your red blood cells',
  },
  {
    name: 'ESR',
    aliases: ['Erythrocyte Sedimentation Rate', 'Sed Rate'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 50,  min: 0, max: 15, unit: 'mm/hr' },
      { sex: 'male',   minAge: 51, maxAge: 120, min: 0, max: 20, unit: 'mm/hr' },
      { sex: 'female', minAge: 18, maxAge: 50,  min: 0, max: 20, unit: 'mm/hr' },
      { sex: 'female', minAge: 51, maxAge: 120, min: 0, max: 30, unit: 'mm/hr' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 0, max: 10, unit: 'mm/hr' },
    ],
    criticalLow: 0,
    criticalHigh: 100,
    description: 'Measures inflammation in the body',
  },

  // ─── BLOOD SUGAR / DIABETES ────────────────────────────────
  {
    name: 'Fasting Blood Sugar',
    aliases: ['FBS', 'Glucose', 'Fasting Glucose', 'Blood Sugar', 'Fasting Blood Glucose', 'Blood Glucose Fasting'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 70, max: 100, unit: 'mg/dL' },
    ],
    criticalLow: 40,
    criticalHigh: 400,
    description: 'Blood sugar level after fasting — screens for diabetes',
  },
  {
    name: 'HbA1c',
    aliases: ['Glycated Hemoglobin', 'A1C', 'Hemoglobin A1c', 'HbA1C', 'Glycosylated Hemoglobin'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 4.0, max: 5.6, unit: '%' },
    ],
    criticalLow: 3.0,
    criticalHigh: 15.0,
    description: 'Average blood sugar over the past 2-3 months',
  },

  // ─── KIDNEY FUNCTION ───────────────────────────────────────
  {
    name: 'Creatinine',
    aliases: ['Serum Creatinine', 'Creat', 'S. Creatinine'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 0.7, max: 1.3, unit: 'mg/dL' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 0.6, max: 1.1, unit: 'mg/dL' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 0.3, max: 0.7, unit: 'mg/dL' },
    ],
    criticalLow: 0.2,
    criticalHigh: 10.0,
    description: 'Measures kidney function — how well your kidneys filter waste',
  },
  {
    name: 'Urea',
    aliases: ['BUN', 'Blood Urea Nitrogen', 'Serum Urea', 'S. Urea'],
    ranges: [
      { sex: 'any', minAge: 18, maxAge: 120, min: 7,  max: 20, unit: 'mg/dL' },
      { sex: 'any', minAge: 0,  maxAge: 17,  min: 5,  max: 18, unit: 'mg/dL' },
    ],
    criticalLow: 2,
    criticalHigh: 100,
    description: 'Measures how well your kidneys remove waste from blood',
  },
  {
    name: 'Uric Acid',
    aliases: ['Serum Uric Acid', 'S. Uric Acid'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 3.4, max: 7.0, unit: 'mg/dL' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 2.4, max: 6.0, unit: 'mg/dL' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 2.0, max: 5.5, unit: 'mg/dL' },
    ],
    criticalLow: 1.0,
    criticalHigh: 12.0,
    description: 'High levels can indicate gout or kidney problems',
  },

  // ─── LIVER FUNCTION ────────────────────────────────────────
  {
    name: 'ALT',
    aliases: ['SGPT', 'Alanine Aminotransferase', 'Alanine Transaminase', 'S. ALT', 'Serum ALT'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 7,  max: 56, unit: 'U/L' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 7,  max: 45, unit: 'U/L' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 7,  max: 40, unit: 'U/L' },
    ],
    criticalLow: 0,
    criticalHigh: 1000,
    description: 'Liver enzyme — elevated levels may indicate liver damage',
  },
  {
    name: 'AST',
    aliases: ['SGOT', 'Aspartate Aminotransferase', 'Aspartate Transaminase', 'S. AST', 'Serum AST'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 10, max: 40, unit: 'U/L' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 9,  max: 32, unit: 'U/L' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 10, max: 35, unit: 'U/L' },
    ],
    criticalLow: 0,
    criticalHigh: 1000,
    description: 'Liver enzyme — can also indicate heart or muscle damage',
  },
  {
    name: 'Bilirubin Total',
    aliases: ['Total Bilirubin', 'T. Bilirubin', 'Serum Bilirubin', 'S. Bilirubin'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 0.1, max: 1.2, unit: 'mg/dL' },
    ],
    criticalLow: 0,
    criticalHigh: 15.0,
    description: 'Measures liver health and bile duct function',
  },

  // ─── ELECTROLYTES ──────────────────────────────────────────
  {
    name: 'Sodium',
    aliases: ['Na', 'Na+', 'Serum Sodium', 'S. Sodium'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 136, max: 145, unit: 'mEq/L' },
    ],
    criticalLow: 120,
    criticalHigh: 160,
    description: 'Essential electrolyte for nerve and muscle function',
  },
  {
    name: 'Potassium',
    aliases: ['K', 'K+', 'Serum Potassium', 'S. Potassium'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 3.5, max: 5.0, unit: 'mEq/L' },
    ],
    criticalLow: 2.5,
    criticalHigh: 6.5,
    description: 'Critical electrolyte for heart rhythm and muscle function',
  },

  // ─── LIPID PROFILE ─────────────────────────────────────────
  {
    name: 'Cholesterol Total',
    aliases: ['Total Cholesterol', 'Cholesterol', 'TC', 'Serum Cholesterol', 'S. Cholesterol'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 0, max: 200, unit: 'mg/dL' },
    ],
    criticalLow: 0,
    criticalHigh: 400,
    description: 'Total cholesterol level — risk factor for heart disease',
  },
  {
    name: 'Triglycerides',
    aliases: ['TG', 'Serum Triglycerides', 'S. Triglycerides', 'Trigs'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 0, max: 150, unit: 'mg/dL' },
    ],
    criticalLow: 0,
    criticalHigh: 500,
    description: 'Type of fat in blood — high levels increase heart disease risk',
  },
  {
    name: 'HDL Cholesterol',
    aliases: ['HDL', 'HDL-C', 'High Density Lipoprotein', 'Good Cholesterol'],
    ranges: [
      { sex: 'male',   minAge: 18, maxAge: 120, min: 40, max: 60, unit: 'mg/dL' },
      { sex: 'female', minAge: 18, maxAge: 120, min: 50, max: 60, unit: 'mg/dL' },
      { sex: 'any',    minAge: 0,  maxAge: 17,  min: 40, max: 60, unit: 'mg/dL' },
    ],
    criticalLow: 20,
    criticalHigh: 100,
    description: 'Good cholesterol — higher levels are protective',
  },
  {
    name: 'LDL Cholesterol',
    aliases: ['LDL', 'LDL-C', 'Low Density Lipoprotein', 'Bad Cholesterol'],
    ranges: [
      { sex: 'any', minAge: 0, maxAge: 120, min: 0, max: 100, unit: 'mg/dL' },
    ],
    criticalLow: 0,
    criticalHigh: 300,
    description: 'Bad cholesterol — high levels increase risk of heart disease',
  },

  // ─── THYROID FUNCTION ──────────────────────────────────────
  {
    name: 'TSH',
    aliases: ['Thyroid Stimulating Hormone', 'Thyrotropin', 'S. TSH', 'Serum TSH'],
    ranges: [
      { sex: 'any', minAge: 18, maxAge: 120, min: 0.4, max: 4.0, unit: 'mIU/L' },
      { sex: 'any', minAge: 0,  maxAge: 17,  min: 0.7, max: 6.4, unit: 'mIU/L' },
    ],
    criticalLow: 0.1,
    criticalHigh: 50.0,
    description: 'Controls thyroid gland function — regulates metabolism',
  },
  {
    name: 'T3',
    aliases: ['Triiodothyronine', 'Total T3', 'Serum T3', 'Free T3', 'FT3'],
    ranges: [
      { sex: 'any', minAge: 18, maxAge: 120, min: 80, max: 200, unit: 'ng/dL' },
      { sex: 'any', minAge: 0,  maxAge: 17,  min: 100, max: 260, unit: 'ng/dL' },
    ],
    criticalLow: 40,
    criticalHigh: 400,
    description: 'Active thyroid hormone — regulates metabolism and energy',
  },
  {
    name: 'T4',
    aliases: ['Thyroxine', 'Total T4', 'Serum T4', 'Free T4', 'FT4'],
    ranges: [
      { sex: 'any', minAge: 18, maxAge: 120, min: 5.0, max: 12.0, unit: 'µg/dL' },
      { sex: 'any', minAge: 0,  maxAge: 17,  min: 6.0, max: 15.0, unit: 'µg/dL' },
    ],
    criticalLow: 2.0,
    criticalHigh: 25.0,
    description: 'Main thyroid hormone — converted to T3 in the body',
  },
];

export default medicalReferenceDB;
