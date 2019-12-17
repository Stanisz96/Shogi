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
  imageString = "";
  console.log(GameBoard.capturedList);
  for (index = 0; index <= 15; index++) {
    if (index <= 7) {
      pieceFileName = "images/" + SideChar[PiecePlayer[index + 1]] + PieceChar[index + 1].toUpperCase();
      pieceFileName += ".png";
      imageString = '<image src="' + pieceFileName + '" class="Piece Lower ' + "captured" + (index + 1) + '"/>';
      $("#RightHand").append(imageString);
      if (GameBoard.capturedList[index] != 0) $(".Piece.Lower.captured" + (index + 1)).css("opacity", 1);
      else $(".Piece.Lower.captured" + (index + 1)).css("opacity", 0.3);
      $(".captured" + (index + 1))
        .children(".RightNumbers")
        .text(GameBoard.capturedList[index]);
    } else {
      pieceFileName = "images/" + SideChar[PiecePlayer[index + 7]] + PieceChar[index + 7].toUpperCase();
      pieceFileName += ".png";
      imageString = '<image src="' + pieceFileName + '" class="Piece Higher ' + "captured" + (16 - index) + '"/>';
      $("#LeftHand").append(imageString);
      if (GameBoard.capturedList[index] != 0) $(".Piece.Higher.captured" + (16 - index)).css("opacity", 1);
      else $(".Piece.Higher.captured" + (16 - index)).css("opacity", 0.3);
      $(".captured" + (16 - index))
        .children(".LeftNumbers")
        .text(GameBoard.capturedList[index]);
    }
  }
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
  if (HandSq.includes(sq, 9)) {
    $(".Square.Left" + ".captured" + (9 - (HandSq.indexOf(sq) - 14))).addClass("SqSelected");
    //console.log(".Square.Left" + ".captured" + (HandSq.indexOf(sq) - 14));
  } else {
    $(".Square.Right" + ".captured" + HandSq.indexOf(sq)).addClass("SqSelected");
    //console.log(".Square.Right" + ".captured" + (HandSq.indexOf(sq) + 1));
  }
  //console.log(".Square rank" + (rank + 1) + " file" + (file + 1));
  //console.log("Clicked sq: " + PrtSq(sq));

  return sq;
}

$(document).on("click", ".Piece", function(e) {
  /*if ($(this).is(".Lower")) {
    if (UserMove.from == SQUARES.NO_SQ) {
      UserMove.from = ClickedSquare(e.pageX, e.pageY);
    } else {
      UserMove.to = ClickedSquare(e.pageX, e.pageY);
    }
    DropPieceInHand();
  } else if ($(this).is(".Higher")) {
    if (UserMove.from == SQUARES.NO_SQ) {
      UserMove.from = ClickedSquare(e.pageX, e.pageY);
    }
    console.log(UserMove.from);
    DropPieceInHand();
  } else {
    console.log("Piece Click");*/
  console.log(UserMove.from);
  if (HandSq.includes(UserMove.from) && UserMove.from != SQUARES.NO_SQ) {
    if ($(this).is(".Lower")) {
      /*if (UserMove.from == SQUARES.NO_SQ) {
        UserMove.from = ClickedSquare(e.pageX, e.pageY);
      } else {
        UserMove.to = ClickedSquare(e.pageX, e.pageY);
      }*/
      DropPieceInHand();
    } else if ($(this).is(".Higher")) {
      if (UserMove.from == SQUARES.NO_SQ) {
        UserMove.from = ClickedSquare(e.pageX, e.pageY);
      }
      console.log(UserMove.from);
      DropPieceInHand();
    }
  } else {
    if (UserMove.from == SQUARES.NO_SQ) {
      UserMove.from = ClickedSquare(e.pageX, e.pageY);
    } else {
      UserMove.to = ClickedSquare(e.pageX, e.pageY);
    }
    MakeUserMove();
  }
});

$(document).on("click", ".Square", function(e) {
  /*if ($(this).is(".Right")) {
    if (UserMove.from != SQUARES.NO_SQ) {
      UserMove.to = ClickedSquare(e.pageX, e.pageY);
      DropPieceInHand();
    }

    //console.log("Right hand Click");
    //console.log(ClickedSquare(e.pageX, e.pageY));
  } else if ($(this).is(".Left")) {
    console.log("Left hand Click");
    console.log(ClickedSquare(e.pageX, e.pageY));
  } else {
    console.log("Board Click");*/
  if (HandSq.includes(UserMove.from) && UserMove.from != SQUARES.NO_SQ) {
    console.log("problem: " + UserMove.from);
    UserMove.to = ClickedSquare(e.pageX, e.pageY);
    DropPieceInHand();
  } else if (UserMove.from != SQUARES.NO_SQ) {
    console.log(UserMove.from);
    UserMove.to = ClickedSquare(e.pageX, e.pageY);
    MakeUserMove();
  }
  //}
});

