const sendCard = require('../controllers/cards/best-match');
const emojiSubstitution = require('../controllers/cards/emoji-substitution');
const searchFuse = require('../controllers/shared/search-fuse');

module.exports = async (messageReaction) => {
  // see if bot has sent reaction and reaction count is exactly 2
  const { count, emoji: { name }, message } = messageReaction;
  if (count !== 2 || message.author.id !== process.env.owner) return null;
  const ownReaction = await messageReaction.users.resolve(process.env.owner);
  if (!ownReaction) return null;
  // remove reaction
  messageReaction.users.remove(process.env.owner);
  const [reactionOnStub] = message.embeds[0].author.url.split('/').slice(-2);
  // send card to which reaction refers
  // TODO: probably need some error handling here
  const reactionOnCard = searchFuse(reactionOnStub, messageReaction.client)[0].item;
  const { emojiMapping } = emojiSubstitution(reactionOnCard);
  const { stub } = emojiMapping[name];
  return sendCard(message, stub);
};
