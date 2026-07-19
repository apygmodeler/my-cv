const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(canvas.width, canvas.height);
const pixels = imageData.data; // Array of color [R,G,B,A, R,G,B,A, ...]
const canvasWrap = document.getElementById('canvasWrap');

function putPixel(x, y, r, g, b, a = 255) {
  x = Math.round(x);
  y = Math.round(y);

  const idx = (y * canvas.width + x) * 4;
  pixels[idx] = r;
  pixels[idx + 1] = g;
  pixels[idx + 2] = b;
  pixels[idx + 3] = a;
}

function drawLine(x1, y1, x2, y2, r, g, b, a = 255) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  if(dx > dy) {
    const m = (y2 - y1) / (x2 - x1);
    const c = y1 - m * x1;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      const y = Math.round(m * x + c);
      putPixel(x, y, r, g, b, a);
    }
  } else {
    const m = (x2 - x1) / (y2 - y1);
    const c = x1 - m * y1;
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      const x = Math.round(m * y + c);
      putPixel(x, y, r, g, b, a);
    }
  }
}

function drawRect(x1, y1, x2, y2, r, g, b, a = 255) {
  drawLine(x1, y1, x2, y1, r, g, b, a);
  drawLine(x2, y1, x2, y2, r, g, b, a);
  drawLine(x2, y2, x1, y2, r, g, b, a);
  drawLine(x1, y2, x1, y1, r, g, b, a);
}

function drawRectFilled(x1, y1, x2, y2, r, g, b, a = 255) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      putPixel(x, y, r, g, b, a);
    }
  }
}

function drawEllipse(cx, cy, rx, ry, r, g, b, a = 255) {
  for (let y = -ry; y <= ry; y++) {
    for (let x = -rx; x <= rx; x++) {
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) {
        putPixel(cx + x, cy + y, r, g, b, a);
      }
    }
  }
}

function drawSprite24Bit(sprite, x, y, degree, scaleX, scaleY) {
  for (let j = 0; j < sprite.length; j++) {
    for (let i = 0; i < sprite[j].length; i++) {
      const color = sprite[j][i];

      if (color !== null) {
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        const cX = i - (sprite[j].length / 2);
        const cY = j - (sprite.length / 2);
        // Rotate
        const rad = degree * Math.PI / 180;
        const x_rotated = Math.round(cX * Math.cos(rad) - cY * Math.sin(rad));
        const y_rotated = Math.round(cX * Math.sin(rad) + cY * Math.cos(rad));

        // Scale
        const x_rotated_scaled = Math.round(x_rotated * scaleX);
        const y_rotated_scaled = Math.round(y_rotated * scaleY);

        drawEllipse(x + x_rotated_scaled, y + y_rotated_scaled, Math.round(scaleX), Math.round(scaleY), r, g, b,);
      }
    }
  }
}
function toScaledMousePos(posX, posY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: Math.floor((posX - rect.left) * scaleX),
    y: Math.floor((posY - rect.top) * scaleY)
  };
}

