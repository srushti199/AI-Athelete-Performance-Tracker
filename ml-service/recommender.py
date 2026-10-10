
from pathlib import Path

import joblib
import pandas as pd
from scipy.sparse import load_npz
from sklearn.metrics.pairwise import cosine_similarity

# Find the artifacts folder relative to this file.
BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = BASE_DIR / "artifacts"

# Load the saved ML preprocessing objects and configuration.
artifacts = joblib.load(
    ARTIFACT_DIR / "athlix_artifacts.pkl"
)

encoder = artifacts["encoder"]
tfidf = artifacts["tfidf"]
feature_columns = artifacts["feature_columns"]
weights_array = artifacts["weights_array"]
feature_weights = artifacts["feature_weights"]

# Load the exercise dataset.
df = pd.read_pickle(
    ARTIFACT_DIR / "athlix_exercises.pkl"
)

# Load the saved feature matrices.
weighted_exercises = load_npz(
    ARTIFACT_DIR / "athlix_weighted_features.npz"
)

text_features = load_npz(
    ARTIFACT_DIR / "athlix_text_features.npz"
)

# Check that all loaded data has matching row counts.
assert len(df) == weighted_exercises.shape[0]
assert len(df) == text_features.shape[0]

print(f"Loaded {len(df)} exercises successfully!")


def recommend_exercises(
    equipment,
    bodyPart,
    target,
    difficulty,
    category,
    description="",
    top_n=10,
    excluded_exercises=None,
):
    """
    Recommend exercises based on athlete preferences.

    Combines structured feature similarity and
    TF-IDF description similarity.
    """

    if not isinstance(top_n, int) or top_n < 1:
        raise ValueError("top_n must be a positive integer.")

    # Create the athlete's workout preference profile.
    athlete = pd.DataFrame(
        [{
            "equipment": equipment,
            "bodyPart": bodyPart,
            "target": target,
            "difficulty": difficulty,
            "category": category,
        }],
        columns=feature_columns,
    )

    # Encode preferences using the saved encoder.
    athlete_encoded = encoder.transform(athlete)

    # Apply the same feature weights used during training.
    weighted_athlete = athlete_encoded.multiply(weights_array)

    # Calculate similarity for structured features.
    structured_similarity = cosine_similarity(
        weighted_athlete,
        weighted_exercises,
    )[0]

    # Compare the athlete's description with exercise descriptions.
    athlete_text = tfidf.transform([description or ""])

    text_similarity = cosine_similarity(
        athlete_text,
        text_features,
    )[0]

    # Combine both similarity scores.
    final_score = (
        0.70 * structured_similarity
        + 0.30 * text_similarity
    )

    # Build the recommendation results.
    results = df[
        [
            "name",
            "bodyPart",
            "target",
            "equipment",
            "difficulty",
            "category",
        ]
    ].copy()

    results["structured_similarity"] = structured_similarity
    results["text_similarity"] = text_similarity
    results["final_score"] = final_score

    # Enforce equipment and difficulty constraints.
    results = results[
        (results["equipment"] == equipment)
        & (results["difficulty"] == difficulty)
    ].copy()

    # Exclude exercises already selected.
    if excluded_exercises:
        excluded_names = {
            name.casefold() for name in excluded_exercises
        }

        results = results[
            ~results["name"].str.casefold().isin(excluded_names)
        ]

    # Return the highest-scoring exercises first.
    results = results.sort_values(
        by="final_score",
        ascending=False,
    )

    return results.head(top_n)
