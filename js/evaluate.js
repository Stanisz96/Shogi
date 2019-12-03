// add position table for all pieces to encourage AI

// prettier-ignore
var KingTable = [5, 5, 5, 5, 5, 5, 5, 5, 5,
   0, 0, 0, 0, 0, 0, 0, 0, 0,
  -5, -5, -5, -5, -5, -5, -5, -5, -5,
  -10, -10, -10, -10, -10, -10, -10, -10, -10,
  -10, -10, -10, -10, -10, -10, -10, -10, -10,
  -10, -10, -10, -10, -10, -10, -10, -10, -10,
  -10, -10, -10, -10, -10, -10, -10, -10, -10,
  -10, -10, -10, -10, -10, -10, -10, -10, -10,
  -10, -10, -10, -10, -10, -10, -10, -10, -10,]

function EvalPosition() {
  var score = GameBoard.material[RANKED_PLAYER.LOWER] - GameBoard.material[RANKED_PLAYER.HIGHER];

  var piece, sq, pieceNum;
  piece = PIECES.gK;
  // for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
  //   sq = GameBoard.pieceList[PIECEINDEX(piece, pieceNum)];
  //   score += KingTable[SQ81(sq)];
  // }
  // piece = PIECES.oK;
  // for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
  //   sq = GameBoard.pieceList[PIECEINDEX(piece, pieceNum)];
  //   score -= KingTable[SQ81(sq)];
  // }

  if (GameBoard.side == RANKED_PLAYER.LOWER) {
    return score;
  } else {
    return -score;
  }
}
