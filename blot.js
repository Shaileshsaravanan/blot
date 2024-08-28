const width = 400;
const height = 400;
setDocDimensions(width, height);

// Store final lines here
const finalLines = [];

// Function to generate the Gosper curve L-System sequence
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

// Function to convert the L-System sequence into drawing commands
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

// Function to execute the drawing commands
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

// Function to scale and contain the Gosper curve within the document
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

// Randomize parameters
const iterations = 4;  // Keep the number of iterations consistent to preserve the fractal structure
const length = Math.random() * 5 + 3;                 // Random length between 3 and 8
const angle = 60;                                     // Fixed angle for Gosper curve
const startAngle = Math.random() * 360;               // Random start angle

// Generate the Gosper curve sequence and commands
const gosperSequence = generateGosperCurve(iterations);
const commands = generateCommands(gosperSequence, length, angle);
drawGosperCurve(commands, 0, 0, startAngle);

// Ensure the curve is contained within the document dimensions
const scaledPath = scaleAndContainPath(finalLines[0], width, height);
finalLines[0] = scaledPath;

// Draw it
drawLines(finalLines);