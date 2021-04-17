const { Command } = require('discord.js-commando');
const send = require('../../controllers/files/send');

module.exports = class BookCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rulebook',
      aliases: ['rules', 'book'],
      group: 'rules',
      memberName: 'book',
      description: 'Displays rule book.',
    });
  }

  run(message) {
    return send(message, { attachment: './docs/ashes-reborn-rules.pdf', name: 'ashes-reborn-rules.pdf' });
  }
};
