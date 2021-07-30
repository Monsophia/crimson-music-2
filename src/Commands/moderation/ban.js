const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ban",
      category: "Moderation",
      userPerms: ['BAN_MEMBERS'],
      botPerms: ['BAN_MEMBERS']

    });
  }

  async run(message, args) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (member.id === '856697326155333662') {
      return message.channel.send(`You cannot ban my developer :smiling_imp:`)
    }

    if (member.id === message.author.id) {
      return message.channel.send(`You cannot ban yourself`)
    }

    if (!member) {
      return message.reply("Please mention a valid member of this server to ban");
    }

    if (!member.bannable) {
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    }

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    await member.ban({ reason: reason }).catch((error) =>
      message.reply(`Sorry ${message.author} I couldn't ban ${member.user.tag} because of : ${error}`));

    await member.send(`You have been banned from: ${message.guild.name}, for: ${reason ? reason : !reason}, by: ${message.author.tag} (${message.author.id})`);
    return message.reply(`${member.user.tag} (${member.user.id}) has been banned by ${message.author.tag} because: ${reason}`);
  }
};
