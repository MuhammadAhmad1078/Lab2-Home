/**
 * RAG Lookup Utility
 *
 * Matches extracted test names against the medical reference database
 * and classifies patient values as Good / Needs Attention / Critical.
 */

import medicalReferenceDB, { MedicalTest, ReferenceRange } from '../data/medicalReferenceDB';

/** Normalized match result returned by findReferenceRange */
export interface MatchedRange {
  testName: string;
  min: number;
  max: number;
  unit: string;
  criticalLow: number;
  criticalHigh: number;
  description: string;
}

/** Classification result */
export type ClassificationStatus = 'Good' | 'Needs Attention' | 'Critical' | 'Unknown';

/**
 * Normalize a string for fuzzy matching: lowercase, strip non-alphanumeric.
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Find the best-matching reference range for a given test name,
 * filtered by patient age and sex.
 *
 * Matching strategy:
 *  1. Exact normalized match on name
 *  2. Exact normalized match on any alias
 *  3. Partial match (input contains alias or alias contains input)
 *
 * Range selection: prefer sex-specific over 'any', then most specific age band.
 */
export function findReferenceRange(
  testName: string,
  patientAge: number,
  patientSex: string
): MatchedRange | null {
  const normalizedInput = normalize(testName);
  if (!normalizedInput) return null;

  // Determine canonical sex
  const sex = patientSex?.toLowerCase() === 'male' ? 'male'
            : patientSex?.toLowerCase() === 'female' ? 'female'
            : 'any';

  let matchedTest: MedicalTest | null = null;

  // Phase 1: Exact name match
  for (const test of medicalReferenceDB) {
    if (normalize(test.name) === normalizedInput) {
      matchedTest = test;
      break;
    }
  }

  // Phase 2: Exact alias match
  if (!matchedTest) {
    for (const test of medicalReferenceDB) {
      for (const alias of test.aliases) {
        if (normalize(alias) === normalizedInput) {
          matchedTest = test;
          break;
        }
      }
      if (matchedTest) break;
    }
  }

  // Phase 3: Partial match (input contains alias or alias contains input)
  if (!matchedTest) {
    for (const test of medicalReferenceDB) {
      const normalizedName = normalize(test.name);
      if (normalizedInput.includes(normalizedName) || normalizedName.includes(normalizedInput)) {
        matchedTest = test;
        break;
      }
      for (const alias of test.aliases) {
        const normalizedAlias = normalize(alias);
        if (normalizedInput.includes(normalizedAlias) || normalizedAlias.includes(normalizedInput)) {
          matchedTest = test;
          break;
        }
      }
      if (matchedTest) break;
    }
  }

  if (!matchedTest) return null;

  // Find the best-matching range for this patient
  const range = selectBestRange(matchedTest.ranges, patientAge, sex);
  if (!range) return null;

  return {
    testName: matchedTest.name,
    min: range.min,
    max: range.max,
    unit: range.unit,
    criticalLow: matchedTest.criticalLow,
    criticalHigh: matchedTest.criticalHigh,
    description: matchedTest.description,
  };
}

/**
 * Select the most specific range matching patient age and sex.
 * Priority: sex-specific > 'any', tightest age band first.
 */
function selectBestRange(
  ranges: ReferenceRange[],
  age: number,
  sex: string
): ReferenceRange | null {
  // Filter ranges that cover the patient's age
  const ageMatches = ranges.filter(r => age >= r.minAge && age <= r.maxAge);
  if (ageMatches.length === 0) return null;

  // Prefer sex-specific match
  const sexSpecific = ageMatches.filter(r => r.sex === sex);
  if (sexSpecific.length > 0) {
    // Return the tightest age band (smallest span)
    return sexSpecific.sort((a, b) => (a.maxAge - a.minAge) - (b.maxAge - b.minAge))[0];
  }

  // Fallback to 'any' sex
  const anyMatch = ageMatches.filter(r => r.sex === 'any');
  if (anyMatch.length > 0) {
    return anyMatch.sort((a, b) => (a.maxAge - a.minAge) - (b.maxAge - b.minAge))[0];
  }

  // Last resort — return first age match
  return ageMatches[0];
}

/**
 * Classify a numeric value against a reference range.
 */
export function classifyValue(
  value: number,
  range: MatchedRange | null
): ClassificationStatus {
  if (!range) return 'Unknown';

  // Check critical thresholds first
  if (value <= range.criticalLow || value >= range.criticalHigh) {
    return 'Critical';
  }

  // Check normal range
  if (value >= range.min && value <= range.max) {
    return 'Good';
  }

  // Outside normal but not critical
  return 'Needs Attention';
}
