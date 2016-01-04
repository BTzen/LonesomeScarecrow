var limit = 0;

//RIGHT NOW ONLY WORKS WHEN AI IS BLACK
function moveAIPiece(ctxHighlight, ctxPiece, board) {
	var newBoard = jQuery.extend(true, {}, board);
	var test = maxi(Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY,2,newBoard);
	//var test = mini(2);
	//console.log(nodeCount);
	console.log("Final Value: " + test);
	
	//while it's black's turn... will need to generalize this
	while (!isWhiteTurn) { //NEED AN ISAI VAR I THINK
		//while we haven't found a set a possible moves
		while (highlightedTiles.length == 0) {
			limit++;
			
			var x = Math.floor(Math.random() * 8);
			var y = Math.floor(Math.random() * 8);
			var piecePosition = (y * 8) + x;
			//look for a piece on the board, at least a 1/64 of getting one
			//while we haven't found a piece
			while (board.__position__[piecePosition]=== null) {
				x = Math.floor(Math.random() * 8);
				y = Math.floor(Math.random() * 8);
				piecePosition = (y * 8) + x;
			}
		
			//try this piece once you see that is exists
			chessPieceListener(ctxHighlight, ctxPiece, board, x*LENGTH, y*LENGTH);
		
			//look at the valid moves, get the last highlighted tile
			highlightedTiles.forEach(function(item) {
				y = item[1] * LENGTH;
				x = item[2] * LENGTH;
			});
			
			if (limit > 10000) {
				alert("I give up");
				isWhiteTurn= !isWhiteTurn; //CHANGE THIS TO AN AI VAR
				isGameRunning = false;
				//init(); //RESET HERE
				break;
			}
		}
		limit = 0;
		
		//depending on the piece type take the greedy move! (which is the furthest highlighted tile)
		if (board.__position__[piecePosition].type === "Pawn") {
				chessPieceListener(ctxHighlight, ctxPiece, board, x, y);	
			} else if (board.__position__[piecePosition].type === "Rook") {
				chessPieceListener(ctxHighlight, ctxPiece, board, x, y);	
			} else if (board.__position__[piecePosition].type === "Knight") {
				chessPieceListener(ctxHighlight, ctxPiece, board, x, y);	
			} else if (board.__position__[piecePosition].type === "Bishop") {
				chessPieceListener(ctxHighlight, ctxPiece, board, x, y);	
			} else if (board.__position__[piecePosition].type === "Queen") {
				chessPieceListener(ctxHighlight, ctxPiece, board, x, y);	
			} else if (board.__position__[piecePosition].type === "King") {
				chessPieceListener(ctxHighlight, ctxPiece, board, x, y);	
			}
		
	}
}