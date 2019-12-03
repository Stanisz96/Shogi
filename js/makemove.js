function ClearPiece(sq) {
  let piece = GameBoard.pieces[sq];
  let sidePiece = PiecePlayer[piece];
  let index;
  let t_pieceNum = -1;

  HASH_PIECE(piece, sq);
  GameBoard.pieces[sq] = PIECES.EMPTY;
  GameBoard.material[sidePiece] -= PieceVal[piece];

  for (index = 0; index < GameBoard.pieceNum[piece]; ++index) {
    if (GameBoard.pieceList[PIECEINDEX(piece, index)] == sq) {
      t_pieceNum = index;
      break;
    }
  }
  GameBoard.pieceNum[piece]--;
  GameBoard.pieceList[PIECEINDEX(piece, t_pieceNum)] = GameBoard.pieceList[PIECEINDEX(piece, GameBoard.pieceNum[piece])];
  //console.log("Clear: " + GameBoard.pieceList[PIECEINDEX(piece, GameBoard.pieceNum[piece])]);
}

function AddPiece(sq, piece) {
  let sidePiece = PiecePlayer[piece];
  HASH_PIECE(piece, sq);
  //GameBoard.promoted[sq] = prom;
  GameBoard.pieces[sq] = piece;
  GameBoard.material[sidePiece] += PieceVal[piece];
  //console.log("AdPiece: " + sq);
  GameBoard.pieceList[PIECEINDEX(piece, GameBoard.pieceNum[piece])] = sq;
  GameBoard.pieceNum[piece]++;
}

function MovePiece(from, to) {
  let index = 0;
  let piece = GameBoard.pieces[from];
  HASH_PIECE(piece, from);
  GameBoard.pieces[from] = PIECES.EMPTY;
  //console.log("hashPieceFrom: " + GameBoard.posKey.toString(16));
  HASH_PIECE(piece, to);
  GameBoard.pieces[to] = piece;
  //console.log("hashPieceTo: " + GameBoard.posKey.toString(16));
  for (index = 0; index < GameBoard.pieceNum[piece]; ++index) {
    if (GameBoard.pieceList[PIECEINDEX(piece, index)] == from) {
      GameBoard.pieceList[PIECEINDEX(piece, index)] = to;
      //console.log("Moved " + from + " to " + to);
      break;
    }
  }
}

function MakeMove(move) {
  let from = FROMSQ(move);
  let to = TOSQ(move);
  let side = GameBoard.side;
  GameBoard.history[GameBoard.hisPlay].posKey = GameBoard.posKey;
  GameBoard.history[GameBoard.hisPlay].move = move;

  let captured = CAPTURED(move);
  if (captured != PIECES.EMPTY) {
    ClearPiece(to);
  }
  GameBoard.hisPlay++;
  GameBoard.ply++;

  MovePiece(from, to);

  let awakening = (move & MFLAG_AWA) >> 19;
  let promoted_piece = PROMOTION[GameBoard.pieces[to]];
  if (awakening == BOOL.TRUE) {
    console.log("LETS PROMOTE!");
    console.log(from + " <-from to-> " + to);
    ClearPiece(to);
    AddPiece(to, promoted_piece);
    //UpdateListMaterial();
  }
  // if (awakening != BOOL.FALSE) {
  //   ClearPiece(to);
  //   AddPiece(to, PROMOTED_PIECES[piece], BOOL.TRUE);
  // }

  GameBoard.side ^= 1;
  HASH_SIDE();
  //console.log("hashSide: " + GameBoard.posKey.toString(16));
  // if there is a check
  //console.log("kings sq: " + GameBoard.pieceList[PIECEINDEX(Kings[side], 0)] + " PC" + PIECEINDEX(Kings[side], 0));
  //console.log(SqAttacked(64, GameBoard.side));
  if (SqAttacked(GameBoard.pieceList[PIECEINDEX(Kings[side], 0)], GameBoard.side)) {
    TakeMove();
    return BOOL.FALSE;
  }
  return BOOL.TRUE;
}

function TakeMove() {
  GameBoard.hisPlay--;
  GameBoard.ply--;

  let move = GameBoard.history[GameBoard.hisPlay].move;
  let from = FROMSQ(move);
  let to = TOSQ(move);
  let awakeing = (move & MFLAG_AWA) >> 19;
  GameBoard.side ^= 1;
  HASH_SIDE();
  var degraded_pieces = DEGRADATION[GameBoard.pieces[to]];
  if (awakeing == BOOL.TRUE) {
    ClearPiece(to);
    AddPiece(to, degraded_pieces);
  }
  MovePiece(to, from);
  let captured = CAPTURED(move);
  if (captured != PIECES.EMPTY) {
    AddPiece(to, captured);
  }

  // if (PROMOTED(move) != PIECES.EMPTY) {
  //   ClearPiece(from);
  //   AddPiece(from, PIECES[PROMOTED(move)], (move & MFLAG_AWA) >> 19);
  // }
}
