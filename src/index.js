const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const Fuse = require('fuse.js');
const firebaseAdmin = require('firebase-admin');
const getCards = require('./setup/get-cards');
const messageHandler = require('./utility/message-handler');
const reactionHandler = require('./utility/reaction-handler');
const generateReleases = require('./utility/generate-releases');
require('dotenv').config();

const commandPrefix = '!!';

const client = new CommandoClient({
  commandPrefix: '!!',
  owner: process.env.owner,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
});

const setupClient = (cards) => {
  // TODO: https://firebase.google.com/docs/firestore/quickstart#initialize
  firebaseAdmin.initializeApp();
  const db = firebaseAdmin.firestore();

  const releases = generateReleases(cards);

  const cardFuse = new Fuse(cards, {
    keys: ['name', 'stub', 'type'],
    includeScore: true,
  });

  client.data = {
    cards,
    releases,
    cardFuse,
    db,
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
    .registerGroups([
      ['draft', 'draft commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

  client.on('message', (message) => {
    if (message.content.startsWith(commandPrefix)) return null;
    if (message.author.bot) return null;
    return messageHandler(message);
  });

  client.on('messageReactionAdd', reactionHandler());
  client.on('messageReactionRemove', reactionHandler(true));

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('for help: !!help');
  });

  client.on('error', console.error);

  client.login(process.env.token);
};

getCards().then(setupClient);
