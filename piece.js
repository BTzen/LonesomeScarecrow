/* Billings, Kurylovich */

/* outlines basic functionality for chess pieces
 *
*/

//object constructor
function Piece(type, isWhite, unicode) {
	//warns the user if a Piece object is instantiated
	if (this.__proto__ === Piece.prototype) {
		console.log("Piece is an abstract class and should not be instantiated directly.");
	}
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
	// call superclass constructor.  Note that the constructor must pass the child object's context (ie. this)
	Piece.call(this, "Pawn", isWhite, (isWhite) ? "9817" : "9823");
	this.hasMoved = false;
}
Pawn.prototype = Object.create(Piece.prototype);	// creates empty object with given prototype. makes pawn inherit from piece
Pawn.prototype.value = 1;							// make all chess pieces share same value (ie. what the piece is worth)

/* Find all actions the piece can make under normal conditions
 * board the game board
 * bHighlight bool indicating whether the tiles in question should be highlighted
 * row the row the piece is located in
 * column the column the piece is located in
 */
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
	if (board.getPiece(row + (1 * sign), column) === null) {
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + (1*sign), column));
		legalMoves.push(new Action(this, ActionType.MOVE, row + (1*sign), column));
	} 
	if (!this.hasMoved && board.getPiece(row + (1 * sign), column) === null)
		if (board.getPiece(row + (2 * sign), column) === null) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row + (2*sign), column));
			legalMoves.push(new Action(this, ActionType.MOVE, row + (2*sign), column));
		} 
	
	return legalMoves;
}

function Knight(isWhite) {
	Piece.call(this, "Knight", isWhite, (isWhite) ? "9816" : "9822");
}
Knight.prototype = Object.create(Piece.prototype);
Knight.prototype.value = 3;

// modified 23/07
/* returns an array of actions containing all possible actions excluding
 *
 */
Knight.prototype.getStandardMoves = function(board, bHighlight, row, column) {
    var legalMoves = [];
	var action;
	
	// up right
    if (board.getPiece(row - 2, column + 1) === null) {
		action = new Action(this, ActionType.MOVE, row - 2, column + 1);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row - 2, column + 1, this)) {
		action = new Action(this, ActionType.ATTACK, row - 2, column + 1);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
	// right up
    if (board.getPiece(row - 1, column + 2) === null) {
		action = new Action(this, ActionType.MOVE, row - 1, column + 2);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row - 1, column + 2, this)) {
		action = new Action(this, ActionType.ATTACK, row - 1, column + 2);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
	// right down
    if (board.getPiece(row + 1, column + 2) === null) {
		action = new Action(this, ActionType.MOVE, row + 1, column + 2);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row + 1, column + 2, this)) {
		action = new Action(this, ActionType.ATTACK, row + 1, column + 2);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
	// down right
    if (board.getPiece(row + 2, column + 1) === null) {
		action = new Action(this, ActionType.MOVE, row + 2, column + 1);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row + 2, column + 1, this)) {
		action = new Action(this, ActionType.ATTACK, row + 2, column + 1);
        if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
    // down left
    if (board.getPiece(row + 2, column - 1) === null) {
		action = new Action(this, ActionType.MOVE, row + 2, column - 1);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row + 2, column - 1, this)) {
		action = new Action(this, ActionType.ATTACK, row + 2, column - 1);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
    // left down
    if (board.getPiece(row + 1, column - 2) === null) {
		action = new Action(this, ActionType.MOVE, row + 1, column - 2);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row + 1, column - 2, this)) {
		action = new Action(this, ActionType.ATTACK, row + 1, column - 2);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
	// left up
    if (board.getPiece(row - 1, column - 2) === null) {
		action = new Action(this, ActionType.MOVE, row - 1, column - 2);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row - 1, column - 2, this)) {
		action = new Action(this, ActionType.ATTACK, row - 1, column - 2);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
    // up left
    if (board.getPiece(row - 2, column - 1) === null) {
		action = new Action(this, ActionType.MOVE, row - 2, column - 1);
		if (bHighlight)
			fill(ctxHighlight, MELLOW_YELLOW, action);
		legalMoves.push(action);
    } 
	else if (board.isValidAttack(row - 2, column - 1, this)) {
		action = new Action(this, ActionType.ATTACK, row - 2, column - 1);
		if (bHighlight)
			fill(ctxHighlight, LIGHT_RED, action);
		legalMoves.push(action);
    }
	
	return legalMoves;
}

function Bishop(isWhite) {
	Piece.call(this, "Bishop", isWhite, (isWhite) ? "9815" : "9821");
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.value = 3;

// modified 23/07
Bishop.prototype.getStandardMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];
	var action;
    var blockedNortheast = false, blockedSoutheast = false, blockedSouthwest = false, blockedNorthwest = false;	// prevent movement past the tile of an attacked piece

    for (var i = 1; i < 8; i++) {
		// northeast
        if (board.getPiece(row-i,column+i) === null && !blockedNortheast) {
			action = new Action(this, ActionType.MOVE, row - i, column + i);
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, action);
			legalMoves.push(action);
        } 
		else if (board.isValidAttack(row - i, column + i, this) && !blockedNortheast) {
            if (bHighlight)
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - i, column + i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - i, column + i));
            blockedNortheast = true;
        }
		else blockedNortheast = true;
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
		else blockedSoutheast = true;
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
		else blockedSouthwest = true;
		// northwest
        if (board.getPiece(row-i,column-i) === null && !blockedNorthwest) {
			if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - i, column - i));
			legalMoves.push(new Action(this, ActionType.MOVE, row - i, column - i));
        } 
		else if (board.isValidAttack(row - i, column - i, this) && !blockedNorthwest) {
            if (bHighlight) 
                fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row - i, column - i));
			legalMoves.push(new Action(this, ActionType.ATTACK, row - i, column - i));
            blockedNorthwest = true;
        }
		else blockedNorthwest = true;
		
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
		else blockedAbove = true;
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
		else blockedEast = true;
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
		else blockedBelow = true;
        // west
        if (board.getPiece(row, column-i) === null && !blockedWest) {
            if (bHighlight)
				fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row, column - i));
			legalMoves.push(new Action(this, ActionType.MOVE, row, column - i));
        } 
		else if (board.isValidAttack(row, column-i, this) && !blockedWest) {
            if (bHighlight) 
				fill(ctxHighlight, LIGHT_RED, new Action(this, ActionType.ATTACK, row, column - i));
            legalMoves.push(new Action(this, ActionType.ATTACK, row, column - i));
            blockedWest = true;
        }
		else blockedWest = true;
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
	this.isInCheck = false;		// faster than always requiring the use of the function determining check when appropriate
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
			legalMoves.push(new Action(this, ActionType.ATTACK, row - 1, column));
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
			legalMoves.push(new Action(this, ActionType.ATTACK, row + 1, column - 1));
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

King.prototype.getSpecialMoves = function(board, bHighlight, row, column) {
	var legalMoves = [];
	var kingTile = new Tile(this, row, column);
	// castle right
	if (canCastle(kingTile, board.getPiece(row, 7)))
		legalMoves.push(new Action(this, ActionType.MOVE, row, column + 2));
	// castle left
	if (canCastle(kingTile, board.getPiece(row, 0)))
		legalMoves.push(new Action(this, ActionType.MOVE, row, column - 2));
	
	return legalMoves;
}