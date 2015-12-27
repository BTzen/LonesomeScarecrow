//object constructor
var Piece = function(type, isWhite, unicode, x, y) {
	//warns the user if a Piece object is instantiated
	if (this.__proto__ === Piece.prototype) {
		alert("Piece is intended as an abstract class and should not be instantiated.");
	}
	// ************************************************************************ 
	// PUBLIC PROPERTIES -- ANYONE MAY READ/WRITE 
	// ************************************************************************
	this.type = type;
	this.isWhite = isWhite;
	this.unicode = unicode;
	this.x = x;
	this.y = y;
};

//methods
//valid if the desired location does not have a piece of the same color located there
// Piece.prototype.isValidMove = function() {
	// alert("isValidMove");
// };

//PAWN
function Pawn(isWhite, x, y) {
	//call superclass constructor.  Note that the constructor must pass the child object's context (ie. this)
	Piece.call(this, "Pawn", isWhite, (isWhite) ? "9817" : "9823", x, y);
	this.hasMoved = false;
}

//PAWN METHODS 

//make Pawn inherit from Piece (might only be necessary if we want piece to have functions)
Pawn.prototype = Object.create(Piece.prototype);	//creates empty object with given prototype
Pawn.prototype.value = 1;	//make all chess pieces share same value (ie. what the piece is worth)

Pawn.prototype.move = function(x, y) {
	//move pawn
	// if (Piece.isValidMove(newRow, newColumn) && ) {
		// alert("");
	// }	
};

Pawn.prototype.attack = function(x, y) {
	
};

//KNIGHT

function Knight(isWhite, x, y) {
	Piece.call(this, "Knight", isWhite, (isWhite) ? "9816" : "9822", x, y);
}

Knight.prototype = Object.create(Piece.prototype);
Knight.prototype.value = 3;

//KNIGHT METHODS
Knight.prototype.move = function() {};

//BISHOP

function Bishop(isWhite, x, y) {
	Piece.call(this, "Bishop", isWhite, (isWhite) ? "9815" : "9821", x, y);
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.value = 3;

//BISHOP METHODS
Bishop.prototype.move = function () {};

//ROOK

function Rook(isWhite, x, y) {
	Piece.call(this, "Rook", isWhite, (isWhite) ? "9814": "9820", x, y);
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.value = 5;

//ROOK METHODS
Rook.prototype.move = function () {};

//QUEEN

function Queen(isWhite, x, y) {
	Piece.call(this, "Queen", isWhite, (isWhite) ? "9813": "9819", x, y);
}

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.value = 9;

//QUEEN METHODS
Queen.prototype.move = function () {};

//KING

function King(isWhite, x, y) {
	Piece.call(this, "King", isWhite, (isWhite) ? "9812" : "9818", x, y); 
}

King.prototype = Object.create(Piece.prototype);
King.prototype.value = Number.MAX_VALUE;

//KING METHODS
King.prototype.move = function() {};