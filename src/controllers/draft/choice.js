module.exports = async ({ emoji: { name } }, user, draftSnapshot, enabled) => {
  const draft = draftSnapshot.data();
  const dm = await user.createDM(true);

  if (['card', 'phoenixborn'].includes(draft.stage)) {
    if (user.id !== draft.current) {
      return dm.send("Whoops - looks like it isn't your turn");
    }
  }

  if (draft.playData[user.id].subSelection) {
    // user is doing subselection
  }

  if (draft.stage === 'phoenixborn') {
    // build view and check if emoji mapping is an array, if it is an array, user is making subselection, if not, they are making actual selection
  }
};
