/* Billings, Kurylovich */

/* outlines basic functionality for chess pieces
 *
*/

//object constructor
function Piece(type, isWhite, unicode) {
	//warns the user if a Piece object is instantiated
	// if (this.__proto__ === Piece.prototype) {
		// console.log("Piece is an abstract class and should not be instantiated directly.");
	// }
	this.type = type;
	this.isWhite = isWhite;
	this.unicode = unicode;
};

Piece.prototype.toString = function() {
	return ((this.isWhite) ? "White " : "Black ") + this.type;
}
/* Create a Pawn.prototype object that inherits from Piece.prototype.  
 * Note: A common error here is to use "new Piece()" to create Pawn.prototype.
 */
function Pawn(isWhite) {
	//call superclass constructor.  Note that the constructor must pass the child object's context (ie. this)
	Piece.call(this, "Pawn", isWhite, (isWhite) ? "9817" : "9823");
	this.hasMoved = false;
	this.movedTwoSquaresLastTurn = false;
}
//make Pawn inherit from Piece (might only be necessary if we want piece to have functions)
Pawn.prototype = Object.create(Piece.prototype);	//creates empty object with given prototype
Pawn.prototype.value = 1;	//make all chess pieces share same value (ie. what the piece is worth)

Pawn.prototype.getAllMoves = function(board, bHighlight, row, column) {
	var legalMoves = this.getStandardMoves(this, board, bHighlight, row, column);
	legalMoves = legalMoves.concat(this.getEnPassantMoves(this, board, bHighlight, row, column));
	return legalMoves;
}

Pawn.prototype.getStandardMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];
	// var attackFlag1 = false;
    // var attackFlag2 = false;
	var sign = (this.isWhite) ? -1 : 1;			// causes white pawns moved towards the top of the board and black pawns to move towards the bottom
		
	// attack east
	if (board.getPiece(row + (1 * sign), column + 1) !== null && board.isValidAttack(row + (1 * sign), column + 1, this))
	{
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + (1 * sign), column + 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row + (1 * sign), column + 1));
	}
	// attack west
	if ((board.getPiece(row + (1 * sign), column-1) !== null && board.isValidAttack(row + (1 * sign), column - 1, this)))
	{
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + (1*sign), column - 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row + (1*sign), column - 1));
	}
	// movement
	if (board.getPiece(row + (1 * sign),column) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + (1*sign), column));
		legalMoves.push(new Action(this, ActionType.MOVE, row + (1*sign), column));
	} 
	if (!this.hasMoved)
	if (board.getPiece(row + (2 * sign), column) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + (2*sign), column));
		legalMoves.push(new Action(this, ActionType.MOVE, row + (2*sign), column));
	} 
	
	return legalMoves;
}

Pawn.prototype.getEnPassantMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];

	// check right
	var adjacentPiece = board.getPiece(row, column + 1);
	if (adjacentPiece !== null && lastSelectedTile.piece.type == 'Pawn' 
		&& pawnThatMovedTwoLastTurn == adjacentPiece
		&& pawnThatMovedTwoLastTurn.isWhite !== this.isWhite) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column + 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column + 1));
	}
	// check left
	adjacentPiece = board.getPiece(row, column - 1);
	if (adjacentPiece !== null && lastSelectedTile.piece.type == 'Pawn' 
		&& pawnThatMovedTwoLastTurn == adjacentPiece
		&& pawnThatMovedTwoLastTurn.isWhite !== this.isWhite) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column - 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column - 1));
	}
}

function Knight(isWhite) {
	Piece.call(this, "Knight", isWhite, (isWhite) ? "9816" : "9822");
}
Knight.prototype = Object.create(Piece.prototype);
Knight.prototype.value = 3;

/* returns an array of actions containing all possible actions excluding
 *
 */
Knight.prototype.getStandardMoves = function(board, bHighlight, row, column) {
    var legalMoves = [];
	
	// up right
    if (board.getPiece(row-2,column+1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 2, column + 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 2, column + 1));
    } else if (board.isValidAttack(row-2, column + 1, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 2, column + 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row - 2, column + 1));
    }
	// right up
    if (board.getPiece(row-1,column+2) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 1, column + 2));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 1, column + 2));
    } else if (board.isValidAttack(row - 1, column + 2, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column + 2));
		legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column + 2));
    }
	// right down
    if (board.getPiece(row+1,column+2) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 1, column + 2));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 1, column + 2));
    } else if (board.isValidAttack(row + 1, column + 2, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 1, column + 2));
		legalMoves.push(new Action(this, ActionType.ATTACK, row + 1, column + 2));
    }
	// down right
    if (board.getPiece(row+2,column+1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 2, column + 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 2, column + 1));
    } else if (board.isValidAttack(row + 2, column+1, this)) {
        if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 2, column + 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row + 2, column + 1));
    }
    // down left
    if (board.getPiece(row+2,column-1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 2, column - 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 2, column - 1));
    } else if (board.isValidAttack(row+2, column-1, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 2, column - 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 2, column - 1));
    }
    // left down
    if (board.getPiece(row+1,column-2) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 1, column - 2));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 1, column - 2));
    } 
	else if (board.isValidAttack(row + 1, column - 2, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 1, column - 2));
		legalMoves.push(new Action(this, ActionType.ATTACK, row + 1, column - 2));
    }
	// left up
    if (board.getPiece(row-1,column-2) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 1, column - 2));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 1, column - 2));
    } else if (board.isValidAttack(row - 1, column-2, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column - 2));
		legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column - 2));
    }
    // up left
    if (board.getPiece(row-2,column-1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 2, column - 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 2, column - 1));
    } 
	else if (board.isValidAttack(row - 2, column-1, this)) {
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 2, column - 1));
		legalMoves.push(new Action(this, ActionType.ATTACK, row - 2, column - 1));
    }
	
	return legalMoves;
}

function Bishop(isWhite) {
	Piece.call(this, "Bishop", isWhite, (isWhite) ? "9815" : "9821");
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.value = 3;

Bishop.prototype.getStandardMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];
    var blockedNortheast = false, blockedSoutheast = false, blockedSouthwest = false, blockedNorthwest = false;	// prevent movement past the tile of an attacked piece

    for (var i = 1; i < 8; i++) {
		// northeast
        if (board.getPiece(row-i,column+i) === null && !blockedNortheast) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - i, column + i));
			legalMoves.push(new Action(this, ActionType.MOVE, row - i, column + i));
        } 
		else if (board.isValidAttack(row - i, column + i, this && !blockedNortheast)) {
            if (bHighlight)
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - i, column + i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - i, column + i));
            blockedNortheast = true;
        }
		// southeast
		if (board.getPiece(row + i, column + i) === null && !blockedSoutheast) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + i, column + i));
			legalMoves.push(new Action(this, ActionType.MOVE, row + i, column + i));
        } 
		else if (board.isValidAttack(row + i, column + i, this) && !blockedSoutheast) {
            if (bHighlight) 
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + i, column + i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row + i, column + i));
            blockedSoutheast = true;
        }
		// southwest
        if (board.getPiece(row + i, column - i) === null && !blockedSouthwest) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + i, column - i));
			legalMoves.push(new Action(this, ActionType.MOVE, row + i, column - i));
        } 
		else if (board.isValidAttack(row+i, column-i, this) && !blockedSouthwest) {
            if (bHighlight) 
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + i, column - i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row + i, column - i));
            blockedSouthwest = true;
        }
		// northwest
        if (board.getPiece(row-i,column-i) === null && !blockedNorthwest) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - i, column - i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - i, column - i));
        } 
		else if (board.isValidAttack(row - i, column - i, this) && !blockedNorthwest) {
            if (bHighlight) 
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - i, column - i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - i, column - i));
            blockedNorthwest = true;
        }

        if (blockedNortheast && blockedSoutheast && blockedNorthwest && blockedSouthwest) 
            break;
    }
	return legalMoves;
}

