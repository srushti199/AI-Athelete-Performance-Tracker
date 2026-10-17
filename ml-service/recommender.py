from pathlib import Path

import joblib
import pandas as pd
from scipy.sparse import load_npz
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = BASE_DIR / "artifacts"

artifacts = joblib.load(ARTIFACT_DIR / "athlix_artifacts.pkl")
encoder = artifacts["encoder"]
tfidf = artifacts["tfidf"]
feature_columns = artifacts["feature_columns"]
weights_array = artifacts["weights_array"]
feature_weights = artifacts["feature_weights"]

df = pd.read_pickle(ARTIFACT_DIR / "athlix_exercises.pkl")
weighted_exercises = load_npz(ARTIFACT_DIR / "athlix_weighted_features.npz")
text_features = load_npz(ARTIFACT_DIR / "athlix_text_features.npz")

assert len(df) == weighted_exercises.shape[0]
assert len(df) == text_features.shape[0]
print(f"Loaded {len(df)} exercises successfully!")


def _as_list(value):
    """Convert a scalar or list-like preference into a clean list."""
    if value is None:
        return []
    if isinstance(value, (list, tuple, set)):
        return [str(item).strip() for item in value if str(item).strip()]
    value = str(value).strip()
    return [value] if value else []


def _normalise(value):
    """Case-insensitive comparison while ignoring surrounding whitespace."""
    return str(value).strip().casefold()


def recommend_exercises(
    equipment,
    bodyPart,
    target,
    difficulty,
    category,
    description="",
    top_n=10,
    excluded_exercises=None,
    equipment_options=None,
    body_parts=None,
    targets=None,
    categories=None,
):
    """Recommend exercises while keeping equipment as a strict constraint.

    Difficulty may fall back only toward easier levels:
    Advanced -> Intermediate -> Beginner; Intermediate -> Beginner;
    Beginner stays Beginner. Unselected equipment is never recommended.
    """
    if not isinstance(top_n, int) or top_n < 1:
        raise ValueError("top_n must be a positive integer.")

    equipment_values = _as_list(equipment_options) or _as_list(equipment)
    body_part_values = _as_list(body_parts) or _as_list(bodyPart)
    target_values = _as_list(targets) or _as_list(target)
    category_values = _as_list(categories) or _as_list(category)

    if not equipment_values:
        raise ValueError("At least one equipment option is required.")
    if not str(difficulty).strip():
        raise ValueError("A difficulty level is required.")

    # Use the first selected value for the encoder profile; the full selected
    # sets are used in the filters and relevance ranking below.
    athlete = pd.DataFrame([{
        "equipment": equipment_values[0],
        "bodyPart": body_part_values[0] if body_part_values else "",
        "target": target_values[0] if target_values else "",
        "difficulty": difficulty,
        "category": category_values[0] if category_values else "",
    }], columns=feature_columns)

    athlete_encoded = encoder.transform(athlete)
    weighted_athlete = athlete_encoded.multiply(weights_array)
    structured_similarity = cosine_similarity(weighted_athlete, weighted_exercises)[0]
    athlete_text = tfidf.transform([description or ""])
    text_similarity = cosine_similarity(athlete_text, text_features)[0]

    results = df[["name", "bodyPart", "target", "equipment", "difficulty", "category"]].copy()
    results["structured_similarity"] = structured_similarity
    results["text_similarity"] = text_similarity
    results["final_score"] = 0.70 * structured_similarity + 0.30 * text_similarity

    # Equipment is a HARD constraint and is never relaxed.
    allowed_equipment = {_normalise(item) for item in equipment_values}
    results = results[results["equipment"].map(_normalise).isin(allowed_equipment)].copy()
    if results.empty:
        return results

    if excluded_exercises:
        excluded_names = {_normalise(name) for name in excluded_exercises}
        results = results[~results["name"].map(_normalise).isin(excluded_names)].copy()
    if results.empty:
        return results

    difficulty_order = {
        "advanced": ["advanced", "intermediate", "beginner"],
        "intermediate": ["intermediate", "beginner"],
        "beginner": ["beginner"],
    }
    requested_difficulty = _normalise(difficulty)
    allowed_difficulties = difficulty_order.get(requested_difficulty, [requested_difficulty])
    results["_difficulty_normalised"] = results["difficulty"].map(_normalise)
    results = results[results["_difficulty_normalised"].isin(allowed_difficulties)].copy()
    if results.empty:
        return results.drop(columns=["_difficulty_normalised"])

    difficulty_rank = {level: index for index, level in enumerate(allowed_difficulties)}
    results["_difficulty_rank"] = results["_difficulty_normalised"].map(difficulty_rank)
    results["fallback_used"] = results["_difficulty_rank"] > 0

    body_part_set = {_normalise(item) for item in body_part_values}
    target_set = {_normalise(item) for item in target_values}
    category_set = {_normalise(item) for item in category_values}
    results["_body_part_match"] = results["bodyPart"].map(_normalise).isin(body_part_set)
    results["_target_match"] = results["target"].map(_normalise).isin(target_set)
    results["_category_match"] = results["category"].map(_normalise).isin(category_set)

    results = results.sort_values(
        by=["_difficulty_rank", "_body_part_match", "_target_match", "_category_match", "final_score"],
        ascending=[True, False, False, False, False],
    )
    return results.head(top_n).drop(columns=[
        "_difficulty_normalised", "_difficulty_rank", "_body_part_match",
        "_target_match", "_category_match",
    ])
