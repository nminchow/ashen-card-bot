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

  if (playerData.subSelection) {
    // user has made subselection
  }

  if (draft.pools.stage === 'phoenixborn') {
    console.log('handling initial reaction');
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
      // TODO: figure out how we do this
      // draft.pools.current =
    }
    return draftSnapshot.ref.set(draft);
    // build view and check if emoji mapping is an array, if it is an array, user is making subselection, if not, they are making actual selection
  }
};
