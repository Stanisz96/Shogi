$(function() {
  init();
  console.log("Main Init Called");
  NewGame(START_FEN);
});

function InitBoardVars() {
  var index = 0;
  for (index = 0; index < MAXGAMEMOVES; ++index) {
    GameBoard.history.push({
      move: NOMOVE,
      posKey: 0
    });
  }

  for (index = 0; index < PVENTRIES; ++index) {
    GameBoard.pvTable.push({
      move: NOMOVE,
      posKey: 0
    });
  }
}

function InitBoardSquares() {
  var light = 1;
  var rankName, fileName, divString, rankIter, fileIter, lightString;

  for (rankIter = RANKS.RANK_9; rankIter >= RANKS.RANK_1; rankIter--) {
    rankName = "rank" + (rankIter + 1);
    for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_I; fileIter++) {
      fileName = "file" + (fileIter + 1);
      if (light == 0) lightString = "Light";
      else lightString = "Dark";
      divString = '<div class="Square ' + rankName + " " + fileName + " " + lightString + '"/>';
      $("#Board").append(divString);
      light ^= 1;
    }
  }
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
  for (index = 0; index < 18 * BRD_SQ_NUM; ++index) {
    PieceKeys[index] = RAND_32();
  }

  SideKey = RAND_32();
}

function init() {
  console.log("init() called");
  InitFilesRanksBrd();
  InitHashKeys();
  InitSq142ToSq81();
  InitBoardVars();
  InitMvvLva();
  InitBoardSquares();
}
