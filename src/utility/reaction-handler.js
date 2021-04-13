const sendCard = require('../controllers/cards/best-match');
const emojiSubstitution = require('../controllers/cards/emoji-substitution');
const searchFuse = require('../controllers/shared/search-fuse');
const draftHandler = require('../controllers/draft/reaction-handler');

module.exports = (remove = false) => async (messageReaction, user) => {
  // see if bot has sent reaction and reaction count is exactly 2
  if (messageReaction.me) return null;
  const { count, emoji: { name }, message } = messageReaction;
  if (message.author.id !== process.env.owner) return null;
  const alsoHasOwn = await messageReaction.users.resolve(process.env.owner);
  if (!alsoHasOwn) return null;

  if (message.embeds[0]?.footer.text.split(':')[0] === 'Draft') {
    return draftHandler(messageReaction, user, remove);
  }

  // card reaction
  if (remove) return null;
  if (count !== 2) return null;
  // remove own reaction
  messageReaction.users.remove(process.env.owner);
  const [reactionOnStub] = message.embeds[0].author.url.split('/').slice(-2);
  // send card to which reaction refers
  // TODO: probably need some error handling here
  const reactionOnCard = searchFuse(reactionOnStub, messageReaction.client)[0].item;
  const { emojiMapping } = emojiSubstitution(reactionOnCard);
  const { stub } = emojiMapping[name];
  return sendCard(message, stub);
};
