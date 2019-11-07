$(function() {
  init();
  console.log("Main Init Called");
  tableCreate("normal");

  tableCreate("files");

  tableCreate("ranks");

  tableCreate("142To81");

  // var piece1 = RAND_32();
  // var piece2 = RAND_32();
  // var piece3 = RAND_32();
  // var piece4 = RAND_32();

  // var key = 0;
  // key ^= piece1;
  // console.log("key1: " + key.toString(16));
  // key ^= piece2;
  // console.log("key2: " + key.toString(16));
  // key ^= piece3;
  // console.log("key3: " + key.toString(16));
  // key ^= piece4;
  // console.log("key4: " + key.toString(16));
  // key ^= piece1;
  // console.log("key1out: " + key.toString(16));
  // key = 0;
  // key ^= piece2;
  // key ^= piece3;
  // key ^= piece4;
  // console.log("build o piece1: " + key.toString(16));
});

function init() {
  console.log("init() called");
  InitFilesRanksBrd();
  InitHashKeys();
  InitSq142ToSq81();
}

function InitSq142ToSq81() {
  var index = 0;
  var file = FILES.FILE_A;
  var rank = RANKS.RANK_1;
  var sq = SQUARES.A1;
  var sq81 = 0;

  for (index = 0; index < BRD_SQ_NUM; ++index) {
    Sq142ToSq81[index] = 82;
  }

  for (index = 0; index < 81; ++index) {
    Sq81ToSq142[index] = 142;
  }

  for (rank = RANKS.RANK_1; rank <= RANKS.RANK_9; ++rank) {
    for (file = FILES.FILE_A; file <= FILES.FILE_I; ++file) {
      sq = FR2SQ(file, rank);
      Sq81ToSq142[sq81] = sq;
      Sq142ToSq81[sq] = sq81;
      sq81++;
    }
  }

  console.log(JSON.stringify(Sq142ToSq81));
  console.log(JSON.stringify(Sq81ToSq142));
}

function InitFilesRanksBrd() {
  var index = 0;
  var file = FILES.FILE_A;
  var rank = RANKS.RANK_1;
  var sq = SQUARES.A1;

  for (index = 0; index < BRD_SQ_NUM; ++index) {
    FilesBrd[index] = SQUARES.OFFBOARD;
    RanksBrd[index] = SQUARES.OFFBOARD;
  }
  for (rank = RANKS.RANK_1; rank <= RANKS.RANK_9; ++rank) {
    for (file = FILES.FILE_A; file <= FILES.FILE_I; ++file) {
      sq = FR2SQ(file, rank);
      FilesBrd[sq] = file;
      RanksBrd[sq] = rank;
    }
  }
}

function InitHashKeys() {
  var index = 0;
  for (index = 0; index < 18 * 142; ++index) {
    PieceKeys[index] = RAND_32();
  }

  SideKey = RAND_32;
}

/*






*/
function tableCreate(mode) {
  var files = 11;
  var ranks = 13;
  var body = document.getElementsByTagName("body")[0];
  var tbl = document.createElement("table");
  tbl.style.width = "500px";
  tbl.style.margin = "10px 10px 10px 0px";
  tbl.style.height = "500px";
  tbl.style.fontWeight = "bold";
  tbl.style.textAlign = "center";
  tbl.setAttribute("border", "1");
  var tbdy = document.createElement("tbody");
  for (var i = 0; i < 13; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < 11; j++) {
      var td = document.createElement("td");
      if (j > 0 && j < 10 && i > 1 && i < 11) {
        td.style.backgroundColor = "rgb(122, 152, 235)";
      } else {
        td.style.backgroundColor = "rgb(169, 230, 245)";
      }
      if (mode == "normal") {
        td.appendChild(document.createTextNode(i * files + j));
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
