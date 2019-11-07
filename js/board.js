var GameBoard = {};

GameBoard.piecies = new Array(BRD_SQ_NUM);
GameBoard.side = RANKED_PLAYER.LOWER;
//GameBoard.fiftyMove = 0; // for chess -> if 50 moves done without  == draw (shogi dont have this)
GameBoard.hisPlay = 0; // count every move which has been made from the start
GameBoard.ply = 0; // nr half moves made in search tree
//GameBoard.castePerm = 0; // for chess, in shogi there is no castling
GameBoard.material = new Array(2); // Higher and lower player material of pieces
