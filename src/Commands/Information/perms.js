const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "perms",
            category: "Information",
        });
    }
    async run(message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.last() || message.member;

        const embed = {
            title: `${member.user.username}\'s permissions`,
            color: "RANDOM",
            thumbnail: `${member.user.displayAvatarURL({ dynamic: true })}`,
            fields: Object.entries(member.permissions.serialize()).reduce((acc, current, i, a, bitfields = {
                ADMINISTRATOR: 0,
                VIEW_AUDIT_LOG: 0,
                VIEW_GUILD_INSIGHTS: 0,
                MANAGE_GUILD: 0,
                MANAGE_ROLES: 0,
                MANAGE_CHANNELS: 0,
                KICK_MEMBERS: 0,
                BAN_MEMBERS: 0,
                CREATE_INSTANT_INVITE: 0,
                CHANGE_NICKNAME: 0,
                MANAGE_NICKNAMES: 0,
                MANAGE_EMOJIS: 0,
                MANAGE_WEBHOOKS: 0,
                VIEW_CHANNEL: 1,
                SEND_MESSAGES: 1,
                SEND_TTS_MESSAGES: 1,
                MANAGE_MESSAGES: 1,
                EMBED_LINKS: 1,
                ATTACH_FILES: 1,
                READ_MESSAGE_HISTORY: 1,
                MENTION_EVERYONE: 1,
                USE_EXTERNAL_EMOJIS: 1,
                ADD_REACTIONS: 1
            }) => (acc[[0, 1].some(e => bitfields[current[0]] === e) ? bitfields[current[0]] : 2].push(`\`${current[0].toLowerCase().replace(/\_/g, " ").replace(/(\b\w)/gi, w => w.toUpperCase())}\` | ${current[1] ? "yes" : "no"}`), acc), [[], [], []]).map((e, c) => [`${c === 0 ? "General" : c === 1 ? "Text" : c === 2 ? "Voice" : "Unknown"} permissions`, e.join("\n")]).map(field => {
                return {
                    name: field[0],
                    value: field[1],
                    inline: true
                };
            })
        };
        await message.channel.send("", { embed });
    }
};
