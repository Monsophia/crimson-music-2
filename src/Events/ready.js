const Event = require("../Structures/Event"),
  { MessageEmbed } = require("discord.js")
require("discord-player"),
  chalk = require("chalk"),
  fetch = require("node-fetch"),
  api = require("../../apiTokens.json")


module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      once: true,
    });
  }

  async run(message, args) {
    const client = this.client

    setInterval(() => {
      fetch(`https://api.voidbots.net/bot/stats/866335240209563648`, {
        method: "POST",
        headers: {
          Authorization: api.void,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "server_count": this.client.guilds.cache.size, "shard_count": client.shard.count })
      }).then(response => response.text())
        .then(console.log).catch(console.error);
    }, 240000)

    //shard error handling 
    client.on('shardError', error => {
      console.error('A websocket connection encountered an error:', error);
    });


    this.client.on("guildCreate", async guild => {
      this.client.logger.log(`\n---------\nI have been added to '${guild.name}' (${guild.id}) with ${guild.memberCount} members!`);
    });

    this.client.on("guildDelete", async guild => {
      this.client.logger.log(`\n---------\nI have been removed from '${guild.name}' (${guild.id}) with ${guild.memberCount} members!`);
    });

    this.client.player.on("trackStart", (message, track) =>
      message.channel.send(`Now playing ${track.title}...`))

    this.client.player.on("trackAdd", (message, queue, track) =>
      message.channel.send(`${track.title} has been added to the queue!`));

    this.client.player.on("playlistAdd", (message, queue, playlist) =>
      message.channel.send(`${playlist.title} has been added to the queue (${playlist.tracks.length} songs)!`));

    // Send messages to format search results
    this.client.player.on("searchResults", async (message, query, tracks) => {
      const embed = new MessageEmbed()
        .setAuthor(`Here are your search results for ${query}!`)
        .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
        .setFooter("Send the number of the song you want to play!");
      await message.channel.send(embed);
    });

    this.client.player.on("searchInvalidResponse", (message, tracks, content, collector) => {
      if (content === "cancel") {
        collector.stop();
        return message.channel.send("Search cancelled!");
      }

      message.channel.send(`You must send a valid number between 1 and ${tracks.length}!`);
    });

    this.client.player.on("searchCancel", (message, query, tracks) =>
      message.channel.send("You did not provide a valid response... Please send the command again!"));

    this.client.player.on("noResults", (message, query) =>
      message.channel.send(`No results found on YouTube for ${query}!`)
    );

    // Send a message when the music is stopped
    this.client.player.on("queueEnd", (message, queue) =>
      message.channel.send("Music stopped as there is no more music in the queue!"));

    this.client.player.on("channelEmpty", (message, queue) =>
      message.channel.send("Music stopped as there is no more member in the voice channel!"));

    this.client.player.on("botDisconnect", (message) =>
      message.channel.send("Music stopped as I have been disconnected from the channel!"));

    // Error handling
    this.client.player.on("error", (error, message) => {
      switch (error) {
        case "NotPlaying":
          message.channel.send("There is no music being played on this server!");
          break;
        case "NotConnected":
          message.channel.send("You are not connected in any voice channel!");
          break;
        case "UnableToJoin":
          message.channel.send("I am not able to join your voice channel, please check my permissions!");
          break;
        case "LiveVideo":
          message.channel.send("YouTube lives are not supported!");
          break;
        case "VideoUnavailable":
          message.channel.send("This YouTube video is not available!");
          break;
        default:
          message.channel.send(`Something went wrong... Error: ${error}`);
      }
    });


    const activities = [
      `${this.client.guilds.cache.size.toLocaleString()} servers!`,
      `${this.client.channels.cache.size.toLocaleString()} channels!`,
      `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users!`, //is showing on the status as [Object Promise]
    ];

    let i = 0;
    setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }), 15000);

    this.client.logger.log([
      `Logged in as ${this.client.user.tag}`,
      `Loaded ${this.client.commands.size} commands!`,
      `Loaded ${this.client.events.size} events!`,
      `Serving ${this.client.users.cache.size.toLocaleString()} members!`,
      `Serving ${this.client.guilds.cache.size.toLocaleString()} guilds!`,
      `Client ID: ${this.client.user.id}`,
      `invite: https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8`,
    ].join("\n"));

    this.client.logger.log(`\nServers[${this.client.guilds.cache.size.toLocaleString()}]: \n---------\n${this.client.guilds.cache.map((guild) => `${guild.id + "\t" + guild.name + "   |   " + guild.memberCount.toLocaleString()} mem\'s`).join("\n")}`);
  }
}