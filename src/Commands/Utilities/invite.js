const { MessageEmbed } = require("discord.js")
const Command = require("../../Structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'invite',
            category: "Utilities",
            cooldown: 10
        });
    }

    async run(message) {
        const msg = message,
            client = this.client

        const e = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(msg.guild.name)
            .setThumbnail(msg.author.avatarURL({ dynamic: true }) ?? msg.guild.iconURL({ dynamic: true }))
            .addField(`${client.user.username}\'s invite`, [
                `[Invite](https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=217083527)`
            ])

        await message.channel.send(e);
    }
};