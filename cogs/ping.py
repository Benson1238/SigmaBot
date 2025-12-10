from __future__ import annotations

import logging

import discord
from discord import app_commands
from discord.ext import commands


class Ping(commands.Cog):
    """Simple connectivity check command."""

    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot
        self.logger = logging.getLogger(self.__class__.__name__)

    @app_commands.command(name="ping", description="Antwortet mit Pong!")
    async def ping(self, interaction: discord.Interaction) -> None:
        try:
            await interaction.response.send_message("Pong!", ephemeral=True)
            self.logger.debug("Responded to /ping from %s", interaction.user)
        except Exception:
            self.logger.exception("Failed to handle /ping command")
            if interaction.response.is_done():
                await interaction.followup.send("Beim Ausführen des Befehls ist ein Fehler aufgetreten.", ephemeral=True)
            else:
                await interaction.response.send_message(
                    "Beim Ausführen des Befehls ist ein Fehler aufgetreten.", ephemeral=True
                )


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Ping(bot))
