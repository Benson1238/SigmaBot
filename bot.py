from __future__ import annotations

import logging
from pathlib import Path

import discord
from discord.ext import commands

from utils.config_loader import BotConfig, ConfigError, configure_logging, load_config


COGS_PACKAGE = "cogs"


def discover_cogs(cogs_path: Path) -> list[str]:
    """Find all cog modules within the cogs directory."""
    cogs = []
    for path in cogs_path.glob("*.py"):
        if path.name.startswith("__"):
            continue
        cogs.append(f"{COGS_PACKAGE}.{path.stem}")
    return cogs


def build_bot(config: BotConfig) -> commands.Bot:
    intents = discord.Intents.default()
    intents.members = True

    bot = commands.Bot(command_prefix=commands.when_mentioned_or("!"), intents=intents)

    bot.config = config  # type: ignore[attr-defined]
    return bot


def load_extensions(bot: commands.Bot) -> None:
    cogs_path = Path(__file__).parent / COGS_PACKAGE
    for ext in discover_cogs(cogs_path):
        try:
            bot.load_extension(ext)
            logging.getLogger(__name__).info("Loaded extension %s", ext)
        except Exception:
            logging.getLogger(__name__).exception("Failed to load extension %s", ext)


def main() -> None:
    try:
        config = load_config()
    except ConfigError as err:
        print(f"Configuration error: {err}")
        return

    configure_logging(config.log_level)

    bot = build_bot(config)

    @bot.event
    async def on_ready() -> None:  # type: ignore[override]
        logging.getLogger("bot").info("Bot is connected as %s", bot.user)
        print(f"✅ Bot ready as {bot.user}")

    load_extensions(bot)

    token = config.token
    try:
        bot.run(token, log_handler=None)
    except discord.LoginFailure:
        logging.getLogger("bot").exception("Invalid bot token provided.")
    except Exception:
        logging.getLogger("bot").exception("Unexpected error while running the bot.")


if __name__ == "__main__":
    main()
