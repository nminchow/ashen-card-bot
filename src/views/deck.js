const Discord = require('discord.js');
const {
  orderBy, times, groupBy, sumBy,
} = require('lodash');
const colorForDice = require('../utility/color-for-dice');
const {
  buildDiceUrl, buildImgUrl, buildDeckUrl, buildCardLink, buildDeckLink,
} = require('../utility/urls');
const emojiMapping = require('../utility/emoji-mapping');

module.exports = ({
  id,
  title,
  modified,
  user: {
    username,
    badge,
  },
  dice,
  phoenixborn: {
    name,
    stub,
    battlefield,
    life,
    spellboard,
  },
  cards,
  conjurations,
  releases,
}, { emojis }) => {
  const embed = new Discord.MessageEmbed();

  const { name: primaryDice } = orderBy(dice, 'count', 'desc')[0];
  const diceUrl = buildDiceUrl(primaryDice);
  embed.setColor(colorForDice(primaryDice));
  const url = buildDeckUrl(id);
  embed.setAuthor(title, diceUrl, url);
  embed.setFooter(`${username}#${badge}`);
  embed.setTimestamp(modified);
  embed.setThumbnail(buildImgUrl(stub));

  const diceList = dice.map(({ count, name }) => times(count, () => emojis.resolve(emojiMapping[`${name}:power`])).join(' ')).join(' ');

  const formattedName = buildCardLink({ name, stub });

  embed.setDescription(`**${formattedName}**\n${diceList}`);

  Object.entries({ battlefield, life, spellboard }).forEach(([key, value]) => {
    if (value === undefined) return;
    embed.addField(key, value, true);
  });

  Object.entries(
    groupBy([...cards, ...conjurations], 'type'),
  ).forEach(([key, value]) => {
    embed.addField(
      `${key} (${sumBy(value, 'count')})`,
      value.map(({ count, ...attributes }) => {
        const formattedName = buildCardLink(attributes);
        return `${formattedName} x ${count}`;
      }).join('\n'),
    );
  });

  if (releases) {
    const releaseNames = releases.map(({ name, preconstructed_deck_id: id }) => {
      if (!id) return name;
      return buildDeckLink({ name, id });
    }).join(', ');

    embed.addField('Requires', releaseNames);
  }
  return embed;
};
