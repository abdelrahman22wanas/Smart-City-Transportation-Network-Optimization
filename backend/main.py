"""FastAPI application entrypoint for the smart city transportation backend."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config.settings import get_settings
from backend.routers.compare import router as compare_router
from backend.routers.dp import router as dp_router
from backend.routers.greedy import router as greedy_router
from backend.routers.ml import router as ml_router
from backend.routers.mst import router as mst_router
from backend.routers.routing import router as routing_router
from backend.utils.logger import get_logger

# Initialize settings and logger
settings = get_settings()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown events."""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Debug mode: {settings.debug}, Log level: {settings.log_level}")
    yield
    logger.info("Shutting down application")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="CSE112 algorithms backend for Cairo transportation optimization.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error. Please try again later.",
            "path": request.url.path,
        },
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
    return {"status": "ok", "app": settings.app_name, "version": settings.app_version}
