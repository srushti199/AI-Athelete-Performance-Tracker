
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from recommender import recommend_exercises

app = FastAPI(
    title="AthliX Workout Recommendation API",
    description="Recommends exercises based on athlete preferences.",
    version="1.1.0",
)


class RecommendationRequest(BaseModel):
    # Existing single-value fields: retained for backward compatibility.
    equipment: str
    bodyPart: str
    target: str
    difficulty: str
    category: str

    # New multi-preference fields.
    equipment_options: list[str] = Field(default_factory=list)
    body_parts: list[str] = Field(default_factory=list)
    targets: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)

    description: str = ""
    top_n: int = Field(default=10, ge=1, le=50)
    excluded_exercises: list[str] = Field(default_factory=list)


@app.get("/")
def home():
    return {
        "message": "AthliX ML Service is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/recommend")
def get_recommendations(request: RecommendationRequest):
    try:
        # Prefer multiple values when provided; otherwise use the
        # existing single-value request fields.
        equipment_options = (
            request.equipment_options or [request.equipment]
        )
        body_parts = request.body_parts or [request.bodyPart]
        targets = request.targets or [request.target]
        categories = request.categories or [request.category]

        recommendations = recommend_exercises(
            equipment=request.equipment,
            bodyPart=request.bodyPart,
            target=request.target,
            difficulty=request.difficulty,
            category=request.category,
            description=request.description,
            top_n=request.top_n,
            excluded_exercises=request.excluded_exercises,

            # Forward the new fields for the recommender update.
            equipment_options=equipment_options,
            body_parts=body_parts,
            targets=targets,
            categories=categories,
        )

        records = recommendations.to_dict(orient="records")

        return {
            "count": len(records),
            "recommendations": records,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error
