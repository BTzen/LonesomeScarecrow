/* contains methods that provide a mechanism to enforce the rules of chess and provide information on board and game state
 * does not handle fifty-move rule, threefold repetition, or insufficient material to checkmate opponent cases
 * http://www.e4ec.org/immr.html for info regarding insufficient material rule and examples
 */
/* Returns all en passant actions a pawn can take
 * NOTE only works for player
 * pawnTile the tile of the pawn that could perform en passant
 */
function getEnPassantMoves(board, bHighlight, pawnTile) {
	var legalMoves = [];
	
	// check right
	var adjacentPiece = board.getPiece(pawnTile.row, pawnTile.column + 1);
	var rowSign = (pawnTile.piece.isWhite == playerIsWhite) ? 1 : -1;		// player pieces always positioned in rank 7 and 8 ie. at the bottom of the displayed board
	if (pawnThatMovedTwoLastTurn !== null) {
		// check left then right
		for (let i = 1; i >= -1; i = i - 2) {	// loop avoids code duplication
			if (adjacentPiece !== null && lastSelectedTile !== null && lastSelectedTile.piece.type == 'Pawn' 	// 'lastSelectedTile !== null' check done to prevent errors from user mouse clicks between moves
			&& pawnThatMovedTwoLastTurn == adjacentPiece
			&& pawnThatMovedTwoLastTurn.isWhite !== pawnTile.piece.isWhite) {
				let action = new Action(pawnTile.piece, ActionType.ENPASSANT, pawnTile.row - (1 * rowSign), pawnTile.column + i);
				if (bHighlight) {
					fill(ctxHighlight, MELLOW_YELLOW, action);		// highlight square the pawn will move to with the movement colour
					ctxHighlight.fillStyle = LIGHT_RED;				
					ctxHighlight.fillRect(action.column * LENGTH, pawnTile.row * LENGTH, LENGTH, LENGTH);	// highlight square pawn will attack
				}
				legalMoves.push(action);
			}
			adjacentPiece = board.getPiece(pawnTile.row, pawnTile.column - 1);
		}
	}
	
	return legalMoves;
}

/* Checks if castling is possible with rook at given position
 * 
 */
