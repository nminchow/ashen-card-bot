const start = require('./start');

const handleOpen = async ({ open }, user) => {
  if (!open) {
    const dm = await user.createDM(true);
    await dm.send('This draft has started and cannot be joined or modified.');
    return false;
  }
  return true;
};

const handleJoin = async (_, user, draftSnapshot, remove) => {
  const draft = draftSnapshot.data();
  if (!await handleOpen(draft, user)) return null;
  const { id } = user;
  // in case the user reacts to multiple joins, always filter them out
  const filtered = draft.players.filter((candidate) => id !== candidate);
  // re-add if this wasn't a removal
  draft.players = remove ? filtered : [...filtered, id];
  return draftSnapshot.ref.set(draft);
};

const handleSetup = async ({ emoji: { name } }, user, draftSnapshot, enabled) => {
  const draft = draftSnapshot.data();
  if (!await handleOpen(draft, user)) return null;
  if (user.id !== draft.author.id) {
    const dm = await user.createDM(true);
    return dm.send("Only the draft's creator can modify it's setup.");
  }
  if (name === '✅') {
    return start(draftSnapshot, user);
  }
  draft.releases[name].enabled = enabled;
  // ref should be enabled when a reaction is removed and disabled when added
  return draftSnapshot.ref.set(draft);
};

module.exports = async (messageReaction, user, remove) => {
  const { message } = messageReaction;
  const [, type, id] = message.embeds[0]?.footer.text.split(':');

  const { client: { data: { db } } } = message;

  const document = db.collection('drafts').doc(id);
  const draftSnapshot = await document.get();

  if (!draftSnapshot.exists) {
    return message.channel.send('Draft not found! It has likely expired or was removed.');
  }

  if (type === 'Join') {
    return handleJoin(messageReaction, user, draftSnapshot, remove);
  }

  if (type === 'Setup') {
    return handleSetup(messageReaction, user, draftSnapshot, remove);
  }

  return message.channel.send('Unknown Embed Type');
};