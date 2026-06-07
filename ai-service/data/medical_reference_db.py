"""
Medical Reference Database (RAG Knowledge Base)

Local list of common lab tests with WHO/standard age-and-sex-adjusted
reference ranges. Used as the retrieval source for the RAG pipeline.
"""

MEDICAL_REFERENCE_DB = [
    # ─── COMPLETE BLOOD COUNT (CBC) ────────────────────────────
    {
        "id": "hemoglobin",
        "name": "Hemoglobin",
        "aliases": ["HGB", "Hb", "Haemoglobin", "HB"],
        "content": (
            "Hemoglobin (HGB, Hb) measures the oxygen-carrying protein in red blood cells. "
            "Normal ranges: Males 18+: 13.5-17.5 g/dL. Females 18+: 12.0-15.5 g/dL. "
            "Children under 18: 11.0-16.0 g/dL. Critical low: below 7.0 g/dL. "
            "Critical high: above 20.0 g/dL. Low hemoglobin indicates anemia, iron deficiency, "
            "or chronic disease. High may indicate dehydration or polycythemia vera."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 13.5, "max": 17.5, "unit": "g/dL"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 12.0, "max": 15.5, "unit": "g/dL"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 11.0, "max": 16.0, "unit": "g/dL"},
        ],
        "criticalLow": 7.0,
        "criticalHigh": 20.0,
    },
    {
        "id": "wbc",
        "name": "WBC",
        "aliases": ["TLC", "Total Leucocyte Count", "Leukocytes", "White Blood Cells", "White Blood Cell Count", "WBC Count"],
        "content": (
            "White Blood Cell count (WBC, TLC) measures infection-fighting cells in blood. "
            "Normal: Adults 4.0-11.0 ×10³/µL. Children: 5.0-13.0 ×10³/µL. "
            "Critical low below 2.0 (risk of infection). Critical high above 30.0 (leukemia risk). "
            "Elevated WBC suggests bacterial infection or inflammation. Low WBC indicates immune suppression."
        ),
        "ranges": [
            {"sex": "any", "minAge": 18, "maxAge": 120, "min": 4.0,  "max": 11.0, "unit": "×10³/µL"},
            {"sex": "any", "minAge": 0,  "maxAge": 17,  "min": 5.0,  "max": 13.0, "unit": "×10³/µL"},
        ],
        "criticalLow": 2.0,
        "criticalHigh": 30.0,
    },
    {
        "id": "rbc",
        "name": "RBC",
        "aliases": ["Red Blood Cells", "Erythrocytes", "Red Blood Cell Count", "RBC Count"],
        "content": (
            "Red Blood Cell count (RBC) measures cells that carry oxygen throughout the body. "
            "Normal: Males 4.5-5.5 ×10⁶/µL. Females 4.0-5.0 ×10⁶/µL. Children 4.0-5.5. "
            "Critical low below 2.0. Critical high above 8.0. "
            "Low RBC indicates anemia or blood loss. High RBC may indicate dehydration or bone marrow disorder."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 4.5, "max": 5.5, "unit": "×10⁶/µL"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 4.0, "max": 5.0, "unit": "×10⁶/µL"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 4.0, "max": 5.5, "unit": "×10⁶/µL"},
        ],
        "criticalLow": 2.0,
        "criticalHigh": 8.0,
    },
    {
        "id": "platelets",
        "name": "Platelets",
        "aliases": ["PLT", "Platelet Count", "Thrombocytes"],
        "content": (
            "Platelets (PLT) are blood cells essential for clotting and wound healing. "
            "Normal range: 150-400 ×10³/µL for all ages. Critical low below 50 (bleeding risk). "
            "Critical high above 1000 (clotting risk). Low platelets may indicate dengue, ITP, or bone marrow issues. "
            "High platelets may indicate infection, inflammation, or myeloproliferative disorder."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 150, "max": 400, "unit": "×10³/µL"},
        ],
        "criticalLow": 50,
        "criticalHigh": 1000,
    },
    {
        "id": "mcv",
        "name": "MCV",
        "aliases": ["Mean Corpuscular Volume"],
        "content": (
            "Mean Corpuscular Volume (MCV) measures the average size of red blood cells. "
            "Normal: Adults 80-100 fL. Children 75-95 fL. Critical low below 60 fL. Critical high above 120 fL. "
            "Low MCV (microcytic) suggests iron deficiency anemia or thalassemia. "
            "High MCV (macrocytic) suggests vitamin B12 or folate deficiency."
        ),
        "ranges": [
            {"sex": "any", "minAge": 18, "maxAge": 120, "min": 80, "max": 100, "unit": "fL"},
            {"sex": "any", "minAge": 0,  "maxAge": 17,  "min": 75, "max": 95,  "unit": "fL"},
        ],
        "criticalLow": 60,
        "criticalHigh": 120,
    },
    {
        "id": "mch",
        "name": "MCH",
        "aliases": ["Mean Corpuscular Hemoglobin"],
        "content": (
            "Mean Corpuscular Hemoglobin (MCH) measures the average amount of hemoglobin per red blood cell. "
            "Normal: 27-33 pg for all ages. Critical low below 20 pg. Critical high above 40 pg. "
            "Low MCH indicates hypochromic anemia (iron deficiency). High MCH may indicate macrocytic anemia."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 27, "max": 33, "unit": "pg"},
        ],
        "criticalLow": 20,
        "criticalHigh": 40,
    },
    {
        "id": "mchc",
        "name": "MCHC",
        "aliases": ["Mean Corpuscular Hemoglobin Concentration"],
        "content": (
            "Mean Corpuscular Hemoglobin Concentration (MCHC) measures average hemoglobin concentration in red blood cells. "
            "Normal: 32-36 g/dL for all ages. Critical low below 28. Critical high above 40. "
            "Low MCHC indicates iron deficiency. High MCHC may indicate hereditary spherocytosis."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 32, "max": 36, "unit": "g/dL"},
        ],
        "criticalLow": 28,
        "criticalHigh": 40,
    },
    {
        "id": "esr",
        "name": "ESR",
        "aliases": ["Erythrocyte Sedimentation Rate", "Sed Rate"],
        "content": (
            "Erythrocyte Sedimentation Rate (ESR) measures inflammation in the body. "
            "Normal: Males <50y: 0-15 mm/hr, >50y: 0-20. Females <50y: 0-20, >50y: 0-30. Children: 0-10. "
            "Critical high above 100 mm/hr. Elevated ESR suggests infection, autoimmune disease, or cancer. "
            "Common in rheumatoid arthritis, tuberculosis, and inflammatory conditions in Pakistani patients."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 50,  "min": 0, "max": 15, "unit": "mm/hr"},
            {"sex": "male",   "minAge": 51, "maxAge": 120, "min": 0, "max": 20, "unit": "mm/hr"},
            {"sex": "female", "minAge": 18, "maxAge": 50,  "min": 0, "max": 20, "unit": "mm/hr"},
            {"sex": "female", "minAge": 51, "maxAge": 120, "min": 0, "max": 30, "unit": "mm/hr"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 0, "max": 10, "unit": "mm/hr"},
        ],
        "criticalLow": 0,
        "criticalHigh": 100,
    },
    # ─── BLOOD SUGAR / DIABETES ────────────────────────────────
    {
        "id": "fasting_blood_sugar",
        "name": "Fasting Blood Sugar",
        "aliases": ["FBS", "FBG", "Fasting Glucose", "Blood Glucose Fasting", "Blood Sugar", "Glucose"],
        "content": (
            "Fasting Blood Sugar (FBS) measures blood glucose after 8-12 hours of fasting. "
            "Normal: 70-100 mg/dL. Pre-diabetic: 100-125 mg/dL. Diabetic: 126+ mg/dL. "
            "Critical low below 40 (hypoglycemia, risk of seizures). Critical high above 400 (diabetic emergency). "
            "Very common test in Pakistan due to high diabetes prevalence."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 70, "max": 100, "unit": "mg/dL"},
        ],
        "criticalLow": 40,
        "criticalHigh": 400,
    },
    {
        "id": "hba1c",
        "name": "HbA1c",
        "aliases": ["Glycated Hemoglobin", "A1C", "HbA1C", "Hemoglobin A1c", "Glycosylated Hemoglobin"],
        "content": (
            "HbA1c (Glycated Hemoglobin) measures average blood sugar over 2-3 months. "
            "Normal: 4.0-5.6%. Pre-diabetic: 5.7-6.4%. Diabetic: 6.5%+. "
            "Critical low below 3.0%. Critical high above 15.0%. "
            "Key diabetes monitoring test. High values indicate poor blood sugar control."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 4.0, "max": 5.6, "unit": "%"},
        ],
        "criticalLow": 3.0,
        "criticalHigh": 15.0,
    },
    # ─── KIDNEY FUNCTION ───────────────────────────────────────
    {
        "id": "creatinine",
        "name": "Creatinine",
        "aliases": ["Serum Creatinine", "S. Creatinine", "Creat"],
        "content": (
            "Creatinine measures kidney filtration function. It is a waste product from muscle metabolism. "
            "Normal: Males 0.7-1.3 mg/dL. Females 0.6-1.1 mg/dL. Children 0.3-0.7 mg/dL. "
            "Critical low below 0.2. Critical high above 10.0 (kidney failure). "
            "Elevated creatinine indicates impaired kidney function or chronic kidney disease."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 0.7, "max": 1.3, "unit": "mg/dL"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 0.6, "max": 1.1, "unit": "mg/dL"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 0.3, "max": 0.7, "unit": "mg/dL"},
        ],
        "criticalLow": 0.2,
        "criticalHigh": 10.0,
    },
    {
        "id": "urea",
        "name": "Urea",
        "aliases": ["Blood Urea", "BUN", "Blood Urea Nitrogen", "Serum Urea", "S. Urea"],
        "content": (
            "Urea (BUN) measures how well kidneys remove waste nitrogen from blood. "
            "Normal: Adults 7-20 mg/dL. Children 5-18 mg/dL. "
            "Critical low below 2. Critical high above 100 (kidney failure). "
            "Elevated urea suggests kidney disease, dehydration, or high protein diet."
        ),
        "ranges": [
            {"sex": "any", "minAge": 18, "maxAge": 120, "min": 7,  "max": 20, "unit": "mg/dL"},
            {"sex": "any", "minAge": 0,  "maxAge": 17,  "min": 5,  "max": 18, "unit": "mg/dL"},
        ],
        "criticalLow": 2,
        "criticalHigh": 100,
    },
    {
        "id": "uric_acid",
        "name": "Uric Acid",
        "aliases": ["S. Uric Acid", "Serum Uric Acid", "SUA"],
        "content": (
            "Uric Acid measures purine metabolism waste product filtered by kidneys. "
            "Normal: Males 3.4-7.0 mg/dL. Females 2.4-6.0 mg/dL. Children 2.0-5.5 mg/dL. "
            "Critical low below 1.0. Critical high above 12.0. "
            "High uric acid causes gout (joint pain) and kidney stones. Common in Pakistani males."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 3.4, "max": 7.0, "unit": "mg/dL"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 2.4, "max": 6.0, "unit": "mg/dL"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 2.0, "max": 5.5, "unit": "mg/dL"},
        ],
        "criticalLow": 1.0,
        "criticalHigh": 12.0,
    },
    # ─── LIVER FUNCTION ────────────────────────────────────────
    {
        "id": "alt",
        "name": "ALT",
        "aliases": ["SGPT", "Alanine Aminotransferase", "Alanine Transaminase", "S. ALT", "Serum ALT"],
        "content": (
            "ALT (SGPT) is a liver enzyme. Elevated levels indicate liver cell damage. "
            "Normal: Males 7-56 U/L. Females 7-45 U/L. Children 7-40 U/L. "
            "Critical high above 1000 U/L (acute liver injury). "
            "Commonly elevated in hepatitis, fatty liver disease, and drug-induced liver injury. "
            "Very commonly tested as SGPT in Pakistani lab reports."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 7,  "max": 56, "unit": "U/L"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 7,  "max": 45, "unit": "U/L"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 7,  "max": 40, "unit": "U/L"},
        ],
        "criticalLow": 0,
        "criticalHigh": 1000,
    },
    {
        "id": "ast",
        "name": "AST",
        "aliases": ["SGOT", "Aspartate Aminotransferase", "Aspartate Transaminase", "S. AST", "Serum AST"],
        "content": (
            "AST (SGOT) is a liver and heart enzyme. Elevated levels suggest liver or cardiac damage. "
            "Normal: Males 10-40 U/L. Females 9-32 U/L. Children 10-35 U/L. "
            "Critical high above 1000. Commonly tested as SGOT in Pakistani lab reports."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 10, "max": 40, "unit": "U/L"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 9,  "max": 32, "unit": "U/L"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 10, "max": 35, "unit": "U/L"},
        ],
        "criticalLow": 0,
        "criticalHigh": 1000,
    },
    {
        "id": "bilirubin_total",
        "name": "Bilirubin Total",
        "aliases": ["Total Bilirubin", "T. Bilirubin", "Bili", "Serum Bilirubin", "S. Bilirubin"],
        "content": (
            "Total Bilirubin measures liver and bile duct function. Bilirubin is a yellow pigment from red blood cell breakdown. "
            "Normal: 0.1-1.2 mg/dL for all ages. Critical high above 15.0 mg/dL. "
            "Elevated bilirubin causes jaundice (yellowing of skin/eyes). Common in hepatitis and bile duct obstruction."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 0.1, "max": 1.2, "unit": "mg/dL"},
        ],
        "criticalLow": 0,
        "criticalHigh": 15.0,
    },
    # ─── ELECTROLYTES ──────────────────────────────────────────
    {
        "id": "sodium",
        "name": "Sodium",
        "aliases": ["Na", "Na+", "Serum Sodium", "S. Sodium"],
        "content": (
            "Sodium (Na) is an essential electrolyte for nerve and muscle function and fluid balance. "
            "Normal: 136-145 mEq/L for all ages. Critical low below 120 (seizure risk). "
            "Critical high above 160 (confusion, coma risk). "
            "Low sodium (hyponatremia) from excess water intake or kidney issues. High sodium from dehydration."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 136, "max": 145, "unit": "mEq/L"},
        ],
        "criticalLow": 120,
        "criticalHigh": 160,
    },
    {
        "id": "potassium",
        "name": "Potassium",
        "aliases": ["K", "K+", "Serum Potassium", "S. Potassium"],
        "content": (
            "Potassium (K) is critical for heart rhythm, nerve signals, and muscle contraction. "
            "Normal: 3.5-5.0 mEq/L for all ages. Critical low below 2.5 (cardiac arrest risk). "
            "Critical high above 6.5 (cardiac arrest risk). "
            "Both high and low potassium are life-threatening emergencies affecting the heart."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 3.5, "max": 5.0, "unit": "mEq/L"},
        ],
        "criticalLow": 2.5,
        "criticalHigh": 6.5,
    },
    # ─── LIPID PROFILE ─────────────────────────────────────────
    {
        "id": "cholesterol_total",
        "name": "Total Cholesterol",
        "aliases": ["Cholesterol", "Serum Cholesterol", "TC", "S. Cholesterol", "Cholesterol Total"],
        "content": (
            "Total Cholesterol measures all cholesterol in blood — a key heart disease risk factor. "
            "Desirable: below 200 mg/dL. Borderline high: 200-239. High: 240+. "
            "Critical high above 400. Important for cardiovascular risk assessment in Pakistani population."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 0, "max": 200, "unit": "mg/dL"},
        ],
        "criticalLow": 0,
        "criticalHigh": 400,
    },
    {
        "id": "triglycerides",
        "name": "Triglycerides",
        "aliases": ["TG", "Trig", "Serum Triglycerides", "S. Triglycerides", "Trigs"],
        "content": (
            "Triglycerides are a type of fat in blood. High levels increase heart disease and pancreatitis risk. "
            "Normal: below 150 mg/dL. Borderline: 150-199. High: 200-499. Very high: 500+. "
            "Critical high above 500 (pancreatitis risk). Elevated by fatty diet, obesity, and diabetes."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 0, "max": 150, "unit": "mg/dL"},
        ],
        "criticalLow": 0,
        "criticalHigh": 500,
    },
    {
        "id": "hdl_cholesterol",
        "name": "HDL Cholesterol",
        "aliases": ["HDL", "Good Cholesterol", "HDL-C", "High Density Lipoprotein"],
        "content": (
            "HDL (Good Cholesterol) protects against heart disease by removing bad cholesterol. "
            "Normal: Males 40-60 mg/dL. Females 50-60 mg/dL. Children 40-60 mg/dL. "
            "Higher HDL is better. Low HDL increases heart disease risk. Critical low below 20."
        ),
        "ranges": [
            {"sex": "male",   "minAge": 18, "maxAge": 120, "min": 40, "max": 60, "unit": "mg/dL"},
            {"sex": "female", "minAge": 18, "maxAge": 120, "min": 50, "max": 60, "unit": "mg/dL"},
            {"sex": "any",    "minAge": 0,  "maxAge": 17,  "min": 40, "max": 60, "unit": "mg/dL"},
        ],
        "criticalLow": 20,
        "criticalHigh": 100,
    },
    {
        "id": "ldl_cholesterol",
        "name": "LDL Cholesterol",
        "aliases": ["LDL", "Bad Cholesterol", "LDL-C", "Low Density Lipoprotein"],
        "content": (
            "LDL (Bad Cholesterol) deposits fat in arteries, increasing heart attack and stroke risk. "
            "Optimal: below 100 mg/dL. Near optimal: 100-129. Borderline: 130-159. High: 160+. "
            "Critical high above 300. Lower LDL is better for heart health."
        ),
        "ranges": [
            {"sex": "any", "minAge": 0, "maxAge": 120, "min": 0, "max": 100, "unit": "mg/dL"},
        ],
        "criticalLow": 0,
        "criticalHigh": 300,
    },
    # ─── THYROID FUNCTION ──────────────────────────────────────
    {
        "id": "tsh",
        "name": "TSH",
        "aliases": ["Thyroid Stimulating Hormone", "Thyrotropin", "S. TSH", "Serum TSH"],
        "content": (
            "TSH controls thyroid gland function and regulates metabolism, energy, and weight. "
            "Normal: Adults 0.4-4.0 mIU/L. Children 0.7-6.4 mIU/L. "
            "Critical low below 0.1 (hyperthyroidism). Critical high above 50 (severe hypothyroidism). "
            "High TSH means underactive thyroid. Low TSH means overactive thyroid."
        ),
        "ranges": [
            {"sex": "any", "minAge": 18, "maxAge": 120, "min": 0.4, "max": 4.0, "unit": "mIU/L"},
            {"sex": "any", "minAge": 0,  "maxAge": 17,  "min": 0.7, "max": 6.4, "unit": "mIU/L"},
        ],
        "criticalLow": 0.1,
        "criticalHigh": 50.0,
    },
    {
        "id": "t3",
        "name": "T3",
        "aliases": ["Triiodothyronine", "Free T3", "FT3", "Total T3", "Serum T3"],
        "content": (
            "T3 (Triiodothyronine) is the most active thyroid hormone regulating metabolism and energy. "
            "Normal: Adults 80-200 ng/dL. Children 100-260 ng/dL. "
            "Critical low below 40. Critical high above 400. "
            "High T3 indicates hyperthyroidism. Low T3 indicates hypothyroidism or sick euthyroid syndrome."
        ),
        "ranges": [
            {"sex": "any", "minAge": 18, "maxAge": 120, "min": 80,  "max": 200, "unit": "ng/dL"},
            {"sex": "any", "minAge": 0,  "maxAge": 17,  "min": 100, "max": 260, "unit": "ng/dL"},
        ],
        "criticalLow": 40,
        "criticalHigh": 400,
    },
    {
        "id": "t4",
        "name": "T4",
        "aliases": ["Thyroxine", "Free T4", "FT4", "Total T4", "Serum T4"],
        "content": (
            "T4 (Thyroxine) is the main thyroid hormone, converted to active T3 in the body. "
            "Normal: Adults 5.0-12.0 µg/dL. Children 6.0-15.0 µg/dL. "
            "Critical low below 2.0. Critical high above 25.0. "
            "High T4 indicates hyperthyroidism. Low T4 indicates hypothyroidism."
        ),
        "ranges": [
            {"sex": "any", "minAge": 18, "maxAge": 120, "min": 5.0,  "max": 12.0, "unit": "µg/dL"},
            {"sex": "any", "minAge": 0,  "maxAge": 17,  "min": 6.0,  "max": 15.0, "unit": "µg/dL"},
        ],
        "criticalLow": 2.0,
        "criticalHigh": 25.0,
    },
]
