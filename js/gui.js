$("#SetFen").click(function() {
  var fenStr = $("#fenIn").val();
  NewGame(fenStr);
});

$("#TakeButton").click(function() {
  if (GameBoard.hisPlay > 0) {
    console.log("Move was taken");
    TakeMove();
    GameBoard.ply = 0;
    UpdateInitialBoard();
  }
});

$("#NewGameButton").click(function() {
  NewGame(START_FEN);
});

function NewGame(fenStr) {
  ClearAllPieces();
  ParseFen(fenStr);
  //PrintBoard();
  SetInitialBoardPieces();
  CheckAndSet();
}

function ClearAllPieces() {
  $(".Piece").remove();
}

function UpdateInitialBoard() {
  $("img").remove();
  SetInitialBoardPieces();
}

function SetInitialBoardPieces() {
  var sq, sq142, file, rank, rankName, fileName, imageString, pieceFileName, piece;
  var index;
  for (sq = 0; sq < 81; sq++) {
    sq142 = SQ142(sq);
    piece = GameBoard.pieces[sq142];
    file = FilesBrd[sq142];
    rank = RanksBrd[sq142];

    if (piece >= PIECES.gP && piece <= PIECES.oRa) {
      rankName = "rank" + (rank + 1);
      fileName = "file" + (file + 1);
      pieceFileName = "images/" + SideChar[PiecePlayer[piece]] + PieceChar[piece].toUpperCase();
      //if (GameBoard.promoted[sq142] == 1) pieceFileName += "a";

      /*for (index = 0; index < GameBoard.pieceNum[piece]; ++index) {
        if (
          GameBoard.pieceList[PIECEINDEX(piece, index)] == sq142 &&
          GameBoard.promotedList[PIECEINDEX(piece, index)] == BOOL.TRUE
        ) {
          pieceFileName += "a";
          break;
        }
      }*/

      pieceFileName += ".png";
      imageString = '<image src="' + pieceFileName + '" class="Piece ' + rankName + " " + fileName + '"/>';
      $("#Board").append(imageString);
    }
  }

  // Pieces in hand
  /*for (index = 0; index <= 15; index++) {

  }*/
}

function ClickedSquare(pageX, pageY) {
  //console.log("ClickedSq: " + pageX + "," + pageY);
  var positionBoard = $("#Board").position();
  var positionGame = $("#Game").offset();
  var workedX = Math.floor(positionBoard.left + positionGame.left);
  var workedY = Math.floor(positionBoard.top + positionGame.top);

  pageX = Math.floor(pageX);
  pageY = Math.floor(pageY);

  var file = Math.floor((pageX - workedX) / 60);
  var rank = 8 - Math.floor((pageY - workedY) / 60);

  //console.log("POSITION: " + (pageX - workedX) + "," + (pageY - workedY));
  var sq = FR2SQ(file, rank);
  $(".Square.rank" + (rank + 1) + ".file" + (file + 1)).addClass("SqSelected");
  //console.log(".Square rank" + (rank + 1) + " file" + (file + 1));
  //console.log("Clicked sq: " + PrtSq(sq));

  return sq;
}

$(document).on("click", ".Piece", function(e) {
  //console.log("Piece Click");
  if (UserMove.from == SQUARES.NO_SQ) {
    UserMove.from = ClickedSquare(e.pageX, e.pageY);
  } else {
    UserMove.to = ClickedSquare(e.pageX, e.pageY);
  }
  MakeUserMove();
});

$(document).on("click", ".Square", function(e) {
  //console.log("Square Click");
  if (UserMove.from != SQUARES.NO_SQ) {
    UserMove.to = ClickedSquare(e.pageX, e.pageY);
    MakeUserMove();
  }
});

function MakeUserMove() {
  if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
    console.log("User Move: " + PrtSq(UserMove.from) + PrtSq(UserMove.to));

    var parsed = ParseMove(UserMove.from, UserMove.to);
    if (parsed != NOMOVE) {
      CheckBoard();
      console.log(parsed.toString(2));
      MakeMove(parsed);
      //console.log(MOVE(UserMove.from, UserMove.from + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA).toString(2));
      //console.log(GameBoard.promoted);
      UpdateInitialBoard();

      CheckAndSet();
      //PreSearch();
      //console.log(SearchController);
      //console.log(SearchController);
    }

    $(".Square.rank" + (RanksBrd[UserMove.from] + 1) + ".file" + (FilesBrd[UserMove.from] + 1)).removeClass("SqSelected");
    $(".Square.rank" + (RanksBrd[UserMove.to] + 1) + ".file" + (FilesBrd[UserMove.to] + 1)).removeClass("SqSelected");

    UserMove.from = SQUARES.NO_SQ;
    UserMove.to = SQUARES.NO_SQ;
    PrintSqAttaced();
  }
}

function CheckResult() {
  GenerateMoves();

  var moveNum = 0;
  var found = 0;
  for (moveNum = GameBoard.moveListStart[GameBoard.ply]; moveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++moveNum) {
    //console.log("checkresult");
    if (MakeMove(GameBoard.moveList[moveNum]) == BOOL.FALSE) {
      continue;
    }
    found++;
    TakeMove();
    break;
  }
  if (found != 0) return BOOL.FALSE;

  var InCheck = SqAttacked(GameBoard.pieceList[PIECEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);
  //console.log(PIECEINDEX(Kings[GameBoard.side], 0) + " % " + (GameBoard.side ^ 1));
  if (InCheck == BOOL.TRUE) {
    if (GameBoard.side == RANKED_PLAYER.LOWER) {
      $("#GameStatus").text("GAME OVER {higher player mates}");
      return BOOL.TRUE;
    } else {
      $("#GameStatus").text("GAME OVER {lower player mates}");
      return BOOL.TRUE;
    }
  } else {
    $("#GameStatus").text("GAME DRAWN {stalemate}");
    return BOOL.TRUE;
  }

  return BOOL.FALSE;
}

function CheckAndSet() {
  if (CheckResult() == BOOL.TRUE) {
    GameController.GameOver = BOOL.TRUE;
  } else {
    GameController.GameOver = BOOL.FALSE;
    $("#GameStatus").text("");
  }
}

function PreSearch() {
  if (GameController.GameOver == BOOL.FALSE) {
    SearchController.thinking = BOOL.TRUE;
    setTimeout(function() {
      StartSearch();
    }, 200);
  }
}

$("#SearchButton").click(function() {
  GameController.PlayerSide = GameController.side ^ 1;
  PreSearch();
});

function StartSearch() {
  SearchController.depth = MAXDEPTH;
  var t = $.now();
  var tt = $("#ThinkTime").val();

  SearchController.time = parseInt(tt) * 1000;
  //console.log(SearchController.time);
  SearchPosition();
  MakeMove(SearchController.best);
  UpdateInitialBoard();
  CheckAndSet();
}
