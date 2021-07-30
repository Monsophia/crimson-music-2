const Command = require("../../Structures/Command"),
  { MessageEmbed } = require("discord.js"),
  moment = require("moment");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["user", "ui"],
      description: "Displays information about a provided user or the message author.",
      category: "Information",
      usage: "[user]",
    });
  }

  async run(message, [target], args) {

    const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member

    const embed = new MessageEmbed()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(member.user.displayHexColor || "RANDOM")
      .addField("User", [
        `Username: ${member.user.username}`,
        `Discriminator: ${member.user.discriminator}`,
        `ID: ${member.id}`,
        `Avatar: [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
        `Time Created: ${moment(member.user.createdTimestamp).format("LT")} ${moment(member.user.createdTimestamp).format("LL")} ${moment(member.user.createdTimestamp).fromNow()}`,
        `\u200b`,
      ])

      .addField("Member", [
        `Highest Role: ${member.roles.highest.id === message.guild.id ? "None" : member.roles.highest.name}`,
        `Server Join Date: ${moment(member.joinedAt).format("LL LTS")}`,
        `Hoist Role: ${member.roles.hoist ? member.roles.hoist.name : "None"}`,
        `\u200b`,
      ])

      .addField(`Badges`, [
        `Owner/Admin: ${this.client.utils.checkOwner(member.id) ? 'Yes' : 'No'}`,
      ])
      .setTimestamp();

    return message.channel.send(embed);
  }
};