from __future__ import annotations

import logging
import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass
class BotConfig:
    token: str
    welcome_channel_id: int
    log_level: str = "INFO"


class ConfigError(RuntimeError):
    """Raised when configuration is invalid or missing."""


def load_config(env_path: str = ".env") -> BotConfig:
    """Load configuration from environment variables.

    Args:
        env_path: Optional path to a .env file used for local development.

    Returns:
        Populated :class:`BotConfig` instance.

    Raises:
        ConfigError: If the token or welcome channel are missing or invalid.
    """

    load_dotenv(env_path)

    token = os.getenv("BOT_TOKEN")
    channel_id = os.getenv("WELCOME_CHANNEL_ID")
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()

    if not token:
        raise ConfigError("BOT_TOKEN is required. Please set it in your environment or .env file.")

    if not channel_id:
        raise ConfigError(
            "WELCOME_CHANNEL_ID is required. Provide the numeric channel ID in your environment or .env file."
        )

    try:
        channel_id_int = int(channel_id)
    except ValueError as exc:
        raise ConfigError("WELCOME_CHANNEL_ID must be a valid integer.") from exc

    return BotConfig(token=token, welcome_channel_id=channel_id_int, log_level=log_level)


def configure_logging(log_level: str, log_file: str = "logs/bot.log") -> None:
    """Configure application-wide logging.

    Args:
        log_level: Logging level name (e.g. INFO, DEBUG).
        log_file: Path to the log file.
    """

    level = getattr(logging, log_level.upper(), logging.INFO)

    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler(log_file, encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )


__all__ = ["BotConfig", "ConfigError", "load_config", "configure_logging"]
