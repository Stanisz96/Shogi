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

  let Move = NOMOVE;
  let PromPiece = PIECES.EMPTY;
  let found = BOOL.FALSE;

  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    Move = GameBoard.moveList[index];
    if (FROMSQ(Move) == from && TOSQ(Move) == to) {
      PromPiece = PROMOTED(Move);
      // if(PromPiece !=PIECES.EMPTY){
      //   if(PromPiece==)
      // } PROMOTION

      found = BOOL.TRUE;
      break;
    }
  }

  if (found != BOOL.FALSE) {
    if (MakeMove(Move) == BOOL.FALSE) {
      return NOMOVE;
    }
    TakeMove();
    return Move;
  }
  return NOMOVE;
}
