const colorArray = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const randomColorGen = () => Math.floor(Math.random() * 16777215).toString(16);

const randomColorSel = () =>
  colorArray[Math.floor(Math.random() * colorArray.length)];

export { randomColorGen, randomColorSel };
