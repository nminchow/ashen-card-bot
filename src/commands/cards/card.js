const { Command } = require('discord.js-commando');
const bestMatch = require('../../controllers/cards/best-match');

module.exports = class CardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'card',
      aliases: ['c'],
      group: 'cards',
      memberName: 'card',
      description: 'Displays card info. Can also be invoked by surrounding card names in brackets, ex: `[aradel]`.',
      args: [
        {
          key: 'text',
          prompt: 'Card Name',
          type: 'string',
        },
      ],
    });
  }

  run(message, { text }) {
    return bestMatch(message, text);
  }
};
