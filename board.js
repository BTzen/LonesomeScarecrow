/* Note: Board class does not contain the functionality to draw the pieces. That is handled by chessboardScript.js
*/
function Board(boardToClone) {
	this.occupiedTiles = [];
	if (arguments.length === 1) {
		if (boardToClone.hasOwnProperty("occupiedTiles") && boardToClone.occupiedTiles !== null && boardToClone.occupiedTiles !== undefined) {
			// deep copy
			for (var i = 0; i < boardToClone.occupiedTiles.length; i++) {
				// this.occupiedTiles.push($.extend(true, {}, boardToClone.occupiedTiles[i]));
				let tileToClone = boardToClone.occupiedTiles[i];
				let pieceToClone = tileToClone.piece;
				
				var clonePiece;
				// allows for quick identification of piece type while debugging
				if (pieceToClone instanceof Pawn) {
					clonePiece = new Pawn();
				}
				else if (pieceToClone instanceof Rook) {
					clonePiece = new Rook();
				}
				else if (pieceToClone instanceof Knight) {
					clonePiece = new Knight();
				}
				else if (pieceToClone instanceof Bishop) {
					clonePiece = new Bishop();
				}
				else if (pieceToClone instanceof King) {
					clonePiece = new King();
				}
				else if (pieceToClone instanceof Queen) {
					clonePiece = new Queen();
				}
				
				for (var prop in tileToClone.piece) {
					clonePiece[prop] = tileToClone.piece[prop];
				}
				
				let cloneTile = new Tile(clonePiece, tileToClone.row, tileToClone.column);
				this.occupiedTiles.push(cloneTile);
			}
		}
	}
}

Board.prototype.clear = function() {
	this.occupiedTiles = [];
}

Board.prototype.draw = function() {
	
}

/* Returns piece located at tile specified by the intersection of the row and column
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

/* Return the tile of the argument piece.  Used to find a piece's position on the board.
 * piece the piece you want to know the position of
 */
Board.prototype.getPositionOfPiece = function(piece) {
	var currentTile = null;
	for (let i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].piece == piece) {
			currentTile = this.occupiedTiles[i];
		}
	}
	return currentTile;
}

Board.prototype.getTile = function(row, col) {
	// bounds check
	if (row < 0 || row > 7 || col < 0 || col > 7) {
		return undefined;
	} 
	else {
		var currentTile = null;
		for (let i = 0; i < this.occupiedTiles.length; i++) {
			if (row === this.occupiedTiles[i].row && col === this.occupiedTiles[i].column) {
				currentTile = this.occupiedTiles[i];
				break;
			}
		}
	}
	
	return currentTile;
}

/* Initialize board for a chess match
*/
Board.prototype.initialize = function(playerIsWhite) {
	if (this instanceof Board) {
		if (playerIsWhite) {
			// place black pieces
			// this.addPiece(new Rook(BLACK), 0, 0);
			// this.addPiece(new Knight(BLACK), 0, 1);
			// this.addPiece(new Bishop(BLACK), 0, 2);
			// this.addPiece(new Queen(BLACK), 0, 3);
			// this.addPiece(new King(BLACK), 0, 4);
			// this.addPiece(new Bishop(BLACK), 0, 5);
			// this.addPiece(new Knight(BLACK), 0, 6);
			// this.addPiece(new Rook(BLACK), 0, 7);
			
			// for (let i = 0; i < 8; i++) {
				// if (i == 7)
					// this.addPiece(new Pawn(BLACK), 3, i);
				// else
					// this.addPiece(new Pawn(BLACK), 1, i);
			// }
			
			// var bPawn = new Pawn(BLACK);
			// bPawn.hasMoved = true;
			// this.addPiece(bPawn, 3, 3);
			// place white pieces
			
			// var wPawn = new Pawn(WHITE);
			// wPawn.hasMoved = true;
			// this.addPiece(wPawn, 3, 4);
			
			// ACTUAL BOARD LAYOUT
			// this.addPiece(new Rook(WHITE), 7, 0);
			// this.addPiece(new Knight(WHITE), 7, 1);
			// this.addPiece(new Bishop(WHITE), 7, 2);
			// this.addPiece(new Queen(WHITE), 7, 3);
			// this.addPiece(new King(WHITE), 7, 4);
			// this.addPiece(new Bishop(WHITE), 7, 5);
			// this.addPiece(new Knight(WHITE), 7, 6);
			// this.addPiece(new Rook(WHITE), 7, 7);
			
			// for (let i = 0; i < 8; i++) {
				// if (i == 4)
					// this.addPiece(new Pawn(WHITE), 4, i);
				// else
					// this.addPiece(new Pawn(WHITE), 6, i);
			// }
			
			//set 1 
			// this.addPiece(new Pawn(BLACK), 2, 2);
			// this.addPiece(new Rook(BLACK), 0, 5);
			// this.addPiece(new Knight(WHITE), 3, 3);
			// this.addPiece(new Pawn(WHITE), 4, 1);
			this.addPiece(new Rook(WHITE), 4, 4);
		}
		// for (var i = 0; i)
	} else {
		console.log("context of 'this' may be unintended:" + this);
	}
	
	//#TESTING
	//utility(this);
}

/* check for opponent and board boundaries
 * rowToAttack the row of the piece the possibility of attack is being checked against
 * columnToAttack
 * attackingPiece the piece that will claim the piece located at [rowToAttack, columnToAttack]
*/
Board.prototype.isValidAttack = function(rowToAttack, columnToAttack, attackingPiece) {
	//check that the desired selection is within legal board dimensions
	if  (rowToAttack > 7 || rowToAttack < 0 || columnToAttack > 7 || columnToAttack < 0) {
		return false;
	}
	
	var potentialTarget = this.getPiece(rowToAttack, columnToAttack);
	if (potentialTarget !== null) {
		return !(potentialTarget.isWhite === attackingPiece.isWhite);
	}		
}
/* Move an existing piece from one location on the board to another.  This only modifies the backing data structure for the board so changes to the visual representation must be made elsewhere
*/
Board.prototype.movePiece = function(fromRow, fromCol, toRow, toCol) {
	let movingPiece = null;
	// let finalLocation = this.getTile(toRow, toCol);
	
	let hasMovedPiece = false;
	let hasClearedTile = false;
	let indexOfTileToRemove;
	
	// update piece position in DS
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].row == fromRow && this.occupiedTiles[i].column == fromCol) {
			movingPiece = this.occupiedTiles[i]
			movingPiece.row = toRow;
			movingPiece.column = toCol;
			hasMovedPiece = true;
			if (movingPiece.piece.hasOwnProperty('hasMoved')) {
				movingPiece.piece.hasMoved = true;
			}
			continue;								//prevents removal of element that was just moved from occupiedTiles
		}
		
		// remove the piece previously existing on that tile if one exists
		if (this.occupiedTiles[i].row == toRow && this.occupiedTiles[i].column == toCol) {
			indexOfTileToRemove = i;
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