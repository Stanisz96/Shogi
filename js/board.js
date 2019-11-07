function pieceIndex(piece, pieceNum) {
  return piece * 10 + pieceNum;
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = RANKED_PLAYER.LOWER;
//GameBoard.fiftyMove = 0; // for chess -> if 50 moves done without  == draw (shogi dont have this)
GameBoard.hisPlay = 0; // count every move which has been made from the start
GameBoard.ply = 0; // nr half moves made in search tree
//GameBoard.castePerm = 0; // for chess, in shogi there is no castling
GameBoard.material = new Array(2); // Higher and lower player material of pieces
GameBoard.pieceNum = new Array(17); // Number of pieces we have
GameBoard.pList = new Array(18 * 10);
GameBoard.posKey = 0; // unice number represents position on the board

GameBoard.moveList = new Array(MAXDEPH * MAXPOSITIONMOVES);
GameBoard.moveScore = new Array(MAXDEPH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPH);

function GeneratePosKey() {
  var sq = 0;
  var finalKey = 0;
  var piece = PIECES.EMPTY;

  for (sq = 0; sq < BRD_SQ_NUM; ++sq) {
    piece = GameBoard.pieces[sq];
    if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
      finalKey ^= PieceKeys[piece * 142 + sq];
    }
  }
  if (GameBoard.side == RANKED_PLAYER.LOWER) {
    finalKey ^= SideKey;
  }

  return finalKey;
}

function ResetBoard() {
  var index = 0;

  for (index = 0; index < BRD_SQ_NUM; ++index) {
    GameBoard.pieces[index] = PIECES.OFFBOARD;
  }
  for (index = 0; index < 81; ++index) {
    GameBoard.pieces[SQ142(index)] = PIECES.EMPTY;
  }
  for (index = 0; index < 18 * 142; ++index) {
    GameBoard.pList[index] = PIECES.EMPTY;
  }
  for (index = 0; index < 2; ++index) {
    GameBoard.material[index] = 0;
  }
  for (index = 0; index < 17; ++index) {
    GameBoard.pieceNum[index] = 0;
  }

  GameBoard.RANKED_PLAYER = RANKED_PLAYER.BOTH;
  GameBoard.ply = 0;
  GameBoard.hisPlay = 0;
  GameBoard.posKey = 0;
  GameBoard.moveListStart[GameBoard.ply] = 0;
}

function ParseFen(fen) {
  ResetBoard();
}
