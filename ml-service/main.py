from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from recommender import recommend_exercises

app = FastAPI(
    title="AthliX Workout Recommendation API",
    description="Recommends exercises based on athlete preferences.",
    version="1.0.0",
)


class RecommendationRequest(BaseModel):
    equipment: str
    bodyPart: str
    target: str
    difficulty: str
    category: str
    description: str = ""
    top_n: int = Field(default=10, ge=1, le=50)
    excluded_exercises: list[str] = []


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
        recommendations = recommend_exercises(
            equipment=request.equipment,
            bodyPart=request.bodyPart,
            target=request.target,
            difficulty=request.difficulty,
            category=request.category,
            description=request.description,
            top_n=request.top_n,
            excluded_exercises=request.excluded_exercises,
        )

        # Convert the DataFrame to JSON-compatible records.
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
