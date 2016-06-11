var MIN;
var MAX;
var ply;		// the desired search depth
var successors = [];

//var currentBoardState = board.get
var actor = MAX;

/* 
 *
 */
function generateSuccessors(state, bColour) {
	// loop through every piece on the board of the given colour
	isCheckingBoard = true;
	for (let currentTile of occupiedTiles) {
		// apply some criteria to only check moves for pieces of given colour
		if (currentTile.piece.colour == bColour) { // only apply to pieces belonging to the side whose turn it is
			// chessPieceListener(ctxHighlight, )
		}	
		
		// switch (currentTile.piece.type) {
			// case "Pawn":
				// console.log('current tile: ' + currentTile);
				// console.log('read as pawn');
				// break;
			// default:
				// console.log('default case');
		// }
	}
	// create a new board state for each of the possible moves from the current state
	//
	isCheckingBoard = false;
}

function highlightLogic(displayHighlight) {
	if (displayHighlight)
		isCheckingBoard = false;
	else
		isCheckingBoard = true;
	
	lastSelectedTile = getBoardTileWithCoords(board, x, y);
	lastRow = row;
	lastColumn = column;
	highlightedTiles = [];
	
	// only allow interaction with pieces of the correct colour
	if (lastSelectedTile !== undefined)
		var turnCheck = lastSelectedTile.piece.isWhite === lastSelectedTile.piece.isWhite; // DEBUG: currently lets you select any piece; isWhiteTurn
	//check what kind of highlighting should take place based on the piece type
	if (lastSelectedTile.piece.type === "Pawn" && turnCheck) {
		//if pawn hasn't moved, highlight up to 2 spaces forward
		let forwardMoves = (lastSelectedTile.piece.hasMoved) ? 2 : 1; //how many space the piece can potentially move forward
		pawnListener(ctxHighlight, board, row, column, forwardMoves, lastSelectedTile.piece.isWhite);
	} 
	else if (lastSelectedTile.piece.type === "Rook" && turnCheck) {
		rookListener(ctxHighlight, board, row, column);
	} 
	else if (lastSelectedTile.piece.type === "Knight" && turnCheck) {
		knightListener(ctxHighlight, board, row, column);
	} 
	else if (lastSelectedTile.piece.type === "Bishop" && turnCheck) {
		bishopListener(ctxHighlight, board, row, column);
	}
	else if (lastSelectedTile.piece.type === "Queen" && turnCheck) {
		queenListener(ctxHighlight, board, row, column);
	}
	else if (lastSelectedTile.piece.type === "King" && turnCheck) {
		kingListener(ctxHighlight, board, row, column);
	}
}
/* used to assign a value to the board state for the given colour.  The larger the value the better the board state for the given side.
 * eval(s) = w_1*f_1 + w_2*f_2 + .... , where f_1 = # of white pieces of type 1 - # of black pieces of type 1
 * board the board state to evaluate
 */
function evaluateBoard(board) {
	let sum = 0;
	
	console.log(board.occupiedTiles.length);
	for (let tile of board.occupiedTiles) {
		console.log("Piece: " + tile.piece);
		let val = tile.piece.value;
		if (!tile.piece.isWhite)
			val *= -1;
		console.log("Value: " + val);
		sum += val;
		console.log("current sum: " + sum);
	}
}

function maxValue(state) {
	
}

