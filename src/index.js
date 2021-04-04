const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const Fuse = require('fuse.js');
const { token } = require('../config.json');
const getCards = require('./setup/get-cards');

const client = new CommandoClient({
  commandPrefix: '!!',
  owner: '827967142435225631',
  // invite: 'https://discord.gg/bRCvFy9',
});

const setupClient = (cards) => {
  const cardFuse = new Fuse(cards, { keys: ['name', 'stub'] });

  client.data = {
    cards,
    cardFuse,
  };

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['cards', 'card related commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('for help: ?c help');
  });

  client.on('error', console.error);

  client.login(token);
};

getCards().then(setupClient);
