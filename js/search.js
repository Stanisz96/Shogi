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
    //console.log("Time's up");
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
  if (GameBoard.ply > MAXDEPTH - 1) {
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
  if (GameBoard.ply > MAXDEPTH - 1) {
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

  var PvMove = ProbePvTable();
  if (PvMove != NOMOVE) {
    for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
      if (GameBoard.moveList[MoveNum] == PvMove) {
        GameBoard.moveScore[MoveNum] = 2000000;
        break;
      }
    }
  }

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
        if ((Move & MFLAG_CAP) == 0) {
          GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] = GameBoard.searchKillers[GameBoard.ply];
          GameBoard.searchKillers[GameBoard.ply] = Move;
        }
        return beta;
      }
      if ((Move & MFLAG_CAP) == 0) {
        GameBoard.searchHistory[GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)] += depth * depth;
      }
      alpha = Score;
      BestMove = Move;
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
  for (index = 0; index < 3 * MAXDEPTH; ++index) {
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
  var Score = -INFINITE;
  var currentDepth = 0;
  var line;
  var PvNum, c;
  ClearForSearch();
  for (currentDepth = 1; currentDepth <= SearchController.depth; ++currentDepth) {
    Score = AlphaBeta(-INFINITE, INFINITE, currentDepth);
    if (SearchController.stop == BOOL.TRUE) {
      break;
    }
    bestScore = Score;
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
    //console.log(line);
    //console.log(c + " Pv: " + JSON.stringify(GameBoard.pvArray));
  }

  SearchController.best = bestMove;
  SearchController.thinking = BOOL.FALSE;
  UpdateDOMStats(bestScore, currentDepth);
}

function UpdateDOMStats(dom_score, dom_depth) {
  var scoreText = "Score: " + (dom_score / 100).toFixed(2);
  if (Math.abs(dom_score) > MATE - MAXDEPTH) {
    scoreText = "Score: Mate In" + (MATE - Math.abs(dom_score) - 1) + " moves";
  }

  $("#OrderingOut").text("Ordering: " + ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) + "%");
  $("#DepthOut").text("Depth: " + dom_depth);
  $("#ScoreOut").text(scoreText);
  $("#NodesOut").text("Nodes: " + SearchController.nodes);
  $("#TimeOut").text("Time: " + (($.now() - SearchController.start) / 1000).toFixed(1) + "s");
  $("#BestOut").text("BestMove: " + PrtMove(SearchController.best));
}
