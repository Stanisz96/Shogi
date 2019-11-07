$(function() {
  init();
  console.log("Main Init Called");

  tableCreate("normal");

  tableCreate("files");

  tableCreate("ranks");
});

function init() {
  console.log("init() called");
  InitFilesRanksBrd();
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
      }
      tr.appendChild(td);
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
}
