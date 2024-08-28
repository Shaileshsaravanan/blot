const width = 400;
const height = 400;
setDocDimensions(width, height);

const finalLines = [];

function generateGosperCurve(iterations) {
  let axiom = 'A';
  const rules = {
    A: 'A-B--B+A++AA+B-',
    B: '+A-BB--B-A++A+B'
  };

  for (let i = 0; i < iterations; i++) {
    let newAxiom = '';
    for (let char of axiom) {
      newAxiom += rules[char] || char;
    }
    axiom = newAxiom;
  }

  return axiom;
}

function generateCommands(sequence, length, angle) {
  const commands = [];
  for (let char of sequence) {
    switch (char) {
      case 'A':
      case 'B':
        commands.push(['F', length]);
        break;
      case '+':
        commands.push(['R', angle]);
        break;
      case '-':
        commands.push(['L', angle]);
        break;
    }
  }
  return commands;
}

function drawGosperCurve(commands, startX, startY, startAngle) {
  let x = startX;
  let y = startY;
  let angle = startAngle;
  let path = [[x, y]];

  for (let command of commands) {
    const [cmd, val] = command;
    if (cmd === 'F') {
      x += val * Math.cos(angle * (Math.PI / 180));
      y += val * Math.sin(angle * (Math.PI / 180));
      path.push([x, y]);
    } else if (cmd === 'R') {
      angle -= val;
    } else if (cmd === 'L') {
      angle += val;
    }
  }

  finalLines.push(path);
}

function scaleAndContainPath(path, width, height) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let [x, y] of path) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  const pathWidth = maxX - minX;
  const pathHeight = maxY - minY;
  const scaleX = (width - 20) / pathWidth;
  const scaleY = (height - 20) / pathHeight;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (width - pathWidth * scale) / 2 - minX * scale;
  const offsetY = (height - pathHeight * scale) / 2 - minY * scale;

  return path.map(([x, y]) => [x * scale + offsetX, y * scale + offsetY]);
}

const iterations = 4 + Math.floor(Math.random() * 2);
const baseLength = 5 + Math.random() * 3;
const baseAngle = 60;
const startAngle = Math.random() * 360;

const gosperSequence = generateGosperCurve(iterations);
const commands = generateCommands(gosperSequence, baseLength, baseAngle);
drawGosperCurve(commands, 0, 0, startAngle);

const scaledPath = scaleAndContainPath(finalLines[0], width, height);
finalLines[0] = scaledPath;

drawLines(finalLines);