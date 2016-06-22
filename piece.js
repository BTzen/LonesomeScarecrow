/* Billings, Kurylovich */

/* outlines basic functionality for chess pieces
 *
*/

//object constructor
function Piece(type, isWhite, unicode) {
	//warns the user if a Piece object is instantiated
	if (this.__proto__ === Piece.prototype) {
		alert("Piece is an abstract class and should not be instantiated directly.");
	}
	// ************************************************************************ 
	// PUBLIC PROPERTIES -- ANYONE MAY READ/WRITE 
	// ************************************************************************
	this.type = type;
	this.isWhite = isWhite;
	this.unicode = unicode;
	// this.legalMoves;			// ds
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

function Rook(isWhite) {
	Piece.call(this, "Rook", isWhite, (isWhite) ? "9814": "9820");
	this.hasMoved = false;
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.value = 5;

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
King.prototype.value = Number.MAX_VALUE;