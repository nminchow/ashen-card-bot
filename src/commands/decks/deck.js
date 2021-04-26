const { Command } = require('discord.js-commando');
const fetchDeck = require('../../controllers/decks/fetch');

const description = 'Displays deck from ashes.live by uuid or id (if public). '
+ 'Can also be invoked by simply pasting deck links, ex: `check out https://ashes.live/decks/7707/`.';

module.exports = class DeckCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deck',
      aliases: ['d'],
      group: 'decks',
      memberName: 'deck',
      description,
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
    return fetchDeck(message, uuid);
  }
};
