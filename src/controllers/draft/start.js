const { TextChannel, MessageEmbed } = require('discord.js');
const {
  shuffle, fromPairs, groupBy, mapValues, chunk,
} = require('lodash');
const createMessageLink = require('../../utility/create-message-link');
const getMessageByString = require('../../utility/get-message-by-string');

module.exports = async (draftSnapshot, user) => {
  const draft = draftSnapshot.data();
  if (!draft.players.length) {
    const dm = await user.createDM(true);
    return dm.send('Cannot start a draft with no participants!');
  }
  // off to the races!
  draft.open = false;

  // use players array to determine turn order
  draft.players = shuffle(draft.players);
  draft.playerData = fromPairs(draft.players.map((player) => ([
    player,
    {
      phoenixborn: null,
      dice: [],
      deck: [],
    },
  ])));

  const stubFromCard = ({ stub }) => stub;

  const releases = Object.values(draft.releases).map(stubFromCard);

  // filter out signature cards, unused releases, rules, and references
  const eligibleCards = user.client.data.cards.filter(
    ({ release: { stub } = {}, phoenixborn }) => !phoenixborn
      && releases.includes(stub),
  );

  const { true: phoenixborn, false: cards } = mapValues(
    groupBy(eligibleCards, ({ type }) => type === 'Phoenixborn'),
    (cards) => cards.map(stubFromCard),
  );

  // cannot store array of arrays directly, so key by index
  const hands = chunk(shuffle(cards), 9).splice(0, draft.players.length).reduce(
    (acc, hand, i) => ({ ...acc, [i]: hand }), {},
  );

  draft.pools = {
    stage: 'phoenixborn', // transitions to 'cards', then 'dice'
    round: 0, // used for card and dice index
    current: draft.players[0],
    hands,
    phoenixborn,
    dice: [], // TODO
  };
  await draftSnapshot.ref.set(draft);

  const { setupId, invites } = draft;
  return Promise.all([setupId, ...invites].map(async (id, index) => {
    const message = await getMessageByString(id, user.client);
    if (message.channel instanceof TextChannel && index) {
      const embed = new MessageEmbed();
      embed.setDescription(
        `${draft.name} has begun! All participants have been DMed a message they will use to make card and dice selections.\n\n`
        + `[The embed above](${createMessageLink(message)}) will also show the status of the draft.`,
      );

      await message.channel.send({ embed });
    }
    return Promise.all(message.reactions.cache.map((r) => r.users.remove(process.env.owner)));
  }));
};
