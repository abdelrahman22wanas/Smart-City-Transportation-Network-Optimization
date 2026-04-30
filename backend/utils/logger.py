"""Logging configuration for the smart city transportation backend.

This module provides structured logging with support for console output
and JSON logging format for production deployments.
"""

from __future__ import annotations

import logging
import sys
from typing import Optional

from backend.config.settings import get_settings


class ColoredFormatter(logging.Formatter):
    """Colored formatter for console output in development."""

    COLORS = {
        "DEBUG": "\033[36m",      # Cyan
        "INFO": "\033[32m",       # Green
        "WARNING": "\033[33m",    # Yellow
        "ERROR": "\033[31m",      # Red
        "CRITICAL": "\033[35m",  # Magenta
        "RESET": "\033[0m",
    }

    def format(self, record: logging.LogRecord) -> str:
        """Format log record with color coding."""
        if record.levelname in self.COLORS:
            record.levelname = (
                f"{self.COLORS[record.levelname]}{record.levelname}{self.COLORS['RESET']}"
            )
        return super().format(record)


def get_logger(name: str, level: Optional[str] = None) -> logging.Logger:
    """Get or create a logger instance with configured settings.

    Args:
        name: Logger name (typically __name__ of the caller)
        level: Optional log level override

    Returns:
        logging.Logger: Configured logger instance
    """
    settings = get_settings()
    log_level = level or settings.log_level

    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    logger.setLevel(getattr(logging, log_level.upper()))
    logger.handlers.clear()

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, log_level.upper()))

    if settings.is_production:
        formatter = logging.Formatter(
            '{"time": "%(asctime)s", "name": "%(name)s", '
            '"level": "%(levelname)s", "message": "%(message)s"}',
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    else:
        formatter = ColoredFormatter(
            "%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
            datefmt="%H:%M:%S",
        )

    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger
