function PrtSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

function PrtMove(move) {
  var MoveStr;

  var ff = FilesBrd[FROMSQ(move)];
  var rf = RanksBrd[FROMSQ(move)];
  var ft = FilesBrd[TOSQ(move)];
  var rt = RanksBrd[TOSQ(move)];

  MoveStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
  //var promoted;
  return MoveStr;
}

function PrintMoveList() {
  var index, move;
  var num = 1;
  console.log("MoveList: ");
  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    console.log("IMove:" + num + ":(" + index + "):" + PrtMove(move) + " Score:" + GameBoard.moveScores[index]);
    num++;
  }
  console.log("End MoveList");
}

function PrintConsoleBoard() {
  var line = "\n\n\n\n";
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

  var Move = NOMOVE;
  var PromPiece = PIECES.EMPTY;
  var found = BOOL.FALSE;

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
