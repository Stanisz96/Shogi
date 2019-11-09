$(function() {
  init();
  console.log("Main Init Called");
  ParseFen(START_FEN);
  PrintBoard();
  tableCreate("pieces");
  tableCreate("normal");
  //GenerateMoves();
  //PrintMoveList();
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
