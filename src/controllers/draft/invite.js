const invite = require('../../views/draft/invite');

module.exports = (message, { draftId: id }) => {
  const { client: { data: { db } } } = message;

  const sendEmbedAndIcons = async ({ embed, icons }, message) => {
    const result = await message.channel.send({ embed });
    await Promise.all(icons.map((key) => result.react(key)));
    return result;
  };

  const createInvite = async () => {
    const snapshot = await db.collection('drafts').doc(id).get();
    if (!snapshot.exists) {
      return message.channel.send('Draft not found. (You can start a new draft with `!!draft`)');
    }
    const doc = snapshot.data();
    const result = await sendEmbedAndIcons(invite(id, doc), message);
    const invites = [...doc.invites, `${message.channel.id}:${result.id}`];
    doc.invites = invites;
    snapshot.ref.set(doc);
    return result;
  };
  return new Promise((resolve) => {
    createInvite().then(resolve);
  });
};
