module.exports= (cardText, { emojis }) => {
  let parsed = cardText.replace('[[side]]', emojis.resolve('491776018970050570'));
  return parsed;
}