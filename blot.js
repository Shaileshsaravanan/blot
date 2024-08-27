const width = 125;
const height = 125;

setDocDimensions(width, height);

const finalLines = [];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function drawBranch(x, y, length, angle, depth) {
  if (depth === 0) return;

  const xEnd = x + length * Math.cos(angle);
  const yEnd = y - length * Math.sin(angle);

  const branch = [
    [x, y],
    [xEnd, yEnd]
  ];

  finalLines.push(branch);

  const newLength = length * getRandom(0.6, 0.8);
  drawBranch(xEnd, yEnd, newLength, angle + getRandom(0.1, 0.5), depth - 1);
  drawBranch(xEnd, yEnd, newLength, angle - getRandom(0.1, 0.5), depth - 1);
}

const baseX = width / 2;
const baseY = height;
const initialLength = 30;
const initialAngle = -Math.PI / 2;
const depth = 5;

drawBranch(baseX, baseY, initialLength, initialAngle, depth);

drawLines(finalLines);