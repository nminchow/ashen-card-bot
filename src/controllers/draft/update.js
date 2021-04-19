const setup = require('../../views/draft/setup');
const invite = require('../../views/draft/invite');
const choice = require('../../views/draft/choice');
const getMessageByString = require('../../utility/get-message-by-string');

// called when a draft document has been updated
// Note: docChanges still fires once when draft is transitioned from open to
// close and has the _old_ version of the data still.
module.exports = (draftSnapshot, client) => {
  const draft = draftSnapshot.data();
  const { setupId, invites } = draft;
  if (!setupId) return null;
  const { embed: setupEmbed } = setup(draftSnapshot.ref.id, draft);
  const { embed } = invite(draftSnapshot.ref.id, draft);

  const updateEdit = async () => {
    console.log('updating');
    const setupMessage = await getMessageByString(setupId, client);
    if (!setupMessage) return null;
    return setupMessage.edit(setupEmbed);
  };

  const inviteUpdates = invites.map(async (inviteId) => {
    const message = await getMessageByString(inviteId, client);
    if (!message) return null;
    console.log('updating invite');
    return message.edit(embed);
  });

  const editUpdates = Object.entries(draft.playerData || []).map(async ([id, { messageId }]) => {
    const message = await getMessageByString(messageId, client);
    if (!message) return null;
    console.log('updating edit');
    const embed = choice(draftSnapshot.ref.id, id, draft);
    return message.edit(embed);
  });

  return Promise.all([updateEdit(), ...inviteUpdates, ...editUpdates]);
};
