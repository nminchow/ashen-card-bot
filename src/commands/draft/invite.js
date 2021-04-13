const { Command } = require('discord.js-commando');
const invite = require('../../controllers/draft/invite');

module.exports = class DraftCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      group: 'draft',
      memberName: 'invite',
      description: 'Generate draft invite message.',
      guildOnly: true,
      args: [
        {
          key: 'draftId',
          prompt: 'Draft Id',
          type: 'string',
        },
      ],
    });
  }

  run(message, args) {
    return invite(message, args);
  }
};