function Rook(isWhite) {
	Piece.call(this, "Rook", isWhite, (isWhite) ? "9814": "9820");
	this.hasMoved = false;
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.value = 5;

Rook.prototype.getStandardMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];
    let blockedAbove = false, blockedBelow = false, blockedEast = false, blockedWest = false;
	

    for (var i = 1; i <= 8; i++) {
		// north
        if (board.getPiece(row-i, column) === null && !blockedAbove) { 
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - i, column));
			legalMoves.push(new Action(this, ActionType.MOVE, row - i, column));
        } 
		else if (board.isValidAttack(row-i, column, this) && !blockedAbove) {		// there is a piece on the path
            if (bHighlight) 	// check to see if the piece is an enemy
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - i, column));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - i, column));
            blockedAbove = true;
        }
		// east
        if (board.getPiece(row, column+i) === null && !blockedEast) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row, column + i));
			legalMoves.push(new Action(this, ActionType.MOVE, row, column + i));
        } 
		else if (board.isValidAttack(row, column+i, this) && !blockedEast) {
            if (bHighlight)
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row, column + i));
            legalMoves.push(new Action(this, ActionType.ATTACK, row, column + i));
            blockedEast = true;
        }
        // south
        if (board.getPiece(row+i, column) === null && !blockedBelow) { //and down flag
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + i, column));
			legalMoves.push(new Action(this, ActionType.MOVE, row + i, column));
        } 
		else if (board.isValidAttack(row+i,column, this) && !blockedBelow) {
            if (bHighlight) 
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + i, column));
            legalMoves.push(new Action(this, ActionType.ATTACK, row + i, column));
            blockedBelow = true;
        }
        // west
        if (board.getPiece(row, column-i) === null && !blockedWest) {
            if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row, column - i));
			legalMoves.push(new Action(this, ActionType.MOVE, row, column - i));
        } else if (board.isValidAttack(row, column-i, this) && !blockedWest) {
            if (bHighlight) 
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row, column - i));
            legalMoves.push(new Action(this, ActionType.ATTACK, row, column - i));
            blockedWest = true;
        }
		// current piece is surrounded on all sides by pieces so stop the loop
        if (blockedAbove && blockedBelow && blockedWest && blockedEast) 
            break;
    }
	return legalMoves;
}

function Queen(isWhite) {
	Piece.call(this, "Queen", isWhite, (isWhite) ? "9813": "9819");
}

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.value = 9;

Queen.prototype.getStandardMoves = function(board, bHighlight, row, column) {
	var legalMoves = Bishop.prototype.getStandardMoves.call(this, board, bHighlight, row, column);
	legalMoves = legalMoves.concat(Rook.prototype.getStandardMoves.call(this, board, bHighlight, row, column));
	return legalMoves;
}

function King(isWhite) {
	Piece.call(this, "King", isWhite, (isWhite) ? "9812" : "9818");
	this.hasMoved = false;
	this.isInCheck = false;
}

King.prototype = Object.create(Piece.prototype);
King.prototype.value = 500;

/* returns an array of actions containing all possible actions excluding castling
 * moves are tested in clockwise order
 * bHighlight boolean indicating whether the tiles in question should be visibly highlighted for the player
 */
King.prototype.getStandardMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];
	
	// north
	if (board.getPiece(row - 1, column) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 1, column));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 1, column));
	}
	else {		// attacking code
		if (board.isValidAttack(row - 1, column, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column));
			legalMoves.push(new Action(this, ActionType.MOVE, row - 1, column));
		}
	}
	// northeast
	if (board.getPiece(row - 1, column + 1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 1, column + 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 1, column + 1));
	} 
	else {
		if (board.isValidAttack(row - 1, column + 1, this)) {
			if (bHighlight) 
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column + 1));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column + 1));
		}
	}
	// east
	if (board.getPiece(row,column + 1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row, column + 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row, column + 1));
	} 
	else {
		if (board.isValidAttack(row,column + 1, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row, column + 1));
			legalMoves.push(new Action(this, ActionType.ATTACK, row, column + 1));
		}
	}
	// southeast
	if (board.getPiece(row+1,column+1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 1, column + 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 1, column + 1));
	} 
	else {
		if (board.isValidAttack(row + 1, column + 1, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 1, column + 1));
			legalMoves.push(new Action(this, ActionType.ATTACK, row + 1, column + 1));
		}
	}
	// south
	if (board.getPiece(row + 1,column) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 1, column));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 1, column));
	} 
	else {
		if (board.isValidAttack(row + 1, column, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 1, column));
			legalMoves.push(new Action(this, ActionType.ATTACK, row + 1, column));
		}
	}
	// southwest
	if (board.getPiece(row + 1, column - 1) === null) {
		if (bHighlight) 
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + 1, column - 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row + 1, column - 1));
	} 
	else {
		if (board.isValidAttack(row+1, column-1, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row + 1, column - 1));
			legalMoves.push(new Action(this, ActionType.MOVE, row + 1, column - 1));
		}
	}
	// west
	if (board.getPiece(row, column - 1) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row, column - 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row, column - 1));
	} 
	else {
		if (board.isValidAttack(row,column - 1, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row, column - 1));
			legalMoves.push(new Action(this, ActionType.ATTACK, row, column - 1));
		}
	}
	// northwest
	if (board.getPiece(row - 1, column - 1) === null) {
		if (bHighlight) 
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - 1, column - 1));
		legalMoves.push(new Action(this, ActionType.MOVE, row - 1, column - 1));
	} 
	else {
		if (board.isValidAttack(row - 1, column - 1, this)) {
			if (bHighlight)
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - 1, column - 1));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column - 1));
		}
	}
	
	return legalMoves;
}

