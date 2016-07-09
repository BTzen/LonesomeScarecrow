// contains methods that provide a mechanism to enforce the rules of chess and provide information on board and game state

// DEBUG: MAY NEED TO CHANGE ALL OF THESE to Board.prototype functions

/* Checks if castling is possible with rook at given position
 * technically a king move
 */
function castlingCheck(rookRow, rookCol) {
	var canCastle = true;
	var rookToCheck = board.getPiece(rookRow, rookCol);
	
	if (rookToCheck !== null && !rookToCheck.hasMoved) {
		var kingsRow = (rookToCheck.isWhite) ? 7 : 0;	//store the row the king and rooks start in
		var king = null;
		if (board.getPiece(kingsRow, 4) !== null && board.getPiece(kingsRow, 4).type === "King") 
			king = board.getPiece(kingsRow, 4);
		
		if (king !== null && !king.hasMoved) {
			var startCol, endCol;
			if (rookCol < 4) {	//determine which rook was passed for the check
				startCol = 1;	//inclusive
				endCol = 4;		//exclusive
			}
			else {
				startCol = 5;	//inclusive
				endCol = 7;		//exclusive
			}
			
			// check that there are no pieces between the king and the castling rook
			
			if (rookCol == 0) {
				if (board.getPiece(kingsRow, 1) !== null || board.getPiece(kingsRow, 2) !== null || board.getPiece(kingsRow, 3) !== null)
					return false;
				
			}
			else {
				if (board.getPiece(kingsRow, 5) !== null || board.getPiece(kingsRow, 6) !== null)
					return false;
			}
			for (var i = startCol; i < endCol; i++) {
				//king doesn't cross over, or end on a square in which it would be in check
				//check if any pieces could potentially attack any square between the kings initial and destination square
				if (i > 1 && i < 7) {	//if castling with the rook in file A I don't need to check column adjacent to said rook, as king doesn't pass over that one)
					// isCheckingBoard = true;
				
					// find the actions every enemy piece on the board can take from their current positions to determine if castling is possible
					for (var row = 0; row < 8; row++) {
						for (var col = 0; col < 8; col++) {
							
							if (board.getPiece(row, col) !== null && board.getPiece(row, col).isWhite !== king.isWhite) {
								// isWhiteTurn = !isWhiteTurn;			//looks like this has something to do with highlighting the proper tiles
								// highlightListener(ctxHighlight, ctxPiece, board, col*LENGTH, row*LENGTH);
								// isWhiteTurn = !isWhiteTurn;
								
							}
						}
					}
					for (var index = 0; index < allHighlightedTiles.length; index++) {
						var enemyPiece = allHighlightedTiles[index];
						//if (enemyPiece[1] === kingsRow && enemyPiece[2] === i) { //the piece can attack the king somewhere along his castling path DEBUG only need to check ActionType.ATTACK
						if (enemyPiece.row === kingsRow && enemyPiece.column === i) { //the piece can attack the king somewhere along his castling path DEBUG only need to check ActionType.ATTACK
							console.log("in castle check");
							//board.getPiece(item[1],item[2]).isInCheck = true; //may not even use this
							allHighlightedTiles = [];
							isCheckingBoard = false;
							canCastle = false;
							break;
						}
					}
				}
			}
			
			//king can't be in check
			if (inCheck(king.isWhite)) { return false; }
		}
		else { return false; }
	}
	else { return false; }
	/* Need to update the data of last tile as the current way of checking pieces changes the lastSelectedPiece and associated data
	 * 
	*/
	lastSelectedTile = new Tile(king, kingsRow, 4);	
	isCheckingBoard = false;	// DEBUG remove all instances of this var when possible
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
 */
function inCheck(row, column, bColour) {
	
	//REDO THIS METHOD
	/* 
	Go through each piece.
	Check the highlighted tiles.
	see if it is attacking the king.
	if the king is being under attack then he is in check.
	-----------------------------------------------------
	Now we want to check where the king can move.
	We also need to see if by moving one of our pieces will save the king.
	If neither of these types of moves are possible then we are in checkmate.
	*/
	
	// check if every piece is attacking or not? might not use this logic.
	// may delgate this to isValidAttack
/*	for (var checkRow = 0; checkRow < 64; checkRow++) {
		for (var checkCol = 0; checkCol < 64; checkCol++) {
			if (isAttackingKing (row, column, colourBool)) {
				return true;
			}
		}		
	}
	*/
}

/* checks if king is in check
 *
 */
// function isAttackingKing (row, column, attackingPiece) {
	// if (isValidAttack(row, column, attackingPiece) && board.getPiece(row,column).type === "King") {
		// return true;
	// }
// }

// /* check for opponent and board boundaries
 // * rowToAttack the row of the piece the possibility of attack is being checked against
 // * columnToAttack
 // * attackingPiece
// */
// function isValidAttack(board, rowToAttack, columnToAttack, attackingPiece) {
	// check that the desired selection is within legal board dimensions
	// if  (rowToAttack > 7 || rowToAttack < 0 || columnToAttack > 7 || columnToAttack < 0) {
		// return false;
	// }
	
	// var potentialTarget = board.getPiece(rowToAttack, columnToAttack);
	// if (potentialTarget !== null) {
		// return !(potentialTarget.isWhite === attackingPiece.isWhite);
	// }		
// }
