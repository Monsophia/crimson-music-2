const Command = require("../../Structures/Command"),
    { exec } = require("child_process")


module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'exec',
            aliases: ['bash'],
            category: "Owner",
            ownerOnly: true,
        });
    }

    async run(message, args) {
        exec(args.join(" "), (error, stdout) => {
            const response = stdout || error;
            message.channel.send(response, { split: true, code: 'js' })
        })
    }
};