const Discord = require('discord.js');
const { orderBy } = require('lodash');
const icons = require('../../utility/universal-emoji-list');

module.exports = (id, { releases, name }) => {
  const embed = new Discord.MessageEmbed();

  embed.setAuthor(name, 'https://static.thenounproject.com/png/219525-200.png');
  embed.setTitle('Setup');

  const orderedReleases = orderBy(
    Object.values(releases),
    ['size', 'stub'], ['desc', 'asc'],
  );

  const description = 'Your draft has been created! React with the following to exclude (or re-include) releases from the draft:';

  // TODO: It'd be nice to have deck links here, but we don't have the precon ids on the cards list
  const iconList = orderedReleases.map(({ icon, name, enabled }) => `${icon} ${enabled ? `**${name}**` : `~~${name}~~`}`).join('\n');

  const completionInfo = 'Once ready, issue the ✅ reaction to lock joining, shuffle, and deal each participant their first draft hand.';

  embed.addField(
    'Inviting Players',
    `Users can use the embed (below) to join the draft. If
    you'd like to share the invite link elsewhere, issue \`!!invite ${id}\`.
    (This bot must be able to see the channel you are sharing to.)`,
  );

  embed.setDescription([description, iconList, completionInfo].join('\n\n'));
  embed.setFooter(`Draft:Setup:${id}`);
  embed.setTimestamp();

  return { embed, icons: [...icons.slice(0, orderedReleases.length), '✅'] };
};
