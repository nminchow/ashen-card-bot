const { keyBy, pick } = require('lodash');
const firebaseAdmin = require('firebase-admin');
const setup = require('../../views/draft/setup');
const invite = require('../../views/draft/invite');

module.exports = (message, { name }) => {
  const { client: { data: { db, releases: rawReleases } }, author: rawAuthor } = message;

  const author = { avatar: rawAuthor.displayAvatarURL(), ...pick(rawAuthor, ['id', 'username', 'tag']) };

  const releases = keyBy(rawReleases.map((entry) => ({ ...entry, enabled: true })), 'icon');

  const sendEmbedAndIcons = async ({ embed, icons }, message) => {
    const result = await message.channel.send({ embed });
    // don't await so we send both embeds right away
    icons.map((key) => result.react(key));
    return result;
  };

  const createDraft = async () => {
    const createdAt = firebaseAdmin.firestore.FieldValue.serverTimestamp();

    const doc = {
      author, name, releases, open: true, createdAt, users: [rawAuthor.id],
    };
    const draftRef = await db.collection('drafts').add(doc);
    const { id } = draftRef;
    const result = await sendEmbedAndIcons(setup(id, doc), message);
    const { id: inviteId } = await sendEmbedAndIcons(invite(id, doc), message);
    await draftRef.set({
      setupId: `${message.channel.id}:${result.id}`,
      invites: [`${message.channel.id}:${inviteId}`],
    }, { merge: true });
    return result;
  };
  return new Promise((resolve) => {
    createDraft().then(resolve);
  });
};
