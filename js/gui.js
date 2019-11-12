$("#SetFen").click(function() {
  var fenStr = $("#fenIn").val();
  ParseFen(fenStr);
  PrintBoard();
  tableUpdate(mainTable, "pieces");
  //PerftTest(5);
  //PrintBoard();
  SearchPosition();
  tableUpdate(mainTable, "pieces");
});
