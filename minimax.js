var max; //alpha best explored option along path to root for max
var min; //beta best explored option along path to root for min
var ply = 2;	//tree depth + 1
var isMaxTurn = true;
var whitePieces = { //hold all the white pieces on the board (should maybe be set upt in chessboardScript when game is initialized)
	pawns: 8,
	rooks: 2,
	knights: 2,
	bishops: 2,
	queens: 1,
	kings: 1
};
var blackPieces = {
	pawns: 6,
	rooks: 2,
	knights: 2,
	bishops: 2,
	queens: 1,
	kings: 1
};

/*each node has children, a worst-case value (max starts at -infinity), and an alpha and beta value, ply

*/
/*max = player who's turn it is
//generate all possible states from current states
//use heuristic to assign each child state a value

/* score the gamestate
*/
function heuristic(playerIsWhite) {
	var val;	//summation of [pieceValue * (your pawns - their pawns)] for each piece type
	var yourPieces = (playerIsWhite) ? whitePieces : blackPieces;
	var theirPieces;
	val = Pawn.prototype.value * (yourPieces["pawns"]);
	//alert(val);
}	

function successor() { //generate valid moves from current moves
}

function utility() {  //maps end-game state (ie. win/loss/draw) to a score
}

//test if game is finished
