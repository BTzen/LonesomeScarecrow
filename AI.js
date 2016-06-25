var player_max = BLACK;		// moves first
var player_min = WHITE;
var currentPly = 0;
var desiredPly = 1;		// the desired search depth
var currentChildStates = [];
// var root = new Node(null, board);

function Node(parent, board) {
	this.parent = parent;
	this.board = board
}

/* 
 *
 */
function generateSuccessors(state, bColour) {
	let boards = [];	// array of all board states that can be reached from the current board state in one move
	// loop through every piece on the board of the given colour
	isCheckingBoard = true;
	for (let currentTile of board.occupiedTiles) {
		// apply some criteria to only check moves for pieces of given colour
		if (currentTile.piece.isWhite === bColour) { // only apply to pieces belonging to the side whose turn it is
			// chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
			highlightLogic('garbage', currentTile);
			
		}	
	}
	
	// create a new board state for each of the possible moves from the current state
	for (let action of allHighlightedTiles) {
		boards.push(new Board());
	}
	
	isCheckingBoard = false;
}

function highlightLogic(displayHighlight, tile) {
	// if (displayHighlight)
		// isCheckingBoard = false;
	// else
		// isCheckingBoard = true;
	
	// tile = getBoardTileWithCoords(board, x, y);
	highlightedTiles = [];
	
	// only allow interaction with pieces of the correct colour
	if (tile !== undefined)
		var turnCheck = tile.piece.isWhite === tile.piece.isWhite; // DEBUG: currently lets you select any piece; isWhiteTurn
	//check what kind of highlighting should take place based on the piece type
	if (tile.piece.type === "Pawn" && turnCheck) {
		//if pawn hasn't moved, highlight up to 2 spaces forward
		let forwardMoves = (!tile.piece.hasMoved) ? 2 : 1; //how many space the piece can potentially move forward
		pawnListener(ctxHighlight, board, tile.row, tile.column, forwardMoves, tile.piece.isWhite);
	} 
	else if (tile.piece.type === "Rook" && turnCheck) {
		rookListener(ctxHighlight, board, tile.row, tile.column);
	} 
	else if (tile.piece.type === "Knight" && turnCheck) {
		knightListener(ctxHighlight, board, tile.row, tile.column);
	} 
	else if (tile.piece.type === "Bishop" && turnCheck) {
		bishopListener(ctxHighlight, board, tile.row, tile.column);
	}
	else if (tile.piece.type === "Queen" && turnCheck) {
		queenListener(ctxHighlight, board, tile.row, tile.column);
	}
	else if (tile.piece.type === "King" && turnCheck) {
		kingListener(ctxHighlight, board, tile.row, tile.column);
	}
}

/* used to assign a value to the board state for the given colour.  The larger the value the better the board state for the given side.
 * eval(s) = w_1*f_1 + w_2*f_2 + .... , where f_1 = # of white pieces of type 1 - # of black pieces of type 1
 * board the board state to evaluate
 */
function utility(s) {
	let sum = 0;
	
	// console.log("Current number of tiles on given board: " + s.occupiedTiles.length);
	for (let tile of s.occupiedTiles) {
		// console.log("Piece: " + tile.piece);
		let val = tile.piece.value;
		if (!tile.piece.isWhite)
			val *= -1;
		// console.log("Value: " + val);
		sum += val;
		console.log("current sum: " + sum);
	}
	
	return sum;
}

/*
 * returns an action
 */ 
function minimax(state) {
	return Math.max;
}

function max(state) {
	// if TERMINAL-STATE(state) then return UTILITY(state)
	// v = -infinity
	// for each a in ACTIONS(state)
	// v = MAX(v, MIN_VALUE(result(s, a)))
	// return v
	console.log('max');
	if (false || currentPly == desiredPly)	// isTerminalState(state)
		return utility(state);
	
	isCheckingBoard = true;		// prevent tiles in UI from being visibly highlighted
	var v = Number.MIN_VALUE;
	// loop through all the occupied tiles and find all the possible moves for the relevant team.
	// try each of those moves and see which one offers the best result
	
	board.occupiedTiles.forEach(function(tile) {
		if (player_max == tile.piece.isWhite) {		// only check pieces of the appropriate colour
			highlightLogic(true, tile);			// find which actions this specific piece can take
			
			// create a new board state for each of the possible actions
			allHighlightedTiles.forEach(function(action, index) {
				// let child = new Board();
				// child.clone(board);
				let child = new Board(board);
				
				// let isSame = (child === board);
				// let t2 = (child == board);
				// let t3 = Object.is(child, board);
				// let t4 = Object.is(board, board);
				child.movePiece(tile.row, tile.column, allHighlightedTiles[index].row, allHighlightedTiles[index].column);
				currentChildStates.push(child);
			});
		}
		currentPly++;
		
		for (var i = 0; i < currentChildStates.length; i++) {
			v = Math.max(v, min(currentChildStates[i]));
		}
		// currentChildStates.forEach(function(state, index) {
			// v = Math.max(v, min(state));
		// });
	});
	
	// v = max(v, min(result(s,a))
	
	// returns a utility value
	isCheckingBoard = false;
}

function min(state) {
	// if TERMINAL-STATE(state) then return UTILITY(state)
	// v = -infinity
	// for each a in ACTIONS(state)
	// v = MAX(v, MIN_VALUE(result(s, a)))
	// return v
	console.log('min');
	
	if (false || currentPly == desiredPly)	// isTerminalState(state)
		return utility(state);
	
	isCheckingBoard = true;
	var v = Number.MAX_VALUE;

	board.occupiedTiles.forEach(function(tile) {
		if (player_max == tile.piece.isWhite) {		// only check pieces of the appropriate colour
			highlightLogic(true, tile);			// find which actions this specific piece can take
			
			// create a new board state for each of the possible actions
			allHighlightedTiles.forEach(function(action, index) {
				let child = new Board(board);
				child.movePiece(tile.row, tile.column, allHighlightedTiles[index].row, allHighlightedTiles[index].column);
				currentChildStates.push(child);
			});
		}
		currentPly++;
		
		currentChildStates.forEach(function(state, index) {
			v = Math.min(v, max(state));
		});
	});
	// returns a utility value
	isCheckingBoard = false;
}
/*
 * returns true if the game is over and false otherwise
 */
function isTerminalState(state) {
	//game ends when one player captures the opponent's king, a player surrenders, or there is a stalemate
	let blackKingLives = false;
	let whiteKingLives = false;
	
	state.occupiedTiles.forEach(function(tile) {
		if (tile.piece.type == "King")
			if (tile.piece.isWhite)
				whiteKingLives = true;
			else
				blackKingLives = true;
	});
	
	if (!whiteKingLives || !blackKingLives) {
		return true
	}
	
	// a stalemate occurs when the only 2 pieces on the board are Kings, regardless of their position, or if the remaining pieces on the board make checkmate impossible (e.g. can't checkmate an appointing with only a king and a bishop)
}

