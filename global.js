const BLACK = false;	// the player that moves second
const LENGTH = 75;
const OFFSET = 10;
const PIECE_FONT = "70px Arial unicode MS";
const MELLOW_YELLOW = "rgba(255, 255, 102, 0.7)";
const LIGHT_RED = "rgba(255, 0, 0, 0.25)"
const WHITE = true;		// the player that moves first

// var lastPieceToMove = null;
var whiteKingTile = undefined;
var blackKingTile = undefined;

// if (isGameRunning) {
		// var column = Math.floor(x / LENGTH);		// find out the intersection of the row and column using the coordinates of where the player clicked
		// var row = Math.floor(y / LENGTH);
		// var highlightedTile = null; // not null if tile selected is highlighted in someway, ie. can the piece be moved there

		// //check if selected tile is highlighted
		// highlightedTiles.forEach(function(currentTile) {
			// if (currentTile.row == row && currentTile.column == column)
				// highlightedTile = currentTile;
		// });
		// //console.log('prev. coords ' + lastRowSelected + ' ' + lastColumnSelected);

		// //deal with piece movement (including attacking) - piece selected last turn; time to move!
		// if (highlightedTile) {		
			// if (highlightedTile.actionType === ActionType.ATTACK) { //DEBUG highlighted
				// // if the attack square is empty then en passant must have just occured
				// // NOTE only works for white
				// if (board.getPiece(highlightedTile.row, highlightedTile.column) === null)
					// board.removePiece(row + 1, column);
				// else
					// ctxPiece.clearRect(highlightedTile.column * LENGTH, highlightedTile.row * LENGTH, LENGTH, LENGTH); //remove old piece image
			// }
			
			
			// if (pawnThatMovedTwoLastTurn !== null) pawnThatMovedTwoLastTurn = null;
			
			// // En passant check
			// if (lastSelectedTile !== null && lastSelectedTile.piece.type == "Pawn") {
				// //check for 2 square move
				// if (Math.abs(lastSelectedTile.row - row) == 2) {
					// pawnThatMovedTwoLastTurn = lastSelectedTile.piece;
				// }
			// }
			
			// // castling logic
			// if (lastSelectedTile.piece.type == 'King') {
				// //move the rook to the appropriate position
				// if (Math.abs(lastSelectedTile.column - highlightedTile.column) == 2) {
					// let rookTile = null;
					// if (lastSelectedTile.column < highlightedTile.column) {		// castle right
						// rookTile = board.getPiece(lastSelectedTile.row, 7);
						// board.movePiece(lastSelectedTile.row, 7, lastSelectedTile.row, highlightedTile.column - 1);
					// }
					// else {
						// rookTile = board.getPiece(lastSelectedTile.row, 0);		// castle left
						// board.movePiece(lastSelectedTile.row, 0, lastSelectedTile.row, highlightedTile.column + 1);
					// }
				// }
			// }
			
			// //move the piece corresponding to that highlighted pattern to the selected location 
			// board.movePiece(lastSelectedTile.row, lastSelectedTile.column, row, column);
			// draw(board);
			
			// // required for en passant and castling
			// if (lastSelectedTile.piece.hasOwnProperty('hasMoved') && lastSelectedTile.piece.hasMoved == false) {
				// lastSelectedTile.piece.hasMoved = true;
			// }
		
			// //update tracking variables
			// highlightedTile = null;
			
			// //check if it's in a promotion tile; only works for white pieces
			// if (lastSelectedTile.piece.isWhite && lastSelectedTile.piece.type === 'Pawn') {
				// if (row == 0) {
					// //call promotion fn
					// $('#promotion')
						// .data( {isWhite: true, row: row, column: column} )	// 2nd 'row' is the variable
						// .dialog({
							// dialogClass: "no-close",						// remove close button
							// modal: true,
							// title: "Promote piece"
						// });
				// }
			// }
			// // }
			// highlightedTiles = []; 						//reset which tiles are hightlighted each time this runs
			
			// //AI CALL HERE
			// isWhiteTurn = !isWhiteTurn;
			
			// var nextAIAction = minimax(board, BLACK);//(isWhiteTurn) ? WHITE : BLACK);
			// var agentTile = board.getPositionOfPiece(nextAIAction.agent);
			// board.movePiece(agentTile.row, agentTile.column, nextAIAction.row, nextAIAction.column);
			// draw(board);
			// // console.log('next move will move ' + nextAIAction.agent + ' from [' + agentTile.row + ', ' + agentTile.column + '] to ['
				// // + nextAIAction.row + ', ' + nextAIAction.column + ']'); 
		// }
		// /* logic used when a piece is first selected - before anything is highlighted for the player
		 // * check if player clicked on their own piece and highlight the appropriate tiles in response
		 // */
		// else if (lastSelectedTile = getBoardTileWithCoords(board, x, y)) {
			// var lastSelectedPiece = lastSelectedTile.piece;
			// // lastRowSelected = row;
			// // lastColumnSelected = column;
			// highlightedTiles = [];
			
			// // only allow interaction with pieces of the correct colour
			// if (lastSelectedTile !== undefined)
				// var isPlayerTurn = lastSelectedTile.piece.isWhite === lastSelectedTile.piece.isWhite; // DEBUG: currently lets you select any piece; isWhiteTurn
			
			
			// // only allow King to be selected if King is in check
			// if (lastSelectedPiece.isWhite == true && inCheck(whiteKingTile)) {	// TODO remove isWhite condition once testing is done
				// if (lastSelectedPiece.type == 'King') {
					// lastSelectedPiece.getStandardMoves(board, true, lastSelectedTile.row, lastSelectedTile.column);
				// }
			// } 
			// else {	// highlight the appropriate tiles
				// lastSelectedPiece.getStandardMoves(board, true, lastSelectedTile.row, lastSelectedTile.column); 
				
				// if (lastSelectedPiece.type == 'Pawn')
					// lastSelectedPiece.getSpecialMoves(board, true, lastSelectedTile.row, lastSelectedTile.column);
				// // check for castling options
				// else if (lastSelectedPiece.type == 'King') {
					// // check right
					// let castlingRookTile = board.getTile(lastSelectedTile.row, 7);
					// if (castlingRookTile !== null && canCastle(lastSelectedTile, castlingRookTile))		
						// fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, lastSelectedTile.row, lastSelectedTile.column + 2));	
					// // check left
					// castlingRookTile = board.getTile(lastSelectedTile.row, 0);
					// if (castlingRookTile !== null && canCastle(lastSelectedTile, castlingRookTile))		
						// fill(ctxHighlight, MELLOW_YELLOW, new Action(this, ActionType.MOVE, lastSelectedTile.row, lastSelectedTile.column - 2));	
				// }
			// }
		// } 
		// else {	// player clicked off the piece
			// highlightedTiles = [];
			// highlightedTile = false;
		// }
	// } 
	// else {
		// //alert("Press the 'Start' button to begin your chess adventure!");
	// }