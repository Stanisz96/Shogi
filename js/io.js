function PrtSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

function PrtMove(move) {
  let MoveStr;

  let ff = FilesBrd[FROMSQ(move)];
  let rf = RanksBrd[FROMSQ(move)];
  let ft = FilesBrd[TOSQ(move)];
  let rt = RanksBrd[TOSQ(move)];

  MoveStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
  //var promoted;
  return MoveStr;
}

function PrintMoveList() {
  let index, move;
  let num = 1;
  console.log("MoveList: ");
  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    console.log("IMove:" + num + ":(" + index + "):" + PrtMove(move) + " Score:" + GameBoard.moveScores[index]);
    num++;
  }
  console.log("End MoveList");
}

function PrintConsoleBoard() {
  let line = "\n\n\n\n";
  for (var i = 1; i < 14; i++) {
    for (var j = 1; j < 12; j++) {
      if (GameBoard.pieces[142 - i * 11 + j] == 121) {
        line += "*  ";
      } else {
        if (GameBoard.pieces[142 - i * 11 + j] <= 9) {
          line += GameBoard.pieces[142 - i * 11 + j] + "  ";
        } else {
          line += GameBoard.pieces[142 - i * 11 + j] + " ";
        }
      }
    }
    line += "\n";
  }
  console.log(line);
}

function ParseMove(from, to) {
  GenerateMoves();

  let Move = [NOMOVE, NOMOVE];
  let found = [BOOL.FALSE, BOOL.FALSE];
  //let found = BOOL.FALSE;
  //var promote_piece = confirm("Do you want to promote piece?");

  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    found[0] == BOOL.TRUE ? {} : (Move[0] = GameBoard.moveList[index]);
    Move[1] = GameBoard.moveList[index];
    awakening = (Move[1] & MFLAG_AWA) >> 19;
    if (FROMSQ(Move[1]) == from && TOSQ(Move[1]) == to && awakening == BOOL.TRUE) {
      found[1] = BOOL.TRUE;
      //found = BOOL.TRUE;
      break;
    } else if (FROMSQ(Move[0]) == from && TOSQ(Move[0]) == to) {
      found[0] = BOOL.TRUE;
    }
  }
  if (found[1] != BOOL.FALSE) {
    console.log("awake");
    //console.log(from + " <-from to-> " + to);
    if (MakeMove(Move[1]) == BOOL.FALSE) return NOMOVE;
    TakeMove();
    if ((promote_piece = confirm("Do you want to promote piece?"))) {
      return Move[1];
      //GameBoard.pieces[from] = PROMOTION[GameBoard.pieces[from]];
    } else return Move[0];
  } else if (found[0] != BOOL.FALSE) {
    console.log("normal");
    if (MakeMove(Move[0]) == BOOL.FALSE) return NOMOVE;
    TakeMove();
    return Move[0];
  }

  return NOMOVE;
}
