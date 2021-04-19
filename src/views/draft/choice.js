const { titleCase } = require('humanize-plus');
const { MessageEmbed } = require('discord.js');
const { fromPairs } = require('lodash');
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
    const emojiMapping = fromPairs(phoenixborn.map((phoenixborn, index) => (
      [universalEmojiList[index], phoenixborn]
    )));
    const options = Object.entries(emojiMapping).map(
      ([icon, phoenixborn]) => `${icon} ${buildCardLink(cardsByStub[phoenixborn])}`,
    );
    embed.addField('Remaining Phoenixborn:', options);
    return { embed, emojiMapping: isTurn ? emojiMapping : {} };
  }

  if (stage === 'card') {
    const index = (players.indexOf(playerId) + round) % players.length;
    embed.addField('Card Options:', hands[index]);
  }
  embed.setColor(ready);
  return { embed, emojiMapping: {} };
};
