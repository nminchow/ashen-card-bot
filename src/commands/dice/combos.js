const { Command } = require('discord.js-commando');
const send = require('../../controllers/files/send');

module.exports = class DiceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'combos',
      aliases: ['dice', 'combo'],
      group: 'dice',
      memberName: 'combos',
      description: 'Displays known dice combos.',
    });
  }

  run(message) {
    return send(message, { attachment: './docs/combos.jpg', name: 'DiceCombos.jpg' });
  }
};
