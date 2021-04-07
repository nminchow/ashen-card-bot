const { Command } = require('discord.js-commando');
const fetchDeck = require('../../controllers/decks/fetch');

module.exports = class DeckCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deck',
      aliases: ['d'],
      group: 'decks',
      memberName: 'deck',
      description: 'Displays deck from ashes.live',
      args: [
        {
          key: 'uuid',
          prompt: 'Deck ID (or uuid)',
          type: 'string',
        },
      ],
    });
  }

  run(message, { uuid }) {
    return fetchDeck(message, uuid, this.client);
  }
};