const apygSprite24Bit = [
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, 0x896144, 0x896144, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0xAD9F7F, 0xAD9F7F, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0x896144, 0x896144, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0x765835, 0x765835, 0x765835, 0x765835, null],
  [null, 0x896144, 0x896144, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0xF7E3B6, 0xF7E3B6, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0x896144, 0x896144, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0xA87E4C, 0xA87E4C, 0xA87E4C, 0x765835, null],
  [null, 0x896144, 0x896144, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0xF7E3B6, 0xF7E3B6, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0x896144, 0x896144, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0xA87E4C, 0xA87E4C, 0xA87E4C, 0x765835, null],
  [null, 0x896144, 0x896144, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0xF7E3B6, 0xF7E3B6, 0x966E4D, 0x966E4D, 0x966E4D, 0x966E4D, 0x896144, 0x896144, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0x6B4C35, 0xA87E4C, 0xA87E4C, 0xA87E4C, 0x765835, null],
  [null, 0x896144, 0x896144, 0x896144, 0x896144, 0xD7A161, 0xD7A161, 0xF7E3B6, 0xF7E3B6, 0xD7A161, 0xD7A161, 0x896144, 0x896144, 0x896144, 0x896144, 0x6B4C35, 0x6B4C35, 0x624130, 0xB28C55, 0x9A6A45, 0x9A6A45, 0x9A6A45, 0x765835, null],
  [null, 0x896144, 0x896144, 0x896144, 0x896144, 0xD7A161, 0xD7A161, 0xF7E3B6, 0xF7E3B6, 0xD7A161, 0xD7A161, 0x896144, 0x896144, 0x896144, 0x896144, 0x6B4C35, 0x6B4C35, 0x624130, 0xB28C55, 0x9A6A45, 0x9A6A45, 0x9A6A45, 0x765835, null],
  [null, 0xA07D4C, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xF7E3B6, 0xF7E3B6, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xA07D4C, 0x7D623B, 0xB28C55, 0xB28C55, 0xB28C55, 0xA87E4C, 0x9A6A45, 0x9A6A45, 0x765835, null],
  [null, 0xA07D4C, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xF7E3B6, 0xF7E3B6, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xA07D4C, 0x7D623B, 0xB28C55, 0xB28C55, 0xB28C55, 0xA87E4C, 0x9A6A45, 0x9A6A45, 0x765835, null],
  [null, 0xA07D4C, 0xE4B36D, 0x4A3528, 0x4A3528, 0xD7A161, 0xD7A161, 0xD7A161, 0xD7A161, 0xD7A161, 0xD7A161, 0x4A3528, 0x4A3528, 0xE4B36D, 0xA07D4C, 0x7D623B, 0xB28C55, 0xB28C55, 0xB28C55, 0x9A6A45, 0x9A6A45, 0x9A6A45, 0x765835, null],
  [null, 0xA07D4C, 0xE4B36D, 0x4A3528, 0x4A3528, 0xD7A161, 0xD7A161, 0xD7A161, 0xD7A161, 0xD7A161, 0xD7A161, 0x4A3528, 0x4A3528, 0xE4B36D, 0xA07D4C, 0x7D623B, 0xB28C55, 0xB28C55, 0xB28C55, 0x9A6A45, 0x9A6A45, 0x9A6A45, 0x765835, null],
  [null, 0xE9CA9E, 0xE9CA9E, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0x4A3528, 0x4A3528, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xE9CA9E, 0xE9CA9E, 0x7F6F56, 0xB69E7B, 0xC1B18E, 0xC1B18E, 0xC1B18E, 0x9A6A45, 0x9A6A45, 0x6C4A30, null],
  [null, 0xE9CA9E, 0xE9CA9E, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0x4A3528, 0x4A3528, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xE9CA9E, 0xE9CA9E, 0x7F6F56, 0xB69E7B, 0xC1B18E, 0xC1B18E, 0xC1B18E, 0x9A6A45, 0x9A6A45, 0x6C4A30, null],
  [null, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0x7F6F56, 0xC1B18E, 0xC1B18E, 0xC1B18E, 0x9A6A45, 0x9A6A45, 0x9A6A45, 0x6C4A30, null],
  [null, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0x7F6F56, 0xC1B18E, 0xC1B18E, 0xC1B18E, 0x9A6A45, 0x9A6A45, 0x9A6A45, 0x6C4A30, null],
  [null, 0xA38D6F, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xA38D6F, 0x7F6F56, 0xB69E7B, 0xB69E7B, 0xB69E7B, 0x81593B, 0x81593B, 0x81593B, 0x6C4A30, null],
  [null, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0x7F6F56, 0x7F6F56, 0x7F6F56, 0x7F6F56, 0x6C4A30, 0x6C4A30, 0x6C4A30, 0x6C4A30, null],
  [null, null, 0xA07D4C, 0xA07D4C, 0xA07D4C, 0xD7A161, 0xD7A161, 0xD7A161, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xD7A161, 0xD7A161, 0x977144, 0x977144, 0xA07D4C, 0xA07D4C, 0x8D6F43, 0x8D6F43, 0x8D6F43, null],
  [null, null, 0xA07D4C, 0xE4B36D, 0xA07D4C, 0xE4B36D, 0xE4B36D, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xE4B36D, 0x977144, 0xD7A161, 0xE4B36D, 0xE4B36D, 0xC99E60, 0xC99E60, 0x8D6F43, null],
  [null, null, 0xE4B36D, 0xE4B36D, 0xA07D4C, 0xE4B36D, 0xE4B36D, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xF7E3B6, 0xE4B36D, 0x977144, 0xD7A161, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, null],
  [null, null, 0xA07D4C, 0xF7E3B6, 0xAD9F7F, 0xD7A161, 0xD7A161, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xE9CA9E, 0xD7A161, 0xA38D6F, 0xE9CA9E, 0xF7E3B6, 0xF7E3B6, 0xD9C8A0, 0xD9C8A0, 0x8D6F43, null],
  [null, null, 0xF7E3B6, 0xAD9F7F, 0xAD9F7F, 0xA07D4C, 0xA07D4C, 0xA07D4C, 0xA07D4C, 0xA07D4C, 0x977144, 0x977144, 0x977144, 0xA07D4C, 0xA07D4C, 0xA07D4C, 0xA38D6F, 0xA38D6F, 0xAD9F7F, 0xAD9F7F, 0x988C70, 0x988C70, 0xF7E3B6, null],
  [null, null, null, null, null, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0x977144, 0x977144, 0xD7A161, 0xE4B36D, 0xE4B36D, 0xE4B36D, 0xBB9359, 0xBB9359, null, null, null, null, null, null],
  [null, null, null, null, null, 0xAD9F7F, 0xAD9F7F, 0xAD9F7F, 0xAD9F7F, 0xAD9F7F, 0xA38D6F, 0xA38D6F, 0xA38D6F, 0xAD9F7F, 0xAD9F7F, 0xAD9F7F, 0xCBBA95, 0xCBBA95, null, null, null, null, null, null],
];

