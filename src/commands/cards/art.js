const { Command } = require('discord.js-commando');
const bestMatch = require('../../controllers/cards/best-match');

module.exports = class ArtCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'art',
      aliases: ['a'],
      group: 'cards',
      memberName: 'art',
      description: 'Displays card art. Can also be invoked by surrounding card names in braces, ex: `{aradel}`.',
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
    return bestMatch(message, text, true);
  }
};
