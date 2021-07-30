const Command = require("../../Structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "skip",
			aliases: ["sk"],
			category: "Music",
			cooldown: 10

		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const client = this.client;

		if (!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`You are not in the same voice channel !`);

		if (!client.player.getQueue(message)) return message.channel.send(`No music currently playing !`);

		const success = client.player.skip(message);

		if (success) message.channel.send(`The current music has just been **skipped** !`);
	}
};
