const { titleCase } = require('humanize-plus');
const { MessageEmbed } = require('discord.js');
const { fromPairs, chunk } = require('lodash');
const { warning, ready, pending } = require('../../constants/colors');
const universalEmojiList = require('../../constants/universal-emoji-list');
const { buildCardLink } = require('../../utility/urls');

module.exports = (id, playerId, { data: { cardsByStub } }, {
  name, players, playerData, pools: {
    stage, round, phoenixborn, hands, current,
  } = {},
}) => {
  const embed = new MessageEmbed();
  embed.setAuthor(name);
  embed.setFooter(`Draft:User:${id}`);
  if (!stage) {
    embed.setColor(warning);
    embed.setDescription('Initializing...');
    return embed;
  }

  embed.setTitle(`${titleCase(stage)} Selection`);
  const isTurn = current === playerId || stage === 'card';
  embed.setColor(isTurn ? ready : pending); // we may want to do this differently for card

  if (stage === 'phoenixborn') {
    const completed = Boolean(playerData[playerId].phoenixborn);
    if (completed) {
      embed.setDescription('You have chosen your phoenixborn. Please wait for the rest of the participants to make their choice');
    } else if (isTurn) {
      embed.setDescription('Choose your phoneixborn using the reactions below!');
    } else {
      embed.setDescription('Other players are choosing their phoenixborn.');
    }

    // could go up to 20, but pad a bit to be safe
    if (phoenixborn.length > 15 && !playerData.subSelection && isTurn) {
      const emojiMapping = fromPairs(chunk(phoenixborn, 5).map((subset, index) => (
        [universalEmojiList[index], subset]
      )));

      Object.entries(emojiMapping).forEach(([key, value]) => {
        const options = value.map((phoenixborn) => buildCardLink(cardsByStub[phoenixborn])).join('\n');
        embed.addField(`${key} Chose From Set`, options);
      });

      return { embed, emojiMapping };
    }

    const emojiMapping = fromPairs(phoenixborn.map((phoenixborn, index) => (
      [universalEmojiList[index], phoenixborn]
    )));
    const [firstSet, ...options] = chunk(Object.entries(emojiMapping).map(
      ([icon, phoenixborn]) => `${icon} ${buildCardLink(cardsByStub[phoenixborn])}`,
    ), 5);
    embed.addField('Remaining Phoenixborn:', firstSet);
    options.forEach((option) => embed.addField('-', option));
    return { embed, emojiMapping: isTurn ? emojiMapping : {} };
  }

  if (stage === 'card') {
    const index = (players.indexOf(playerId) + round) % players.length;
    embed.addField('Card Options:', hands[index]);
  }
  embed.setColor(ready);
  return { embed, emojiMapping: {} };
};
