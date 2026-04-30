"""Application settings and configuration management.

This module provides environment-based configuration for the smart city
transportation backend using environment variables with sensible defaults.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables.

    All settings can be overridden via environment variables or .env file.
    Defaults are optimized for local development.

    Environment Variables:
        APP_NAME: Application name (default: "Smart City Transportation API")
        APP_VERSION: API version string (default: "1.0.0")
        DEBUG: Enable debug mode (default: False)
        LOG_LEVEL: Logging level - DEBUG, INFO, WARNING, ERROR, CRITICAL (default: "INFO")
        CORS_ORIGINS: Comma-separated list of allowed CORS origins (default: "*")
        API_PREFIX: API route prefix (default: "/api")
        CACHE_SIZE: LRU cache size for route calculations (default: 512)
        MAX_ROUTE_DISTANCE_KM: Maximum allowed route distance (default: 500)
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application settings
    app_name: str = Field(default="Smart City Transportation API", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    debug: bool = Field(default=False, alias="DEBUG")

    # Server settings
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")

    # Logging settings
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    # CORS settings
    cors_origins: str = Field(default="*", alias="CORS_ORIGINS")

    # API settings
    api_prefix: str = Field(default="/api", alias="API_PREFIX")

    # Algorithm settings
    cache_size: int = Field(default=512, alias="CACHE_SIZE")
    max_route_distance_km: float = Field(default=500.0, alias="MAX_ROUTE_DISTANCE_KM")

    # ML settings
    ml_model_path: str = Field(default="models/traffic_model.pkl", alias="ML_MODEL_PATH")
    ml_training_epochs: int = Field(default=100, alias="ML_TRAINING_EPOCHS")

    @property
    def cors_origins_list(self) -> list[str]:
        """Return CORS origins as a list."""
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return not self.debug


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance (singleton pattern).

    Returns:
        Settings: Cached settings instance
    """
    return Settings()
