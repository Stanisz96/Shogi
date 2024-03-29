// prettier-ignore
var PIECES = {
  EMPTY: 0, gP: 1, gL: 2, gN: 3, gS: 4, gG: 5, gB: 6, gR: 7, gK: 8, gPa: 9, gLa: 10, gNa: 11, gSa: 12, gBa: 13, gRa: 14, oP: 15, oL: 16, oN: 17, oS: 18, oG: 19, oB: 20, oR: 21, oK: 22, oPa: 23, oLa: 24, oNa: 25, oSa: 26, oBa: 27, oRa: 28
};
// prettier-ignore
var PROMOTED_PIECES = {
  EMPTY: 0, gPa: 5, gLa: 5, gNa: 5, gSa: 5, gGa: 5, gBa: 6, gRa: 7, gKa: 8, oPa: 13, oLa: 13, oNa: 13, oSa: 13, oGa: 13, oBa: 14, oRa: 15, oKa: 16
};
// prettier-ignore
var PROMOTION = [0, 9, 10, 11, 12, 5, 13, 14, 8, 9, 10, 11, 12, 13, 14, 23, 24, 25, 26, 19, 27, 28, 22, 23, 24, 25, 26, 27, 28]
// prettier-ignore
var DEGRADATION = [0, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 6, 7, 15, 16, 17, 18, 19, 20, 21, 22, 15, 16, 17, 18, 20, 21]

var i = 0;
// board squares number
var BRD_SQ_NUM = 143;
// prettier-ignore
var FILES = {
  FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3, FILE_E: 4, FILE_F: 5, FILE_G: 6, FILE_H: 7, FILE_I: 8, FILE_NONE: 9
};
// prettier-ignore
var RANKS = {
  RANK_1: 0,RANK_2: 1,RANK_3: 2,RANK_4: 3,RANK_5: 4,RANK_6: 5,RANK_7: 6,RANK_8: 7,RANK_9: 8,RANK_NONE: 9
};
var RANKED_PLAYER = { LOWER: 0, HIGHER: 1, BOTH: 2 };
// prettier-ignore
var SQUARES = {
  A1: 23, B1: 24, C1: 25, D1: 26, E1: 27, F1: 28, G1: 29, H1: 30, I1: 31, A9: 111, B9: 112, C9: 113, D9: 114, E9: 115, F9: 116, G9: 117, H9: 118, I9: 119, NO_SQ: 120, OFFBOARD: 121
};

var BOOL = { FALSE: 0, TRUE: 1 };

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 81;
var INFINITE = 30000;
var MATE = 29000;
var PVENTRIES = 10000;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var START_FEN = "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL g";

//var PieceChar = ".PLNSGBRKPLNSBRplnsgbrkplnsbr";
// prettier-ignore
var PieceChar = ['.', 'P', 'L', 'N', 'S', 'G', 'B', 'R', 'K', 'Pa', 'La', 'Na', 'Sa', 'Ba', 'Ra', 'P', 'L', 'N', 'S', 'G', 'B', 'R', 'K', 'Pa', 'La', 'Na', 'Sa', 'Ba', 'Ra']
var SideChar = "go-";
var RankChar = "123456789";
var FileChar = "abcdefghi";

// File and Rank to Square
function FR2SQ(file, rank) {
  return 23 + file + rank * 11;
}

// Absolute pieces
// prettier-ignore
var PieceAbs = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE
];
// Major pieces [None,pawn,lance,knight,silver,gold,bishop,rook,king,p,n,l,s,b,r]
// prettier-ignore
var PieceMaj = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE
];
// Minor pieces [None,pawn,lance,knight,silver,gold,bishop,rook,king]
// prettier-ignore
var PieceMin = [
  BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE
];
// [None, pawn, lance, knight, silver, gold, bishop, rook, king]
// prettier-ignore
var PieceVal = [0, 100, 430, 450, 640, 690, 890, 1040, 50000, 420, 630, 640, 670, 1150, 1300, 100, 430, 450, 640, 690, 890, 1040, 50000,420, 630, 640, 670, 1150, 1300];
// [None, pawn, lance, knight, silver, gold, bishop, rook, king]
var PieceInHandVal = [0, 115, 480, 510, 720, 780, 1110, 1270, 50000, 115, 480, 510, 720, 780, 1110, 1270, 50000];

// Affiliation of pawns to the player
// prettier-ignore
var PiecePlayer = [
  RANKED_PLAYER.BOTH, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.LOWER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER, RANKED_PLAYER.HIGHER
];

// Assign a pawn
// prettier-ignore
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE
];
// prettier-ignore
var PieceLance = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE
];
// prettier-ignore
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE
];
// prettier-ignore
var PieceSilver = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE
];
// prettier-ignore
var PieceGold = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE
];
// prettier-ignore
var PieceBishop = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE
];
// prettier-ignore
var PieceRook = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE
];
// prettier-ignore
var PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE
];

