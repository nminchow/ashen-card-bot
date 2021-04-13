module.exports = (message) => {
  const { client: { data: { db } }, author: { id: author } } = message;
  const createDraft = async () => {
    const { id } = await db.collection('drafts').add({ author });
    return message.channel.send(`draft created ${id}`);
  };
  return new Promise((resolve) => {
    createDraft().then(resolve);
  });
};
