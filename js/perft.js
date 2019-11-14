var perft_leafNodes;

function Perft(depth) {
  if (depth == 0) {
    perft_leafNodes++;
    return;
  }
  GenerateMoves();

  var index, move;

  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) == BOOL.FALSE) {
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

  return;
}