function canCastle(castlingKingTile, castlingRookTile) {
	var canCastle = true;
	
	if (castlingRookTile !== null && castlingRookTile.piece.type == 'Rook' && !castlingRookTile.piece.hasMoved && !castlingKingTile.piece.hasMoved) {
		var possibleEnemyActions = [];
		if (castlingKingTile.piece.isInCheck) {	//if (inCheck(castlingKingTile, possibleEnemyActions))
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
	
	// Need to update the data of last tile as the current way of checking pieces changes the lastSelectedPiece and associated data
	// DEBUG
	var sRookToCastleWith = (castlingRookTile.column == 0) ? 'left rook' : 'right rook';
	console.log('canCastle with ' + sRookToCastleWith + ': ' + canCastle);
	return canCastle;
}

/* determine if given king is in check
 * bColour boolean indicating which colour (white or black) should be tested
 */
function inCheck(board, bColour) {
	var inCheck = false;
	var kingsTile = (bColour === WHITE) ? board.whiteKingTile : board.blackKingTile;
	var checkingTile = null;
	
	// if I need to get all the possibly enemy moves
	if (arguments.length == 2) {
		var possibleEnemyActions = [];
		for (let i = 0; i < board.occupiedTiles.length; i++) {
			let currentTile = board.occupiedTiles[i];
			if (currentTile !== null && currentTile.piece.isWhite !== bColour) {
				possibleEnemyActions = possibleEnemyActions.concat(currentTile.piece.getStandardMoves(board, false, currentTile.row, currentTile.column));
			}
		}
		
		for (let i = 0; i < possibleEnemyActions.length; i++) {
			if (possibleEnemyActions[i].actionType === ActionType.ATTACK && possibleEnemyActions[i].row === kingsTile.row && possibleEnemyActions[i].column === kingsTile.column) {
				inCheck = true;
				checkingTile = board.getTileWithPiece(possibleEnemyActions[i].agent);
				break;
			}
		}
	}
	// received array intended to store all possible actions for pieces of the opposing colour
	// NOTE only bother with this if it causes a noticeable improvement in AI performance
	else if (arguments.length == 3) {
		console.log();
	}
	
	// set inCheck property of appropriate piece
	if (inCheck) {
		kingsTile.piece.isInCheck = true;
	}
	else {
		kingsTile.piece.isInCheck = false;
	}
	board.tileOfCheckingPiece = checkingTile;
	return inCheck;
}

/* 
 * objDetails argument will store additional details about the game terminal conditions if the function returns true and will be unchanged by the call otherwise
 * want to know what condition the game ended with
 * 1) was it a win or a draw? which side won?
 * 2) if it was a draw, which of the following was it:
 *    fifty-move rule, threefold repetition, insufficient material to checkmate opponent, stalemate
 */
function terminalGameConditionTest(board) {
	var gameOver = false;
	var legalMoves = [];
	var colourToCheck = (isWhiteTurn) ? WHITE : BLACK;
	var returnObj = {				
		isTerminalState : false,		
		isDraw : undefined,
		details : undefined				// contains additional information about the match e.g. if it ended in a draw, what kind of draw was it
	};
	
	for (let i = 0; i < board.occupiedTiles.length; i++) {
		if (board.occupiedTiles[i].piece.isWhite === colourToCheck) {
			let currentTile = board.occupiedTiles[i];
			let potentialMoves = currentTile.piece.getStandardMoves(board, false, currentTile.row, currentTile.column);
			
			if (currentTile.piece.type == 'Pawn') {
				potentialMoves = potentialMoves.concat(getEnPassantMoves(board, false, currentTile));
			}
			else if (currentTile.piece.type == 'King') {
				// castling options
				// check right
				let castlingRookTile = board.getTile(currentTile.row, 7);
				if (castlingRookTile !== null && canCastle(currentTile, castlingRookTile)) {		
					legalMoves.push(new Action(currentTile.piece, ActionType.MOVE, currentTile.row, currentTile.column + 2));	// can push to legal moves as canCastle checks for move legality inherently
				}
				// check left
				castlingRookTile = board.getTile(currentTile.row, 0);
				if (castlingRookTile !== null && canCastle(currentTile, castlingRookTile))	{
					legalMoves.push(new Action(currentTile.piece, ActionType.MOVE, currentTile.row, currentTile.column - 2));
				}
			}
			
			// only allow actions that won't place the King in check
			potentialMoves.forEach(function(action) {
				let futureBoardState = new Board(board);
				futureBoardState.movePiece(currentTile.row, currentTile.column, action.row, action.column);
				if (!inCheck(futureBoardState, currentTile.piece.isWhite)) {
					legalMoves.push(action);
				}
			});
		}
	}
	
	// (inCheck) ? win-loss : stalemate
	if (legalMoves.length == 0) {
		if (inCheck(board, colourToCheck)) {
			bDraw = false;
			if (colourToCheck == WHITE)
				sDetails = 'Black wins'
			else
				sDetails = 'White wins'
			
			// DEBUG
			console.log('terminalGameStateFn return: ' + colourToCheck + ' lost!');
		}
		// stalemate
		else {
			bDraw = true;
			sDetails = 'Stalemate';
			console.log('terminalGameStateFn return: stalemate');
		}
		returnObj.isTerminalState = true;
	}
	
	
	if (returnObj.isTerminalState) {
		returnObj.isDraw = bDraw;
		returnObj.details = sDetails;
	}
	return returnObj;
}
// not used
/* consider including an argument to indicate whether the tile should be highlighted
 *
 */
function getLegalMoves(tile) {
	// highlight legal moves
	// legalMoves.forEach(function(action) {
		// let actionColour;
		// if (action.actionType == ActionType.MOVE) {
			// actionColour = MELLOW_YELLOW;
		// }
		// else if (action.actionType == ActionType.ATTACK) {
			// actionColour = LIGHT_RED;
		// }
		// fill(ctxHighlight, actionColour, action);
	// });
}

// not used
function getAllLegalMoves(bColour) {
	var legalMoves = [];
	
	for (let i = 0; i < board.occupiedTiles.length; i++) {
		if (board.occupiedTiles[i].piece.isWhite === bColour) {
			let currentTile = board.occupiedTiles[i];
			let potentialMoves = currentTile.piece.getStandardMoves(board, false, currentTile.row, currentTile.column);
			
			if (currentTile.piece.type == 'Pawn') {
				potentialMoves = potentialMoves.concat(getEnPassantMoves(board, false, currentTile));
			}
			else if (currentTile.piece.type == 'King') {
				// castling options
				// check right
				let castlingRookTile = board.getTile(currentTile.row, 7);
				if (castlingRookTile !== null && canCastle(currentTile, castlingRookTile)) {		
					legalMoves.push(new Action(currentTile.piece, ActionType.MOVE, currentTile.row, currentTile.column + 2));	// can push to legal moves as canCastle checks for move legality inherently
				}
				// check left
				castlingRookTile = board.getTile(currentTile.row, 0);
				if (castlingRookTile !== null && canCastle(currentTile, castlingRookTile))	{
					legalMoves.push(new Action(currentTile.piece, ActionType.MOVE, currentTile.row, currentTile.column - 2));
				}
			}
			
			// only allow actions that won't place the King in check
			potentialMoves.forEach(function(action) {
				let futureBoardState = new Board(board);
				futureBoardState.movePiece(currentTile.row, currentTile.column, action.row, action.column);
				if (!inCheck(futureBoardState, currentTile.piece.isWhite)) {
					legalMoves.push(action);
				}
			});
		}
	}
	return legalMoves;
}