King.prototype.canCastle = function(board, bHighlight, row, column, bCastleWithLeftRook) {
	var canCastle = true;
	// castling with left rook
	// castling with right rook
	
	var pieceToCheck = (board, bHighlight, row, column, bCastleWithLeftRook) ? board.getPiece(row, 0) : board.getPiece(row, 7);
	
	if (pieceToCheck !== null && pieceToCheck.type == 'Rook' && !pieceToCheck.hasMoved) {
		// var kingsRow = row;	//store the row the king and rooks start in
		// var king = null;
		// if (board.getPiece(row, column) !== null && board.getPiece(kingsRow, 4).type === "King") 
			// king = board.getPiece(kingsRow, 4);
		
		if (!this.hasMoved) {
			var startCol, endCol;
			
			if (bCastleWithLeftRook) {
				startCol = 1;		//inclusive
				endCol = 4;			//exclusive
			}
			else {
				startCol = 5;	//inclusive
				endCol = 7;		//exclusive
			}
			
			// check that there are no pieces between the king and the rook
			for (let i = startCol; i < endCol; i++) {
				if (board.getPiece(row, i) !== null) 
					return false;
			}
			
			// for (let i = startCol; i < endCol; i++) {
				//king doesn't cross over, or end on a square in which it would be in check
				//check if any pieces could potentially attack any square between the kings initial and destination square
				// if (i > 1 && i < 7) {	//if castling with the rook in file A I don't need to check column adjacent to said rook, as king doesn't pass over that one)
					// isCheckingBoard = true;
					var possibleEnemyMoves = [];
					// find the actions every enemy piece on the board can take from their current positions to determine if castling is possible
					for (var row = 0; row < 8; row++) {
						for (var col = 0; col < 8; col++) {
							let currentTile = board.getTile(row, col);
							if (currentTile !== null && currentTile.piece.isWhite !== this.isWhite) {
								// isWhiteTurn = !isWhiteTurn;			//looks like this has something to do with highlighting the proper tiles
								// highlightListener(ctxHighlight, ctxPiece, board, col*LENGTH, row*LENGTH);
								// isWhiteTurn = !isWhiteTurn;
								if (currentTile.piece == 'Pawn') {		//only piece whose attack options are different from their movement options
									// TODO need to handle pawns separately
								}
								else {
									possibleEnemyMoves = possibleEnemyMoves.concat(currentTile.piece.getStandardMoves(board, false, currentTile.row, currentTile.column));
								}
							}
						}
					}
					for (let i = 0; i < possibleEnemyMoves.length; i++) {
						var currentMove = possibleEnemyMoves[i];
						//if (enemyPiece[1] === kingsRow && enemyPiece[2] === i) { //the piece can attack the king somewhere along his castling path DEBUG only need to check ActionType.ATTACK
						if (currentMove.row === row && currentMove.column >= startCol && currentMove.column < endCol) {
							console.log("in castle check");
							//board.getPiece(item[1],item[2]).isInCheck = true; //may not even use this
							// allHighlightedTiles = [];
							// isCheckingBoard = false;
							canCastle = false;
							break;
						}
					}
				// }
			// }
			
			//king can't be in check
			if (inCheck(king.isWhite)) { return false; }
		}
		else 
			canCastle = false;
	}
	else 
		canCastle = false;
	/* Need to update the data of last tile as the current way of checking pieces changes the lastSelectedPiece and associated data
	 * 
	*/
	// lastSelectedTile = new Tile(king, kingsRow, 4);	
	// isCheckingBoard = false;	// DEBUG remove all instances of this var when possible
	return canCastle;
}