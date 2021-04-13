const { keyBy } = require('lodash');
const setup = require('../../views/draft/setup');

module.exports = (message, { name }) => {
  const { client: { data: { db, releases: rawReleases } }, author: { id: author } } = message;

  const enabled = true;
  const releases = keyBy(rawReleases.map((entry) => ({ ...entry, enabled })), 'icon');

  const createDraft = async () => {
    const doc = { author, name, releases };
    const { id } = await db.collection('drafts').add(doc);
    const { embed, icons } = setup(id, doc);
    const result = await message.channel.send({ embed });
    await Promise.all(icons.map((key) => result.react(key)));
    return result;
  };
  return new Promise((resolve) => {
    createDraft().then(resolve);
  });
};
