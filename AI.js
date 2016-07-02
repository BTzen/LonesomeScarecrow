// DEBUG hasMoved is being set to true when it shouldn't be
// DEBUG miniMax not returning best move
var player_max = BLACK;		// played by the AI; the root of the search tree is a max node
var player_min = WHITE;
var desiredPly = 2;		// the desired search depth
var successors = [];
// var root = new Node(null, board);
// DEBUG
var utilityResults = 0;
var nodes = [];
var tempUtility = -Math.MAX_VALUE;

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
	var action;
	var v = max(nodes[0]);
	isCheckingBoard = false;
	// nodes = [];
	console.log('minimax returned: ' + v);
	let nextMoveNode = null;
	for (var i = 0; i < nodes[0].children.length; i++) {
		if (nodes[0].children[i].utility === v) {
			nextMoveNode = nodes[0].children[i];
		}
	}
	// return action;	// return the action in successors(state) with value v
}

// contains common logic for min and max methods
function minimaxHelper(node, isRunningMaxCode, parent) {
	// var bestNode;		// node with the highest minimax value in the search tree
	var u = (isRunningMaxCode) ? -Number.MAX_VALUE : Number.MAX_VALUE;
	// if TERMINAL-STATE(state) then return UTILITY(state)
	if (false || node.ply == desiredPly) {	// isTerminalState(state)
		u = utility(node.state);
		// assign the utility value to the state once discovered
		node.utility = u;
		// for (var i = 0; i < nodes.length; i++) {
			// if (Object.is(nodes[i].state, node.state)) {
				// nodes[i].utility = u;
				// break;
			// }
		// }
	}
	else {
		let child = null;
		// loop through all the occupied tiles and find all the possible moves for the relevant team
		// try each of those moves and see which one offers the best result
		node.state.occupiedTiles.forEach(function(tile) {
			let pieceColorToCheck = (isRunningMaxCode) ? BLACK : WHITE;
			
			if (pieceColorToCheck == tile.piece.isWhite) {		// only check pieces of the appropriate colour
				highlightLogic(true, tile, node.state);				// find which actions this specific piece can take
				
				// create a new board state for each of the possible actions
				allHighlightedTiles.forEach(function(action, index) {
					// let child = new Board();
					// child.clone(board);
					child = new Board(node.state);
					
					// let isSame = (child === board);
					// let t2 = (child == board);
					// let t3 = Object.is(child, board);
					// let t4 = Object.is(board, board);
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
			// nodes[i + 1].utility = u;					// first node is the root so I need to start at the element at index i+1
			}
		}
	}
	
	return u;
}

function max(node) {
	return minimaxHelper(node, true);
	// var u = -Number.MAX_VALUE;
	// if TERMINAL-STATE(state) then return UTILITY(state)
	// if (false || currentPly == desiredPly) {	// isTerminalState(state)
		// u = utility(state);
		// for (var i = 0; i < nodes.length; i++) {
			// if (Object.is(nodes[i].state, state)) {
				// nodes[i].utility = u;
			// }
		// }
	// }
	// else {
		// // loop through all the occupied tiles and find all the possible moves for the relevant team
		// // try each of those moves and see which one offers the best result
		// board.occupiedTiles.forEach(function(tile) {
			// if (player_max == tile.piece.isWhite) {		// only check pieces of the appropriate colour
				// highlightLogic(true, tile);				// find which actions this specific piece can take
				
				// // create a new board state for each of the possible actions
				// allHighlightedTiles.forEach(function(action, index) {
					// // let child = new Board();
					// // child.clone(board);
					// let child = new Board(board);
					
					// // let isSame = (child === board);
					// // let t2 = (child == board);
					// // let t3 = Object.is(child, board);
					// // let t4 = Object.is(board, board);
					// child.movePiece(tile.row, tile.column, allHighlightedTiles[index].row, allHighlightedTiles[index].column);
					// successors.push(child);
					
					// //DEBUG
					// let node = new Node(child, undefined, allHighlightedTiles[index], currentPly + 1);
					// nodes.push(node);
				// });
			// }
		// });
		// currentPly++;
		// allHighlightedTiles = []
		// // for each a in ACTIONS(state)
		// // v = MAX(v, MIN_VALUE(result(s, a)))
		// for (var i = 0; i < successors.length; i++) {
			// u = Math.max(u, min(successors[i]));
			// // nodes[i + 1].utility = u;					// first node is the root so I need to start at the element at index i+1
		// }
	// }
	
	// return u;
}

function min(node) {
	return minimaxHelper(node, false);
}

/* TODO doesn't check for stalemate or surrender
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