function MakeUserMove() {
  if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
    console.log("User Move: " + PrtSq(UserMove.from) + PrtSq(UserMove.to));

    var parsed = ParseMove(UserMove.from, UserMove.to);
    if (parsed != NOMOVE) {
      CheckBoard();
      //console.log(parsed.toString(2));
      MakeMove(parsed);
      //console.log(MOVE(UserMove.from, UserMove.from + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA).toString(2));
      //console.log(GameBoard.promoted);
      UpdateInitialBoard();

      CheckAndSet();
      //console.log(GameBoard.capturedList);
    }

    $(".Square.rank" + (RanksBrd[UserMove.from] + 1) + ".file" + (FilesBrd[UserMove.from] + 1)).removeClass("SqSelected");
    $(".Square.rank" + (RanksBrd[UserMove.to] + 1) + ".file" + (FilesBrd[UserMove.to] + 1)).removeClass("SqSelected");
    if (HandSq.includes(UserMove.to)) {
      if (HandSq.includes(UserMove.to, 9)) {
        $(".Square.Left" + ".captured" + (9 - (HandSq.indexOf(UserMove.to) - 14))).removeClass("SqSelected");
        //console.log(".Square.Left" + ".captured" + (HandSq.indexOf(sq) - 14));
      } else {
        $(".Square.Right" + ".captured" + HandSq.indexOf(UserMove.to)).removeClass("SqSelected");
        //console.log(".Square.Right" + ".captured" + (HandSq.indexOf(UserMove.from) + 1));
      }
    }
    UserMove.from = SQUARES.NO_SQ;
    UserMove.to = SQUARES.NO_SQ;
    //PrintSqAttaced();
  }
}

function DropPieceInHand() {
  if (UserMove.from != SQUARES.NO_SQ && HandSq.includes(UserMove.to) == false) {
    var parsed = ParseMove(UserMove.from, UserMove.to);
    if (parsed != NOMOVE) {
      CheckBoard();
      //console.log(parsed.toString(2));
      MakeMove(parsed);
      //console.log(MOVE(UserMove.from, UserMove.from + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAG_AWA).toString(2));
      //console.log(GameBoard.promoted);
      UpdateInitialBoard();

      CheckAndSet();
      //console.log(GameBoard.capturedList);
    }

    if (HandSq.includes(UserMove.from, 9)) {
      $(".Square.Left" + ".captured" + (9 - (HandSq.indexOf(UserMove.from) - 14))).removeClass("SqSelected");
      //console.log(".Square.Left" + ".captured" + (HandSq.indexOf(sq) - 14));
    } else {
      $(".Square.Right" + ".captured" + HandSq.indexOf(UserMove.from)).removeClass("SqSelected");
      //console.log(".Square.Right" + ".captured" + (HandSq.indexOf(UserMove.from) + 1));
    }
    /* - - - - - */
    $(".Square.rank" + (RanksBrd[UserMove.to] + 1) + ".file" + (FilesBrd[UserMove.to] + 1)).removeClass("SqSelected");

    console.log("from: " + UserMove.from + " to: " + UserMove.to);
    UserMove.from = SQUARES.NO_SQ;
    UserMove.to = SQUARES.NO_SQ;
    //console.log("from: " + UserMove.from + " to: " + UserMove.to + "\n");
  } else if (HandSq.includes(UserMove.from) && HandSq.includes(UserMove.to)) {
    console.log("NOMOVE: from: " + UserMove.from + " to: " + UserMove.to);
    if (HandSq.includes(UserMove.from, 9)) {
      $(".Square.Left" + ".captured" + (9 - (HandSq.indexOf(UserMove.from) - 14))).removeClass("SqSelected");
      //console.log(".Square.Left" + ".captured" + (HandSq.indexOf(sq) - 14));
    } else {
      $(".Square.Right" + ".captured" + HandSq.indexOf(UserMove.from)).removeClass("SqSelected");
      //console.log(".Square.Right" + ".captured" + (HandSq.indexOf(UserMove.from) + 1));
    }
    UserMove.from = UserMove.to;
    UserMove.to = SQUARES.NO_SQ;
  }
}

function CheckResult() {
  GenerateMoves();
  var moveNum = 0;
  var found = 0;
  var sq = 0;
  var pieceCount = 0;
  // No "dead end" minor pieces move or drop
  if (GameBoard.side ^ (1 == RANKED_PLAYER.LOWER)) {
    for (sq = 111; sq <= 119; sq++) {
      if ([PIECES.gP, PIECES.gL, PIECES.gN].includes(GameBoard.pieces[sq])) {
        $("#GameStatus").text("GAME OVER {lower player done illegal move}");
        return BOOL.TRUE;
      }
    }
  } else {
    for (sq = 23; sq <= 31; sq++) {
      if ([PIECES.oP, PIECES.oL, PIECES.oN].includes(GameBoard.pieces[sq])) {
        $("#GameStatus").text("GAME OVER {higher player done illegal move}");
        return BOOL.TRUE;
      }
    }
  }
  // No double  unpromoted pown
  if (GameBoard.side ^ (1 == RANKED_PLAYER.LOWER)) {
    for (file = 1; file <= 9; file++) {
      pieceCount = 0;
      for (rank = 1; rank <= 9; rank++) {
        if (GameBoard.pieces[FR2SQ(file, rank)] == PIECES.gP) pieceCount++;
        if (pieceCount > 1) {
          $("#GameStatus").text("GAME OVER {lower player done illegal move}");
          return BOOL.TRUE;
        }
      }
    }
  } else {
    for (file = 1; file <= 9; file++) {
      pieceCount = 0;
      for (rank = 1; rank <= 9; rank++) {
        if (GameBoard.pieces[FR2SQ(file, rank)] == PIECES.oP) pieceCount++;
        if (pieceCount > 1) {
          $("#GameStatus").text("GAME OVER {lower player done illegal move}");
          return BOOL.TRUE;
        }
      }
    }
  }

  for (moveNum = GameBoard.moveListStart[GameBoard.ply]; moveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++moveNum) {
    //console.log("checkresult");
    if (MakeMove(GameBoard.moveList[moveNum]) == BOOL.FALSE) {
      continue;
    }
    //console.log(GameBoard.moveList[moveNum]);
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
    //console.log("LOOOl");
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
