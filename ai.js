var isMiniMaxCheckingBoard = false;
var treeDepth = null;

//RIGHT NOW ONLY WORKS WHEN AI IS BLACK
function moveAIPiece(ctxHighlight, ctxPiece, testBoard) {
	//Get a Minimax move
    isMiniMaxCheckingBoard = true;
    var newBoard = jQuery.extend(true, {}, testBoard);
	var test = maxi(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 3, testBoard);
	console.log(nodeCount);
	console.log("Final Value: " + test);
	testBoard = jQuery.extend(true, {}, newBoard);
    isMiniMaxCheckingBoard = false;
	isWhiteTurn = false;
	var limit = 0;
	/*
	Problem: We had trouble getting the right coordinates out of the tree. It was able to evaluate the best
	move and pass it up the tree which can be seen being processed in the console, so please check that out.
	This AI moves at random to display that we have a working GUI. We are missing a bridge between this kind of
	movement and the best move coordinates returned from the tree. As it stands right now the tree returns greedy
	coordinates (last tested in this case) but an optimal AI move based on the Minimax value.
	*/
	
	//move the actualy piece
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

		//execute move
		chessPieceListener(ctxHighlight, ctxPiece, board, x, y);
	}
}