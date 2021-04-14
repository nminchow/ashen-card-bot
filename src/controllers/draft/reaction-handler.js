const setup = require('../../views/draft/setup');

const handleJoin = async ({ emoji: { name } }, user, draftSnapshot, remove) => {
  // we'll need to store the channel and message id to lookup like this:
  // msg.channel.messages.fetch("701574160211771462")
  // .then(message => console.log(message.content))
  // .catch(console.error);
};

const handleSetup = async ({ emoji: { name }, message }, user, draftSnapshot, enabled) => {
  const draft = draftSnapshot.data();
  if (user.id !== draft.author.id) {
    const dm = await user.createDM(true);
    return dm.send("Only the draft's creator can modify it's setup.");
  }
  draft.releases[name].enabled = enabled;
  // ref should be enabled when a reaction is removed and disabled when added
  await draftSnapshot.ref.set(draft);

  const { embed } = setup(draftSnapshot.ref.id, draft);
  return message.edit(embed);
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
