const { shuffle, fromPairs, groupBy, mapValues } = require('lodash');

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

  // TODO: dice

  draft.pools = {
    stage: 'phoenixborn',
    current: draft.players[0],
    cards,
    phoenixborn,
    dice: [],
  };
  return draftSnapshot.ref.set(draft);
};
