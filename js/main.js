$(function() {
  init();
  console.log("Main Init Called");
  ParseFen(START_FEN);
  PrintBoard();
  tableCreate("pieces");

  // tableCreate("files");

  // tableCreate("ranks");

  // tableCreate("142To81");

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
