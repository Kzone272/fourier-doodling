import sortBy from 'lodash.sortby';

function makeRandomCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 10 * (Math.random() * 3 + 1),
      rotation: 0,
      period: Math.random() * n,
      x: 0,
      y: 0,
    });
  }
  return array;
}

function makeOrderedCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 10 * (n + 2 - i),
      rotation: 0,
      period: i + 1,
      x: 0,
      y: 0,
    });
  }
  return array;
}

function makeSquareCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 50 / (2 * i + 1),
      rotation: 0,
      period: 2 * i + 1,
      x: 0,
      y: 0,
    });
  }
  return array;
}

function makeCircles(method = 'square', n = 50) {
  let array = [];
  switch (method) {
    case 'random':
      array = makeRandomCircles(n);
      break;
    case 'ordered':
      array = makeOrderedCircles(n);
      break;
    case 'square':
      array = makeSquareCircles(n);
      break;
    default:
      array = [];
  }
  return sortBy(array, 'period');
}

export default makeCircles;
