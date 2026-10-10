
from recommender import recommend_exercises

recommendations = recommend_exercises(
    equipment="body weight",
    bodyPart="upper legs",
    target="quads",
    difficulty="Beginner",
    category="strength",
    description=(
        "beginner body weight exercise for strengthening "
        "the quadriceps and upper legs"
    ),
    top_n=10,
)

print("\nRecommended exercises:")
print(recommendations.to_string(index=False))
