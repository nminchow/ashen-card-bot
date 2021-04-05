const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const Fuse = require('fuse.js');
const getCards = require('./setup/get-cards');
const messageHandler = require('./utility/message-handler');
require('dotenv').config();

const commandPrefix = '!!';

const client = new CommandoClient({
  commandPrefix: '!!',
  owner: '827967142435225631',
  owner: process.env.owner,
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
    .registerGroups([
      ['decks', 'card related commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

  client.on('message', (message) => {
    if (message.content.startsWith(commandPrefix)) return null;
    if (message.author.bot) return null;
    return messageHandler(message, client);
  });

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('for help: !!help');
  });

  client.on('error', console.error);

  client.login(process.env.token);
};

getCards().then(setupClient);
