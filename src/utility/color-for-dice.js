const mapping = {
  'ceremonial': '#ee3342',
  'charm': '#f34f98',
  'divine': '#b58a2b',
  'illusion': '#490d67',
  'natural': '#004a98',
  'sympathy': '#119981',
  'time': '#9a2e36',
};

module.exports = (dice) => {
  return mapping[dice] || '#ffffff';
}