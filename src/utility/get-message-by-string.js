module.exports = async (id, client) => {
  const [channelId, messageId] = id.split(':');
  const channel = await client.channels.fetch(channelId);
  if (!channel) {
    console.log('channel not found');
    return null;
  }
  return channel.messages.fetch(messageId);
};
