function ClearePiece(sq) {
  var piece = GameBoard.pieces[sq];
  var sidePiece = PiecePlayer[piece];
  var index;
  var t_pieceNum = -1;

  HASH_PIECE(piece, sq);
  GameBoard.pieces[sq] = PIECES.EMPTY;
  GameBoard.material[sidePiece] -= PieceVal[piece];

  for (index = 0; index < GameBoard.pieceNum[piece]; ++index) {
    if (GameBoard.pList[PIECEINDEX(piece, index)] == sq) {
      t_pieceNum = index;
      break;
    }
  }
  GameBoard.pieceNum[piece]--;
  GameBoard.pList[PIECEINDEX(piece, t_pieceNum)] = GameBoard.pList[PIECEINDEX(piece, GameBoard.pieceNum[piece])];
}

function AddPiece(sq, piece) {
  var sidePiece = PiecePlayer[piece];
  HASH_PIECE(piece, sq);
  GameBoard.pieces[sq] = piece;
  GameBoard.material[sidePiece] += PieceVal[piece];
  GameBoard.pList[PIECEINDEX(piece, GameBoard.pieceNum[piece])] = sq;
  GameBoard.pieceNum[piece]++;
}

function MovePiece(from, to) {
  var index = 0;
  var piece = GameBoard.pieces[from];
  HASH_PIECE(piece, from);
  GameBoard.pieces[from] = PIECES.EMPTY;
  console.log("hashPieceFrom: " + GameBoard.posKey.toString(16));
  HASH_PIECE(piece, to);
  GameBoard.pieces[to] = piece;
  console.log("hashPieceTo: " + GameBoard.posKey.toString(16));
  for (index = 0; index < GameBoard.pieceNum[piece]; ++index) {
    if (GameBoard.pList[PIECEINDEX(piece, index)] == from) {
      GameBoard.pList[PIECEINDEX(piece, index)] = to;
      break;
    }
  }
}

function MakeMove(move) {
  var from = FROMSQ(move);
  var to = TOSQ(move);
  var side = GameBoard.side;
  var captured = CAPTURED(move);
  console.log("Before move: " + GameBoard.posKey.toString(16));
  GameBoard.history[GameBoard.hisPlay].posKey = GameBoard.posKey;
  GameBoard.history[GameBoard.hisPlay].move = move;
  if (captured != PIECES.EMPTY) {
    ClearePiece(to);
  }
  GameBoard.hisPlay++;
  GameBoard.ply++;

  MovePiece(from, to);

  //promotion

  GameBoard.side ^= 1;
  HASH_SIDE();
  console.log("hashSide: " + GameBoard.posKey.toString(16));
  // if there is a check
  if (SqAttacked(GameBoard.pList[PIECEINDEX(Kings[side], 0)], GameBoard.side)) {
    return BOOL.FALSE;
  }
  return BOOL.TRUE;
}

function TakeMove() {
  GameBoard.hisPlay--;
  GameBoard.ply--;

  var move = GameBoard.history[GameBoard.hisPlay].move;
  var from = FROMSQ(move);
  var to = TOSQ(move);

  GameBoard.side ^= 1;
  HASH_SIDE();

  MovePiece(to, from);
  var captured = CAPTURED(move);
  if (captured != PIECES.EMPTY) {
    AddPiece(to, captured);
  }
}
