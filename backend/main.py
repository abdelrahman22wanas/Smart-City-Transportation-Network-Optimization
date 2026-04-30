"""FastAPI application entrypoint for the smart city transportation backend."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.compare import router as compare_router
from backend.routers.dp import router as dp_router
from backend.routers.greedy import router as greedy_router
from backend.routers.ml import router as ml_router
from backend.routers.mst import router as mst_router
from backend.routers.routing import router as routing_router

app = FastAPI(
    title="Smart City Transportation Network Optimization API",
    version="1.0.0",
    description="CSE112 algorithms backend for Cairo transportation optimization.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mst_router)
app.include_router(routing_router)
app.include_router(dp_router)
app.include_router(greedy_router)
app.include_router(ml_router)
app.include_router(compare_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Simple health endpoint for deployment checks."""

    return {"status": "ok"}
