const { Command } = require('discord.js-commando');
const bestMatch = require('../../controllers/rules/best-match');

module.exports = class RuleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rule',
      aliases: ['r'],
      group: 'rules',
      memberName: 'rule',
      description: 'Displays rule.',
      args: [
        {
          key: 'text',
          prompt: 'Rule Name',
          type: 'string',
        },
      ],
    });
  }

  run(message, { text }) {
    return bestMatch(message, text);
  }
};
