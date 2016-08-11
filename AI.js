// Billings, M.
// blackKing thinks it's in check after being placed inCheck (see img001)
// ERROR some board states return Number.MAX_VALUE

var desiredPly = 1;		// the desired search depth
var successors = [];	// stores every board state that can be reached from moving a particular piece

// DEBUG
/* encapsulates data needed to infer the best move from a given state
 * board the board state represented 
 * action the action that led from the prior state to the current one
 *
 *
 */
function Node(board, utility, action, ply, children, parent) {
	this.board = board;
	this.utility = utility;
	this.action = action;
	this.ply = ply;
	this.parent = parent;
	this.children = children;
}

/* used to assign a value to the board state for the given colour.  The larger the value the better the board state for the given side.
 * eval(s) = w_1*f_1 + w_2*f_2 + .... , where f_1 = # of white pieces of type 1 - # of black pieces of type 1
 * consider factoring in promotion
 * s the board state to evaluate
 * maxIsWhite allows the AI to operate as the white or black player.  Max is always played by the AI.
 */
function utility(s, maxIsWhite) {
	var sum = 0;
	
	for (let tile of s.occupiedTiles) {
		// console.log("Piece: " + tile.piece);
		let val = tile.piece.value;

		if (maxIsWhite !== tile.piece.isWhite) { 	// DEBUG added maxIsWhite to try and account for if the player wants to play black
			val *= -1;
		}
		sum += val;
		
	}
	return sum;
}

/* returns an action with the best utility score.  Returns null if there are no legal actions to take.
 * 
 * 
 */ 
function minimax(board, maxIsWhite) {
	var nodes = [];				// store all possible moves from current board
	var possibleActions = [];	// stores all possible actions possible for a given board
	nodes.push(new Node(board, undefined, null, 0, undefined, null));			// push root node
	var action = null;					//the (or one of the) optimal actions to take
	var bestUtility = max(nodes[0], maxIsWhite, nodes);

	console.log('minimax returned: ' + bestUtility);
	let nextMoveNode = null;
	if (nodes[0].children !== undefined && nodes[0].children.length > 0) {
		for (var i = 0; i < nodes[0].children.length; i++) {		// ERRATA bugs out when there are no pieces left of a certain colour
			if (nodes[0].children[i].utility === bestUtility) {
				if (nextMoveNode == null || Math.random() >= 0.5)
					nextMoveNode = nodes[0].children[i];
				// DEBUG
				// if (nextMoveNode.action.actionType == ActionType.ENPASSANT) {
					// nextMoveNode = nodes[0].children[i];
					// break;
				// }
			}
		}
		action = nextMoveNode.action;
	}

	return action;	// return the action in successors(state) with value v
}

// contains common logic for min and max methods
function minimaxHelper(node, isRunningMaxCode, maxIsWhite, nodes) {		
	var u = (isRunningMaxCode) ? -Number.MAX_VALUE : Number.MAX_VALUE;
	var kingTile = (playerIsWhite) ? node.board.blackKingTile : node.board.whiteKingTile;
	var CPUColour = (playerIsWhite) ? BLACK : WHITE;
	
	//blackKingTile !== undefined used to test en passant
	terminalTestResult = terminalGameConditionTest(node.board)
	if (terminalTestResult.isTerminalState || node.ply == desiredPly) {	
		u = utility(node.board, maxIsWhite);
	}
	else {
		var child = null;
		var pieceColorToCheck = (maxIsWhite) ? WHITE : BLACK;
		if (!isRunningMaxCode)
			pieceColorToCheck = !pieceColorToCheck;
		var possibleActions = [];
		
		if (kingTile !== undefined && inCheck(node.board, CPUColour)) {	// CPU colour was BLACK
			possibleActions = kingTile.piece.getStandardMoves(node.board, false, kingTile.row, kingTile.column);
		}
		else {
			// loop through all the occupied tiles and find all the possible moves for the relevant team
			// try each of those moves and see which one offers the best result
			node.board.occupiedTiles.forEach(function(tile) {
				if (pieceColorToCheck == tile.piece.isWhite) {			// only check pieces of the appropriate colour
					// // DEBUG castling check for pawns
					// if (tile.row == 1 && tile.column == 0) 
						// console.log();
					possibleActions = possibleActions.concat(tile.piece.getStandardMoves(node.board, false, tile.row, tile.column));
	
					if (tile.piece.type == 'Pawn')
						possibleActions = possibleActions.concat(getEnPassantMoves(node.board, false, tile));
					else if (kingTile !== undefined && tile.piece.type == 'King') {
						// check right
						let castlingRookTile = board.getTile(tile.row, 7);
						if (castlingRookTile !== null && canCastle(tile, castlingRookTile))		
							possibleActions.push(new Action(this, ActionType.MOVE, tile.row, tile.column + 2));	
						// check left
						castlingRookTile = board.getTile(tile.row, 0);
						if (castlingRookTile !== null && canCastle(tile, castlingRookTile))		
							possibleActions.push(new Action(this, ActionType.MOVE, tile.row, tile.column - 2));	
					}
				}
			});
		}
		/* create a new board state for each of the possible actions
		 * note: possibleActions = [] if there are no possible moves which may cause problems for utility calculations done within this function
		 */
		for (let i = 0; i < possibleActions.length; i++) {
			// DEBUG
			// if (i == 4)
				// console.log();
			let agentTile = node.board.getTileWithPiece(possibleActions[i].agent);
			child = new Board(node.board);
			child.movePiece(agentTile.row, agentTile.column, possibleActions[i].row, possibleActions[i].column);
			
			// return list of actions if the King isn't in checkmate
			if (kingTile !== undefined) {
				if (!inCheck(child, CPUColour)) {
					let newNode = new Node(child, undefined, possibleActions[i], node.ply + 1, null, node);
					nodes.push(newNode);
					successors.push(newNode);
				}
				// else {
					// blackHasBeenCheckmated = true;
				// }		
			}	
		}
		possibleActions = [];
			
		node.children = successors;
		successors = [];
		
		if (node.children !== null) {
			// DEBUG
			// one player can't make any moves eg. they only have one pawn and it's blocked by a piece belonging to the opposing player - CATCH case, shouldn't happen in a real game
			if (node.children.length == 0) {
				u = utility(node.board, maxIsWhite);
			}
			// examine all children of current node
			else {
				for (let i = 0; i < node.children.length; i++) {
					// DEBUG
					if (i == 8 && node.ply == 0) 
						console.log();
					u = (isRunningMaxCode) ? Math.max(u, min(node.children[i], maxIsWhite, nodes)) : Math.min(u, max(node.children[i], maxIsWhite, nodes));
				}
			}
		}	
	}
	node.utility = u;
	return u;
}

/* AI is always max; the root of the search tree is a max node
 * AI plays the role of 'max' and desires to select the move which will maximize it's goal heuristic
 */
function max(node, maxIsWhite, nodes) {
	return minimaxHelper(node, true, maxIsWhite, nodes);	// 2nd argument is for isRunningMaxCode, which should always be true when max is called
}

function min(node, maxIsWhite, nodes) {
	return minimaxHelper(node, false, maxIsWhite, nodes);	// false
}