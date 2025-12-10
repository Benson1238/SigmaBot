from __future__ import annotations

import logging

import discord
from discord.ext import commands


class Welcome(commands.Cog):
    """Send welcome messages when users join the guild."""

    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot
        self.logger = logging.getLogger(self.__class__.__name__)

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member) -> None:
        channel_id = getattr(self.bot, "config").welcome_channel_id  # type: ignore[attr-defined]
        channel = member.guild.get_channel(channel_id)

        if channel is None:
            self.logger.warning("Welcome channel with ID %s not found in guild %s", channel_id, member.guild)
            return

        try:
            await channel.send(f"Willkommen auf dem Server, {member.mention}!")
            self.logger.info("Sent welcome message for %s", member)
        except discord.Forbidden:
            self.logger.error("Missing permissions to send messages in welcome channel %s", channel_id)
        except Exception:
            self.logger.exception("Failed to send welcome message for %s", member)


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Welcome(bot))
