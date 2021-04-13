const { Command } = require('discord.js-commando');
const create = require('../../controllers/draft/create');

module.exports = class DraftCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'draft',
      group: 'draft',
      memberName: 'draft',
      description: 'Start a draft.',
    });
  }

  run(message) {
    return create(message);
  }
};
