$("#SetFen").click(function() {
  var fenStr = $("#fenIn").val();
  ParseFen(fenStr);
  PrintBoard();
  tableUpdate(mainTable, "pieces");
  //console.log(random);
  var line = "";
  for (var i = 0; i < 142; i++) {
    line += GameBoard.pieces[i] + " ";
    if ((i + 1) % 11 == 0) {
      line += "\n";
    }
  }
  console.log(line);
  //console.log(SqAttacked(67, 0));
  //console.log(SqAttacked(75, 0));
});