let isDragging = false;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let degree = 0;
let scale = 4;

canvas.addEventListener('mousedown', (event) => {
  isDragging = true;

  const position = toScaledMousePos(event.clientX, event.clientY);
  mouseX = position.x;
  mouseY = position.y;

  canvas.classList.add('dragging');
  requestAnimationFrame();
});

canvas.addEventListener('mousemove', (event) => {
  if (!isDragging) {
    return;
  }

  const position = toScaledMousePos(event.clientX, event.clientY);
  mouseX = position.x;
  mouseY = position.y;

  clampTransform();
  requestAnimationFrame();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.classList.remove('dragging');
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (key === 'q' || event.key === '4') {
    degree -= 1;
  } else if (key === 'e' || event.key === '6') {
    degree += 1;
  } else if (key === '+') {
    scale += 1;
  } else if (key === '-') {
    scale -= 1;
  } else if (key === 'r') {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
    degree = 0;
    scale = 4;
  } else {
    return;
  }

  event.preventDefault();
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;

    if (action === 'rotate-left') {
      degree -= 1;
    }
    else if (action === 'rotate-right') {
      degree += 1;
    }
    else if (action === 'scale-up') {
      scale += 1;
    }
    else if (action === 'scale-down') {
      scale -= 1;
    }
    else if (action === 'reset') {
      mouseX = canvas.width / 2;
      mouseY = canvas.height / 2;
      degree = 0;
      scale = 4;
    }

    canvasWrap.focus();
  });
});

ctx.putImageData(imageData, 0, 0);

function animate() {
  drawRectFilled(0, 0, canvas.width - 1, canvas.height - 1, 255, 255, 255);
  drawSprite24Bit(apygSprite24Bit, mouseX, mouseY, degree, scale, scale);
  ctx.putImageData(imageData, 0, 0);

  document.getElementById('xValue').textContent = Math.round(mouseX);
  document.getElementById('yValue').textContent = Math.round(mouseY);
  document.getElementById('rotationValue').textContent = degree + '°';
  document.getElementById('scaleValue').textContent = scale.toFixed(2);
  requestAnimationFrame(animate);
}

animate();
requestAnimationFrame();

const menuButton = document.getElementById('menuButton');
const navigation = document.getElementById('navigation');

menuButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navigation.classList.remove('open'));
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
