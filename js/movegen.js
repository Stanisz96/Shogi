/*
-FROM SQUARE
-TO SQUARE

-CAPTURED
-PROMOTION
-IN YOU HAND?

                          F    8
0000 0000 0000 0000 0000 1111 1000

*/
// prettier-ignore
var MvvLvaValue = [0, 100, 430, 450, 640, 690, 890, 1040, 2000, 420, 630, 640, 670, 1150, 1300, 100, 430, 450, 640, 690, 890, 1040, 2000,420, 630, 640, 670, 1150, 1300];
var MvvLvaScores = new Array(30 * 30);

function InitMvvLva() {
  //console.log("lol");
  let Attacker;
  let Victim;

  for (Attacker = PIECES.gP; Attacker <= PIECES.oRa; ++Attacker) {
    for (Victim = PIECES.gP; Victim <= PIECES.oRa; ++Victim) {
      MvvLvaScores[Victim * 30 + Attacker] = MvvLvaValue[Victim] + 8 - MvvLvaValue[Attacker] / 100;
    }
  }
}

function MoveExists(move) {
  GenerateMoves();
  let index;
  let moveFound = NOMOVE;
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

function AddPromotionMove(from, to, cap) {
  if (GameBoard.side == RANKED_PLAYER.LOWER && to > 88) {
    if ([1, 2, 3, 4, 6, 7].includes(GameBoard.pieces[from])) {
      if (cap != PIECES.EMPTY) {
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, MFLAG_AWA));
      } else {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA));
      }
    }
  } else if (GameBoard.side == RANKED_PLAYER.HIGHER && to < 55) {
    if ([15, 16, 17, 18, 20, 21].includes(GameBoard.pieces[from])) {
      if (cap != PIECES.EMPTY) {
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, MFLAG_AWA));
      } else {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA));
      }
    }
  }
}

