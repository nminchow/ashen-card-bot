const handleJoin = async ({ emoji: { name } }, user, draft, remove) => {

};

const handleSetup = async ({ emoji: { name }, message }, user, draft, remove) => {
  if (user.id !== draft.author.id) {
    const dm = await user.createDM(true);
    return dm.send("Only the draft's creator can modify it's setup.");
  }
  console.log('handle', name);
  return 'woot';
};

module.exports = async (messageReaction, user, remove) => {
  const { message } = messageReaction;
  const [, type, id] = message.embeds[0]?.footer.text.split(':');

  const { client: { data: { db } } } = message;

  const document = db.collection('drafts').doc(id);
  const draftRef = await document.get();

  if (!draftRef.exists) {
    return message.channel.send('Draft not found! It has likely expired or was removed.');
  }

  const draft = draftRef.data();

  if (type === 'Join') {
    return handleJoin(messageReaction, user, draft, remove);
  }

  if (type === 'Setup') {
    return handleSetup(messageReaction, user, draft, remove);
  }

  return message.channel.send('Unknown Embed Type');
};
