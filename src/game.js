export default class Game {
  static points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };
  score = 0;
  lines = 19;
  playfield = this.createPlayField();
  activePiece = this.createPiece();
  nextPiece = this.createPiece();

  get level() {
    return Math.floor(this.lines * 0.1);
  }
  // activePiece =  {
  //  x: 0,
  //  y: 0,
  //  get blocks() {
  //    return this.rotations[this.rotationIndex];
  //  },
  //  blocks: [
  //    [0, 1, 0],
  //    [1, 1, 1],
  //    [0, 0, 0],
  //  ],
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
  //   };

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
          playfield[pieceY + y][pieceX + x] = blocks[y][x];
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

  // получаем и создаем случайный тип фигуры
  createPiece() {
    const index = Math.floor(Math.random() * 7);
    const type = "IJLOSTZ"[index];
    const piece = {};

    // в зависимости от кейса будет меняться массив который мы будем хранить в свойстве blocks у объекта
    switch (type) {
      case "I":
        piece.blocks = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        break;
      case "J":
        piece.blocks = [
          [0, 0, 0],
          [2, 2, 2],
          [0, 0, 2],
        ];
        break;
      case "L":
        piece.blocks = [
          [0, 0, 0],
          [3, 3, 3],
          [3, 0, 0],
        ];
        break;
      case "O":
        piece.blocks = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0],
        ];
        break;
      case "S":
        piece.blocks = [
          [0, 0, 0],
          [0, 5, 5],
          [5, 5, 0],
        ];
        break;
      case "T":
        piece.blocks = [
          [0, 0, 0],
          [6, 6, 6],
          [0, 6, 0],
        ];
        break;
      case "Z":
        piece.blocks = [
          [0, 0, 0],
          [7, 7, 0],
          [0, 7, 7],
        ];
        break;
      default:
        throw new Error("Неизвестный тип фигуры");
    }

    piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
    piece.y = -1;

    return piece;
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
      const clearedLines = this.clearLines();
      this.updateScore(clearedLines);
      this.updatePieces();
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

  // удалять линии
  clearLines() {
    const rows = 20;
    const columns = 10;
    let lines = [];

    for (let y = rows - 1; y >= 0; y--) {
      let numberOfBlocks = 0;

      for (let x = 0; x < columns; x++) {
        if (this.playfield[y][x]) numberOfBlocks += 1;
      }

      if (numberOfBlocks === 0) {
        break;
      } else if (numberOfBlocks < columns) {
        continue;
      } else if (numberOfBlocks === columns) {
        lines.unshift(y);
      }
    }

    for (let index of lines) {
      this.playfield.splice(index, 1);
      this.playfield.unshift(new Array(columns).fill(0));
    }

    return lines.length;
  }

  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines; // изменяем кол-во собранных линий
    }
  }

  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }
}
