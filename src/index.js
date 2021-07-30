const CrimsonClient = require("./Structures/CrimsonClient"),
  config = require("../config.json"),
  client = new CrimsonClient(config),
  { Player } = require("discord-player")

client.player = new Player(client);

client.debug = 1;


client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting . . ."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting . . ."))
  .on("rateLimit", async (info) => client.logger.warn(info))
  .on("error", async (e) => client.logger.error(e))
  .on("shardError", async (e, id) => {
    client.logger.error(`Error on shard ${id}:`),
      client.logger.error(e)
  }).on("debug", (info) => {
    const loading = info.match(/\[WS => Shard (\d+)] \[CONNECT]/),
      sessions = info.match(/Remaining: (\d+)$/);
    if (loading) return client.logger.log(`Loading . . .`, { shard: loading[1] });
    if (sessions) return client.logger.debug(`Session ${1000 - parseInt(sessions[1], 10)} of 1000`, { shard: "Manager" });
    if (info.match(/\[WS => Shard \d+] (?:\[HeartbeatTimer] Sending a heartbeat\.|Heartbeat acknowledged, latency of \d+ms\.)/)) return;
    if (info.startsWith("429 hit on route")) return;
    if (client.debug >= 6) client.logger.debug(info);
  })
  .on("warn", (info) => client.logger.warn((info), { shard: "Manager" }))
  .on("shardReady", (id) => client.logger.ready("Connected!", { shard: id }))
  .on("shardResume", (id) => client.logger.ready("Connected!", { shard: id }));


process.on("unhandledRejection", err => client.logger.error(err.stack));


client.start();
