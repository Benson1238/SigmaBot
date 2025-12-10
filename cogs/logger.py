from __future__ import annotations

import logging

import discord
from discord.ext import commands


class EventLogger(commands.Cog):
    """Log key bot events for observability."""

    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot
        self.logger = logging.getLogger(self.__class__.__name__)

    @commands.Cog.listener()
    async def on_ready(self) -> None:
        self.logger.info("Bot ready: logged in as %s (ID: %s)", self.bot.user, self.bot.user.id if self.bot.user else "?")

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member) -> None:
        self.logger.info("Member left: %s (%s)", member, member.id)

    @commands.Cog.listener()
    async def on_app_command_error(self, interaction: discord.Interaction, error: discord.AppCommandError) -> None:
        self.logger.error(
            "Application command error for %s", interaction.command, exc_info=(type(error), error, error.__traceback__)
        )
        if interaction.response.is_done():
            await interaction.followup.send("Beim Ausführen des Befehls ist ein Fehler aufgetreten.", ephemeral=True)
        else:
            await interaction.response.send_message(
                "Beim Ausführen des Befehls ist ein Fehler aufgetreten.", ephemeral=True
            )


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(EventLogger(bot))
