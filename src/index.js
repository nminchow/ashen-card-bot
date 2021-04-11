const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const Fuse = require('fuse.js');
const getCards = require('./setup/get-cards');
const messageHandler = require('./utility/message-handler');
const reactionHandler = require('./utility/reaction-handler');
require('dotenv').config();

const commandPrefix = '!!';

const client = new CommandoClient({
  commandPrefix: '!!',
  owner: process.env.owner,
});

const setupClient = (cards) => {
  const cardFuse = new Fuse(cards, {
    keys: ['name', 'stub', 'type'],
    includeScore: true,
  });

  client.data = {
    cards,
    cardFuse,
  };

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['cards', 'card commands'],
    ])
    .registerGroups([
      ['decks', 'deck commands'],
    ])
    .registerGroups([
      ['rules', 'rule commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

  client.on('message', (message) => {
    if (message.content.startsWith(commandPrefix)) return null;
    if (message.author.bot) return null;
    return messageHandler(message);
  });

  client.on('messageReactionAdd', reactionHandler);

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('for help: !!help');
  });

  client.on('error', console.error);

  client.login(process.env.token);
};

getCards().then(setupClient);
