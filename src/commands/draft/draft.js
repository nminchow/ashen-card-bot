const { Command } = require('discord.js-commando');
const create = require('../../controllers/draft/create');

module.exports = class DraftCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'draft',
      group: 'draft',
      memberName: 'draft',
      description: 'Start a draft.',
      guildOnly: true,
      args: [
        {
          key: 'name',
          prompt: 'Draft Name',
          type: 'string',
          default: 'Ashes Draft',
        },
      ],
    });
  }

  run(message, args) {
    return create(message, args);
  }
};
