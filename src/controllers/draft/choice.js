const { pull } = require('lodash');
const choice = require('../../views/draft/choice');

module.exports = async ({ emoji: { name } }, user, draftSnapshot, enabled) => {
  const draft = draftSnapshot.data();
  const dm = await user.createDM(true);
  const playerData = draft.playerData[user.id];

  if (['card', 'phoenixborn'].includes(draft.stage)) {
    if (user.id !== draft.current) {
      return dm.send("Whoops - looks like it isn't your turn");
    }
  }
  if (draft.pools.stage === 'phoenixborn') {
    const { emojiMapping } = choice(draftSnapshot.ref.id, user.id, user.client, draft);
    const result = emojiMapping[name];
    console.log(result);
    if (!result) {
      return dm.send('invalid reaction!');
    }
    if (Array.isArray(result)) {
      // transition to subselection was made, update
      playerData.subSelection = result;
    } else {
      // just normal phoenixborn set
      playerData.subSelection = null;
      playerData.phoenixborn = result;
      pull(draft.pools.phoenixborn, result);
      const nextPlayer = draft.players.find((id) => draft.playerData[id].phoenixborn === null);
      if (!nextPlayer) {
        draft.pools.stage = 'card';
        // eslint-disable-next-line prefer-destructuring
        draft.pools.current = draft.players[0];
      } else {
        draft.pools.current = nextPlayer;
      }
    }
    return draftSnapshot.ref.set(draft);
  }
};
