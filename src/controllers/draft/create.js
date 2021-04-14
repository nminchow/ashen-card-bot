const { keyBy, pick } = require('lodash');
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
    const doc = {
      author, name, releases, open: true,
    };
    const draftRef = await db.collection('drafts').add(doc);
    const { id } = draftRef;
    const result = await sendEmbedAndIcons(setup(id, doc), message);
    await sendEmbedAndIcons(invite(id, doc), message);
    await draftRef.set({ setupId: result.id }, { merge: true });
    return result;
  };
  return new Promise((resolve) => {
    createDraft().then(resolve);
  });
};
