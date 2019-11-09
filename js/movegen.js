/*
-FROM SQUARE
-TO SQUARE

-CAPTURED
-PROMOTION
-IN YOU HAND?

                          F    8
0000 0000 0000 0000 0000 1111 1000



*/

function MOVE(from, to, captured, promoted, flag) {
  return from | (to << 7) | (captured << 14) | (promoted << 20) | flag;
}

function AddCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}
function AddQuietMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

// add function promotion :)

function GenerateMoves() {
  GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

  var pieceType, pieceNum, sq, pieceIndex, piece, t_sq, dir;

  if (GameBoard.side == RANKED_PLAYER.LOWER) {
    pieceType = PIECES.gP;

    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq + 11) == BOOL.FALSE && GameBoard.pieces[sq + 11] == PIECES.EMPTY) {
        AddQuietMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, 0));
      }
      if (
        SQOFFBOARD(sq + 11) == BOOL.FALSE &&
        PiecePlayer[GameBoard.pieces[sq + 11]] == RANKED_PLAYER.HIGHER
      ) {
        AddCaptureMove(MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.EMPTY, 0));
      }
    }
  } else {
    pieceType = PIECES.oP;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq - 11) == BOOL.FALSE && GameBoard.pieces[sq - 11] == PIECES.EMPTY) {
        AddQuietMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, 0));
      }
      if (
        SQOFFBOARD(sq - 11) == BOOL.FALSE &&
        PiecePlayer[GameBoard.pieces[sq - 11]] == RANKED_PLAYER.LOWER
      ) {
        AddCaptureMove(MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.EMPTY, 0));
      }
    }
  }

  pieceIndex = LoopNonSlideIndex[GameBoard.side];
  piece = LoopNonSlidePiece[pieceIndex++];

  while (piece != 0) {
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
      sq = GameBoard.pList[PIECEINDEX(piece, pieceNum)];

      for (index = 0; index < DirNum[piece]; index++) {
        dir = PieceDir[piece][index];
        GameBoard.side == RANKED_PLAYER.LOWER ? (t_sq = sq + dir) : (t_sq = sq - dir);

        if (SQOFFBOARD(t_sq) == BOOL.TRUE) {
          continue;
        }

        if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
          if (PiecePlayer[GameBoard.pieces[t_sq]] != GameBoard.side) {
            AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
          }
        } else {
          AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
        }
      }
    }
    piece = LoopNonSlidePiece[pieceIndex++];
  }

  pieceIndex = LoopSlideIndex[GameBoard.side];
  piece = LoopSlidePiece[pieceIndex++];

  while (piece != 0) {
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
      sq = GameBoard.pList[PIECEINDEX(piece, pieceNum)];

      for (index = 0; index < DirNum[piece]; index++) {
        dir = PieceDir[piece][index];
        GameBoard.side == RANKED_PLAYER.LOWER ? (t_sq = sq + dir) : (t_sq = sq - dir);
        t_sq = sq + dir;
        while (SQOFFBOARD(t_sq) == BOOL.FALSE) {
          if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
            if (PiecePlayer[GameBoard.pieces[t_sq]] != GameBoard.side) {
              AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
            }
            break;
          }
          AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
          t_sq += dir;
        }
      }
    }
    piece = LoopSlidePiece[pieceIndex++];
  }
}
