import sortBy from 'lodash.sortby';

function makeRandomCircles(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 10 * (Math.random() * 3 + 1),
      rotation: 0,
      offset: 0,
      frequency: Math.random() * n,
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
      offset: 0,
      frequency: i + 1,
      x: 0,
      y: 0,
    });
  }
  return array;
}

function makeSquareCircles(n, offset = 0) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push({
      radius: 50 / (2 * i + 1),
      rotation: offset,
      offset,
      frequency: 2 * i + 1,
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
    case 'squareX':
      array = makeSquareCircles(n, Math.PI / 2);
      break;
    default:
      array = [];
  }
  return sortBy(array, 'frequency');
}

export default makeCircles;
