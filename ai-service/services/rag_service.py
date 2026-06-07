"""
RAG Lookup Service

Matches extracted test names against the medical reference database
and classifies patient values as Good / Needs Attention / Critical.
"""

import re
from data.medical_reference_db import MEDICAL_REFERENCE_DB


def normalize_str(s: str) -> str:
    """Lowercase + remove non-alphanumeric characters."""
    return re.sub(r"[^a-z0-9]", "", s.lower())


def find_reference_range(test_name: str, age: int, sex: str) -> dict | None:
    """
    Find the best-matching reference range for a given test name,
    filtered by patient age and sex.

    Matching strategy:
      1. Exact normalized match on name
      2. Exact normalized match on any alias
      3. Partial match (input contains alias or alias contains input)

    Returns: { normalMin, normalMax, unit, criticalLow, criticalHigh, testName }
    """
    normalized_input = normalize_str(test_name)
    if not normalized_input:
        return None

    # Canonical sex
    sex_lower = (sex or "").lower()
    canonical_sex = "male" if sex_lower == "male" else ("female" if sex_lower == "female" else "any")

    matched_test = None

    # Phase 1: Exact name match
    for test in MEDICAL_REFERENCE_DB:
        if normalize_str(test["name"]) == normalized_input:
            matched_test = test
            break

    # Phase 2: Exact alias match
    if not matched_test:
        for test in MEDICAL_REFERENCE_DB:
            for alias in test["aliases"]:
                if normalize_str(alias) == normalized_input:
                    matched_test = test
                    break
            if matched_test:
                break

    # Phase 3: Partial match
    if not matched_test:
        for test in MEDICAL_REFERENCE_DB:
            norm_name = normalize_str(test["name"])
            if normalized_input in norm_name or norm_name in normalized_input:
                matched_test = test
                break
            for alias in test["aliases"]:
                norm_alias = normalize_str(alias)
                if normalized_input in norm_alias or norm_alias in normalized_input:
                    matched_test = test
                    break
            if matched_test:
                break

    if not matched_test:
        return None

    # Find the best range for this patient
    best_range = _select_best_range(matched_test["ranges"], age, canonical_sex)
    if not best_range:
        return None

    return {
        "testName": matched_test["name"],
        "normalMin": best_range["min"],
        "normalMax": best_range["max"],
        "unit": best_range["unit"],
        "criticalLow": matched_test["criticalLow"],
        "criticalHigh": matched_test["criticalHigh"],
    }


def _select_best_range(ranges: list, age: int, sex: str) -> dict | None:
    """Select the most specific range matching patient age and sex."""
    # Filter ranges that cover the patient's age
    age_matches = [r for r in ranges if r["minAge"] <= age <= r["maxAge"]]
    if not age_matches:
        return None

    # Prefer sex-specific match
    sex_specific = [r for r in age_matches if r["sex"] == sex]
    if sex_specific:
        return min(sex_specific, key=lambda r: r["maxAge"] - r["minAge"])

    # Fallback to 'any' sex
    any_match = [r for r in age_matches if r["sex"] == "any"]
    if any_match:
        return min(any_match, key=lambda r: r["maxAge"] - r["minAge"])

    # Last resort
    return age_matches[0]


def classify_value(value: float, range_obj: dict | None) -> str:
    """
    Classify a numeric value against a reference range.
    Returns: 'Good' | 'Needs Attention' | 'Critical' | 'Unknown'

    IMPORTANT: This function — not the AI — always controls classification.
    """
    if range_obj is None:
        return "Unknown"

    critical_low = range_obj.get("criticalLow")
    critical_high = range_obj.get("criticalHigh")

    # Check critical thresholds first
    if critical_low is not None and value < critical_low:
        return "Critical"
    if critical_high is not None and value > critical_high:
        return "Critical"

    # Check normal range
    normal_min = range_obj.get("normalMin")
    normal_max = range_obj.get("normalMax")

    if normal_min is not None and normal_max is not None:
        if normal_min <= value <= normal_max:
            return "Good"

    # Outside normal but not critical
    return "Needs Attention"
