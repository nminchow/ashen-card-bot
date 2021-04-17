const setup = require('../../views/draft/setup');
const invite = require('../../views/draft/invite');

// called when a draft document has been updated
// Note: docChanges still fires once when draft is transitioned from open to
// close and has the _old_ version of the data still.
module.exports = (draftSnapshot, client) => {
  const getChannelByString = async (id) => {
    const [channelId, messageId] = id.split(':');
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.log('channel not found');
      return null;
    }
    return channel.messages.fetch(messageId);
  };

  const draft = draftSnapshot.data();
  const { setupId, invites } = draft;
  if (!setupId) return null;
  const { embed: setupEmbed } = setup(draftSnapshot.ref.id, draft);
  const { embed } = invite(draftSnapshot.ref.id, draft);

  const updateEdit = async () => {
    console.log('updating');
    const setupMessage = await getChannelByString(setupId);
    if (!setupMessage) return null;
    return setupMessage.edit(setupEmbed);
  };

  const inviteUpdates = invites.map((inviteId) => async () => {
    const message = await getChannelByString(inviteId);
    if (!message) return null;
    console.log('updating invite');
    return message.edit(embed);
  });
  return Promise.all([updateEdit(), ...inviteUpdates.map((call) => call())]);
};
