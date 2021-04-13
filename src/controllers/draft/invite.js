const invite = require('../../views/draft/invite');

module.exports = (message, { draftId: id }) => {
  const { client: { data: { db } } } = message;

  const sendEmbedAndIcons = async ({ embed, icons }, message) => {
    const result = await message.channel.send({ embed });
    await Promise.all(icons.map((key) => result.react(key)));
    return result;
  };

  const createInvite = async () => {
    const ref = await db.collection('drafts').doc(id).get();
    if (!ref.exists) {
      return message.channel.send('Draft not found. (You can start a new draft with `!!draft`)');
    }
    const doc = ref.data();
    const result = await sendEmbedAndIcons(invite(id, doc), message);
    return result;
  };
  return new Promise((resolve) => {
    createInvite().then(resolve);
  });
};
