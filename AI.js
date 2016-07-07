// Billings, M.
// DEBUG miniMax not returning best move
// DEBUG some board states return Number.MAX_VALUE

var desiredPly = 3;		// the desired search depth
var successors = [];

// DEBUG

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
		var turnCheck = tile.piece.isWhite === tile.piece.isWhite; // ERRATA: currently lets you select any piece; isWhiteTurn
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
 * consider factoring in promotion
 * s the board state to evaluate
 * maxIsWhite allows the AI to operate as the white or black player.  Max is always played by the AI.
 */
function utility(s, maxIsWhite) {
	var sum = 0;
	
	// console.log("Current number of tiles on given board: " + s.occupiedTiles.length);
	for (let tile of s.occupiedTiles) {
		// console.log("Piece: " + tile.piece);
		let val = tile.piece.value;
		// DEBUG not tested
		/* check if the piece in question is a pawn which has reached the opposite end of the board
		 * and is therefore a candidate for promotion.
		 */
		// let promotionRow = (tile.piece.isWhite) ? 0 : 7;
		// if (tile.piece.type == 'Pawn' && tile.row == promotionRow)
			// val += 10;							// arbitrary value to add weight to actions that result in promotion
		
		if (maxIsWhite !== tile.piece.isWhite) { 	// DEBUG added maxIsWhite to try and account for if the player wants to play black
			val *= -1;
		}
		// console.log("Value: " + val);	
		sum += val;
		
	}
	// console.log("total sum: " + sum);
	return sum;
}

/*
 * returns an action with the best utility score.  Currently always returns the last child of the root with the greatest utility
 * 
 */ 
function minimax(state, maxIsWhite) {
	isCheckingBoard = true;		// prevent tiles in UI from being visibly highlighted
	var nodes = [];				// store all possible moves from current state
	nodes.push(new Node(state, undefined, null, 0, undefined, null));			// push root node
	var action = null;					//the (or one of the) optimal actions to take
	var bestUtility = max(nodes[0], maxIsWhite, nodes);
	isCheckingBoard = false;
	// nodes = [];
	console.log('minimax returned: ' + bestUtility);
	let nextMoveNode = null;
	if (nodes[0].children !== undefined) {
		for (var i = 0; i < nodes[0].children.length; i++) {		// ERRATA bugs out when there are no pieces left of a certain colour
			if (nodes[0].children[i].utility === bestUtility) {
				nextMoveNode = nodes[0].children[i];
			}
		}
		action = nextMoveNode.action;
	}
	return action;	// return the action in successors(state) with value v
}

// contains common logic for min and max methods
function minimaxHelper(node, isRunningMaxCode, maxIsWhite, nodes) {		
	// DEBUG find out why this node is giving a utility of -7 DOESN'T WORK
	// if (node.action !== null && node.action !== undefined) {
		// if (node.action.agent == 'Pawn' &&node.action.row == 4 && node.action.column == 3)
			// console.log();
	// }
	
	
	var u = (isRunningMaxCode) ? -Number.MAX_VALUE : Number.MAX_VALUE;
	// if TERMINAL-STATE(state) then return UTILITY(state)
	if (isTerminalState(node.state) || node.ply == desiredPly) {	
		u = utility(node.state, maxIsWhite);
	}
	else {
		var child = null;
		var pieceColorToCheck = (maxIsWhite) ? WHITE : BLACK;
		if (!isRunningMaxCode)
			pieceColorToCheck = !pieceColorToCheck;
			
			
		// loop through all the occupied tiles and find all the possible moves for the relevant team
		// try each of those moves and see which one offers the best result
		node.state.occupiedTiles.forEach(function(tile) {
			if (pieceColorToCheck == tile.piece.isWhite) {			// only check pieces of the appropriate colour
				highlightLogic(true, tile, node.state);				// find which actions the piece in question can take
				
				/* create a new board state for each of the possible actions
				 * note: allHighlightedTiles = [] if there are no possible moves which may cause problems for utility calculations done within this function
				 */
				allHighlightedTiles.forEach(function(action, index) {
					child = new Board(node.state);
					child.movePiece(tile.row, tile.column, allHighlightedTiles[index].row, allHighlightedTiles[index].column);
					
					//DEBUG
					let newNode = new Node(child, undefined, allHighlightedTiles[index], node.ply + 1, null, node);
					// if (nodes === undefined)
						// console.log();
					// if (nodes.length == 17) 
						// var ab = 0;
					
					nodes.push(newNode);
					successors.push(newNode);
				});
				allHighlightedTiles = [];
			}
		});
		node.children = successors;
		successors = [];
		
		if (node.children !== null) {
			// examine all children of current node
			for (let i = 0; i < node.children.length; i++) {
				if (i == 8 && node.ply == 0) 
					console.log();
				u = (isRunningMaxCode) ? Math.max(u, min(node.children[i], maxIsWhite, nodes)) : Math.min(u, max(node.children[i], maxIsWhite, nodes));
			}
		}
		// DEBUG
		// one player can't make any moves eg. they only have one pawn and it's blocked by a piece belonging to the opposing player - CATCH case, shouldn't happen in a real game
		if (node.children.length == 0) {
			u = utility(node.state, maxIsWhite);
		}
	}
	// DEBUG
	if (u == -7) {
		console.log();
	}
	node.utility = u;
	return u;
}

/* by the AI; the root of the search tree is a max node
 * AI plays the role of 'max' and desires to select the move which will maximize it's goal heuristic
 */
function max(node, maxIsWhite, nodes) {
	return minimaxHelper(node, true, maxIsWhite, nodes);	// 2nd argument is for isRunningMaxCode, which should always be true when max is called
}

function min(node, maxIsWhite, nodes) {
	return minimaxHelper(node, false, maxIsWhite, nodes);	// false
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
	
	// checks for presence of Kings
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
	if (blackPieces == 1 && whitePieces == 1 && blackKingLives && whiteKingLives)
		isTerminal = true;
	// if (!whiteKingLives || !blackKingLives) {
		// return true
	// }
	
	// a stalemate occurs when the only 2 pieces on the board are Kings, regardless of their position, or if the remaining pieces on the board make checkmate impossible (e.g. can't checkmate an opponent with only a king and a bishop)
	return isTerminal;
}

