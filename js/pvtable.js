function GetPvLine(depth) {
  var move = ProbePvTable();
  var count = 0;

  while (move != NOMOVE && count < depth) {
    if (MoveExists(move) == BOOL.TRUE) {
      MakeMove(move);
      GameBoard.pvArray[count++] = move;
    } else {
      break;
    }
    move = ProbePvTable();
  }
  while (GameBoard.ply > 0) {
    TakeMove();
  }

  return count;
}

function ProbePvTable() {
  var index = GameBoard.posKey % PVENTRIES;
  //console.log(index);

  if (GameBoard.pvTable[index].posKey == GameBoard.posKey) {
    return GameBoard.pvTable[index].move;
  }

  return NOMOVE;
}

function StorePvMove(move) {
  var index = GameBoard.posKey % PVENTRIES;
  GameBoard.pvTable[index].posKey = GameBoard.posKey;
  GameBoard.pvTable[index].move = move;
}
