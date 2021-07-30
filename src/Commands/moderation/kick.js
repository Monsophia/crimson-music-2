const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "kick",
      category: "Moderation",
      userPerms: ['KICK_MEMBERS'],
      botPerms: ['KICK_MEMBERS']

    });
  }

  async run(message, args) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (member.id === '856697326155333662') {
      return message.channel.send(`You cannot kick my developer :smiling_imp:`)
    }

    if (member.id === message.author.id) {
      return message.channel.send(`You cannot kick yourself`)
    }

    if (!member) {
      return message.reply("Please mention a valid member of this server to kick");
    }

    if (!member.kickable) {
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    }

    const reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    await member.kick(reason).catch(async (error) =>
      message.reply(`Sorry ${message.author} I couldn't kick ${member.user.tag} because of : ${error}`));

    await member.send(`You have been kick from: ${message.guild.name}, for: ${reason ? reason : !reason}, by: ${message.author.tag} (${message.author.id})`)

    return message.reply(`${member.user.tag} (${member.user.id}) has been kicked by ${message.author.tag} because: ${reason ? reason : !reason}`);
  }
};
