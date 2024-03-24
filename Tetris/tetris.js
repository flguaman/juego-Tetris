document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');
  
  // Aumenta la escala del lienzo para que la visualización sea más clara
  context.scale(20, 20);

  // Crear una pieza en base al tipo
  function createPiece(type) {
    // Matriz para cada tipo de pieza
    if (type === 'T') {
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ];
    } else if (type === 'O') {
      return [
        [2, 2],
        [2, 2]
      ];
    } else if (type === 'L') {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3]
      ];
    } else if (type === 'J') {
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0]
      ];
    } else if (type === 'I') {
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0]
      ];
    } else if (type === 'S') {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0]
      ];
    } else if (type === 'Z') {
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
      ];
    }
  }

  // Dibujar la matriz en el lienzo
  function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = 'cyan';
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }

  // Dibujar el juego en el lienzo
  function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(player.matrix, player.pos);
  }

  // Fusionar la pieza actual con la arena de juego
  function merge() {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }


  // Dibujar la matriz en el lienzo
  function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = 'cyan';
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }
  // Dibujar el juego en el lienzo
  function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
  }

  // Fusionar la pieza actual con la arena de juego
  function merge() {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  // Comprobar si la pieza colisiona con la arena de juego
  function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
            (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  // Mover la pieza hacia abajo de manera suave
  function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
      player.pos.y--;
      merge();
      playerReset();
      arenaSweep();
    }
    dropCounter = 0;
  }

  // Mover la pieza en horizontal
  function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
      player.pos.x -= dir;
    }
  }

  // Reiniciar la posición y matriz de la pieza
  function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
      arena.forEach(row => row.fill(0));
    }
  }

  // Rotar la pieza
  function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
      player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player.matrix[0].length) {
        rotate(player.matrix, -dir);
        player.pos.x = pos;
        return;
      }
    }
  }

  // Rotar la matriz en un sentido determinado
  function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
          matrix[y][x],
          matrix[x][y],
        ];
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  // Eliminar las líneas completadas en la arena de juego
  function arenaSweep() {
    outer: for (let y = arena.length - 1; y > 0; --y) {
      for (let x = 0; x < arena[y].length; ++x) {
        if (arena[y][x] === 0) {
          continue outer;
        }
      }
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      ++y;
    }
  }

  // Crear la arena de juego como una matriz vacía
  function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }

  // Representación de colores para cada número en la matriz
  const colors = [
    null,
    'purple',
    'yellow',
    'orange',
    'blue',
    'aqua',
    'green',
    'red'
  ];

  // Controlar las teclas presionadas para mover y rotar la pieza
  document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
      playerMove(-1); // mover hacia la izquierda
    } else if (event.keyCode === 39) {
      playerMove(1); // mover hacia la derecha
    } else if (event.keyCode === 40) {
      playerDrop(); // caída suave
    } else if (event.keyCode === 81) {
      playerRotate(-1); // rotar en sentido antihorario (Q)
    } else if (event.keyCode === 87) {
      playerRotate(1); // rotar en sentido horario (W)
    }
  });

  // Variable para controlar el tiempo de caída de las piezas
  let dropCounter = 0;
  let dropInterval = 1000; // 1 segundo

  // Actualizar el juego en cada fotograma
  let lastTime = 0;
  function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      playerDrop(); // Hacer que la pieza caiga gradualmente
    }

    draw();
    requestAnimationFrame(update);
  }

  // Crear una matriz de la arena de juego
  const arena = createMatrix(12, 20);

  // Estado del jugador (posición y matriz de la pieza actual)
  const player = {
    pos: { x: 0, y: 0 },
    matrix: null
  };

  playerReset();
  update();
});