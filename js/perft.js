var perft_leafNodes;
var count = 0;

function Perft(depth) {
  if (depth == 0) {
    perft_leafNodes++;
    return;
  }
  GenerateMoves();

  // if (depth == 1) {
  //   count++;
  //   //PrintBoard();
  // }
  var index, move;

  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) == BOOL.FALSE) {
      //console.log("ERROR? " + index + "\n" + GameBoard.moveList[index]);
      continue;
    }
    Perft(depth - 1);
    TakeMove();
  }
  return;
}

function PerftTest(depth) {
  GenerateMoves();
  console.log("Starting Test To Depth: " + depth);
  perft_leafNodes = 0;
  var index, move;
  var moveNum = 0;
  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    //tableUpdate(mainTable, "pieces");
    //sleep(1000);
    if (MakeMove(move) == BOOL.FALSE) {
      continue;
    }
    moveNum++;
    var cumnodes = perft_leafNodes;
    Perft(depth - 1);
    TakeMove();
    var oldnodes = perft_leafNodes - cumnodes;
    console.log("move: " + moveNum + " " + PrtMove(move) + " " + oldnodes);
  }
  console.log("Test Complete: " + perft_leafNodes + " leaf nodes visited");
  // console.log("count 1 depth: " + count);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
