$("#SetFen").click(function() {
  var fenStr = $("#fenIn").val();
  ParseFen(fenStr);
  PrintBoard();
  tableUpdate(mainTable, "pieces");
  PrintConsoleBoard();
  GenerateMoves();
  PrintMoveList();
  CheckBoard();
});
