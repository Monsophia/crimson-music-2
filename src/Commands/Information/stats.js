const { MessageEmbed } = require("discord.js"),
    Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'stats',
            category: "Information",
            cooldown: 10

        });
    }

    async run(message, args) {
        const client = this.client,
            members = message.guild.members.cache,
            msg = message

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
        ];

        return Promise.all(promises).then(results => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            const e = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(msg.guild.name)
                .setThumbnail(msg.guild.iconURL({ dynamic: true }) ?? msg.author.avatarURL({ dynamic: true }))
                .addField(`Server count:`, [
                    `${totalGuilds.toLocaleString()}`
                ])
                .addField(`Member count:`, [
                    `${totalMembers.toLocaleString()}`
                ])
                .addField(`Cached Members:`, [
                    `${this.client.guilds.cache.size.toLocaleString()}`
                ])
                .addField(`Members in ${msg.guild.name}`, [
                    `${members.filter((member) => !member.user.bot).size.toLocaleString()}`
                ])
            return message.channel.send(e);
        })
    }
};
