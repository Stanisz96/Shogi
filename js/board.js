function pieceIndex(piece, pieceNum) {
  return piece * 10 + pieceNum;
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = RANKED_PLAYER.LOWER;
//GameBoard.fiftyMove = 0; // for chess -> if 50 moves done without  == draw (shogi dont have this)
GameBoard.hisPlay = 0; // count every move which has been made from the start
GameBoard.ply = 0; // nr half moves made in search tree
//GameBoard.castePerm = 0; // for chess, in shogi there is no castling
GameBoard.material = new Array(2); // Higher and lower player material of pieces
GameBoard.pieceNum = new Array(17); // Number of pieces we have
GameBoard.pList = new Array(18 * 10);
GameBoard.posKey = 0; // unice number represents position on the board

GameBoard.moveList = new Array(MAXDEPH * MAXPOSITIONMOVES);
GameBoard.moveScore = new Array(MAXDEPH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPH);

function PrintBoard() {
  var sq, file, rank, piece;

  console.log("\nGame Board:\n");
  var line = "    ";
  for (file = FILES.FILE_A; file <= FILES.FILE_I; file++) {
    line += " " + FileChar[file] + " ";
  }
  console.log(line);
  console.log("");
  for (rank = RANKS.RANK_9; rank >= RANKS.RANK_1; rank--) {
    var line = RankChar[rank] + "   ";
    for (file = FILES.FILE_A; file <= FILES.FILE_I; file++) {
      sq = FR2SQ(file, rank);
      piece = GameBoard.pieces[sq];
      line += " " + PieceChar[piece] + " ";
    }
    console.log(line);
  }
  console.log("");

  console.log("side: " + SideChar[GameBoard.side]);
  line = "";

  console.log("key: " + GameBoard.posKey.toString(16));
}

function tableCreate(mode) {
  if (document.getElementById("table1")) {
  } else {
    console.log("shieeet");
    var files = 11;
    var ranks = 13;
    var body = document.getElementsByTagName("body")[0];
    var tbl = document.createElement("table");
    tbl.id = "table1";
    tbl.style.width = "500px";
    tbl.style.position = "center";
    tbl.style.margin = "auto";
    tbl.style.marginBottom = "10px";
    tbl.style.marginTop = "10px";
    tbl.style.height = "500px";
    tbl.style.fontWeight = "bold";
    tbl.style.textAlign = "center";
    tbl.setAttribute("border", "1");
    var tbdy = document.createElement("tbody");

    for (var i = 2; i < 11; i++) {
      var tr = document.createElement("tr");
      for (var j = 1; j < 10; j++) {
        var td = document.createElement("td");
        if (j > 0 && j < 10 && i > 1 && i < 11) {
          td.style.backgroundColor = "rgb(122, 152, 235)";
        } else {
          td.style.backgroundColor = "rgb(169, 230, 245)";
        }
        if (mode == "normal") {
          td.appendChild(document.createTextNode(i * files + j));
        }
        if (mode == "pieces") {
          td.appendChild(document.createTextNode(PieceChar[GameBoard.pieces[i * files + j]]));
        } else if (mode == "files") {
          td.appendChild(document.createTextNode(FilesBrd[i * files + j]));
        } else if (mode == "ranks") {
          td.appendChild(document.createTextNode(RanksBrd[i * files + j]));
        } else if (mode == "142To81") {
          td.appendChild(document.createTextNode(Sq142ToSq81[i * files + j]));
        }
        tr.appendChild(td);
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
  }
  mainTable = tbl;
}

function tableChange(table, mode) {
  var files = 11;
  for (var i = 2; i < 11; i++) {
    for (var j = 1; j < 10; j++) {
      if (mode == "normal") {
      }
      if (mode == "pieces") {
        table.rows[i - 2].cells[j - 1].innerHTML = PieceChar[GameBoard.pieces[i * files + j]];
      } else if (mode == "files") {
      } else if (mode == "ranks") {
      } else if (mode == "142To81") {
      }
    }
  }
}

function GeneratePosKey() {
  var sq = 0;
  var finalKey = 0;
  var piece = PIECES.EMPTY;

  for (sq = 0; sq < BRD_SQ_NUM; ++sq) {
    piece = GameBoard.pieces[sq];
    if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
      finalKey ^= PieceKeys[piece * 142 + sq];
    }
  }
  if (GameBoard.side == RANKED_PLAYER.LOWER) {
    finalKey ^= SideKey;
  }

  return finalKey;
}

function ResetBoard() {
  var index = 0;

  for (index = 0; index < BRD_SQ_NUM; ++index) {
    GameBoard.pieces[index] = SQUARES.OFFBOARD;
  }
  for (index = 0; index < 81; ++index) {
    GameBoard.pieces[SQ142(index)] = PIECES.EMPTY;
  }
  for (index = 0; index < 18 * 142; ++index) {
    GameBoard.pList[index] = PIECES.EMPTY;
  }
  for (index = 0; index < 2; ++index) {
    GameBoard.material[index] = 0;
  }
  for (index = 0; index < 17; ++index) {
    GameBoard.pieceNum[index] = 0;
  }

  GameBoard.RANKED_PLAYER = RANKED_PLAYER.BOTH;
  GameBoard.ply = 0;
  GameBoard.hisPlay = 0;
  GameBoard.posKey = 0;
  GameBoard.moveListStart[GameBoard.ply] = 0;
}

function ParseFen(fen) {
  ResetBoard();
  var rank = RANKS.RANK_9;
  var file = FILES.FILE_A;
  var piece = 0;
  var count = 0;
  var i = 0;
  var sq142 = 0;
  var fenCount = 0;

  while (rank >= RANKS.RANK_1 && fenCount < fen.length) {
    count = 1;
    switch (fen[fenCount]) {
      case "p":
        piece = PIECES.oP;
        break;
      case "n":
        piece = PIECES.oN;
        break;
      case "l":
        piece = PIECES.oL;
        break;
      case "s":
        piece = PIECES.oS;
        break;
      case "g":
        piece = PIECES.oG;
        break;
      case "b":
        piece = PIECES.oB;
        break;
      case "r":
        piece = PIECES.oR;
        break;
      case "k":
        piece = PIECES.oK;
        break;
      case "P":
        piece = PIECES.gP;
        break;
      case "N":
        piece = PIECES.gN;
        break;
      case "L":
        piece = PIECES.gL;
        break;
      case "S":
        piece = PIECES.gS;
        break;
      case "G":
        piece = PIECES.gG;
        break;
      case "B":
        piece = PIECES.gB;
        break;
      case "R":
        piece = PIECES.gR;
        break;
      case "K":
        piece = PIECES.gK;
        break;

      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        piece = PIECES.EMPTY;
        count = Number(fen[fenCount]);
        break;

      case "/":
      case " ":
        rank--;
        file = FILES.FILE_A;
        fenCount++;
        continue;
      default:
        console.log("FEN error");
        return;
    }
    for (i = 0; i < count; i++) {
      sq142 = FR2SQ(file, rank);
      GameBoard.pieces[sq142] = piece;
      file++;
    }
    fenCount++;
  }

  GameBoard.side = fen[fenCount] == "w" ? RANKED_PLAYER.LOWER : RANKED_PLAYER.HIGHER;
  fenCount += 2;

  GameBoard.posKey = GeneratePosKey();
}
