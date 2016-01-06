var isMiniMaxCheckingBoard = false;

//RIGHT NOW ONLY WORKS WHEN AI IS BLACK
function moveAIPiece(ctxHighlight, ctxPiece, board) {
    isMiniMaxCheckingBoard = true;
    var newBoard = jQuery.extend(true, {}, board);
    var test = maxi(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 1, newBoard);
    //var test = mini(Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY,2,newBoard);
    //I sometimes lose a piece at 0,0
    //var test = mini(2);
    //console.log(nodeCount);
    console.log("Value: " + test + ", and piece is:" + newBoard.getPiece(test[2], test[3]));
    isMiniMaxCheckingBoard = false;
    //ctxHighlight.clearRect(0, 0, LENGTH * 8, LENGTH * 8);
	isWhiteTurn = false;
	var limit = 0;
    //while it's black's turn... will need to generalize this
    while (!isWhiteTurn) { //NEED AN ISAI VAR I THINK
        //while we haven't found a set a possible moves
        //while (highlightedTiles.length == 0) {
            limit++;

            var x = test[2];
            var y = test[3];
            var piecePosition = (x * 8) + y;
            //look for a piece on the board, at least a 1/64 of getting one
            //while we haven't found a piece
			/*
            while (board.__position__[piecePosition] === null) {
                x = Math.floor(Math.random() * 8);
                y = Math.floor(Math.random() * 8);
                piecePosition = (y * 8) + x;
            }
			*/
			
            //try this piece once you see that is exists
            chessPieceListener(ctxHighlight, ctxPiece, board, y * LENGTH, x * LENGTH);
			x = test[4] * LENGTH;
			y = test[5] * LENGTH;
			//piecePosition = (x * 8) + y;
			
            //look at the valid moves, get the last highlighted tile
			/*
            highlightedTiles.forEach(function(item) {
                y = item[1] * LENGTH;
                x = item[2] * LENGTH;
            });
			*/
			
            if (limit > 10000) {
                alert("I give up");
                isWhiteTurn = !isWhiteTurn; //CHANGE THIS TO AN AI VAR
                isGameRunning = false;
                //init(); //RESET HERE
                break;
            }
			
        //}

		chessPieceListener(ctxHighlight, ctxPiece, board, y, x);
        //depending on the piece type take the greedy move! (which is the furthest highlighted tile)
		/*
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
        } else {
		}
		*/

    }

}