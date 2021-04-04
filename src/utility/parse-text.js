const emojiMapping = {
  'main': '408070378204954629',
  'side': '408070377969811456',
  'basic': '408070376967503874',
  'exhaust': '408070378498424842',
  'discard': '408070377911222273',
}


const regex = new RegExp(
  Object.keys(emojiMapping).map(id => `\\[\\[${id}\\]\\]`).join('|'),
  'gi'
)


module.exports= (cardText, { emojis }) => {
  return cardText.replace(regex, (match) => {
    const key = match.substring(2, match.length - 2);
    return emojis.resolve(emojiMapping[key].toString());
  });
}