/*
function AddPromotionMove(from, to, cap) {
  let is_promoted = BOOL.FALSE;
  var index = 0;
  //console.log(GameBoard.pieceNum[GameBoard.pieces[from]]);
  for (index = 0; index < GameBoard.pieceNum[GameBoard.pieces[from]]; ++index) {
    if (GameBoard.pieceList[PIECEINDEX(GameBoard.pieces[from], index)] == from) {
      is_promoted = GameBoard.promotedList[PIECEINDEX(GameBoard.pieces[from], index)];
      break;
    }
  }
  if (is_promoted != BOOL.TRUE) {
    if (
      GameBoard.side == RANKED_PLAYER.LOWER &&
      to > 88 &&
      GameBoard.pieces[from] != PIECES.gK &&
      GameBoard.pieces[from] != PIECES.gG
    ) {
      if (cap != PIECES.EMPTY) {
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, MFLAG_AWA));
      } else {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA));
      }
    }
    if (
      GameBoard.side == RANKED_PLAYER.HIGHER &&
      to < 55 &&
      GameBoard.pieces[from] != PIECES.oK &&
      GameBoard.pieces[from] != PIECES.oG
    ) {
      if (cap != PIECES.EMPTY) {
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, MFLAG_AWA));
      } else {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA));
      }
    }
  }
}
*/
function GenerateMoves() {
  GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

  let pieceType, pieceNum, sq, pieceIndex, piece, t_sq, dir;

  if (GameBoard.side == RANKED_PLAYER.LOWER) {
    pieceType = PIECES.gP;

    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq + 11) == BOOL.FALSE && GameBoard.pieces[sq + 11] == PIECES.EMPTY) {
        AddQuietMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, 0));
        AddPromotionMove(sq, sq + 11, PIECES.EMPTY);
      }
      if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq + 11]] == RANKED_PLAYER.HIGHER) {
        AddCaptureMove(MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.EMPTY, 0));
        AddPromotionMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
      }
    }
  } else {
    pieceType = PIECES.oP;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq - 11) == BOOL.FALSE && GameBoard.pieces[sq - 11] == PIECES.EMPTY) {
        AddQuietMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, 0));
        AddPromotionMove(sq, sq - 11, PIECES.EMPTY);
      }
      if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq - 11]] == RANKED_PLAYER.LOWER) {
        AddCaptureMove(MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.EMPTY, 0));
        AddPromotionMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
      }
    }
  }

  pieceIndex = LoopNonSlideIndex[GameBoard.side];
  piece = LoopNonSlidePiece[pieceIndex++];

  while (piece != 0) {
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
      sq = GameBoard.pieceList[PIECEINDEX(piece, pieceNum)];

      for (index = 0; index < DirNum[piece]; index++) {
        if (piece == PIECES.gRa || piece == PIECES.oRa) {
          if (RookProSlide[index] != 0) continue;
        }
        if (piece == PIECES.gBa || piece == PIECES.oBa) {
          if (BishopProSlide[index] != 0) continue;
        }
        dir = PieceDir[piece][index];
        GameBoard.side == RANKED_PLAYER.LOWER ? (t_sq = sq + dir) : (t_sq = sq - dir);

        if (SQOFFBOARD(t_sq) == BOOL.TRUE) {
          continue;
        }

        if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
          if (PiecePlayer[GameBoard.pieces[t_sq]] != GameBoard.side) {
            AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
            AddPromotionMove(sq, t_sq, GameBoard.pieces[t_sq]);
          }
        } else {
          AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
          AddPromotionMove(sq, t_sq, PIECES.EMPTY);
        }
      }
    }
    piece = LoopNonSlidePiece[pieceIndex++];
  }

  pieceIndex = LoopSlideIndex[GameBoard.side];
  piece = LoopSlidePiece[pieceIndex++];

  while (piece != 0) {
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
      sq = GameBoard.pieceList[PIECEINDEX(piece, pieceNum)];

      for (index = 0; index < DirNum[piece]; index++) {
        if (piece == PIECES.gRa || piece == PIECES.oRa) {
          if (RookProSlide[index] == 0) continue;
        }
        if (piece == PIECES.gBa || piece == PIECES.oBa) {
          if (BishopProSlide[index] == 0) continue;
        }
        dir = PieceDir[piece][index];
        GameBoard.side == RANKED_PLAYER.LOWER ? (t_sq = sq + dir) : (t_sq = sq - dir);
        t_sq = sq + dir;
        while (SQOFFBOARD(t_sq) == BOOL.FALSE) {
          if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
            if (PiecePlayer[GameBoard.pieces[t_sq]] != GameBoard.side) {
              AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
              AddPromotionMove(sq, t_sq, GameBoard.pieces[t_sq]);
            }
            break;
          }
          AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
          AddPromotionMove(sq, t_sq, PIECES.EMPTY);
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
      sq = GameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq + 11]] == RANKED_PLAYER.HIGHER) {
        AddCaptureMove(MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.EMPTY, 0));
        AddPromotionMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
      }
    }
  } else {
    pieceType = PIECES.oP;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; ++pieceNum) {
      sq = GameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

      if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PiecePlayer[GameBoard.pieces[sq - 11]] == RANKED_PLAYER.LOWER) {
        AddCaptureMove(MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.EMPTY, 0));
        AddPromotionMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
      }
    }
  }

  pieceIndex = LoopNonSlideIndex[GameBoard.side];
  piece = LoopNonSlidePiece[pieceIndex++];

  while (piece != 0) {
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; ++pieceNum) {
      sq = GameBoard.pieceList[PIECEINDEX(piece, pieceNum)];

      for (index = 0; index < DirNum[piece]; index++) {
        dir = PieceDir[piece][index];
        GameBoard.side == RANKED_PLAYER.LOWER ? (t_sq = sq + dir) : (t_sq = sq - dir);

        if (SQOFFBOARD(t_sq) == BOOL.TRUE) {
          continue;
        }

        if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
          if (PiecePlayer[GameBoard.pieces[t_sq]] != GameBoard.side) {
            AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
            AddPromotionMove(sq, t_sq, GameBoard.pieces[t_sq]);
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
      sq = GameBoard.pieceList[PIECEINDEX(piece, pieceNum)];

      for (index = 0; index < DirNum[piece]; index++) {
        dir = PieceDir[piece][index];
        GameBoard.side == RANKED_PLAYER.LOWER ? (t_sq = sq + dir) : (t_sq = sq - dir);
        t_sq = sq + dir;
        while (SQOFFBOARD(t_sq) == BOOL.FALSE) {
          if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
            if (PiecePlayer[GameBoard.pieces[t_sq]] != GameBoard.side) {
              AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
              AddPromotionMove(sq, t_sq, GameBoard.pieces[t_sq]);
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
