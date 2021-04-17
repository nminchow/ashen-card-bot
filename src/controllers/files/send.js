module.exports = (message, { attachment, name }) => {
  const sendWithReaction = async () => {
    const addEmoji = message.react(message.client.emojis.resolve('833007449236701225'));
    const upload = message.channel.send({
      files: [{
        attachment,
        name,
      }],
    });
    const [emoji] = await Promise.all([addEmoji, upload]);
    await emoji.users.remove(process.env.owner);
    return upload;
  };
  return new Promise((resolve, reject) => {
    sendWithReaction().then(resolve).catch(reject);
  });
};
