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
  console.log("MoveList: ");
  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    console.log(PrtMove(move));
  }
}

function PrintConsoleBoard() {
  var line = "\n\n\n\n\n\n\n\n\n";
  for (var i = 1; i < 14; i++) {
    for (var j = 1; j < 12; j++) {
      GameBoard.pieces[142 - i * 11 + j] == 121
        ? (line += "* ")
        : (line += GameBoard.pieces[142 - i * 11 + j] + " ");
    }
    line += "\n";
  }
  console.log(line);
}
