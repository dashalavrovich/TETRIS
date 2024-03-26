export default class Game {
  score = 0;
  lines = 0;
  level = 0;
  playfield = this.createPlayField();
  activePiece = {
    x: 0,
    y: 0,
    get blocks() {
      return this.rotations[this.rotationIndex];
    },
    blocks: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    //  rotationIndex: 0,
    //  rotations: [
    //    [
    //      [0, 1, 0],
    //      [1, 1, 1],
    //      [0, 0, 0],
    //    ],
    //    [
    //      [0, 1, 0],
    //      [0, 1, 1],
    //      [0, 1, 0],
    //    ],
    //    [
    //      [0, 0, 0],
    //      [1, 1, 1],
    //      [0, 1, 0],
    //    ],
    //    [
    //      [0, 1, 0],
    //      [1, 1, 0],
    //      [0, 1, 0],
    //    ],
    //  ],
  };


  // возвращаем состояние
  getState() {
    const playfield = this.createPlayField();
	 const { y: pieceY, x: pieceX, blocks } = this.activePiece;

    for (let y = 0; y < this.playfield.length; y++) {
      playfield[y] = [];

      for (let x = 0; x < this.playfield[y].length; x++) {
        playfield[y][x] = this.playfield[y][x];
      }
    }

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          playfield[pieceY + y][pieceX + x] =
            blocks[y][x];
        }
      }
    }
    return { playfield };
  }

  createPlayField() {
    const playfield = [];

    for (let y = 0; y < 20; y++) {
      playfield[y] = [];

      for (let x = 0; x < 10; x++) {
        playfield[y][x] = 0;
      }
    }

    return playfield;
  }

  // двигаем фигуру влево
  movePieceLeft() {
    this.activePiece.x -= 1;

    if (this.hasCollision()) {
      this.activePiece.x += 1;
    }
  }
  // двигаем фигуру вправо
  movePieceRight() {
    this.activePiece.x += 1;

    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    }
  }
  // двигаем фигуру вниз
  movePieceDown() {
    this.activePiece.y += 1;

    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
    }
  }

  // поворачиваем фигуру
  rotatePiece() {
    // №1 способ поворота фигуры (нерабочий)
    // либо так:
    //  this.activePiece.rotationIndex = (this.activePiece.rotationIndex + 1) % 4;
    // либо так:
    //  if (this.activePiece.rotationIndex === 3) {
    //    this.activePiece.rotationIndex = 0;
    //  } else {
    //    this.activePiece.rotationIndex += 1;
    //  }

    //  this.activePiece.rotationIndex =
    //    this.activePiece.rotationIndex < 3
    //      ? this.activePiece.rotationIndex + 1
    //      : 0;

    // 	  console.log(this.hasCollision());
    //  if (this.hasCollision()) {
    //    this.activePiece.rotationIndex =
    //      this.activePiece.rotationIndex > 0
    //        ? this.activePiece.rotationIndex - 1
    //        : 3;
    //  }
    //  return this.activePiece.blocks;

    //  №2 способ поворота фигуры (рабочий)
    const blocks = this.activePiece.blocks;
    const length = blocks.length;

    const temp = [];
    for (let i = 0; i < length; i++) {
      temp[i] = new Array(length).fill(0);
    }

    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        temp[x][y] = blocks[length - 1 - y][x];
      }
    }

    this.activePiece.blocks = temp;

    if (this.hasCollision()) {
      this.activePiece.blocks = blocks;
    }

    // №3 способ поворота фигуры (недоделанный)
    //  const blocks = this.activePiece.blocks;
    //  const length = blocks.length;

    //  const x = Math.floor(length / 2);
    //  const y = length - 1;

    //  for (let i = 0; i < x; i++) {
    //    for (let j = i; j < y - i; j++) {
    // 		const temp=blocks[i][j]
    // 	}
    //  }
  }

  // проверка на столкновение
  hasCollision() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          (this.playfield[pieceY + y] === undefined ||
            this.playfield[pieceY + y][pieceX + x] === undefined ||
            this.playfield[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // фиксируем изменения
  lockPiece() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }
}
