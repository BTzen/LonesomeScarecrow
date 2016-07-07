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

function Knight(isWhite) {
	Piece.call(this, "Knight", isWhite, (isWhite) ? "9816" : "9822");
}
Knight.prototype = Object.create(Piece.prototype);
Knight.prototype.value = 3;

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
        if (board.getPiece(row-i,column-i) === null && !blockedNorthwest) {
            fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, row - i, column - i));
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
        if (board.getPiece(row, column-i) === null && !blockedWest) { // && !leftFlag
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

function King(isWhite) {
	Piece.call(this, "King", isWhite, (isWhite) ? "9812" : "9818");
	this.hasMoved = false;
	this.isInCheck = false;
}

King.prototype = Object.create(Piece.prototype);
King.prototype.value = 500;

/*
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