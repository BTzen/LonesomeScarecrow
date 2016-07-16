// contains methods that provide a mechanism to enforce the rules of chess and provide information on board and game state

// DEBUG: MAY NEED TO CHANGE ALL OF THESE to Board.prototype functions

/* Checks if castling is possible with rook at given position
 * TODO needs to check if King is currently in check
 */
function canCastle(castlingKingTile, castlingRookTile) {
	var canCastle = true;
	
	if (castlingRookTile !== null && castlingRookTile.piece.type == 'Rook' && !castlingRookTile.piece.hasMoved && !castlingKingTile.piece.hasMoved) {
		var possibleEnemyActions = [];
		if (inCheck(castlingKingTile, possibleEnemyActions)) {
			return false;
		}
		var startCol, endCol;
		
		if (castlingRookTile.column == 0) {
			startCol = 1;		//inclusive
			endCol = 4;			//exclusive
		}
		else {
			startCol = 5;	//inclusive
			endCol = 7;		//exclusive
		}
		
		// check that there are no pieces between the king and the rook
		for (let i = startCol; i < endCol; i++) {
			if (board.getPiece(castlingKingTile.row, i) !== null) 
				return false;
		}

		// find the actions every enemy piece on the board can take from their current positions to determine if castling is possible
		for (let currentRow = 0; currentRow < 8; currentRow++) {
			for (let currentColumn = 0; currentColumn < 8; currentColumn++) {
				let currentTile = board.getTile(currentRow, currentColumn);
				if (currentTile !== null && currentTile.piece.isWhite !== castlingKingTile.piece.isWhite) {
					if (currentTile.piece.type !== 'Pawn') {
						possibleEnemyActions = possibleEnemyActions.concat(currentTile.piece.getStandardMoves(board, false, currentTile.row, currentTile.column));
					}
					else {
						if (Math.abs(currentTile.row - castlingKingTile.row) == 1) {	// piece needs to be 1 row away from the king
							let columnDifference = currentTile.column - castlingKingTile.column;
							// left-hand or right-hand rook
							if (startCol == 1) {		// lefthand
								if (columnDifference > -4 && columnDifference <= 1) {
									// console.log("can't castle left");
									canCastle = false;
									break;
								}
							}
							else {
								if (columnDifference >= -1) {
									// console.log("can't castle right");
									canCastle = false;
									break;
								}
							}
						}
					}
				}
			}
		}
		if (canCastle) {
			for (let i = 0; i < possibleEnemyActions.length; i++) {
				var currentMove = possibleEnemyActions[i];
				if (currentMove.row === castlingKingTile.row && currentMove.column >= startCol && currentMove.column < endCol) {
					console.log("in castle check");
					canCastle = false;
					break;
				}
			}
		}
	}
	else 
		canCastle = false;
	/* Need to update the data of last tile as the current way of checking pieces changes the lastSelectedPiece and associated data
	 * 
	*/
	// lastSelectedTile = new Tile(king, kingsRow, 4);	
	// isCheckingBoard = false;	// DEBUG remove all instances of this var when possible
	var sRookToCastleWith = (castlingRookTile.column == 0) ? 'left rook' : 'right rook';
	console.log('canCastle with ' + sRookToCastleWith + ': ' + canCastle);
	return canCastle;
}

/*
 * row the row of the pawn that moves 2 spaces forward, post move(and the one that is potentially vulnerable to en passant)
 * col the column of said pawn
 */
// function enPassantCheck(row, column) {
	// //capturing pawn must be on its 5th rank before executing the maneuver
	// //check for pawns immediate to the right and left of the pawn that moved
	// var rightAdjacentPiece = board.getPiece(row, col + 1);
	// var leftAdjacentPiece = board.getPiece(row, col + 1);
	
	// var legalMoves = [];
	// // var attackFlag1 = false;
    // // var attackFlag2 = false;
	// var sign = (this.isWhite) ? -1 : 1;			// causes white pawns moved towards the top of the board and black pawns to move towards the bottom
		
	// // attack east
	// if (board.getPiece(row + (1 * sign), column + 1) !== null && board.isValidAttack(row + (1 * sign), column + 1, this))
	// {
		// if (bHighlight)
			// fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + (1 * sign), column + 1));
		// legalMoves.push(new Action(this, ActionType.ATTACK, row + (1 * sign), column + 1));
	// }
	// // attack west
	// if ((board.getPiece(row + (1 * sign), column-1) !== null && board.isValidAttack(row + (1 * sign), column - 1, this)))
	// {
		// if (bHighlight)
			// fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + (1*sign), column - 1));
		// legalMoves.push(new Action(this, ActionType.ATTACK, row + (1*sign), column - 1));
	// }
	// // movement
	// if (board.getPiece(row + (1 * sign),column) === null) {
		// if (bHighlight)
			// fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + (1*sign), column));
		// legalMoves.push(new Action(this, ActionType.MOVE, row + (1*sign), column));
	// } 
	// if (!this.hasMoved)
	// if (board.getPiece(row + (2 * sign), column) === null) {
		// if (bHighlight)
			// fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + (2*sign), column));
		// legalMoves.push(new Action(this, ActionType.MOVE, row + (2*sign), column));
	// } 
	
	// return legalMoves;
// }

/* determine if given king is in check DEBUG doesn't work
 * I think this will have to be called inside each listener.
 * Meaning after a piece is moved it will automatically check the condition
 * Once the turn is over it should output some sort of message.
 * Should require a global variable
 * bColour boolean indicating which colour (white or black) should be tested
 */
function inCheck(bColour) {
	var inCheck = false;
	var kingsTile = (bColour === WHITE) ? whiteKingTile : blackKingTile;
	// if I need to get all the possibly enemy moves
	if (arguments.length == 1) {
		var possibleEnemyActions = [];
		for (let currentRow = 0; currentRow < 8; currentRow++) {
			for (let currentColumn = 0; currentColumn < 8; currentColumn++) {
				let currentTile = board.getTile(currentRow, currentColumn);
				if (currentTile !== null && currentTile.piece.isWhite !== bColour) {
					possibleEnemyActions = possibleEnemyActions.concat(currentTile.piece.getStandardMoves(board, false, currentTile.row, currentTile.column));
				}
			}
		}
		
		for (let i = 0; i < possibleEnemyActions.length; i++) {
			if (possibleEnemyActions[i].actionType === ActionType.ATTACK && possibleEnemyActions[i].row === kingsTile.row && possibleEnemyActions[i].column === kingsTile.column) {
				inCheck = true;
				break;
			}
		}
	}
	// received array intended to store all possible actions for pieces of the opposing colour
	// NOTE only bother with this if it causes a noticeable improvement in AI performance
	else if (arguments.length == 2) {
		console.log();
	}
	return inCheck;
}
