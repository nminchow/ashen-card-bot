const got = require('got');
const deck = require('../../views/deck');

const sendIfFound = (message, result) => {
  if (result) {
    return message.channel.send({ embed: deck(result, message.client) });
  }
  return message.channel.send('deck not found');
};

const byUUID = async (message, uuid) => {
  const result = await got(`https://api.ashes.live/v2/decks/shared/${uuid}`).json();
  return sendIfFound(message, result);
};

const byId = async (message, id) => {
  if (Number.isNaN(Number(id))) {
    return byUUID(message, id);
  }
  const { deck, releases } = await got(`https://api.ashes.live/v2/decks/${id}`).json();
  return sendIfFound(message, { releases, ...deck });
};

module.exports = byId;
