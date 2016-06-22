/* Note: Board class does not contain the functionality to draw the pieces. That is handled by chessboardScript.js
*/
function Board(opts) {
	// if (opts !== undefined)
		// this.occupiedTiles = [];
	// else if (opts === "clone") {
		// this.occupiedTiles = jQuery.extend(true, {}, occupiedTilesToClone);
	// }
	this.occupiedTiles = [];
}

Board.prototype.clear = function() {
	this.occupiedTiles = [];
}

// Board.prototype.clone = function(boardToClone) {
	
// }

Board.prototype.draw = function() {
	
}

/* Retrieve the tile at the specified position
 * returns tile or null, or undefined if the given index is out of bounds
*/
Board.prototype.getPiece = function(row, col) {
	var currentTile = this.getTile(row, col);
	if (currentTile !== null && currentTile !== undefined)
		return currentTile.piece;
	else {
		return currentTile;
	}
}

Board.prototype.getTile = function(row, col) {
	if (row < 0 || row > 7 || col < 0 || col > 7) {
		return undefined;
	} 
	
	var currentTile;
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		currentTile = this.occupiedTiles[i];
		if (row === currentTile.row && col === currentTile.column)
			return currentTile;
	}
	
	return null;
}
/* Initialize board for a chess match
*/
Board.prototype.initialize = function(playerIsWhite) {
	let white = true, black = false;
	if (this instanceof Board) {
		if (playerIsWhite) {
			// place black pieces
			// this.addPiece(new Rook(false), 0, 0);
			// this.addPiece(new Bishop(false), 0, 1);
			this.addPiece(new Pawn(black), 2, 2);
			// this.addPiece(new Knight(false), 3, 4);
			
			// place white pieces
			this.addPiece(new Pawn(white), 6, 3);
			// this.addPiece(new Knight(white), 5, 4);
			// this.addPiece(new Rook(white), 7, 0); 		// check if you can castle with left rook
			// this.addPiece(new Bishop(white), 7, 2);
			// this.addPiece(new Queen(white), 7, 3);
			// this.addPiece(new King(white), 7, 4);
			// this.addPiece(new Rook(white), 7, 7);
			
			this.addPiece(new Pawn(white), 3, 3);
		}
		// for (var i = 0; i)
	} else {
		console.log("context of 'this' may be unintended:" + this);
	}
	
	//#TESTING
	//utility(this);
}

/* Move an existing piece from one location on the board to another.  This only modifies the backing data structure for the board so changes to the visual representation must be made elsewhere
*/
Board.prototype.movePiece = function(fromRow, fromCol, toRow, toCol) {
	let hasMovedPiece = false;
	let hasClearedTile = false;
	let indexOfTileToRemove;
	// update piece position in DS
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].row == fromRow && this.occupiedTiles[i].column == fromCol) {
			this.occupiedTiles[i].row = toRow;
			this.occupiedTiles[i].column = toCol;
			hasMovedPiece = true;
			continue;								//prevents removal of element that was just moved from occupiedTiles
		}
		
		// remove the piece previously existing on that tile if one exists
		if (this.occupiedTiles[i].row == toRow && this.occupiedTiles[i].column == toCol) {
			indexOfTileToRemove = i
			hasClearedTile = true;
		}
		
		// if the piece to be moved has been updated and the piece at its destination removed then there's no need to check any remaining tiles
		if (hasClearedTile && hasMovedPiece)
			break;
	}
	// remove piece that previously occupied the tile
	if (indexOfTileToRemove !== undefined)
		this.occupiedTiles.splice(indexOfTileToRemove, 1);		
}
// // Move an existing piece from one location on the board to another 
    // movePiece: function(piece, row, column) {
        // //iterate through board to find which piece we're moving
        // var temp;
        // var i = 0;
        // for (; i < 64; i++) {
            // if (piece == this.__position__[i]) {
                // temp = this.__position__[i];
                // this.__position__[i] = null; //remove that piece from its old index
				// break;
            // }
        // }
        // this.__position__[column + row * 8] = piece; //update ds that backs the piece canvas
		
		// var canvasPieces = document.getElementById('chesspieceCanvas');
		// var ctxPiece = canvasPieces.getContext('2d');
		// ctxPiece.clearRect(lastColumn * LENGTH, lastRow * LENGTH, LENGTH, LENGTH); //erase old piece
		// ctxPiece.fillText(String.fromCharCode(piece.unicode), column * LENGTH, (row + 1) * LENGTH - OFFSET); //draw piece at required spot

		// if (!isFreeplayTest)
			// isWhiteTurn = !isWhiteTurn;
	
		// //update turn info on HTML page
		// if (isWhiteTurn) { 
			// document.getElementById('turn').innerHTML = "Turn: White";}
		// else {
			// document.getElementById('turn').innerHTML = "Turn: Black";
		// }
    // },

/* Adds a piece to the backing data structure and draws it to the canvas.  If a piece already exists at the given cell it will be replaced with the argument piece in order to maintain a legal board state.  
 * piece the piece to be added
 * row expects row index (ie. 0-7)
 * column expects column index (ie. 0-7)
 */
Board.prototype.addPiece = function(piece, row, col) {
	// check data structure to see if it contains a piece located on the given tile
	var bPieceReplacesExistingElement = false;
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].row === row && this.occupiedTiles[i].column === col) {
			this.occupiedTiles[i].piece = piece;
			bPieceReplacesExistingElement = true;
		}
	}
	// creates a new tile for the data structure otherwise
	if (!bPieceReplacesExistingElement) {
		var newTile = new Tile(piece, row, col);
		this.occupiedTiles.push(newTile);
	}
}

/* Removes an existing piece at the specified tile
 * 
 */
Board.prototype.removePiece = function(row, col) {
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].row === row && this.occupiedTiles[i].column === col) {
			this.occupiedTiles.splice(i, 1);
			break;
		}
	}
}

function Tile(piece, row, col) {
	this.piece = piece;		// the piece occupying the tile
	this.row = row;			// the row the piece is in
	this.column = col;		// the column the piece is in
}

Tile.prototype.toString = function() {
	return this.piece + ' [' + this.row + ', ' + this.col + ']';
}