var PIECES = {
  EMPTY: 0,
  gP: 1,
  gL: 2,
  gN: 3,
  gS: 4,
  gG: 5,
  gB: 6,
  gR: 7,
  gK: 8,
  oP: 9,
  oL: 10,
  oN: 11,
  oS: 12,
  oG: 13,
  oB: 14,
  oR: 15,
  oK: 16
};

// board squares number
var BRD_SQ_NUM = 143;

var FILES = {
  FILE_A: 0,
  FILE_B: 1,
  FILE_C: 2,
  FILE_D: 3,
  FILE_E: 4,
  FILE_F: 5,
  FILE_G: 6,
  FILE_H: 7,
  FILE_I: 8,
  FILE_NONE: 9
};
var RANKS = {
  RANK_1: 0,
  RANK_2: 1,
  RANK_3: 2,
  RANK_4: 3,
  RANK_5: 4,
  RANK_6: 5,
  RANK_7: 6,
  RANK_8: 7,
  RANK_9: 8,
  RANK_NONE: 9
};

var RANKED_PLAYER = { LOWER: 0, HIGHER: 1, BOTH: 2 };

var SQUARES = {
  A1: 23,
  B1: 24,
  C1: 25,
  D1: 26,
  E1: 27,
  F1: 28,
  G1: 29,
  H1: 30,
  I1: 31,
  A9: 111,
  B9: 112,
  C9: 113,
  D9: 114,
  E9: 115,
  F9: 116,
  G9: 117,
  H9: 118,
  I9: 119,
  NO_SQ: 120,
  OFFBOARD: 121
};

var BOOL = { FALSE: 0, TRUE: 1 };

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPH = 81;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

// File and Rank to Square
function FR2SQ(file, rank) {
  return 23 + file + rank * 11;
}

// var PieceBig = ?
////////////////// [None,pawn,lance,knight,silver,gold,bishop,rook,king]
// Absolute pieces
var PieceAbs = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE
];
// Major pieces [None,pawn,lance,knight,silver,gold,bishop,rook,king]
var PieceMaj = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE
];
// Minor pieces [None,pawn,lance,knight,silver,gold,bishop,rook,king]
var PieceMin = [
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE
];
// [None, pawn, lance, knight, silver, gold, bishop, rook, king]
var PieceVal = [
  0,
  100,
  430,
  450,
  640,
  690,
  890,
  1040,
  50000,
  100,
  430,
  450,
  640,
  690,
  890,
  1040,
  50000
];
// [None, pawn, lance, knight, silver, gold, bishop, rook, king]
var PieceInHandVal = [
  0,
  115,
  480,
  510,
  720,
  780,
  1110,
  1270,
  50000,
  115,
  480,
  510,
  720,
  780,
  1110,
  1270,
  50000
];

// Affiliation of pawns to the player
var PiecePlayer = [
  RANKED_PLAYER.BOTH,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.LOWER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER,
  RANKED_PLAYER.HIGHER
];

// Assign a pawn

var PiecePawn = [
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE
];
var PieceLance = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE
];
var PieceKnight = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE
];
var PieceSilver = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE
];
var PieceGold = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE
];
var PieceBishop = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE
];
var PieceRook = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE
];
var PieceKing = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE
];

var PieceKeys = new Array(18 * 143);
var SideKey;

var Sq142ToSq81 = new Array(BRD_SQ_NUM);
var Sq81ToSq142 = new Array(81);

function RAND_32() {
  return (
    (Math.floor(Math.random() * 255 + 1) << 23) |
    (Math.floor(Math.random() * 255 + 1) << 16) |
    (Math.floor(Math.random() * 255 + 1) << 8) |
    Math.floor(Math.random() * 255 + 1)
  );
}

function SQ81(sq142) {
  return Sq142ToSq81[sq142];
}
function SQ142(sq81) {
  return Sq81ToSq142[sq81];
}
