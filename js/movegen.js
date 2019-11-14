/*
-FROM SQUARE
-TO SQUARE

-CAPTURED
-PROMOTION
-IN YOU HAND?

                          F    8
0000 0000 0000 0000 0000 1111 1000

*/

var MvvLvaValue = [0, 100, 430, 450, 640, 690, 890, 1040, 1200, 100, 430, 450, 640, 690, 890, 1040, 1200];
var MvvLvaScores = new Array(18 * 18);

function InitMvvLva() {
  var Attacker;
  var Victim;

  for (Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
    for (Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
      MvvLvaScores[Victim * 18 + Attacker] = MvvLvaValue[Victim] + 8 - MvvLvaValue[Attacker] / 100;
    }
  }
}

function MoveExists(move) {
  GenerateMoves();
  var index;
  var moveFound = NOMOVE;
  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    moveFound = GameBoard.moveList[index];
    if (MakeMove(moveFound) == BOOL.FALSE) {
      continue;
    }
    TakeMove();
    if (move == moveFound) {
      return BOOL.TRUE;
    }
  }

  return BOOL.FALSE;
}

function MOVE(from, to, captured, promoted, flag) {
  return from | (to << 7) | (captured << 14) | (promoted << 20) | flag;
}

function AddCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]++] =
    MvvLvaScores[CAPTURED(move) * 14 + GameBoard.pieces[FROMSQ(move)]] + 1000000;
}
function AddQuietMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;

  if (move == GameBoard.searchKillers[GameBoard.ply]) {
    GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
  } else if (move == GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
    GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
  } else {
    GameBoard.moveScore[GameBoard.moveListStart[GameBoard.ply + 1]] =
      GameBoard.searchHistory[GameBoard.pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)];
  }

  GameBoard.moveListStart[GameBoard.ply + 1]++;
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
      if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq + 11]] == RANKED_PLAYER.HIGHER) {
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
      if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq - 11]] == RANKED_PLAYER.LOWER) {
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

function GenerateCapture() {
  GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

  var pieceType, pieceNum, sq, pieceIndex, piece, t_sq, dir;

  if (GameBoard.side == RANKED_PLAYER.LOWER) {
    pieceType = PIECES.gP;

    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq + 11]] == RANKED_PLAYER.HIGHER) {
        AddCaptureMove(MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.EMPTY, 0));
      }
    }
  } else {
    pieceType = PIECES.oP;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq - 11]] == RANKED_PLAYER.LOWER) {
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
          t_sq += dir;
        }
      }
    }
    piece = LoopSlidePiece[pieceIndex++];
  }
}
