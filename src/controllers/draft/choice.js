module.exports = async ({ emoji: { name } }, user, draftSnapshot, enabled) => {
  const draft = draftSnapshot.data();
  const dm = await user.createDM(true);

  if (['card', 'phonixborn'].includes(draft.stage)) {
    if (user.id !== draft.current) {
      return dm.send("Whoops - looks like it isn't your turn");
    }
  }
};
