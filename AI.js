// Billings, M.
// DEBUG miniMax not returning best move
// DEBUG some board states return Number.MAX_VALUE

var desiredPly = 3;		// the desired search depth
var successors = [];

// DEBUG
var nodes = [];

/* encapsulates data needed to infer the best move from a given state
 * state the state of the board
 * action the action that led from the prior state to the current one
 *
 *
 */
function Node(state, utility, action, ply, children, parent) {
	this.state = state;
	this.utility = utility;
	this.action = action;
	this.ply = ply;
	this.parent = parent;
	this.children = children;
}

function highlightLogic(displayHighlight, tile, board) {
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
		if (tile.piece.isWhite)
			val *= -1;
		// console.log("Value: " + val);
		sum += val;
		
	}
	console.log("total sum: " + sum);
	return sum;
}

/*
 * returns an action with the best utility score THIS IS FILLER SO I CAN MAKE A COMMIT WITH A MESSAGE
 */ 
function minimax(state) {
	isCheckingBoard = true;		// prevent tiles in UI from being visibly highlighted
	nodes.push(new Node(state, undefined, null, 0, undefined, null));			// push root node
	var action;					//the (or one of the) optimal actions to take
	var bestUtility = max(nodes[0]);
	isCheckingBoard = false;
	// nodes = [];
	console.log('minimax returned: ' + bestUtility);
	let nextMoveNode = null;
	for (var i = 0; i < nodes[0].children.length; i++) {
		if (nodes[0].children[i].utility === bestUtility) {
			nextMoveNode = nodes[0].children[i];
		}
	}
	action = nextMoveNode.action;
	return action;	// return the action in successors(state) with value v
}

// contains common logic for min and max methods
function minimaxHelper(node, isRunningMaxCode, parent) {
	var u = (isRunningMaxCode) ? -Number.MAX_VALUE : Number.MAX_VALUE;
	// if TERMINAL-STATE(state) then return UTILITY(state)
	if (isTerminalState(node.state) || node.ply == desiredPly) {	
		u = utility(node.state);
	}
	else {
		let child = null;
		// loop through all the occupied tiles and find all the possible moves for the relevant team
		// try each of those moves and see which one offers the best result
		node.state.occupiedTiles.forEach(function(tile) {
			let pieceColorToCheck = (isRunningMaxCode) ? BLACK : WHITE;
			
			if (pieceColorToCheck == tile.piece.isWhite) {			// only check pieces of the appropriate colour
				highlightLogic(true, tile, node.state);				// find which actions the piece in question can take
				
				// create a new board state for each of the possible actions
				allHighlightedTiles.forEach(function(action, index) {
					child = new Board(node.state);
					child.movePiece(tile.row, tile.column, allHighlightedTiles[index].row, allHighlightedTiles[index].column);
					
					//DEBUG
					let newNode = new Node(child, undefined, allHighlightedTiles[index], node.ply + 1, null, node);
					nodes.push(newNode);
					successors.push(newNode);
				});
				allHighlightedTiles = [];
			}
		});
		// currentPly++;
		node.children = successors;
		successors = [];
		// for each a in ACTIONS(state)
		// v = MAX(v, MIN_VALUE(result(s, a)))
		if (node.children !== null) {
			for (var i = 0; i < node.children.length; i++) {
				// examine all children of current node
				u = (isRunningMaxCode) ? Math.max(u, min(node.children[i])) : Math.min(u, max(node.children[i]));
			}
		}
	}
	
	node.utility = u;
	return u;
}

/* by the AI; the root of the search tree is a max node
 * AI plays the role of 'max' and desires to select the move which will maximize it's goal heuristic
 */
function max(node) {
	return minimaxHelper(node, true);
}

function min(node) {
	return minimaxHelper(node, false);
}

/* TODO doesn't check for stalemate or surrender
 * returns true if the game is over and false otherwise
 */
function isTerminalState(state) {
	//game ends when one player captures the opponent's king, a player surrenders, or there is a stalemate
	var isTerminal = false;
	let blackKingLives = false;
	let whiteKingLives = false;
	
	//DEBUG 
	let blackPieces = 0;
	let whitePieces = 0;
	
	state.occupiedTiles.forEach(function(tile) {
		// if (tile.piece.type == "King")
			// if (tile.piece.isWhite)
				// whiteKingLives = true;
			// else
				// blackKingLives = true;
		if (tile.piece.isWhite)
			whitePieces++;
		else
			blackPieces++;
	});
	
	if (blackPieces == 0 || whitePieces == 0)
		isTerminal = true;
	// if (!whiteKingLives || !blackKingLives) {
		// return true
	// }
	
	// a stalemate occurs when the only 2 pieces on the board are Kings, regardless of their position, or if the remaining pieces on the board make checkmate impossible (e.g. can't checkmate an appointing with only a king and a bishop)
	return isTerminal;
}

