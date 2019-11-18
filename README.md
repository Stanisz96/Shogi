# Shogi
Shogi is a strategy board game. It's similar to chess, also known as Japanese chess. To describe this quickly, let's talk about main difference between Shogi and chess:
 - Board is 9x9
 - There is more pieces (King, Rook, Bishop, Gold General, Silver General, Knight, Lance, Pawn)
 - Almost every pieces can be promoted (except King and Gold General)
 - Promotion can be done while player move piece to/in oponnets area
 - When a player capture a pieces - he/she can draps captured pices on board as his/her own (cost - turn)
 - Pawns capture the same way they move
 - There is no initial two-space pawn move and no en-passant move.
 - There is no special castling move. There are a large number of possible defensive formations referred to as “castles” (see Sample game)    but there is no need for special moves to create them.
 - A given piece can only promote to one other kind of piece.
 
 
# Version 1.0
## Game
Game works without some rules:
- There is no promotion
- Can't drop captured pieces
- There is no draw rule "Sennichite" and "Jishogi"
- Player can't do illegal move
## AI
Builded AI machine is based on MinMax and AlphaBeta. Additionali there are some functions to optimalize number of searching moves. Evaluaton is not taken into account.
## Layout
![game layout](https://raw.githubusercontent.com/Stanisz96/Shogi/master/images/game.png)
