/* Billings, M., Kurylovich, A. */

// TODO cloning process modifies objects and inserts prototype properties into the object

/* Note: Board class does not contain the functionality to draw the pieces. That is handled in chessboardScript.js
 *
 */
function Board(boardToClone) {
	this.occupiedTiles = [];
	this.whiteKingTile;
	this.blackKingTile;
	this.tileOfCheckingPiece = null;
	
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
				// copy all other properties of the object (excluding inherited properties from the prototype chain)
				for (var prop in pieceToClone) {
					if (pieceToClone.hasOwnProperty(prop))
						clonePiece[prop] = pieceToClone[prop];
				}
				
				let cloneTile = new Tile(clonePiece, tileToClone.row, tileToClone.column);					
				this.occupiedTiles.push(cloneTile);
				
				if (clonePiece.type == 'King') {
					if (boardToClone.tileOfCheckingPiece !== null) {
						// var t = this;
						// var temp = new Tile();
						this.tileOfCheckingPiece = (new Tile()).clone(boardToClone.tileOfCheckingPiece);
					}
					
					if (clonePiece.isWhite)
						this.whiteKingTile = cloneTile;
					else
						this.blackKingTile = cloneTile;
				}
			}
		}
	}
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
 * piece the piece you want the tile for
 */
Board.prototype.getTileWithPiece = function(piece) {
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

/* Initialize board for a chess match. Overwrites the backing DS with the required setup for a standard chess game.
 * TODO support playing as Black as well
*/
Board.prototype.initialize = function() {
	this.occupiedTiles = [];
	
	if (this instanceof Board) {
		// place black pieces
		this.addPiece(new Rook(BLACK), 0, 0);
		this.addPiece(new Knight(BLACK), 0, 1);
		this.addPiece(new Bishop(BLACK), 0, 2);
		this.addPiece(new Queen(BLACK), 0, 3);
		// this.blackKingTile = new Tile(new King(BLACK), 0, 4);
		// this.occupiedTiles.push(this.blackKingTile);
		this.addPiece(new King(BLACK), 0, 4);
		this.addPiece(new Bishop(BLACK), 0, 5);
		this.addPiece(new Knight(BLACK), 0, 6);
		this.addPiece(new Rook(BLACK), 0, 7);
		
		for (let i = 0; i < 8; i++) {
			this.addPiece(new Pawn(BLACK), 1, i);
		}
		
		// place white pieces
		for (let i = 0; i < 8; i++) {
			this.addPiece(new Pawn(WHITE), 6, i);
		}
		
		this.addPiece(new Rook(WHITE), 7, 0);
		this.addPiece(new Knight(WHITE), 7, 1);
		this.addPiece(new Bishop(WHITE), 7, 2);
		this.addPiece(new Queen(WHITE), 7, 3);
		// this.whiteKingTile = new Tile(new King(WHITE), 7, 4);
		// this.occupiedTiles.push(this.whiteKingTile);
		this.addPiece(new King(WHITE), 7, 4);
		this.addPiece(new Bishop(WHITE), 7, 5);
		this.addPiece(new Knight(WHITE), 7, 6);
		this.addPiece(new Rook(WHITE), 7, 7);
		
		// DEBUG
		// this.blackKingTile = new Tile(new King(BLACK), 0, 1);
		// this.occupiedTiles.push(this.blackKingTile);


		// this.whiteKingTile = new Tile(new King(WHITE), 7, 4);
		// this.occupiedTiles.push(this.whiteKingTile);
		// this.addPiece(new Queen(WHITE), 3, 2);
	} else {
		console.log("context of 'this' may be unintended:" + this);
	}
}

/* check for opponent and board boundaries.  Does not check if the piece in question is blocked or not.
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

/* Move an existing piece from one location on the board to another and updates the hasMoved property of this piece, if one exists.  This only modifies the backing data structure for the board so changes to the visual representation must be 	made elsewhere
 */
Board.prototype.movePiece = function(fromRow, fromCol, toRow, toCol) {
	var movingPiece = null;	
	var hasMovedPiece = false;
	var hasClearedTile = false;
	var indexOfTileToRemove;
	
	// update piece position in DS
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].row == fromRow && this.occupiedTiles[i].column == fromCol) {
			movingPieceTile = this.occupiedTiles[i];
			movingPieceTile.row = toRow;
			movingPieceTile.column = toCol;
			hasMovedPiece = true;
			
			if (movingPieceTile.piece.hasOwnProperty('hasMoved')) {
				movingPieceTile.piece.hasMoved = true;
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

/* Adds a piece to the backing data structure and draws it to the canvas.  If a piece already exists at the given cell it will be replaced with the argument piece in order to maintain a legal board state.  If no piece exists with the provided row and column a new tile will be created for it and added to the list of existing tiles.
 * piece the piece to be added
 * row expects row index (ie. 0-7)
 * column expects column index (ie. 0-7)
 */
Board.prototype.addPiece = function(piece, row, col) {
	var bPieceReplacesExistingElement = false;
	
	if (piece.type == 'King') {
		if (piece.isWhite)
			this.whiteKingTile = piece;
		else
			this.blackKingTile = piece;
	}
	// only allow 2 moves if the pawn is placed in the correct starting row
	else if (piece.type == 'Pawn') {
		if (piece.isWhite !== playerIsWhite) { //piece is controlled by the CPU
			if (row !== 1) {
				piece.hasMoved = true;
			}
		}
		else {
			if (row !== 6) {
				piece.hasMoved = true;
			}
		}
	}
	
	// check data structure to see if it contains a piece located on the given tile
	for (var i = 0; i < this.occupiedTiles.length; i++) {
		if (this.occupiedTiles[i].row === row && this.occupiedTiles[i].column === col) {
			
			if (piece.type == 'King') {
				if (piece.isWhite) {
					this.whiteKingTile = piece;
					this.occupiedTiles[i].piece = this.whiteKingTile;
				}
				else {
					this.blackKingTile = piece;
					this.occupiedTiles[i].piece = this.blackKingTile;
				}
			}
			
			this.occupiedTiles[i].piece = piece;
			bPieceReplacesExistingElement = true;
			break;
		}
	}
	// creates a new tile for the data structure otherwise
	if (!bPieceReplacesExistingElement) {
		var newTile = new Tile(piece, row, col);
		
		if (piece.type == 'King') {
			if (piece.isWhite) {
				this.whiteKingTile = newTile;
				this.occupiedTiles.push(this.whiteKingTile);
			}
			else {
				this.blackKingTile = newTile;
				this.occupiedTiles.push(this.blackKingTile);
			}
		}
		else
			this.occupiedTiles.push(newTile);
	}
}

/* Removes an existing piece at the specified tile from backing data structure
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

/* Clone a board tile.  Returns the cloned tile.
 * tile the tile to clone
 */
Tile.prototype.clone = function(tile) {
	var cloneTile = new Tile();
	// allows for quick identification of piece type while debugging
	if (tile.piece instanceof Pawn) {
		cloneTile.piece = new Pawn();
	}
	else if (tile.piece instanceof Rook) {
		cloneTile.piece = new Rook();
	}
	else if (tile.piece instanceof Knight) {
		cloneTile.piece = new Knight();
	}
	else if (tile.piece instanceof Bishop) {
		cloneTile.piece = new Bishop();
	}
	else if (tile.piece instanceof King) {
		cloneTile.piece = new King();
	}
	else if (tile.piece instanceof Queen) {
		cloneTile.piece = new Queen();
	}
	
	// copy all other properties of the object (excluding inherited properties from the prototype chain)
	for (var prop in tile.piece) {
		if (tile.piece.hasOwnProperty(prop))
			cloneTile.piece[prop] = tile.piece[prop];
	}
	
	cloneTile.row = tile.row;
	cloneTile.column = tile.column;
	return cloneTile;
}