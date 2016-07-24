// Billings, M.
// ERROR some board states return Number.MAX_VALUE

var desiredPly = 1;		// the desired search depth
var successors = [];	// stores every board state that can be reached from moving a particular piece

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

/* returns an action with the best utility score.  Currently always returns the last child of the root with the greatest utility
 * 
 * 
 */ 
function minimax(state, maxIsWhite) {
	// isCheckingBoard = true;		// prevent tiles in UI from being visibly highlighted
	var nodes = [];				// store all possible moves from current state
	var possibleActions = [];	// stores all possible actions possible for a given state
	nodes.push(new Node(state, undefined, null, 0, undefined, null));			// push root node
	var action = null;					//the (or one of the) optimal actions to take
	var bestUtility = max(nodes[0], maxIsWhite, nodes);
	console.log('minimax returned: ' + bestUtility);
	let nextMoveNode = null;
	if (nodes[0].children !== undefined && nodes[0].children.length > 0) {
		for (var i = 0; i < nodes[0].children.length; i++) {		// ERRATA bugs out when there are no pieces left of a certain colour
			if (nodes[0].children[i].utility === bestUtility) {
				nextMoveNode = nodes[0].children[i];
			}
		}
		action = nextMoveNode.action;
	}
	else {
		alert('no children for this node state');
	}
	return action;	// return the action in successors(state) with value v
}

// contains common logic for min and max methods
function minimaxHelper(node, isRunningMaxCode, maxIsWhite, nodes) {		
	var u = (isRunningMaxCode) ? -Number.MAX_VALUE : Number.MAX_VALUE;
	// var CPUColour = (playerIsWhite) ? BLACK : WHITE;
	
	//blackKingTile !== undefined used to test en passant
	
	if (isTerminalState(node.state) || node.ply == desiredPly) {	
		u = utility(node.state, maxIsWhite);
	}
	else {
		var child = null;
		var pieceColorToCheck = (maxIsWhite) ? WHITE : BLACK;
		if (!isRunningMaxCode)
			pieceColorToCheck = !pieceColorToCheck;
		var possibleActions = [];
		
		if (blackKingTile !== undefined && inCheck(board, BLACK)) {
			possibleActions = blackKingTile.piece.getStandardMoves(node.state, false, blackKingTile.row, blackKingTile.column);
		}
		else {
			// loop through all the occupied tiles and find all the possible moves for the relevant team
			// try each of those moves and see which one offers the best result
			node.state.occupiedTiles.forEach(function(tile) {
				if (pieceColorToCheck == tile.piece.isWhite) {			// only check pieces of the appropriate colour
					// // DEBUG castling check for pawns
					// if (tile.row == 1 && tile.column == 0) 
						// console.log();
					possibleActions = possibleActions.concat(tile.piece.getStandardMoves(node.state, false, tile.row, tile.column));
	
					if (tile.piece.type == 'Pawn')
						possibleActions = possibleActions.concat(getEnPassantMoves(node.state, false, tile.row, tile));
					else if (blackKingTile !== undefined && tile.piece.type == 'King') {
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
		possibleActions.forEach(function(action, index) {
			child = new Board(node.state);
			child.movePiece(action.agent.row, action.agent.column, possibleActions[index].row, possibleActions[index].column);
			
			// return list of actions if the King isn't in checkmate
			if (blackKingTile !== undefined && !(blackKingTile.piece.isInCheck && inCheck(BLACK))) {
				let newNode = new Node(child, undefined, possibleActions[index], node.ply + 1, null, node);
				nodes.push(newNode);
				successors.push(newNode);
			}
			else if (blackKingTile !== undefined) {
				blackIsInCheckmate = true;
			}			
		});
		possibleActions = [];
			
		node.children = successors;
		successors = [];
		
		if (node.children !== null) {
			// DEBUG
			// one player can't make any moves eg. they only have one pawn and it's blocked by a piece belonging to the opposing player - CATCH case, shouldn't happen in a real game
			if (node.children.length == 0) {
				u = utility(node.state, maxIsWhite);
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

/* TODO doesn't check for stalemate or surrender
 * returns true if the game is over and false otherwise
 */
function isTerminalState(state) {
	var isTerminalState = false;
	var blackKing = blackKingTile.piece;
	
	// TODO check if the function call is necessary here 
	// if (inCheck(CPUColour) || inCheck(CPUColour)
		// || board.occupiedTiles.length == 2) {	// only 2 kings on board
			// isTerminalState = true;
	// }
	
	
	// a stalemate occurs when the only 2 pieces on the board are Kings, regardless of their position, or if the remaining pieces on the board make checkmate impossible (e.g. can't checkmate an opponent with only a king and a bishop)
	return isTerminalState;
}

