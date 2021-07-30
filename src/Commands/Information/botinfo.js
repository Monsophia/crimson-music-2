const { MessageEmbed, version: djsversion } = require("discord.js"),
  { version, license } = require("../../../package"),
  Command = require("../../Structures/Command"),
  { utc } = require("moment"),
  os = require("os"),
  ms = require("ms");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["info", "bot", "bi"],
      description: "Displays information about the bot.",
      category: "Information",
      cooldown: 10

    });
  }

  async run(message) {

    const core = os.cpus()[0];
    const embed = new MessageEmbed()
      .setThumbnail(this.client.user.displayAvatarURL() ?? message.author.avatarURL())
      .setColor(message.guild.me.displayHexColor || "RANDOM")
      .addField("General", [
        `Client: ${this.client.user.tag}`,
        `ID: ${this.client.user.id}`,
        `API Latency: ${Math.round(this.client.ws.ping).toString()}ms`,
        `Commands: ${this.client.commands.size}`,
        `Servers: ${this.client.guilds.cache.size.toLocaleString()} `,
        `Users: ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
        `Channels: ${this.client.channels.cache.size.toLocaleString()}`,
        `Creation Date: ${utc(this.client.user.createdTimestamp).format("Do MMMM YYYY HH:mm:ss")}`,
        "\u200b",
      ])

      .addField("System", [
        `Platform: ${process.platform}`,
        `OS Version: ${os.version()}`,
        `Uptime: ${ms(os.uptime() * 1000, { long: true })}`,
        `CPU:`,
        `\u3000 Cores: ${os.cpus().length}`,
        `\u3000 Model: ${core.model}`,
        `\u3000 Speed: ${core.speed}MHz`,
        `Memory:`,
        `\u3000 Total: ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
        `\u3000 Used: ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)}`,
      ])

      .addField(`Misc`, [
        `Node.js: ${process.version}`,
        `Version: v${version}`,
        `Discord.js: v${djsversion}`,
        `License: ${license}`,
      ])
      .setTimestamp();

    message.channel.send(embed);
  }
};
