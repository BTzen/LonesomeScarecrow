// contains methods that provide a mechanism to enforce the rules of chess and provide information on board and game state

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
				startCol = 5;
				endCol = 7;
			}

			for (var i = startCol; i < endCol; i++) {
				//no pieces between rook and king
				if (board.getPiece(kingsRow, i) !== null) { 
					return false;
				}
				//king doesn't cross over, or end on a square in which it would be in check
				//check if a piece can attack any square between the kings initial and destination square
				if (i > 1 && i < 7) {	//if castling with the rook in file A we don't need to check column adjacent to it as the king doesn't pass over that one)
					isCheckingBoard = true;
				
					// find the actions every enemy piece on the board can take from their current positions to determine if castling is possible
					for (var row = 0; row < 8; row++) {
						for (var col = 0; col < 8; col++) {
							if (board.getPiece(row, col) !== null && board.getPiece(row, col).isWhite !== king.isWhite) {
								isWhiteTurn = !isWhiteTurn;			//looks like this has something to do with highlighting the proper tiles
								highlightListener(ctxHighlight, ctxPiece, board, col*LENGTH, row*LENGTH);
								isWhiteTurn = !isWhiteTurn;
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
	// if (canCastle) {
		// lastRow = kingsRow;
		// lastColumn = 4;
	// }
	
	
	isCheckingBoard = false;
	return canCastle;
}

/*
 * row the row of the pawn that moves 2 spaces forward, post move(and the one that is potentially vulnerable to en passant)
 * col the column of said pawn
 */
function enPassantCheck(row, column) {
	//capturing pawn must be on its 5th rank before executing the maneuver
	//check for pawns immediate to the right and left of the pawn that moved
	var rightAdjacentPiece = board.getPiece(row, col + 1);
	var leftAdjacentPiece = board.getPiece(row, col + 1);
	
	if (leftAdjacentPiece !== null && leftAdjacentPiece.type === "Pawn") {
		
	}
	//must be done on turn immediately after captured pawn moves 2 spaces forward
	
	//move capturing pawn to same position it would be in if the captured pawn only moved one square forward
}

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
function isAttackingKing (row, column, attackingPiece) {
	if (isValidAttack(row, column, attackingPiece) && board.getPiece(row,column).type === "King") {
		return true;
	}
}

/* check for opponent and board boundaries
 * rowToAttack the row of the piece the possibility of attack is being checked against
 * columnToAttack
 * attackingPiece
*/
function isValidAttack(rowToAttack, columnToAttack, attackingPiece) {
	//check that the desired selection is within legal board dimensions
	if  (rowToAttack > 7 || rowToAttack < 0 || columnToAttack > 7 || columnToAttack < 0) {
		return false;
	}
	
	var potentialTarget = board.getPiece(rowToAttack, columnToAttack);
	if (potentialTarget !== null) {
		return !(potentialTarget.isWhite === attackingPiece.isWhite);
	}		
}
