const got = require('got');
const deck = require('../../views/deck');

const sendIfFound = (message, result, client) => {
  if (result) {
    return message.channel.send({ embed: deck(result, client) });
  }
  return message.channel.send('deck not found');
};

const byId = async (message, id, client) => {
  const { deck, releases } = await got(`https://api.ashes.live/v2/decks/${id}`).json();
  return sendIfFound(message, { releases, ...deck }, client);
};

const byUUID = async (message, uuid, client) => {
  const result = await got(`https://api.ashes.live/v2/decks/shared/${uuid}`).json();
  return sendIfFound(message, result, client);
};

module.exports = {
  byId,
  byUUID,
};