var KingDir = [-1, 10, 11, 12, 1, -10, -11, -12];
var RookDir = [-1, 11, 1, -11];
var BishopDir = [10, 12, -10, -12];
var GoldDir = [-1, 10, 11, 12, 1, -11];
var SilverDir = [10, 11, 12, -10, -12];
var KnightDir = [21, 23];
var LanceDir = [11];
var PawnDir = [11];

var DirNum = [0, 1, 1, 2, 5, 6, 4, 4, 8, 6, 6, 6, 6, 8, 8, 1, 1, 2, 5, 6, 4, 4, 8, 6, 6, 6, 6, 8, 8];

// prettier-ignore
var PieceDir = [ 0, PawnDir, LanceDir, KnightDir, SilverDir, GoldDir, BishopDir, RookDir, KingDir, GoldDir, GoldDir, GoldDir, GoldDir, KingDir, KingDir, PawnDir, LanceDir, KnightDir, SilverDir, GoldDir, BishopDir, RookDir, KingDir, GoldDir, GoldDir, GoldDir, GoldDir, KingDir, KingDir
];

var RookProSlide = [1, 0, 1, 0, 1, 0, 1, 0];
var BishopProSlide = [0, 1, 0, 1, 0, 1, 0, 1];
// prettier-ignore
var LoopNonSlidePiece = [PIECES.gN, PIECES.gS, PIECES.gG, PIECES.gK, PIECES.gPa, PIECES.gLa, PIECES.gNa, PIECES.gSa, PIECES.gBa, PIECES.gRa, 0, PIECES.oN, PIECES.oS, PIECES.oG, PIECES.oK, PIECES.oPa, PIECES.oLa, PIECES.oNa, PIECES.oSa, PIECES.oBa, PIECES.oRa, 0];
var LoopNonSlideIndex = [0, 11];
// prettier-ignore
var LoopSlidePiece = [PIECES.gL, PIECES.gB, PIECES.gR, PIECES.gBa, PIECES.gRa, 0, PIECES.oL, PIECES.oB, PIECES.oR, PIECES.oBa, PIECES.oRa, 0];
var LoopSlideIndex = [0, 6];

var PieceKeys = new Array(30 * 142);
var SideKey;

var Sq142ToSq81 = new Array(BRD_SQ_NUM);
var Sq81ToSq142 = new Array(81);

// Table board
var mainTable;

function RAND_32() {
  return (
    (Math.floor(Math.random() * 255 + 1) << 23) |
    (Math.floor(Math.random() * 255 + 1) << 16) |
    (Math.floor(Math.random() * 255 + 1) << 8) |
    Math.floor(Math.random() * 255 + 1)
  );
}
// prettier-ignore
var Mirror81=[72,73,74,75,76,77,78,79,80,
              63,64,65,66,67,68,69,70,71,
              54,55,56,57,58,59,60,61,62,
              45,46,47,48,49,50,51,52,53,
              36,37,38,39,40,41,42,43,44,
              27,28,29,30,31,32,33,34,35,
              18,19,20,21,22,23,24,25,26,
              9 ,10,11,12,13,14,15,16,17,
              0 ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ]

function SQ81(sq142) {
  return Sq142ToSq81[sq142];
}
function SQ142(sq81) {
  return Sq81ToSq142[sq81];
}

function PIECEINDEX(piece, pieceNum) {
  return piece * 10 + pieceNum;
}

function MIRROR81(sq) {
  return Mirror81[sq];
}

var random = "";

var Kings = [PIECES.gK, PIECES.oK];

//0000 0000 0000 0000 0000 0111 1111 7bit for fromsq 81
//0000 0000 0000 0011 1111 1000 0000 7bit for tosq 81
//0000 0000 0111 1100 0000 0000 0000 5bit for captured
//0000 0000 1000 0000 0000 0000 0000 1bit if can be promoted?? awakening
//0001 1111 0000 0000 0000 0000 0000 5bit drop piece
//
// 0000 0000 0000 0000 0000 0000

function FROMSQ(m) {
  return m & 0x7f;
}
function TOSQ(m) {
  return (m >> 7) & 0x7f;
}
function CAPTURED(m) {
  return (m >> 14) & 0x1f;
}
function DROP(m) {
  return (m >> 20) & 0x7f;
}

var MFLAG_AWA = 0x80000;
var MFLAG_CAP = 0xfc000;
var MFLAG_PROM = 0xf80000;

var NOMOVE = 0;

function SQOFFBOARD(sq) {
  if (FilesBrd[sq] == SQUARES.OFFBOARD) return BOOL.TRUE;
  return BOOL.FALSE;
}

function HASH_PIECE(piece, sq) {
  GameBoard.posKey ^= PieceKeys[piece * 142 + sq];
}

function HASH_SIDE() {
  GameBoard.posKey ^= SideKey;
}

var GameController = {};
GameController.EngineSide = RANKED_PLAYER.BOTH;
GameController.PlayerSide = RANKED_PLAYER.BOTH;
GameController.GameOver = BOOL.FALSE;

var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;

// prettier-ignore
var HandSq = [120, 109, 98, 87, 76, 65, 54, 43, 32, 120, 120, 120, 120, 120, 120, 33, 44, 55, 66, 77, 88, 99, 110, 120, 120, 120, 120, 120, 120];
