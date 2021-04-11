const card = require('../../views/card');

module.exports = (message, result, client, fullArt) => {
  const { embed, emojiMapping } = card(result.item, client, fullArt);
  return new Promise((resolve, reject) => {
    const addEmoji = async (result) => {
      if (fullArt) {
        resolve(result);
        return;
      }
      await Promise.all(Object.entries(emojiMapping).map(([key]) => result.react(key)));
      resolve(result);
    };

    message.channel.send({ embed }).then(addEmoji).catch(reject);
  });
};
