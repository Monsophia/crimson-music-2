const Command = require("../../Structures/Command"),
	CrimsonEmbed = require("../../Structures/CrimsonEmbed");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "debug",
			category: "Music",
			cooldown: 10

		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const guild = this.client.guilds.cache.get(args[0]) || message.guild;

		const e = new CrimsonEmbed()
			.setTitle(`Debug info for ${guild.name}`)
			.setColor("RANDOM")
			.setThumbnail(guild.iconURL({ dynamic: true }) ?? message.author.avatarURL())
			.addField(`Guild:`, [
				`Name: ${guild.name}`,
				`ID: ${guild.id}`,
				`Shard: ${message.guild.shardID + 1}/${this.client.shard.count}`,
				`API Latency: ${Math.round(this.client.ws.ping).toLocaleString()}ms`
			]);
		message.channel.send(e);
	}
};
