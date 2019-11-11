$("#SetFen").click(function() {
  var fenStr = $("#fenIn").val();
  ParseFen(fenStr);
  PrintBoard();
  //PrintConsoleBoard();
  //GenerateMoves();
  //PrintMoveList();
  //CheckBoard();
  PerftTest(5);
  PrintBoard();
  //tableUpdate(mainTable, "pieces");
});
