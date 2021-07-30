const { ShardingManager } = require('discord.js'),
    config = require("../config.json"),
    manager = new ShardingManager('./src/index.js', { token: config.token });

manager.on('shardCreate', async shard => console.log(`[Shard] Launched shard ${shard.id}`));
manager.spawn('auto')
