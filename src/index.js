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

  const snapshotListeners = [];
  const setupListeners = () => {
    // TODO: only query for past 31 days
    const query = db.collection('drafts').where('open', '==', true);
    query.get().then((querySnapshot) => {
      // TODO: iterate snapshotListeners and unhook them
      // TODO: start a watcher for all returned documents and add it to our list
      console.log(`Received query snapshot of size ${querySnapshot.size}`);
    }, (err) => {
      console.log(`Encountered error: ${err}`);
    });
  };

  setupListeners();
  setInterval(setupListeners, 24 * 60 * 60 * 1000);

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
