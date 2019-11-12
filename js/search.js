var SearchController = {};

SearchController.nodes; //Number of positions that program visits during the search - includeing noneleafs nodes
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function PickNextMove(moveNum) {
  var index = 0;
  var bestScore = -1;
  var bestNum = moveNum;

  for (index = moveNum; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    if (GameBoard.moveScore[index] > bestScore) {
      bestScore = GameBoard.moveScore[index];
      bestNum = index;
    }
  }
  if (bestNum != moveNum) {
    var temp = 0;
    temp = GameBoard.moveScore[moveNum];
    GameBoard.moveScore[moveNum] = GameBoard.moveScore[bestNum];
    GameBoard.moveScore[bestNum] = temp;

    temp = GameBoard.moveList[moveNum];
    GameBoard.moveList[moveNum] = GameBoard.moveList[bestNum];
    GameBoard.moveList[bestNum] = temp;
  }
}

function ClearPvTable() {
  for (index = 0; index < PVENTRIES; index++) {
    GameBoard.pvTable[index].move = NOMOVE;
    GameBoard.pvTable[index].posKey = 0;
  }
}

function CheckUp() {
  if ($.now() - SearchController.start > SearchController.time) {
    SearchController.stop = BOOL.TRUE;
  }
}

/*
function IsRepetition() {
  var index = 0;

  for(index=GameBoard.hisPlay-GameBoard.)
}*/

function Quiescence(alpha, beta) {
  if ((SearchController.nodes & 2047) == 0) {
    CheckUp();
  }
  SearchController.nodes++;

  // Check Repetitions()
  if (GameBoard.ply > MAXDEPH - 1) {
    return EvalPosition();
  }

  var Score = EvalPosition();

  if (Score >= beta) {
    return beta;
  }

  if (Score > alpha) {
    alpha = Score;
  }

  GenerateCapture();

  var MoveNum = 0;
  var Legal = 0;
  var OldAlpha = alpha;
  var BestMove = NOMOVE;
  var Move = NOMOVE;

  // get PvMove
  // order PvMove

  for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];
    if (MakeMove(Move) == BOOL.FALSE) {
      continue;
    }
    Legal++;
    Score = -Quiescence(-beta, -alpha);

    TakeMove();
    if (SearchController.stop == BOOL.TRUE) {
      return 0;
    }

    if (Score > alpha) {
      if (Score >= beta) {
        if (Legal == 1) {
          SearchController.fhf++;
        }
        SearchController.fh++;

        return beta;
      }
      alpha = Score;
      BestMove = Move;
    }
  }

  if (alpha != OldAlpha) {
    StorePvMove(BestMove);
  }
  return alpha;
}

function AlphaBeta(alpha, beta, depth) {
  if (depth <= 0) {
    return Quiescence(alpha, beta);
  }

  if ((SearchController.nodes & 2047) == 0) {
    CheckUp();
  }
  SearchController.nodes++;

  // Check Repetitions()
  if (GameBoard.ply > MAXDEPH - 1) {
    return EvalPosition();
  }
  var InCheck = SqAttacked(GameBoard.pList[PIECEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);
  if (InCheck == BOOL.TRUE) {
    depth++;
  }

  var Score = -INFINITE;
  GenerateMoves();

  var MoveNum = 0;
  var Legal = 0;
  var OldAlpha = alpha;
  var BestMove = NOMOVE;
  var Move = NOMOVE;

  // get PvMove
  // order PvMove

  for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];
    if (MakeMove(Move) == BOOL.FALSE) {
      continue;
    }
    Legal++;
    Score = -AlphaBeta(-beta, -alpha, depth - 1);

    TakeMove();
    if (SearchController.stop == BOOL.TRUE) {
      return 0;
    }

    if (Score > alpha) {
      if (Score >= beta) {
        if (Legal == 1) {
          SearchController.fhf++;
        }
        SearchController.fh++;
        // update killer moves

        return beta;
      }
      alpha = Score;
      BestMove = Move;
      // Update history table
    }
  }

  if (Legal == 0) {
    if (InCheck == BOOL.TRUE) {
      return -MATE + GameBoard.ply;
    } else {
      return 0;
    }
  }

  if (alpha != OldAlpha) {
    StorePvMove(BestMove);
  }

  return alpha;
}

function ClearForSearch() {
  var index = 0;

  for (index = 0; index < 18 * BRD_SQ_NUM; ++index) {
    GameBoard.searchHistory[index] = 0;
  }
  for (index = 0; index < 3 * MAXDEPH; ++index) {
    GameBoard.searchKillers[index] = 0;
  }

  ClearPvTable();
  GameBoard.ply = 0;
  SearchController.nodes = 0;
  SearchController.fh = 0;
  SearchController.fhf = 0;
  SearchController.start = $.now();
  SearchController.stop = BOOL.FALSE;
}

function SearchPosition() {
  var bestMove = NOMOVE;
  var bestScore = -INFINITE;
  var currentDepth = 0;
  var line;
  var PvNum, c;
  ClearForSearch();
  for (currentDepth = 1; currentDepth <= /*SearchController.depth*/ 4; ++currentDepth) {
    bestScore = AlphaBeta(-INFINITE, INFINITE, currentDepth);

    if (SearchController.stop == BOOL.TRUE) {
      break;
    }

    bestMove = ProbePvTable();
    line = "D: " + currentDepth + " Best: " + PrtMove(bestMove) + " Score: " + bestScore + " nodes: " + SearchController.nodes;

    PvNum = GetPvLine(currentDepth);
    line += " Pv: ";
    for (c = 0; c < PvNum; ++c) {
      line += " " + PrtMove(GameBoard.pvArray[c]);
    }
    if (currentDepth != 1) {
      line += "Ordering: " + ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) + "%";
    }
    console.log(line);
    //console.log(c + " Pv: " + JSON.stringify(GameBoard.pvArray));
  }

  SearchController.best = bestMove;
  SearchController.thinking = BOOL.FALSE;
}
